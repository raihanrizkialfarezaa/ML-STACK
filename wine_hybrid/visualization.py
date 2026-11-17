"""Publication-grade four-panel dashboard."""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Dict

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.lines import Line2D
from matplotlib.colors import Normalize
from sklearn.metrics import roc_curve

from .config import SCOPES, SCOPE_COLORS
from .modeling import ScopeModelArtifacts

logger = logging.getLogger(__name__)

ABBREVIATIONS = {
    "fixed acidity": "FA",
    "volatile acidity": "VA",
    "citric acid": "CA",
    "residual sugar": "RS",
    "chlorides": "CL",
    "free sulfur dioxide": "FSO2",
    "total sulfur dioxide": "TSO2",
    "density": "DEN",
    "pH": "pH",
    "sulphates": "SUL",
    "alcohol": "ALC",
}


def _abbreviate(text: str) -> str:
    out = text
    for long_name, short in ABBREVIATIONS.items():
        out = out.replace(long_name, short)
    return out.replace("High", "H").replace("Med", "M").replace("Low", "L")



def _style(ax) -> None:
    ax.grid(True, linestyle="--", alpha=0.28)
    ax.set_axisbelow(True)
    for spine in ("top", "right"):
        ax.spines[spine].set_visible(False)


def _shorten(text: str, max_len: int = 58) -> str:
    return text if len(text) <= max_len else text[: max_len - 3] + "..."


def _panel_a(ax, artifacts: Dict[str, ScopeModelArtifacts]) -> None:
    frames = []
    for scope in SCOPES:
        table = artifacts[scope].feature_importance[["feature", "gini"]].copy()
        table["scope"] = scope
        frames.append(table)
    wide = pd.concat(frames).pivot(index="feature", columns="scope", values="gini")
    order = wide.mean(axis=1).sort_values(ascending=False).index
    wide = wide.loc[order]
    y = np.arange(len(wide))
    height = 0.26
    for i, scope in enumerate(SCOPES):
        ax.barh(
            y + (i - 1) * height,
            wide[scope].to_numpy(),
            height=height,
            label=scope,
            color=SCOPE_COLORS[scope],
            alpha=0.90,
        )
    ax.set_yticks(y)
    ax.set_yticklabels(wide.index)
    ax.invert_yaxis()
    ax.set_xlabel("Gini importance")
    ax.set_title("A. Random Forest feature importance by scope", loc="left", fontweight="bold")
    ax.legend(frameon=False, loc="lower right")
    _style(ax)


def _panel_b(ax, artifacts: Dict[str, ScopeModelArtifacts]) -> None:
    for scope in SCOPES:
        result = next(r for r in artifacts[scope].results if r.model_name == "M2_Tuned_CostSensitive")
        fpr, tpr, _ = roc_curve(result.y_true, result.y_proba)
        auc = result.metrics["roc_auc"]
        ax.plot(
            fpr,
            tpr,
            linewidth=2.2,
            color=SCOPE_COLORS[scope],
            label=f"{scope} (AUC = {auc:.3f})",
        )
    ax.plot([0, 1], [0, 1], linestyle=":", color="#616161", linewidth=1.2)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1.01)
    ax.set_xlabel("False positive rate")
    ax.set_ylabel("True positive rate")
    ax.set_title("B. ROC curves - tuned cost-sensitive Random Forest", loc="left", fontweight="bold")
    ax.legend(loc="lower right", frameon=False)
    _style(ax)


def _panel_c(ax, rules: pd.DataFrame) -> None:
    data = rules[rules["scope"] == "Combined"].copy() if not rules.empty else rules
    data = data.reset_index(drop=True)
    if data.empty:
        ax.text(0.5, 0.5, "No association rules passed the thresholds",
                ha="center", va="center", transform=ax.transAxes)
        ax.set_title("C. Association rules - support vs confidence", loc="left", fontweight="bold")
        return

    lift = data["lift"].to_numpy(dtype=float)
    norm = Normalize(vmin=float(np.nanmin(lift)), vmax=float(np.nanmax(lift)))
    sizes = 45.0 + 420.0 * (lift - norm.vmin) / max(norm.vmax - norm.vmin, 1e-9)
    for tier, marker in (("High", "o"), ("Low", "^")):
        subset = data[data["consequent_tier"] == tier]
        if subset.empty:
            continue
        ax.scatter(
            subset["support"],
            subset["confidence"],
            s=sizes[subset.index.to_numpy()],
            c=subset["lift"],
            cmap="viridis",
            norm=norm,
            marker=marker,
            edgecolor="white",
            linewidth=0.5,
            alpha=0.85,
            label=f"Quality={tier}",
        )

    top = (
        data.sort_values(["lift", "confidence"], ascending=False)
        .groupby("consequent_tier", sort=False)
        .head(1)
    )
    for _, row in top.iterrows():
        offset = (14, 14) if row["consequent_tier"] == "High" else (14, 8)
        ax.annotate(
            _shorten(_abbreviate(row["antecedents"]), 34),
            (row["support"], row["confidence"]),
            xytext=offset,
            textcoords="offset points",
            fontsize=7.2,
            arrowprops={"arrowstyle": "-", "lw": 0.7, "color": "#424242"},
        )

    sm = plt.cm.ScalarMappable(cmap="viridis", norm=norm)
    sm.set_array([])
    colorbar = plt.colorbar(sm, ax=ax, pad=0.01)
    colorbar.set_label("Lift", fontsize=9)
    ax.set_xlabel("Support")
    ax.set_ylabel("Confidence")
    ax.set_title("C. Association rules - Combined scope", loc="left", fontweight="bold")
    ax.text(
        0.02,
        0.02,
        "Labels: highest-lift rule per consequent.",
        transform=ax.transAxes,
        fontsize=7.2,
        color="#555555",
    )
    handles = [
        Line2D([0], [0], marker="o", color="none", markerfacecolor="#455a64",
               markeredgecolor="white", markersize=7, label="Quality=High"),
        Line2D([0], [0], marker="^", color="none", markerfacecolor="#455a64",
               markeredgecolor="white", markersize=7, label="Quality=Low"),
    ]
    ax.legend(handles=handles, frameon=False, loc="upper left", fontsize=8)
    _style(ax)


def _panel_d(ax, rules: pd.DataFrame) -> None:
    if rules.empty:
        high = rules
    else:
        high = rules[rules["consequent_tier"] == "High"].sort_values(
            ["lift", "confidence"], ascending=False
        ).head(10)
    if high.empty:
        ax.text(0.5, 0.5, "No High-quality rules passed the thresholds",
                ha="center", va="center", transform=ax.transAxes)
        ax.set_title("D. Top high-quality rules by lift", loc="left", fontweight="bold")
        return

    high = high.iloc[::-1]
    y = np.arange(len(high))
    colors = high["confidence"].to_numpy(dtype=float)
    norm = Normalize(vmin=float(colors.min()), vmax=float(colors.max()))
    bars = ax.barh(y, high["lift"], color=plt.cm.viridis(norm(colors)), alpha=0.9)
    ax.set_yticks(y)
    ax.set_yticklabels(
        [f"{row.scope} | {_shorten(_abbreviate(row.antecedents), 34)}"
         for row in high.itertuples(index=False)],
        fontsize=8,
    )
    ax.tick_params(axis="y", pad=4)
    ax.set_xlabel("Lift")
    ax.axvline(1.0, color="#616161", linestyle=":", linewidth=1)
    for bar, (_, row) in zip(bars, high.iterrows()):
        ax.text(
            bar.get_width() + 0.03,
            bar.get_y() + bar.get_height() / 2,
            f"{100 * row['confidence']:.2f}% conf.",
            va="center",
            fontsize=7,
        )
    ax.set_title("D. Top 10 Quality=High rules by lift (all scopes)",
                 loc="left", fontweight="bold")
    _style(ax)


def plot_dashboard(
    artifacts: Dict[str, ScopeModelArtifacts],
    rules: pd.DataFrame,
    output_path: Path,
) -> Path:
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    fig = plt.figure(figsize=(22, 15), facecolor="white")
    grid = fig.add_gridspec(2, 2, hspace=0.26, wspace=0.20)
    _panel_a(fig.add_subplot(grid[0, 0]), artifacts)
    _panel_b(fig.add_subplot(grid[0, 1]), artifacts)
    _panel_c(fig.add_subplot(grid[1, 0]), rules)
    _panel_d(fig.add_subplot(grid[1, 1]), rules)
    fig.suptitle(
        "Feature-Guided Hybrid Data Mining on UCI Wine Quality  |  "
        "Random Forest (Bagging) + Association Rule Mining",
        fontsize=16,
        fontweight="bold",
        y=0.985,
    )
    fig.text(
        0.5,
        0.008,
        "Abbreviations: ALC alcohol | VA volatile acidity | CA citric acid | "
        "RS residual sugar | CL chlorides | DEN density | SUL sulphates | H/M/L High/Med/Low",
        ha="center",
        fontsize=8,
        color="#555555",
    )
    fig.savefig(output_path, dpi=300, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    logger.info("Dashboard saved: %s", output_path)
    return output_path
