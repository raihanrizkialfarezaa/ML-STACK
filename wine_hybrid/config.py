"""Central configuration for the feature-guided hybrid wine-quality project."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATASET_DIR = PROJECT_ROOT / "datasets"
DEFAULT_OUTPUT_DIR = PROJECT_ROOT / "outputs"

FEATURES: tuple[str, ...] = (
    "fixed acidity",
    "volatile acidity",
    "citric acid",
    "residual sugar",
    "chlorides",
    "free sulfur dioxide",
    "total sulfur dioxide",
    "density",
    "pH",
    "sulphates",
    "alcohol",
)

QUALITY = "quality"
WINE_TYPE = "wine_type"
BINARY_TARGET = "high_quality"
TIER_TARGET = "quality_tier"

TIERS: tuple[str, ...] = ("Low", "Med", "High")
BIN_LABELS: tuple[str, ...] = ("Low", "Med", "High")
SCOPES: tuple[str, ...] = ("Combined", "Red", "White")
WINE_TYPE_CODES: dict[str, int] = {"Red": 0, "White": 1}
WINE_TYPE_NAMES: dict[int, str] = {0: "Red", 1: "White"}

TEST_SIZE = 0.20
SEED = 42
HIGH_QUALITY_CUTOFF = 7
TOP_N_FEATURES = 6
PERMUTATION_REPEATS = 10
THRESHOLD_GRID = tuple(round(0.30 + 0.01 * i, 2) for i in range(36))  # 0.30 .. 0.65

SCOPE_COLORS: dict[str, str] = {
    "Combined": "#4a148c",
    "Red": "#b71c1c",
    "White": "#b8860b",
}


@dataclass(frozen=True)
class RuleConfig:
    """Thresholds for one quality consequent."""

    tier: str
    min_support: float
    min_confidence: float
    min_lift: float


RULE_CONFIGS: tuple[RuleConfig, ...] = (
    RuleConfig(tier="High", min_support=0.025, min_confidence=0.50, min_lift=2.00),
    RuleConfig(tier="Low", min_support=0.050, min_confidence=0.65, min_lift=1.75),
)

TOP_RULES_PER_GROUP = 10
