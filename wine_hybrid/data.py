"""Data loading, target engineering, scope construction and splitting."""
from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Dict

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

from .config import (
    BINARY_TARGET,
    FEATURES,
    HIGH_QUALITY_CUTOFF,
    QUALITY,
    SCOPES,
    TIER_TARGET,
    TIERS,
    WINE_TYPE,
    WINE_TYPE_CODES,
)

logger = logging.getLogger(__name__)


@dataclass
class SplitData:
    """Everything needed downstream for one experimental scope."""

    scope: str
    train_df: pd.DataFrame
    test_df: pd.DataFrame
    X_train: pd.DataFrame
    X_test: pd.DataFrame
    y_train: pd.Series
    y_test: pd.Series

    @property
    def n_train(self) -> int:
        return len(self.train_df)

    @property
    def n_test(self) -> int:
        return len(self.test_df)


def load_wine_data(dataset_dir: Path) -> pd.DataFrame:
    """Load, validate and concatenate the red and white wine files."""
    dataset_dir = Path(dataset_dir)
    files = {
        "Red": dataset_dir / "winequality-red.csv",
        "White": dataset_dir / "winequality-white.csv",
    }
    frames = []
    for name, path in files.items():
        if not path.exists():
            raise FileNotFoundError(f"Dataset file not found: {path}")
        frame = pd.read_csv(path, sep=";")
        frame.columns = [str(c).strip().strip('"') for c in frame.columns]
        frame[WINE_TYPE] = WINE_TYPE_CODES[name]
        frames.append(frame)
        logger.info("Loaded %s: %d rows x %d columns", name, *frame.shape)

    df = pd.concat(frames, ignore_index=True)
    missing_cols = [c for c in list(FEATURES) + [QUALITY] if c not in df.columns]
    if missing_cols:
        raise ValueError(f"Missing expected columns: {missing_cols}")

    df = df[list(FEATURES) + [QUALITY, WINE_TYPE]].copy()
    for col in FEATURES:
        df[col] = pd.to_numeric(df[col], errors="raise")
    df[QUALITY] = pd.to_numeric(df[QUALITY], errors="raise").astype(int)
    df[WINE_TYPE] = df[WINE_TYPE].astype(int)

    missing = int(df.isna().sum().sum())
    if missing:
        raise ValueError(f"Dataset contains {missing} missing values; refusing to impute silently.")
    if not df[QUALITY].between(3, 9).all():
        raise ValueError("Target 'quality' falls outside the documented 3-9 range.")

    logger.info("Unified dataset: %d rows, %d missing values", len(df), missing)
    return df


def add_targets(df: pd.DataFrame) -> pd.DataFrame:
    """Create the binary RF target and the 3-tier ARM target."""
    out = df.copy()
    out[BINARY_TARGET] = (out[QUALITY] >= HIGH_QUALITY_CUTOFF).astype(int)
    values = np.select(
        [out[QUALITY] >= HIGH_QUALITY_CUTOFF, out[QUALITY] == 6],
        ["High", "Med"],
        default="Low",
    )
    out[TIER_TARGET] = pd.Categorical(values, categories=list(TIERS), ordered=True)
    return out


def build_scopes(df: pd.DataFrame) -> Dict[str, pd.DataFrame]:
    """Return the three leakage-safe experimental populations."""
    scopes = {
        "Combined": df.copy(),
        "Red": df[df[WINE_TYPE] == 0].reset_index(drop=True),
        "White": df[df[WINE_TYPE] == 1].reset_index(drop=True),
    }
    for name in SCOPES:
        logger.info("Scope %-8s N=%d", name, len(scopes[name]))
    return scopes


def split_scope(scope: str, df: pd.DataFrame, test_size: float, seed: int) -> SplitData:
    """Stratified 80/20 split on the binary quality target."""
    train_df, test_df = train_test_split(
        df,
        test_size=test_size,
        random_state=seed,
        stratify=df[BINARY_TARGET],
    )
    train_df = train_df.reset_index(drop=True)
    test_df = test_df.reset_index(drop=True)
    split = SplitData(
        scope=scope,
        train_df=train_df,
        test_df=test_df,
        X_train=train_df[list(FEATURES)],
        X_test=test_df[list(FEATURES)],
        y_train=train_df[BINARY_TARGET].astype(int),
        y_test=test_df[BINARY_TARGET].astype(int),
    )
    logger.info(
        "Split %-8s train=%d test=%d | positives train=%d test=%d",
        scope,
        split.n_train,
        split.n_test,
        int(split.y_train.sum()),
        int(split.y_test.sum()),
    )
    return split


def target_distribution(scopes: Dict[str, pd.DataFrame]) -> pd.DataFrame:
    """Compact per-scope class distribution table."""
    rows = []
    for scope in SCOPES:
        sub = scopes[scope]
        tier_counts = sub[TIER_TARGET].value_counts().reindex(list(TIERS), fill_value=0)
        high = int((sub[QUALITY] >= HIGH_QUALITY_CUTOFF).sum())
        rows.append(
            {
                "scope": scope,
                "n_rows": len(sub),
                "tier_low": int(tier_counts["Low"]),
                "tier_med": int(tier_counts["Med"]),
                "tier_high": int(tier_counts["High"]),
                "quality_high_n": high,
                "quality_high_pct": 100.0 * high / len(sub),
            }
        )
    return pd.DataFrame(rows)


def duplicate_summary(scopes: Dict[str, pd.DataFrame]) -> pd.DataFrame:
    """Report exact duplicate feature/target rows (known Wine Quality issue)."""
    rows = []
    key = list(FEATURES) + [QUALITY, WINE_TYPE]
    for scope in SCOPES:
        sub = scopes[scope]
        dup = int(sub.duplicated(subset=key, keep="first").sum())
        rows.append(
            {
                "scope": scope,
                "n_rows": len(sub),
                "duplicate_rows": dup,
                "duplicate_pct": 100.0 * dup / len(sub),
            }
        )
    return pd.DataFrame(rows)
