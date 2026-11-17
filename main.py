"""End-to-end entry point for the hybrid wine-quality pipeline."""
from __future__ import annotations

import argparse
import json
import logging
import platform
import random
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.metrics import confusion_matrix, roc_curve

from wine_hybrid.associations import (
    HAS_MLXTEND,
    apply_bins,
    build_binning_table,
    build_onehot,
    fit_bin_specs,
    mine_scope_rules,
)
from wine_hybrid.config import (
    DEFAULT_DATASET_DIR,
    DEFAULT_OUTPUT_DIR,
    PROJECT_ROOT,
    RULE_CONFIGS,
    SCOPES,
    SEED,
    TEST_SIZE,
    TOP_RULES_PER_GROUP,
)
from wine_hybrid.data import (
    add_targets,
    build_scopes,
    duplicate_summary,
    load_wine_data,
    split_scope,
    target_distribution,
)
from wine_hybrid.modeling import run_random_forest_scope
from wine_hybrid.reporting import build_report
from wine_hybrid.visualization import plot_dashboard


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Feature-guided Random Forest + Association Rule Mining on Wine Quality."
    )
    parser.add_argument("--data-dir", type=Path, default=DEFAULT_DATASET_DIR)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--seed", type=int, default=SEED)
    parser.add_argument("--test-size", type=float, default=TEST_SIZE)
    parser.add_argument(
        "--miner",
        choices=["auto", "mlxtend", "fallback"],
        default="auto",
        help="Association-rule engine; 'auto' uses mlxtend when available.",
    )
    return parser.parse_args()


def _setup_logging(output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
        datefmt="%H:%M:%S",
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler(output_dir / "pipeline.log", mode="w", encoding="utf-8"),
        ],
        force=True,
    )


def _versions() -> dict:
    import matplotlib
    import sklearn

    versions = {
        "python": platform.python_version(),
        "platform": platform.platform(),
        "pandas": pd.__version__,
        "numpy": np.__version__,
        "scikit-learn": sklearn.__version__,
        "matplotlib": matplotlib.__version__,
        "mlxtend": None,
    }
    try:
        import mlxtend

        versions["mlxtend"] = mlxtend.__version__
    except ImportError:
        pass
    return versions


def _relative(path: Path) -> str:
    try:
        return path.resolve().relative_to(PROJECT_ROOT).as_posix()
    except ValueError:
        return path.resolve().as_posix()


def run(args: argparse.Namespace) -> dict:
    output_dir = Path(args.output_dir)
    table_dir = output_dir / "tables"
    figure_dir = output_dir / "figures"
    for directory in (output_dir, table_dir, figure_dir):
        directory.mkdir(parents=True, exist_ok=True)

    seed = int(args.seed)
    random.seed(seed)
    np.random.seed(seed)
    started = time.perf_counter()
    logger = logging.getLogger("wine_hybrid")

    logger.info("Python %s | mlxtend available: %s | miner=%s",
                platform.python_version(), HAS_MLXTEND, args.miner)
    logger.info("Versions: %s", json.dumps(_versions()))

    df = add_targets(load_wine_data(Path(args.data_dir)))
    scopes = build_scopes(df)
    target_dist = target_distribution(scopes)
    duplicates = duplicate_summary(scopes)
    logger.info("Target distribution:\n%s", target_dist.to_string(index=False))
    logger.info("Duplicate rows:\n%s", duplicates.to_string(index=False))

    artifacts = {}
    for scope in SCOPES:
        split = split_scope(scope, scopes[scope], args.test_size, seed)
        artifacts[scope] = run_random_forest_scope(split, seed)

    binning_frames = []
    rule_frames = []
    for scope in SCOPES:
        art = artifacts[scope]
        split = art.split
        specs = fit_bin_specs(split.train_df, art.top_features, scope)
        train_disc = apply_bins(split.train_df, specs)
        test_disc = apply_bins(split.test_df, specs)
        onehot_train = build_onehot(train_disc, split.train_df["quality_tier"])
        onehot_test = build_onehot(test_disc, split.test_df["quality_tier"])
        onehot_test = onehot_test.reindex(columns=onehot_train.columns, fill_value=False)
        onehot_test = onehot_test.astype(bool)

        binning_frames.append(build_binning_table(specs, split.train_df, split.test_df, scope))
        rule_frames.append(mine_scope_rules(onehot_train, onehot_test, scope, miner=args.miner))

    binning = pd.concat(binning_frames, ignore_index=True)
    rules = pd.concat(rule_frames, ignore_index=True)
    if not rules.empty:
        rules["_scope_order"] = pd.Categorical(rules["scope"], categories=list(SCOPES), ordered=True)
        rules["_tier_order"] = pd.Categorical(
            rules["consequent_tier"], categories=["High", "Low"], ordered=True
        )
        rules = rules.sort_values(["_scope_order", "_tier_order", "rank"]).drop(
            columns=["_scope_order", "_tier_order"]
        ).reset_index(drop=True)

    metrics = pd.DataFrame(
        [
            {
                "scope": result.scope,
                "model": result.model_name,
                "threshold": result.threshold,
                **result.metrics,
            }
            for scope in SCOPES
            for result in artifacts[scope].results
        ]
    )
    importance = pd.concat(
        [artifacts[scope].feature_importance for scope in SCOPES], ignore_index=True
    )

    roc_rows = []
    confusion_rows = []
    for scope in SCOPES:
        for result in artifacts[scope].results:
            fpr, tpr, _ = roc_curve(result.y_true, result.y_proba)
            if len(fpr) > 150:
                idx = np.linspace(0, len(fpr) - 1, 150).round().astype(int)
                idx = np.unique(idx)
                fpr, tpr = fpr[idx], tpr[idx]
            for x, y in zip(fpr, tpr):
                roc_rows.append(
                    {"scope": scope, "model": result.model_name,
                     "fpr": float(x), "tpr": float(y)}
                )
            tn, fp, fn, tp = confusion_matrix(
                result.y_true, result.y_pred, labels=[0, 1]
            ).ravel()
            confusion_rows.append(
                {
                    "scope": scope,
                    "model": result.model_name,
                    "threshold": result.threshold,
                    "true_negative": int(tn),
                    "false_positive": int(fp),
                    "false_negative": int(fn),
                    "true_positive": int(tp),
                    "n_test": int(len(result.y_true)),
                }
            )

    metrics_path = table_dir / "rf_model_comparison.csv"
    roc_path = table_dir / "roc_curves.csv"
    confusion_path = table_dir / "confusion_matrices.csv"
    top_rules_path = table_dir / "top_wine_association_rules.csv"
    all_rules_path = table_dir / "association_rules_all_scopes.csv"
    importance_path = table_dir / "feature_importance.csv"
    binning_path = table_dir / "binning_boundaries.csv"
    target_path = table_dir / "target_distribution.csv"
    duplicate_path = table_dir / "duplicate_summary.csv"

    metrics.to_csv(metrics_path, index=False, encoding="utf-8")
    pd.DataFrame(roc_rows).to_csv(roc_path, index=False, encoding="utf-8")
    pd.DataFrame(confusion_rows).to_csv(confusion_path, index=False, encoding="utf-8")
    importance.to_csv(importance_path, index=False, encoding="utf-8")
    binning.to_csv(binning_path, index=False, encoding="utf-8")
    target_dist.to_csv(target_path, index=False, encoding="utf-8")
    duplicates.to_csv(duplicate_path, index=False, encoding="utf-8")
    rules.to_csv(all_rules_path, index=False, encoding="utf-8")
    if rules.empty:
        rules.to_csv(top_rules_path, index=False, encoding="utf-8")
    else:
        top = (
            rules.groupby(["scope", "consequent_tier"], sort=False)
            .head(TOP_RULES_PER_GROUP)
            .reset_index(drop=True)
        )
        top.to_csv(top_rules_path, index=False, encoding="utf-8")

    dashboard_path = figure_dir / "wine_hybrid_dashboard.png"
    plot_dashboard(artifacts, rules, dashboard_path)

    generated_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    output_files = [
        _relative(path)
        for path in (
            dashboard_path,
            metrics_path,
            roc_path,
            confusion_path,
            top_rules_path,
            all_rules_path,
            importance_path,
            binning_path,
            target_path,
            duplicate_path,
        )
    ]
    report = build_report(
        target_dist=target_dist,
        duplicates=duplicates,
        artifacts=artifacts,
        binning=binning,
        rules=rules,
        generated_at=generated_at,
        output_files=output_files,
    )
    report_path = output_dir / "report.md"
    report_path.write_text(report, encoding="utf-8")

    runtime = time.perf_counter() - started
    metadata = {
        "generated_at": generated_at,
        "runtime_seconds": round(runtime, 2),
        "seed": seed,
        "test_size": args.test_size,
        "top_features": {scope: artifacts[scope].top_features for scope in SCOPES},
        "miner": args.miner,
        "mlxtend_available": HAS_MLXTEND,
        "rule_thresholds": [
            {
                "consequent": f"Quality={cfg.tier}",
                "min_support": cfg.min_support,
                "min_confidence": cfg.min_confidence,
                "min_lift": cfg.min_lift,
            }
            for cfg in RULE_CONFIGS
        ],
        "n_rules": int(len(rules)),
        "n_rules_holdout_pass": int(rules["holdout_pass"].sum()) if not rules.empty else 0,
        "versions": _versions(),
        "outputs": [_relative(report_path), *output_files, _relative(output_dir / "pipeline.log")],
    }
    (output_dir / "run_metadata.json").write_text(
        json.dumps(metadata, indent=2), encoding="utf-8"
    )

    logger.info("Rules mined: %d | pass holdout: %d", metadata["n_rules"],
                metadata["n_rules_holdout_pass"])
    logger.info("Pipeline finished in %.1f s", runtime)
    print("\n" + report)
    return metadata


def main() -> None:
    args = _parse_args()
    _setup_logging(Path(args.output_dir))
    run(args)


if __name__ == "__main__":
    main()
