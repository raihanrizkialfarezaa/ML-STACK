"""
================================================================================
HYBRID DATA MINING: RANDOM FOREST CLASSIFICATION (BAGGING ENSEMBLE)
PADA DATASET UCI WINE QUALITY (RED & WHITE WINE)
================================================================================
File ini dirancang self-contained (satu file utuh) dan siap dijalankan langsung
di Google Colab, Jupyter Notebook, maupun Terminal lokal Python biasa.

Fitur Utama:
1. Auto-download dataset dari UCI Repository jika file CSV lokal belum ada.
2. Target Engineering: Biner (Quality >= 7 -> 1 [Premium], <= 6 -> 0 [Reguler]).
3. Evaluasi 3 Scope Populasi: Combined (N=6.497), Red (N=1.599), White (N=4.898).
4. Komparasi 3 Varian Random Forest per Scope:
   - M1: Baseline (200 Trees, Default Cutoff 0.50)
   - M2: Cost-Sensitive Tuned (300 Trees, class_weight='balanced_subsample')
   - M3: Threshold-Optimized (Tuning ambang probabilitas via 5-Fold OOF CV)
5. Dual Feature Importance: Gini Impurity vs Permutation Importance (ROC-AUC drop).
6. Dashboard Visualisasi Publikasi 4-Panel (ROC Curves, Feature Importance,
   Confusion Matrices, dan Metrik Komparasi F1/Akurasi).
================================================================================
"""

import os
import sys
import math
import time
import urllib.request
from pathlib import Path

# Memastikan output stdout UTF-8 pada terminal Windows
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.base import clone
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    roc_curve,
    confusion_matrix,
)
from sklearn.model_selection import StratifiedKFold, cross_val_predict, train_test_split

# ==============================================================================
# 1. KONFIGURASI DAN PARAMETER GLOBAL
# ==============================================================================
SEED = 42
TEST_SIZE = 0.20
HIGH_QUALITY_THRESHOLD = 7  # Nilai >= 7 diklasifikasikan sebagai Premium (1)
PERMUTATION_REPEATS = 10

FEATURES = [
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
]

UCI_URLS = {
    "winequality-red.csv": "https://archive.ics.uci.edu/ml/machine-learning-databases/wine-quality/winequality-red.csv",
    "winequality-white.csv": "https://archive.ics.uci.edu/ml/machine-learning-databases/wine-quality/winequality-white.csv",
}

SCOPE_COLORS = {
    "Combined": "#6b21a8",  # Ungu
    "Red": "#b91c1c",       # Merah marun
    "White": "#d97706",     # Kuning amber/emas
}

# ==============================================================================
# 2. FUNGSI PENGAMBILAN & PREPROCESSING DATA
# ==============================================================================
def download_file(url: str, destination: Path) -> None:
    """Mengunduh file dari URL dengan User-Agent browser."""
    print(f"[*] Mengunduh dataset dari UCI: {destination.name} ...")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as response, open(destination, "wb") as out_file:
        out_file.write(response.read())
    print(f"[+] Selesai mengunduh: {destination.name} ({destination.stat().st_size:,} bytes)")


def load_dataset() -> pd.DataFrame:
    """
    Mencari dataset di direktori saat ini atau subfolder datasets/.
    Jika tidak ditemukan, otomatis mengunduh langsung dari repositori UCI.
    """
    possible_dirs = [Path("."), Path("./datasets"), Path("../datasets")]
    files_to_find = ["winequality-red.csv", "winequality-white.csv"]

    data_paths = {}
    for filename in files_to_find:
        found_path = None
        for pdir in possible_dirs:
            candidate = pdir / filename
            if candidate.exists() and candidate.stat().st_size > 0:
                found_path = candidate
                break

        if found_path is None:
            # Unduh ke direktori kerja saat ini
            target_path = Path(filename)
            download_file(UCI_URLS[filename], target_path)
            found_path = target_path

        data_paths[filename] = found_path

    # Baca file CSV (delimiter titik koma ';')
    df_red = pd.read_csv(data_paths["winequality-red.csv"], sep=";")
    df_white = pd.read_csv(data_paths["winequality-white.csv"], sep=";")

    df_red.columns = [c.strip().strip('"') for c in df_red.columns]
    df_white.columns = [c.strip().strip('"') for c in df_white.columns]

    df_red["wine_type"] = 0   # 0 = Red Wine
    df_white["wine_type"] = 1 # 1 = White Wine

    df = pd.concat([df_red, df_white], ignore_index=True)

    # Validasi tipe data numerik
    for col in FEATURES:
        df[col] = pd.to_numeric(df[col], errors="raise")
    df["quality"] = pd.to_numeric(df["quality"], errors="raise").astype(int)
    df["wine_type"] = df["wine_type"].astype(int)

    # Target Engineering: Biner Kualitas Tinggi (1) vs Biasa (0)
    df["high_quality"] = (df["quality"] >= HIGH_QUALITY_THRESHOLD).astype(int)

    return df


# ==============================================================================
# 3. FUNGSI PELATIHAN & EVALUASI RANDOM FOREST
# ==============================================================================
def optimize_threshold_oof(estimator, X_train, y_train, seed=SEED):
    """
    Mencari ambang batas probabilitas optimal (antara 0.30 s/d 0.65)
    menggunakan Out-Of-Fold (OOF) 5-Fold Stratified Cross Validation pada DATA LATIHAN.
    Ini menjamin data test tidak tersentuh (Zero Data Leakage).
    """
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=seed)
    oof_proba = cross_val_predict(
        clone(estimator), X_train, y_train, cv=cv, method="predict_proba", n_jobs=-1
    )[:, 1]

    best_thresh, best_f1 = 0.50, -1.0
    for thresh in [round(0.30 + 0.01 * i, 2) for i in range(36)]:
        preds = (oof_proba >= thresh).astype(int)
        score = f1_score(y_train, preds, zero_division=0)
        # Tie-break: pilih yang terdekat dengan 0.50 jika skor sama
        if score > best_f1 + 1e-12 or (
            abs(score - best_f1) <= 1e-12 and abs(thresh - 0.5) < abs(best_thresh - 0.5)
        ):
            best_thresh, best_f1 = thresh, score

    return float(best_thresh), float(best_f1)


def train_and_evaluate_scope(scope_name: str, df_scope: pd.DataFrame):
    """
    Melatih 3 varian Random Forest pada satu scope (Combined / Red / White):
    M1: Baseline (200 Trees)
    M2: Cost-Sensitive (300 Trees, class_weight='balanced_subsample')
    M3: Threshold-Optimized (Menggunakan M2 dengan ambang probabilitas optimal)
    """
    print(f"\n=======================================================")
    print(f"[>] Memproses Scope: {scope_name.upper()} WINE (N = {len(df_scope):,})")
    print(f"=======================================================")

    X = df_scope[FEATURES]
    y = df_scope["high_quality"]

    # Stratified 80% Train / 20% Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=SEED, stratify=y
    )

    n_pos_train = int(y_train.sum())
    n_pos_test = int(y_test.sum())
    print(f"  * Data Latihan (80%): {len(X_train):,} baris ({n_pos_train} Premium = {n_pos_train/len(X_train)*100:.1f}%)")
    print(f"  * Data Uji (20%)    : {len(X_test):,} baris ({n_pos_test} Premium = {n_pos_test/len(X_test)*100:.1f}%)")

    # Inisialisasi Model
    m1_baseline = RandomForestClassifier(
        n_estimators=200, random_state=SEED, n_jobs=-1
    )
    m2_tuned = RandomForestClassifier(
        n_estimators=300,
        max_depth=16,
        min_samples_split=4,
        class_weight="balanced_subsample",  # Kunci penanganan data timpang tanpa SMOTE
        random_state=SEED,
        n_jobs=-1,
    )

    print("  * Melatih Model M1 (Baseline 200 Trees) & M2 (Cost-Sensitive 300 Trees)...")
    m1_baseline.fit(X_train, y_train)
    m2_tuned.fit(X_train, y_train)

    # Probabilitas prediksi pada holdout test set
    proba_m1 = m1_baseline.predict_proba(X_test)[:, 1]
    proba_m2 = m2_tuned.predict_proba(X_test)[:, 1]

    # Optimasi threshold M3 pada OOF training set
    opt_threshold, oof_f1 = optimize_threshold_oof(m2_tuned, X_train, y_train, seed=SEED)
    print(f"  * Optimalisasi OOF Threshold (M3): Cutoff terbaik = {opt_threshold:.2f} (OOF F1 = {oof_f1:.4f})")

    models_config = [
        ("M1_Baseline", 0.50, proba_m1),
        ("M2_CostSensitive", 0.50, proba_m2),
        ("M3_ThresholdOpt", opt_threshold, proba_m2),
    ]

    results = []
    roc_curves_dict = {}
    confusion_dict = {}

    for m_name, cut, proba in models_config:
        preds = (proba >= cut).astype(int)
        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds, zero_division=0)
        rec = recall_score(y_test, preds, zero_division=0)
        f1 = f1_score(y_test, preds, zero_division=0)
        f1_macro = f1_score(y_test, preds, average="macro", zero_division=0)
        auc = roc_auc_score(y_test, proba)

        cm = confusion_matrix(y_test, preds, labels=[0, 1])

        results.append({
            "scope": scope_name,
            "model": m_name,
            "threshold": cut,
            "accuracy": acc,
            "precision": prec,
            "recall": rec,
            "f1_score": f1,
            "f1_macro": f1_macro,
            "roc_auc": auc,
        })

        fpr, tpr, _ = roc_curve(y_test, proba)
        roc_curves_dict[m_name] = (fpr, tpr, auc)
        confusion_dict[m_name] = cm

        print(f"    [{m_name:18s}] Acc: {acc*100:5.2f}% | Prec: {prec*100:5.2f}% | Rec: {rec*100:5.2f}% | F1: {f1:.4f} | AUC: {auc:.4f}")

    # Feature Importance (Gini dari data latihan & Permutation dari data test)
    print("  * Menghitung Permutation Feature Importance (10 repetisi)...")
    perm = permutation_importance(
        m2_tuned, X_test, y_test, scoring="roc_auc", n_repeats=PERMUTATION_REPEATS, random_state=SEED, n_jobs=-1
    )

    feat_imp = pd.DataFrame({
        "scope": scope_name,
        "feature": FEATURES,
        "gini_importance": m2_tuned.feature_importances_,
        "perm_importance_mean": perm.importances_mean,
        "perm_importance_std": perm.importances_std,
    }).sort_values("gini_importance", ascending=False).reset_index(drop=True)

    feat_imp["rank"] = feat_imp.index + 1

    return {
        "metrics": results,
        "feature_importance": feat_imp,
        "roc_curves": roc_curves_dict,
        "confusion_matrices": confusion_dict,
        "y_test": y_test,
        "m2_proba": proba_m2,
    }


# ==============================================================================
# 4. VISUALISASI DASHBOARD 4-PANEL PUBLIKASI
# ==============================================================================
def plot_publication_dashboard(artifacts_all: dict, output_filepath: str = "wine_random_forest_dashboard.png"):
    """
    Membuat grafik komprehensif 4-panel:
    Panel A: Perbandingan Gini Feature Importance Lintas Scope
    Panel B: Kurva Multi-line ROC-AUC (Combined vs Red vs White)
    Panel C: Heatmap Confusion Matrix untuk Model Terbaik di Setiap Scope
    Panel D: Perbandingan Metrik Akurasi, F1, dan Presisi/Recall
    """
    print(f"\n[*] Menggambar Dashboard Visualisasi 4-Panel...")
    fig, axes = plt.subplots(2, 2, figsize=(18, 13), facecolor="white")
    plt.subplots_adjust(hspace=0.32, wspace=0.25)

    scopes = ["Combined", "Red", "White"]

    # --------------------------------------------------------------------------
    # PANEL A: Grouped Bar Chart Feature Importance
    # --------------------------------------------------------------------------
    ax_a = axes[0, 0]
    imp_frames = [artifacts_all[s]["feature_importance"][["feature", "gini_importance"]].assign(scope=s) for s in scopes]
    imp_df = pd.concat(imp_frames, ignore_index=True)
    pivot_imp = imp_df.pivot(index="feature", columns="scope", values="gini_importance")
    # Urutkan berdasarkan rata-rata importance
    order = pivot_imp.mean(axis=1).sort_values(ascending=False).index
    pivot_imp = pivot_imp.loc[order]

    y_pos = np.arange(len(pivot_imp))
    bar_height = 0.26

    for i, s in enumerate(scopes):
        ax_a.barh(
            y_pos + (i - 1) * bar_height,
            pivot_imp[s],
            height=bar_height,
            label=f"{s} Wine",
            color=SCOPE_COLORS[s],
            alpha=0.88,
        )

    ax_a.set_yticks(y_pos)
    ax_a.set_yticklabels([f.title() for f in pivot_imp.index], fontsize=10)
    ax_a.invert_yaxis()
    ax_a.set_xlabel("Gini Feature Importance", fontsize=11, fontweight="bold")
    ax_a.set_title("A. Peringkat Kepentingan Zat Kimia (Random Forest Gini)", fontsize=13, fontweight="bold", loc="left")
    ax_a.legend(frameon=True, facecolor="white", edgecolor="#cbd5e1", loc="lower right", fontsize=10)
    ax_a.grid(True, linestyle="--", alpha=0.3)
    ax_a.spines["top"].set_visible(False)
    ax_a.spines["right"].set_visible(False)

    # --------------------------------------------------------------------------
    # PANEL B: Multi-line ROC Curves (Cost-Sensitive Model M2)
    # --------------------------------------------------------------------------
    ax_b = axes[0, 1]
    for s in scopes:
        fpr, tpr, auc_score = artifacts_all[s]["roc_curves"]["M2_CostSensitive"]
        ax_b.plot(
            fpr, tpr,
            linewidth=2.5,
            color=SCOPE_COLORS[s],
            label=f"{s} Wine (AUC = {auc_score:.3f})"
        )

    ax_b.plot([0, 1], [0, 1], linestyle=":", color="#64748b", linewidth=1.5, label="Tebakan Acak (AUC = 0.500)")
    ax_b.set_xlim([-0.01, 1.0])
    ax_b.set_ylim([0.0, 1.02])
    ax_b.set_xlabel("False Positive Rate (1 - Specificity)", fontsize=11, fontweight="bold")
    ax_b.set_ylabel("True Positive Rate (Recall / Sensitivity)", fontsize=11, fontweight="bold")
    ax_b.set_title("B. Kurva ROC-AUC: Cost-Sensitive Random Forest (Holdout Test)", fontsize=13, fontweight="bold", loc="left")
    ax_b.legend(frameon=True, facecolor="white", edgecolor="#cbd5e1", loc="lower right", fontsize=10)
    ax_b.grid(True, linestyle="--", alpha=0.3)
    ax_b.spines["top"].set_visible(False)
    ax_b.spines["right"].set_visible(False)

    # --------------------------------------------------------------------------
    # PANEL C: 3 Mini Confusion Matrix Heatmaps (Side-by-Side)
    # --------------------------------------------------------------------------
    ax_c = axes[1, 0]
    ax_c.axis("off")
    ax_c.set_title("C. Matriks Kebingungan (Confusion Matrix) Model M2 pada Data Uji", fontsize=13, fontweight="bold", loc="left")

    # Buat 3 sub-axes di dalam area ax_c
    bbox = ax_c.get_position()
    sub_w = bbox.width / 3.3
    sub_h = bbox.height * 0.85

    for idx, s in enumerate(scopes):
        sub_x = bbox.x0 + idx * (sub_w * 1.15)
        sub_y = bbox.y0 + 0.02
        sub_ax = fig.add_axes([sub_x, sub_y, sub_w, sub_h])

        cm = artifacts_all[s]["confusion_matrices"]["M2_CostSensitive"]
        tn, fp, fn, tp = cm.ravel()

        sub_ax.imshow([[tn, fp], [fn, tp]], cmap="Purples" if s=="Combined" else "Reds" if s=="Red" else "YlOrBr", aspect="auto")

        # Label angka di dalam kotak
        sub_ax.text(0, 0, f"TN\n{tn:,}", ha="center", va="center", color="white" if tn > (tn+fp)*0.4 else "black", fontweight="bold", fontsize=10)
        sub_ax.text(1, 0, f"FP\n{fp:,}", ha="center", va="center", color="black", fontweight="bold", fontsize=10)
        sub_ax.text(0, 1, f"FN\n{fn:,}", ha="center", va="center", color="black", fontweight="bold", fontsize=10)
        sub_ax.text(1, 1, f"TP\n{tp:,}", ha="center", va="center", color="white" if tp > (fn+tp)*0.4 else "black", fontweight="bold", fontsize=10)

        sub_ax.set_xticks([0, 1])
        sub_ax.set_yticks([0, 1])
        sub_ax.set_xticklabels(["Pred 0", "Pred 1"], fontsize=9)
        sub_ax.set_yticklabels(["True 0", "True 1"], fontsize=9)
        sub_ax.set_title(f"{s} Wine\n(N={len(artifacts_all[s]['y_test'])})", fontsize=10, fontweight="bold", color=SCOPE_COLORS[s])

    # --------------------------------------------------------------------------
    # PANEL D: Perbandingan F1-Score & Akurasi Lintas Model
    # --------------------------------------------------------------------------
    ax_d = axes[1, 1]
    all_metrics_list = []
    for s in scopes:
        for m in artifacts_all[s]["metrics"]:
            all_metrics_list.append(m)
    all_metrics_df = pd.DataFrame(all_metrics_list)

    model_names = ["M1_Baseline", "M2_CostSensitive", "M3_ThresholdOpt"]
    x = np.arange(len(model_names))
    width = 0.25

    for i, s in enumerate(scopes):
        subset = all_metrics_df[all_metrics_df["scope"] == s]
        f1_vals = [subset[subset["model"] == m]["f1_score"].values[0] for m in model_names]
        bars = ax_d.bar(x + (i - 1) * width, f1_vals, width, label=f"{s} Wine", color=SCOPE_COLORS[s], alpha=0.9)

        # Label angka di atas bar
        for bar in bars:
            height = bar.get_height()
            ax_d.text(bar.get_x() + bar.get_width()/2., height + 0.015, f"{height:.2f}", ha="center", va="bottom", fontsize=8.5, rotation=0)

    ax_d.set_xticks(x)
    ax_d.set_xticklabels(["M1: Baseline\n(Cutoff 0.50)", "M2: Cost-Sensitive\n(Cutoff 0.50)", "M3: Threshold-Opt\n(OOF Tuned)"], fontsize=10)
    ax_d.set_ylabel("F1-Score (Minority Class)", fontsize=11, fontweight="bold")
    ax_d.set_ylim([0, 0.95])
    ax_d.set_title("D. Perbandingan F1-Score Minoritas (Precision-Recall Balance)", fontsize=13, fontweight="bold", loc="left")
    ax_d.legend(frameon=True, facecolor="white", edgecolor="#cbd5e1", loc="upper left", fontsize=10)
    ax_d.grid(True, linestyle="--", alpha=0.3)
    ax_d.spines["top"].set_visible(False)
    ax_d.spines["right"].set_visible(False)

    # Super Title
    fig.suptitle(
        "Evaluasi Algoritma Random Forest (Bagging) pada UCI Wine Quality Dataset\n"
        "Model Klasifikasi Biner Kualitas Wine (Quality >= 7)",
        fontsize=15, fontweight="bold", y=0.98
    )

    plt.savefig(output_filepath, dpi=300, bbox_inches="tight", facecolor="white")
    print(f"[+] Dashboard visualisasi berhasil disimpan di: {output_filepath}")

    # Tampilkan jika di Colab/Jupyter, jika terminal simpan dan tutup agar tidak memblokir
    try:
        if "ipykernel" in sys.modules or "google.colab" in sys.modules:
            plt.show()
        else:
            plt.close(fig)
    except Exception:
        plt.close(fig)


# ==============================================================================
# 5. MAIN EXECUTION PIPELINE
# ==============================================================================
def main():
    start_time = time.perf_counter()
    print("=" * 80)
    print("  PIPELINE MACHINE LEARNING: RANDOM FOREST (BAGGING ALGORITHM)")
    print("  DATASET: UCI WINE QUALITY (RED & WHITE WINE)")
    print("=" * 80)

    # 1. Muat Dataset
    df = load_dataset()
    print(f"\n[1] Dataset Berhasil Dimuat:")
    print(f"    * Total Baris (N) : {len(df):,}")
    print(f"    * Red Wine        : {len(df[df['wine_type'] == 0]):,} baris")
    print(f"    * White Wine      : {len(df[df['wine_type'] == 1]):,} baris")
    print(f"    * Nilai Kosong/NaN: {df.isna().sum().sum()}")
    print(f"    * Proporsi Premium: {df['high_quality'].sum():,} baris ({df['high_quality'].mean()*100:.2f}%)")

    # 2. Definisikan 3 Scope Populasi
    scopes = {
        "Combined": df.copy(),
        "Red": df[df["wine_type"] == 0].reset_index(drop=True),
        "White": df[df["wine_type"] == 1].reset_index(drop=True),
    }

    # 3. Latih & Evaluasi Random Forest pada Tiap Scope
    artifacts_all = {}
    all_metrics = []
    all_importance = []

    for scope_name, df_scope in scopes.items():
        art = train_and_evaluate_scope(scope_name, df_scope)
        artifacts_all[scope_name] = art
        all_metrics.extend(art["metrics"])
        all_importance.append(art["feature_importance"])

    # 4. Ringkasan Tabel Metrik
    df_metrics = pd.DataFrame(all_metrics)
    df_importance = pd.concat(all_importance, ignore_index=True)

    print("\n" + "=" * 80)
    print("  TABEL KOMPARASI PERFORMA RANDOM FOREST (HOLDOUT TEST SET 20%)")
    print("=" * 80)
    fmt_metrics = df_metrics.copy()
    fmt_metrics["accuracy"] = fmt_metrics["accuracy"].map(lambda x: f"{x*100:5.2f}%")
    fmt_metrics["precision"] = fmt_metrics["precision"].map(lambda x: f"{x*100:5.2f}%")
    fmt_metrics["recall"] = fmt_metrics["recall"].map(lambda x: f"{x*100:5.2f}%")
    fmt_metrics["f1_score"] = fmt_metrics["f1_score"].map(lambda x: f"{x:.4f}")
    fmt_metrics["f1_macro"] = fmt_metrics["f1_macro"].map(lambda x: f"{x:.4f}")
    fmt_metrics["roc_auc"] = fmt_metrics["roc_auc"].map(lambda x: f"{x:.4f}")
    print(fmt_metrics.to_string(index=False))

    # 5. Top 5 Fitur Kimia Paling Berpengaruh
    print("\n" + "=" * 80)
    print("  TOP 5 ZAT KIMIA PALING BERPENGARUH PER SCOPE (GINI IMPORTANCE)")
    print("=" * 80)
    for s in ["Combined", "Red", "White"]:
        top5 = df_importance[df_importance["scope"] == s].head(5)
        print(f"\n[>] Scope {s} Wine:")
        for _, r in top5.iterrows():
            print(f"   #{r['rank']} {r['feature']:22s} | Gini: {r['gini_importance']:.4f} | Permutation Drop: {r['perm_importance_mean']:.4f}")

    # 6. Simpan Hasil ke CSV
    df_metrics.to_csv("rf_model_comparison.csv", index=False)
    df_importance.to_csv("rf_feature_importance.csv", index=False)
    print(f"\n[+] Tabel metrik disimpan ke: rf_model_comparison.csv")
    print(f"[+] Tabel kepentingan fitur disimpan ke: rf_feature_importance.csv")

    # 7. Gambar & Simpan Visualisasi 4-Panel
    plot_publication_dashboard(artifacts_all, "wine_random_forest_dashboard.png")

    elapsed = time.perf_counter() - start_time
    print(f"\n[OK] Seluruh pipeline selesai dalam {elapsed:.1f} detik!")
    print("=" * 80)


if __name__ == "__main__":
    main()
