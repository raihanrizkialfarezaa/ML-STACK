"""Markdown reporting utilities."""
from __future__ import annotations

import math
from typing import Dict, Iterable

import numpy as np
import pandas as pd

from .config import RULE_CONFIGS, SCOPES, TOP_RULES_PER_GROUP
from .modeling import ScopeModelArtifacts


def _fmt(value, digits: int = 4) -> str:
    if value is None:
        return "n/a"
    if isinstance(value, (float, np.floating)):
        if math.isnan(float(value)):
            return "n/a"
        if math.isinf(float(value)):
            return "inf" if value > 0 else "-inf"
        return f"{float(value):.{digits}f}"
    if isinstance(value, (bool, np.bool_)):
        return "yes" if bool(value) else "no"
    text = str(value)
    return text.replace("|", "\\|")


def markdown_table(df: pd.DataFrame, digits: int = 4, max_rows: int | None = None) -> str:
    if df is None or df.empty:
        return "_No rows available._"
    view = df.head(max_rows) if max_rows else df
    columns = [str(c) for c in view.columns]
    rows = [[_fmt(v, digits) for v in row] for row in view.itertuples(index=False, name=None)]
    widths = [len(c) for c in columns]
    for row in rows:
        widths = [max(w, len(cell)) for w, cell in zip(widths, row)]
    header = "| " + " | ".join(c.ljust(w) for c, w in zip(columns, widths)) + " |"
    separator = "|" + "|".join("-" * (w + 2) for w in widths) + "|"
    body = [
        "| " + " | ".join(cell.ljust(w) for cell, w in zip(row, widths)) + " |"
        for row in rows
    ]
    return "\n".join([header, separator, *body])


def _metrics_table(artifacts: Dict[str, ScopeModelArtifacts]) -> pd.DataFrame:
    rows = []
    for scope in SCOPES:
        for result in artifacts[scope].results:
            rows.append(
                {
                    "scope": scope,
                    "model": result.model_name,
                    "threshold": result.threshold,
                    **result.metrics,
                }
            )
    return pd.DataFrame(rows)


def _feature_table(artifacts: Dict[str, ScopeModelArtifacts], scope: str) -> pd.DataFrame:
    table = artifacts[scope].feature_importance
    view = table.loc[table["selected_top6"], ["feature", "gini", "perm_mean", "perm_std"]]
    return view.reset_index(drop=True)


def _top_rules(rules: pd.DataFrame, scope: str, tier: str, n: int) -> pd.DataFrame:
    if rules.empty:
        return pd.DataFrame()
    subset = rules[(rules["scope"] == scope) & (rules["consequent_tier"] == tier)]
    subset = subset.sort_values(["lift", "confidence"], ascending=False).head(n)
    columns = [
        "rank",
        "antecedents",
        "support",
        "confidence",
        "lift",
        "conviction",
        "confidence_test",
        "holdout_pass",
    ]
    return subset[columns].reset_index(drop=True)


def _boundary_summary(binning: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for (scope, group, feature), subset in binning.groupby(
        ["scope", "group", "feature"], sort=False
    ):
        cuts = [
            value
            for value in subset.iloc[:-1]["upper_bound"].tolist()
            if np.isfinite(value)
        ]
        rows.append(
            {
                "scope": scope,
                "group": group,
                "feature": feature,
                "n_bins": len(subset),
                "cut_points": ", ".join(f"{value:.4g}" for value in cuts) or "-",
            }
        )
    return pd.DataFrame(rows)


def _bin_view(binning: pd.DataFrame, scope: str) -> pd.DataFrame:
    subset = binning[binning["scope"] == scope].copy()
    subset["interval"] = subset.apply(
        lambda r: f"({r['lower_bound']:.4g}, {r['upper_bound']:.4g}]", axis=1
    )
    columns = [
        "group",
        "feature",
        "bin",
        "interval",
        "n_train",
        "share_train",
        "observed_min",
        "observed_max",
    ]
    return subset[columns].reset_index(drop=True)


def build_report(
    target_dist: pd.DataFrame,
    duplicates: pd.DataFrame,
    artifacts: Dict[str, ScopeModelArtifacts],
    binning: pd.DataFrame,
    rules: pd.DataFrame,
    generated_at: str,
    output_files: Iterable[str],
) -> str:
    metrics = _metrics_table(artifacts)
    lines = [
        "# Feature-Guided Hybrid Data Mining: Random Forest + Association Rules",
        "",
        f"Generated: {generated_at}",
        "",
        "Dataset: UCI Wine Quality (red + white). Random Forest predicts "
        "`high_quality = quality >= 7`; FP-Growth mines interpretable rules for "
        "`Quality=High` and `Quality=Low` from training-only discretized features.",
        "",
        "## 1. Dataset and target engineering",
        "",
        markdown_table(target_dist),
        "",
        "`tier_*` columns use the association-rule definition "
        "(Low <= 5, Med = 6, High >= 7). Exact duplicate rows are reported "
        "below and retained because the task specifies the full 6,497-row corpus.",
        "",
        markdown_table(duplicates),
        "",
        "## 2. Random Forest comparison (held-out 20% test set)",
        "",
        "M3 reuses the tuned forest with a probability threshold selected only "
        "on out-of-fold training predictions.",
        "",
        markdown_table(metrics),
        "",
        "M3 targets minority-class F1. When the OOF threshold moves away from 0.50, "
        "recall usually rises while accuracy and precision can fall; the held-out "
        "test columns are the unbiased comparison, and M3 is not guaranteed to win "
        "on every scope.",
        "",
        "## 3. Feature importance and selected features",
        "",
        "Selection uses training-only Gini importance. Permutation importance "
        "(ROC-AUC drop, 10 repeats, test set) is reported as a robustness check "
        "but is not used for downstream selection, preserving the rule holdout.",
        "",
    ]
    for scope in SCOPES:
        lines += [
            f"### {scope}: top 6 features",
            "",
            markdown_table(_feature_table(artifacts, scope)),
            "",
        ]

    lines += [
        "## 4. Group-wise quantile discretization (training fit)",
        "",
        "Combined-scope boundaries are fitted separately for red and white wine, "
        "so `alcohol=High` means the top tertile *within that wine type*. "
        "Intervals are closed on the right; `-inf` and `inf` are open outer bounds.",
        "",
        "### Combined scope",
        "",
        markdown_table(_bin_view(binning, "Combined")),
        "",
        "### Cut-point summary - all scopes",
        "",
        markdown_table(_boundary_summary(binning)),
        "",
        "Full boundaries for all scopes are exported to `outputs/tables/binning_boundaries.csv`.",
        "",
        "## 5. Association rules",
        "",
        "Rules are mined on the training split and re-scored on the untouched test "
        "split. `holdout_pass` requires the test support, confidence and lift to "
        "meet the same thresholds.",
        "",
        "| consequent | min support | min confidence | min lift |",
        "|---|---|---|---|",
    ]
    for cfg in RULE_CONFIGS:
        lines.append(
            f"| Quality={cfg.tier} | {cfg.min_support:.3f} | "
            f"{cfg.min_confidence:.2f} | {cfg.min_lift:.2f} |"
        )
    lines.append("")

    if rules.empty:
        lines += ["_No association rules passed the configured thresholds._", ""]
    else:
        counts = (
            rules.groupby(["scope", "consequent_tier"])
            .agg(rules=("rule_id", "size"), pass_holdout=("holdout_pass", "sum"),
                 max_lift=("lift", "max"))
            .reset_index()
        )
        lines += ["### Rule inventory", "", markdown_table(counts), ""]
        lines += [
            "The Combined scope pools two chemically different populations. "
            "Even with group-wise binning, pooled rules can be confounded by wine "
            "type (a Simpson's-paradox risk); use the Red and White tables as the "
            "primary basis for production advice and treat Combined rules as "
            "descriptive corpus-level patterns.",
            "",
        ]
        for scope in SCOPES:
            for tier in ("High", "Low"):
                table = _top_rules(rules, scope, tier, 5)
                lines += [
                    f"### {scope}: top Quality={tier} rules by lift",
                    "",
                    markdown_table(table),
                    "",
                ]
        lines += [
            f"Top {TOP_RULES_PER_GROUP} rules per scope/consequent are exported, "
            "with the complete inventory, to `outputs/tables/`.",
            "",
            "### Practical reading (associative, not causal)",
            "",
            "- Red premium rules repeatedly combine alcohol above 10.8% (top tertile), "
            "volatile acidity at or below 0.43 g/dm3, sulphates above 0.68 g/dm3 and "
            "density at or below 0.9961 g/cm3.",
            "- White premium rules favour alcohol above 11.0%, chlorides at or below "
            "0.038 g/dm3, density at or below 0.9924 g/cm3 and pH above 3.24; "
            "mid-range residual sugar (2.3-8.1 g/L) also appears repeatedly.",
            "- White rules are more heterogeneous than red rules, and the pooled "
            "Combined rules contain wine-type confounding. Treat these cutoffs as "
            "within-sample tertiles for hypothesis generation, not as universal "
            "winemaking specifications.",
            "",
        ]

    lines += [
        "## 6. Leakage controls and reproducibility",
        "",
        "- Stratified 80/20 train-test split before any model fitting (`random_state=42`).",
        "- Cost-sensitive fitting and threshold selection use training data only; "
        "the threshold is tuned on 5-fold out-of-fold predictions.",
        "- Feature selection uses Gini importance from the training fit.",
        "- Discretization boundaries are fitted on the training split only and "
        "applied unchanged to the test split.",
        "- Association rules are mined on training transactions and validated on test.",
        "- No SMOTE is applied. Class imbalance is handled with "
        "`class_weight='balanced_subsample'`, avoiding synthetic-data leakage.",
        "",
        "## 7. Limitations",
        "",
        "- The corpus contains 1,177 exact duplicate rows (18.1%); they are retained "
        "as specified and can modestly inflate support. Rule holdout checks are "
        "reported separately, but duplicate records may straddle the split.",
        "- The 80/20 split stratifies the binary target only; the Combined split is "
        "25.0% red in train and 23.2% in test.",
        "- Rules are associative, not causal. Confounding, measurement error and the "
        "ordinal nature of the sensory quality score remain.",
        "- Tertile binning discards within-bin variation; the reported cutoffs are "
        "sample-specific, not universal thresholds.",
        "",
        "## 8. Generated files",
        "",
    ]
    for path in output_files:
        lines.append(f"- `{path}`")
    lines.append("")
    return "\n".join(lines)
