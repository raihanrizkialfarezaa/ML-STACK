"""Type-aware discretization and association-rule mining with holdout validation."""
from __future__ import annotations

import itertools
import logging
from dataclasses import dataclass
from typing import Iterable, List, Sequence

import numpy as np
import pandas as pd

from .config import (
    BIN_LABELS,
    RULE_CONFIGS,
    TIERS,
    WINE_TYPE,
    WINE_TYPE_CODES,
    RuleConfig,
)

logger = logging.getLogger(__name__)

try:  # Optional dependency: a pure-Python fallback keeps the pipeline runnable.
    from mlxtend.frequent_patterns import association_rules, fpgrowth

    HAS_MLXTEND = True
except ImportError:  # pragma: no cover - exercised only without mlxtend
    HAS_MLXTEND = False

RAW_RULE_COLUMNS = [
    "antecedents",
    "consequents",
    "antecedent_support",
    "consequent_support",
    "support",
    "confidence",
    "lift",
    "leverage",
    "conviction",
    "consequent_tier",
]

FINAL_RULE_COLUMNS = [
    "rule_id",
    "scope",
    "consequent_tier",
    "antecedents",
    "consequent",
    "rule",
    "n_antecedents",
    "support",
    "confidence",
    "lift",
    "leverage",
    "conviction",
    "antecedent_support",
    "consequent_support",
    "support_test",
    "confidence_test",
    "lift_test",
    "holdout_pass",
    "rank",
]


@dataclass(frozen=True)
class BinSpec:
    """Quantile boundaries for one feature inside one wine-type group."""

    scope: str
    group: str
    feature: str
    interior_edges: tuple[float, ...]

    @property
    def n_bins(self) -> int:
        return len(self.interior_edges) + 1

    @property
    def labels(self) -> tuple[str, ...]:
        return _labels_for(self.n_bins)

    def cut(self, series: pd.Series) -> pd.Series:
        edges = [-np.inf, *self.interior_edges, np.inf]
        return pd.cut(
            series,
            bins=edges,
            labels=list(self.labels),
            include_lowest=True,
            right=True,
        ).astype(str)


def _labels_for(n_bins: int) -> tuple[str, ...]:
    if n_bins == 3:
        return BIN_LABELS
    if n_bins == 2:
        return ("Low", "High")
    return ("All",)


def _tertile_edges(series: pd.Series) -> list[float]:
    """Return up to two strictly interior cut points, handling heavy ties."""
    x = series.dropna()
    if x.empty:
        return []
    lo, hi = float(x.min()), float(x.max())
    if lo == hi:
        return []

    try:
        _, edges = pd.qcut(x, q=3, retbins=True, duplicates="raise")
        interior = sorted({float(e) for e in edges[1:-1] if lo < float(e) < hi})
        if len(interior) == 2:
            return interior
    except (ValueError, IndexError):
        pass

    unique = np.sort(x.unique())
    pool = unique[(unique > lo) & (unique < hi)]
    if len(pool) == 0:
        return []
    if len(pool) == 1:
        return [float(pool[0])]

    counts = x.value_counts().sort_index()
    cumulative = counts.cumsum().to_numpy() / len(x)
    picks: list[float] = []
    for quantile in (1.0 / 3.0, 2.0 / 3.0):
        idx = int(np.searchsorted(cumulative, quantile, side="left"))
        idx = min(max(idx, 0), len(counts) - 1)
        value = float(counts.index[idx])
        if lo < value < hi:
            picks.append(value)
    picks = sorted(set(picks))
    if len(picks) >= 2:
        return [picks[0], picks[-1]]
    return [float(pool[0]), float(pool[-1])]


def fit_bin_specs(train_df: pd.DataFrame, features: Sequence[str], scope: str) -> List[BinSpec]:
    """Fit group-wise tertiles; combined data is binned within each wine type."""
    if scope == "Combined":
        groups = [
            ("Red", train_df[train_df[WINE_TYPE] == WINE_TYPE_CODES["Red"]]),
            ("White", train_df[train_df[WINE_TYPE] == WINE_TYPE_CODES["White"]]),
        ]
    else:
        groups = [("All", train_df)]

    specs: List[BinSpec] = []
    for feature in features:
        for group_name, subset in groups:
            if subset.empty:
                continue
            edges = _tertile_edges(subset[feature])
            spec = BinSpec(scope, group_name, feature, tuple(edges))
            specs.append(spec)
            if spec.n_bins < 3:
                logger.warning(
                    "%s | %s | %s produced %d bin(s) because of tied quantiles",
                    scope,
                    group_name,
                    feature,
                    spec.n_bins,
                )
    return specs


def _group_mask(df: pd.DataFrame, group: str) -> pd.Series:
    if group == "Red":
        return df[WINE_TYPE] == WINE_TYPE_CODES["Red"]
    if group == "White":
        return df[WINE_TYPE] == WINE_TYPE_CODES["White"]
    return pd.Series(True, index=df.index)


def apply_bins(df: pd.DataFrame, specs: Iterable[BinSpec]) -> pd.DataFrame:
    """Apply fitted boundaries row-wise, respecting wine-type groups."""
    specs = list(specs)
    features = sorted({s.feature for s in specs})
    out = pd.DataFrame(index=df.index, columns=features, dtype=object)
    for spec in specs:
        mask = _group_mask(df, spec.group)
        if not mask.any():
            continue
        out.loc[mask, spec.feature] = spec.cut(df.loc[mask, spec.feature])
    if out.isna().any().any():
        missing = out.isna().sum().loc[lambda s: s > 0].to_dict()
        raise ValueError(f"Discretization left unassigned rows: {missing}")
    return out.astype(str)


def build_onehot(discrete_df: pd.DataFrame, tiers: pd.Series) -> pd.DataFrame:
    """One-hot encode binned features and the ordered quality tier."""
    items = discrete_df.copy()
    items["Quality"] = pd.Categorical(tiers, categories=list(TIERS), ordered=True)
    hot = pd.get_dummies(items, prefix_sep="=", dtype=bool)
    for tier in TIERS:
        col = f"Quality={tier}"
        if col not in hot.columns:
            hot[col] = False
    return hot


def _format_itemset(items: frozenset) -> str:
    return " & ".join(sorted(str(i) for i in items))


def _empty_raw() -> pd.DataFrame:
    return pd.DataFrame(columns=RAW_RULE_COLUMNS)


def _empty_final() -> pd.DataFrame:
    return pd.DataFrame(columns=FINAL_RULE_COLUMNS)


def _filter_rules(rules: pd.DataFrame, cfg: RuleConfig) -> pd.DataFrame:
    if rules.empty:
        return _empty_raw()
    target = frozenset({f"Quality={cfg.tier}"})
    mask = rules["consequents"].apply(lambda c: c == target)
    mask &= rules["antecedents"].apply(
        lambda a: 1 <= len(a) <= 3
        and not any(str(item).startswith("Quality=") for item in a)
    )
    mask &= rules["support"] >= cfg.min_support
    mask &= rules["confidence"] >= cfg.min_confidence
    mask &= rules["lift"] >= cfg.min_lift
    out = rules.loc[mask].copy()
    out = out.rename(
        columns={
            "antecedent support": "antecedent_support",
            "consequent support": "consequent_support",
        }
    )
    out["consequent_tier"] = cfg.tier
    return out[RAW_RULE_COLUMNS].reset_index(drop=True)


def _mine_mlxtend(onehot: pd.DataFrame, cfg: RuleConfig) -> pd.DataFrame:
    if not HAS_MLXTEND:
        raise RuntimeError("mlxtend is not installed.")
    frequent = fpgrowth(
        onehot,
        min_support=cfg.min_support,
        use_colnames=True,
        max_len=4,
    )
    if frequent.empty:
        return _empty_raw()
    try:
        rules = association_rules(
            frequent,
            metric="confidence",
            min_threshold=cfg.min_confidence,
            num_itemsets=len(frequent),
        )
    except TypeError:  # older mlxtend without num_itemsets
        rules = association_rules(
            frequent, metric="confidence", min_threshold=cfg.min_confidence
        )
    return _filter_rules(rules, cfg)


def _mine_fallback(onehot: pd.DataFrame, cfg: RuleConfig) -> pd.DataFrame:
    """Pure-Python exhaustive antecedent search (max 3 items)."""
    items = [c for c in onehot.columns if not c.startswith("Quality=")]
    arrays = {c: onehot[c].to_numpy(dtype=bool) for c in items}
    target_col = f"Quality={cfg.tier}"
    if target_col not in onehot.columns:
        return _empty_raw()
    target = onehot[target_col].to_numpy(dtype=bool)
    target_support = float(target.mean())
    n_rows = len(onehot)

    rows = []
    for k in range(1, 4):
        for combo in itertools.combinations(items, k):
            antecedent = np.ones(n_rows, dtype=bool)
            for item in combo:
                antecedent &= arrays[item]
            antecedent_support = float(antecedent.mean())
            if antecedent_support < cfg.min_support:
                continue
            union = antecedent & target
            support = float(union.mean())
            if support < cfg.min_support:
                continue
            confidence = support / antecedent_support
            if confidence < cfg.min_confidence:
                continue
            lift = confidence / target_support if target_support else float("nan")
            if not lift >= cfg.min_lift:
                continue
            leverage = support - antecedent_support * target_support
            conviction = (
                (1.0 - target_support) / (1.0 - confidence)
                if confidence < 1.0
                else float("inf")
            )
            rows.append(
                {
                    "antecedents": frozenset(combo),
                    "consequents": frozenset({target_col}),
                    "antecedent_support": antecedent_support,
                    "consequent_support": target_support,
                    "support": support,
                    "confidence": confidence,
                    "lift": lift,
                    "leverage": leverage,
                    "conviction": conviction,
                    "consequent_tier": cfg.tier,
                }
            )
    return pd.DataFrame(rows, columns=RAW_RULE_COLUMNS)


def mine_rules(onehot: pd.DataFrame, cfg: RuleConfig, miner: str = "auto") -> pd.DataFrame:
    if miner == "fallback":
        return _mine_fallback(onehot, cfg)
    if miner == "mlxtend":
        return _mine_mlxtend(onehot, cfg)
    if miner == "auto":
        return _mine_mlxtend(onehot, cfg) if HAS_MLXTEND else _mine_fallback(onehot, cfg)
    raise ValueError(f"Unknown miner: {miner}")


def add_holdout_metrics(
    rules: pd.DataFrame, holdout: pd.DataFrame, cfg: RuleConfig
) -> pd.DataFrame:
    """Recompute rule support/confidence/lift on the untouched 20% test split."""
    if rules.empty:
        return rules
    out = rules.copy()
    target_col = f"Quality={cfg.tier}"
    target = holdout[target_col].to_numpy(dtype=bool)
    target_support = float(target.mean())

    supports, confidences, lifts, passes = [], [], [], []
    for antecedent, consequent in zip(out["antecedents"], out["consequents"]):
        if consequent != frozenset({target_col}):
            raise ValueError("Holdout validation received an unexpected consequent.")
        mask = np.ones(len(holdout), dtype=bool)
        for item in antecedent:
            mask &= holdout[str(item)].to_numpy(dtype=bool)
        union = mask & target
        support_holdout = float(union.mean())
        antecedent_support = float(mask.mean())
        if antecedent_support > 0:
            confidence_holdout = support_holdout / antecedent_support
            lift_holdout = confidence_holdout / target_support if target_support else np.nan
        else:
            confidence_holdout = np.nan
            lift_holdout = np.nan
        supports.append(support_holdout)
        confidences.append(confidence_holdout)
        lifts.append(lift_holdout)
        passes.append(
            bool(
                antecedent_support > 0
                and support_holdout >= cfg.min_support
                and confidence_holdout >= cfg.min_confidence
                and lift_holdout >= cfg.min_lift
            )
        )
    out["support_test"] = supports
    out["confidence_test"] = confidences
    out["lift_test"] = lifts
    out["holdout_pass"] = passes
    return out


def finalize_rules(raw: pd.DataFrame, cfg: RuleConfig, scope: str) -> pd.DataFrame:
    if raw.empty:
        return _empty_final()
    out = raw.copy()
    out["scope"] = scope
    out["antecedent_items"] = out["antecedents"].apply(_format_itemset)
    out["antecedent_count"] = out["antecedents"].apply(len)
    out["consequent"] = f"Quality={cfg.tier}"
    out["rule"] = out["antecedent_items"] + " => " + out["consequent"]
    out = out.sort_values(
        ["lift", "confidence", "support"], ascending=[False, False, False]
    ).reset_index(drop=True)
    out["rank"] = np.arange(1, len(out) + 1)
    out["rule_id"] = (
        scope
        + "-"
        + cfg.tier
        + "-"
        + pd.Series(out["rank"]).astype(str).str.zfill(2).to_numpy()
    )
    out = out.drop(columns=["antecedents"])
    out = out.rename(
        columns={
            "antecedent_items": "antecedents",
            "antecedent_count": "n_antecedents",
        }
    )
    return out[FINAL_RULE_COLUMNS]


def mine_scope_rules(
    onehot_train: pd.DataFrame,
    onehot_test: pd.DataFrame,
    scope: str,
    miner: str = "auto",
) -> pd.DataFrame:
    frames = []
    for cfg in RULE_CONFIGS:
        raw = mine_rules(onehot_train, cfg, miner=miner)
        if raw.empty:
            logger.warning("%s | Quality=%s | no rules passed the thresholds", scope, cfg.tier)
            frames.append(_empty_final())
            continue
        validated = add_holdout_metrics(raw, onehot_test, cfg)
        final = finalize_rules(validated, cfg, scope)
        frames.append(final)
        logger.info(
            "%s | Quality=%s | %d rules | %d pass holdout | lift %.2f-%.2f",
            scope,
            cfg.tier,
            len(final),
            int(final["holdout_pass"].sum()),
            final["lift"].min(),
            final["lift"].max(),
        )
    return pd.concat(frames, ignore_index=True)


def build_binning_table(
    specs: Sequence[BinSpec],
    train_df: pd.DataFrame,
    test_df: pd.DataFrame,
    scope: str,
) -> pd.DataFrame:
    rows = []
    for spec in specs:
        edges = [-np.inf, *spec.interior_edges, np.inf]
        labels = spec.labels
        train_mask = _group_mask(train_df, spec.group)
        test_mask = _group_mask(test_df, spec.group)
        train_sub = train_df.loc[train_mask]
        test_sub = test_df.loc[test_mask]
        train_bins = spec.cut(train_sub[spec.feature])
        test_bins = spec.cut(test_sub[spec.feature])
        for i, label in enumerate(labels):
            tr = train_sub.loc[train_bins == label, spec.feature]
            te = test_sub.loc[test_bins == label, spec.feature]
            rows.append(
                {
                    "scope": scope,
                    "group": spec.group,
                    "feature": spec.feature,
                    "bin": label,
                    "lower_bound": float(edges[i]),
                    "upper_bound": float(edges[i + 1]),
                    "n_train": len(tr),
                    "share_train": len(tr) / len(train_sub),
                    "n_test": len(te),
                    "share_test": len(te) / len(test_sub),
                    "observed_min": float(tr.min()) if len(tr) else np.nan,
                    "observed_max": float(tr.max()) if len(tr) else np.nan,
                }
            )
    return pd.DataFrame(rows)
