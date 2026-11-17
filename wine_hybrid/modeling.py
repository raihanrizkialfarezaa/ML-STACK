"""Random Forest (bagging) modelling, evaluation and feature importance."""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Dict, List

import numpy as np
import pandas as pd
from sklearn.base import clone
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import StratifiedKFold, cross_val_predict

from .config import (
    FEATURES,
    PERMUTATION_REPEATS,
    THRESHOLD_GRID,
    TOP_N_FEATURES,
)
from .data import SplitData

logger = logging.getLogger(__name__)


@dataclass
class ModelResult:
    scope: str
    model_name: str
    threshold: float
    y_true: np.ndarray
    y_pred: np.ndarray
    y_proba: np.ndarray
    metrics: Dict[str, float]


@dataclass
class ScopeModelArtifacts:
    scope: str
    split: SplitData
    results: List[ModelResult]
    feature_importance: pd.DataFrame
    top_features: List[str]


def _build_model(kind: str, seed: int) -> RandomForestClassifier:
    if kind == "baseline":
        return RandomForestClassifier(
            n_estimators=200,
            random_state=seed,
            n_jobs=-1,
        )
    if kind == "tuned":
        return RandomForestClassifier(
            n_estimators=300,
            max_depth=16,
            min_samples_split=4,
            class_weight="balanced_subsample",
            random_state=seed,
            n_jobs=-1,
        )
    raise ValueError(f"Unknown model kind: {kind}")


def _metrics(y_true: np.ndarray, y_pred: np.ndarray, y_proba: np.ndarray) -> Dict[str, float]:
    out = {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred, zero_division=0)),
        "recall": float(recall_score(y_true, y_pred, zero_division=0)),
        "f1": float(f1_score(y_true, y_pred, zero_division=0)),
        "f1_macro": float(f1_score(y_true, y_pred, average="macro", zero_division=0)),
    }
    try:
        out["roc_auc"] = float(roc_auc_score(y_true, y_proba))
    except ValueError:
        out["roc_auc"] = float("nan")
    return out


def optimize_threshold_oof(
    estimator: RandomForestClassifier,
    X: pd.DataFrame,
    y: pd.Series,
    seed: int,
) -> tuple[float, np.ndarray, float]:
    """Choose a probability threshold on out-of-fold training predictions only."""
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=seed)
    oof = cross_val_predict(
        clone(estimator), X, y, cv=cv, method="predict_proba", n_jobs=1
    )[:, 1]
    best_threshold, best_f1 = 0.50, -1.0
    for threshold in THRESHOLD_GRID:
        score = f1_score(y, (oof >= threshold).astype(int), zero_division=0)
        # Tie-break: keep the threshold closest to 0.5 for stability.
        if score > best_f1 + 1e-12 or (
            abs(score - best_f1) <= 1e-12 and abs(threshold - 0.5) < abs(best_threshold - 0.5)
        ):
            best_threshold, best_f1 = threshold, score
    return float(best_threshold), oof, float(best_f1)


def _feature_importance(
    model: RandomForestClassifier,
    split: SplitData,
    seed: int,
) -> pd.DataFrame:
    gini = np.asarray(model.feature_importances_, dtype=float)
    perm = permutation_importance(
        model,
        split.X_test,
        split.y_test,
        scoring="roc_auc",
        n_repeats=PERMUTATION_REPEATS,
        random_state=seed,
        n_jobs=-1,
    )
    table = pd.DataFrame(
        {
            "scope": split.scope,
            "feature": list(FEATURES),
            "gini": gini,
            "perm_mean": np.asarray(perm.importances_mean, dtype=float),
            "perm_std": np.asarray(perm.importances_std, dtype=float),
        }
    )
    table["gini_rank"] = table["gini"].rank(ascending=False, method="min").astype(int)
    table["perm_rank"] = table["perm_mean"].rank(ascending=False, method="min").astype(int)
    table = table.sort_values(["gini_rank", "perm_rank", "feature"]).reset_index(drop=True)
    table["selected_top6"] = table["gini_rank"] <= TOP_N_FEATURES
    logger.info(
        "Top %d features (%s): %s",
        TOP_N_FEATURES,
        split.scope,
        ", ".join(table.loc[table["selected_top6"], "feature"]),
    )
    return table


def run_random_forest_scope(split: SplitData, seed: int) -> ScopeModelArtifacts:
    """Fit baseline, cost-sensitive tuned and threshold-optimized variants."""
    baseline = _build_model("baseline", seed)
    tuned = _build_model("tuned", seed)
    baseline.fit(split.X_train, split.y_train)
    tuned.fit(split.X_train, split.y_train)

    proba_baseline = baseline.predict_proba(split.X_test)[:, 1]
    proba_tuned = tuned.predict_proba(split.X_test)[:, 1]

    threshold, oof, oof_f1 = optimize_threshold_oof(tuned, split.X_train, split.y_train, seed)
    logger.info("Scope %-8s OOF-optimal threshold=%.2f (OOF F1=%.4f)", split.scope, threshold, oof_f1)

    definitions = [
        ("M1_Baseline", 0.50, proba_baseline),
        ("M2_Tuned_CostSensitive", 0.50, proba_tuned),
        ("M3_ThresholdOptimized", threshold, proba_tuned),
    ]
    results: List[ModelResult] = []
    for name, cut, proba in definitions:
        pred = (proba >= cut).astype(int)
        results.append(
            ModelResult(
                scope=split.scope,
                model_name=name,
                threshold=float(cut),
                y_true=split.y_test.to_numpy(),
                y_pred=pred,
                y_proba=np.asarray(proba, dtype=float),
                metrics=_metrics(split.y_test.to_numpy(), pred, proba),
            )
        )
        logger.info(
            "%-8s %-24s acc=%.4f f1=%.4f auc=%.4f",
            split.scope,
            name,
            results[-1].metrics["accuracy"],
            results[-1].metrics["f1"],
            results[-1].metrics["roc_auc"],
        )

    importance = _feature_importance(tuned, split, seed)
    top_features = (
        importance.loc[importance["selected_top6"], "feature"].head(TOP_N_FEATURES).tolist()
    )
    return ScopeModelArtifacts(
        scope=split.scope,
        split=split,
        results=results,
        feature_importance=importance,
        top_features=top_features,
    )
