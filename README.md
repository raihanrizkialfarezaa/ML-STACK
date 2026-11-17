# Feature-Guided Hybrid Data Mining: Random Forest + Association Rules

Reproducible, publication-grade pipeline for the UCI Wine Quality dataset combining
**Random Forest (bagging, supervised)** with **association-rule mining (unsupervised,
FP-Growth/Apriori-style)**.

The two algorithms are connected instead of being run in isolation:

1. Random Forest predicts premium quality and ranks the chemical drivers.
2. The top-6 training-only drivers are discretized with group-wise tertiles.
3. FP-Growth mines `Quality=High` and `Quality=Low` rules on the training split.
4. Every rule is re-scored on the untouched test split.

## Dataset

- `datasets/winequality-red.csv` - 1,599 rows
- `datasets/winequality-white.csv` - 4,898 rows
- 11 physicochemical features, target `quality` in `[3, 9]`
- delimiter `;`, no missing values

## Setup (Windows PowerShell)

```powershell
cd "B:\app\ML 2023B\RANDOM FOREST"
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## Menjalankan Web Frontend (Next.js)

Aplikasi web modern interaktif berbasis **Next.js 16 + Tailwind CSS** telah tersedia di folder `web/`.
Web ini memisahkan kedua tugas secara bersih, dilengkapi penjelasan awam, rumus matematika interaktif (KaTeX), rincian kode, tabel filterable, dan **Live Wine Simulator**.

Untuk menjalankannya:
```powershell
cd "B:\app\ML 2023B\RANDOM FOREST"
.\run_web.bat
```
Atau secara manual:
```powershell
cd "B:\app\ML 2023B\RANDOM FOREST\web"
npm run dev
```
Buka browser di: **`http://localhost:3000`**

### Struktur Halaman Web:
1. **`/` (Overview Hybrid Framework):** Menjelaskan mengapa Random Forest & Association Rules digabung, perbandingan Supervised vs Unsupervised, arsitektur 4 fase, dan tombol unduh dashboard 300 DPI.
2. **`/random-forest` (Modul 1: Random Forest):** Penjelasan awam dewan 300 juri, rumus Bagging, Gini Impurity, Permutation Importance, F1, OOF Threshold Tuning, implementasi kode scikit-learn, kurva ROC SVG interaktif, Confusion Matrix 2x2, dan bar chart Feature Importance.
3. **`/association-rules` (Modul 2: Association Rules):** Penjelasan awam resep sommelier, bahaya Simpson's Paradox, rumus Support, Confidence, Lift, Leverage, Conviction, implementasi FP-Growth & Fallback pure-Python, batas numerik diskritisasi (binning viewer), Bubble Scatter Plot 2D, dan tabel eksplorer 54 aturan dengan filter & badge holdout pass.
4. **`/simulator` (Live Wine Lab & Rule Matcher):** Pengguna dapat memilih Red atau White Wine, menggeser 11 slider kimia, melihat status kategori tertile (Low/Med/High), dan secara real-time mencocokkan aturan asosiasi mana yang aktif beserta nilai Lift & Confidence serta rekomendasi enologis dari pembuat wine!
5. **`/dataset` (Dataset & Kimia Wine):** Kamus 11 zat fisikokimia dan pengaruh biologisnya pada lidah, statistik distribusi skor 3-9, serta audit transparansi 1.177 baris duplikat.

## Menjalankan Pipeline Python (CLI)

```powershell
.\.venv\Scripts\python.exe main.py
```

Optional flags:

```powershell
.\.venv\Scripts\python.exe main.py --miner fallback       # no mlxtend
.\.venv\Scripts\python.exe main.py --seed 42 --test-size 0.2
```

## Pipeline

### Phase 1 - Integration and targets

- Merge red/white with `wine_type` (`0` = red, `1` = white); `N = 6,497`.
- Binary target `high_quality = 1 if quality >= 7 else 0`.
- Three-tier target: `High >= 7`, `Med = 6`, `Low <= 5`.
- Three scopes: Combined, Red, White. Stratified 80/20 split, `random_state=42`.

### Phase 2 - Random Forest

- `M1_Baseline`: 200 trees.
- `M2_Tuned_CostSensitive`: 300 trees, `max_depth=16`, `min_samples_split=4`,
  `class_weight="balanced_subsample"`.
- `M3_ThresholdOptimized`: M2 probabilities with a threshold selected from
  `0.30` to `0.65` on 5-fold out-of-fold training F1 (test set never touches this step).
- Metrics: accuracy, precision, recall, F1, macro-F1, ROC-AUC.
- Both Gini and permutation importance (ROC-AUC drop, 10 repeats) are reported.
  **Top-6 selection uses training-only Gini importance**, so the rule holdout is clean.

### Phase 3 - Discretization and rules

- Each top-6 feature is cut into tertiles (`Low`, `Med`, `High`).
- In the Combined scope, cuts are fitted **within each wine type** with
  `pd.qcut`-based tertiles, so red/white chemical scale differences do not distort bins.
  Heavy-tie fallbacks prevent `qcut` failures.
- One-hot items use `feature=Bin`, e.g. `alcohol=High`, `Quality=High`.
- Rules: antecedents of 1-3 items; consequent exactly `Quality=High` or `Quality=Low`.
- Thresholds: High `support >= 0.025`, `confidence >= 0.50`, `lift >= 2.0`;
  Low `support >= 0.05`, `confidence >= 0.65`, `lift >= 1.75`.
- Metrics: support, confidence, lift, leverage, conviction, plus test-split versions.
- A pure-Python `itertools.combinations` fallback runs when `mlxtend` is absent.

### Phase 4 - Dashboard

`outputs/figures/wine_hybrid_dashboard.png`, 300 dpi, four panels:

- A: grouped Gini importance across scopes.
- B: ROC curves for Combined/Red/White.
- C: support vs confidence bubble chart, size/colour = lift.
- D: top-10 `Quality=High` rules by lift with confidence labels.

## Outputs

| File | Content |
|---|---|
| `outputs/figures/wine_hybrid_dashboard.png` | 4-panel publication dashboard |
| `outputs/tables/rf_model_comparison.csv` | 9 model/scope metric rows |
| `outputs/tables/top_wine_association_rules.csv` | top 10 rules per scope/consequent |
| `outputs/tables/association_rules_all_scopes.csv` | complete rule inventory |
| `outputs/tables/feature_importance.csv` | Gini + permutation importance, top-6 flag |
| `outputs/tables/binning_boundaries.csv` | numeric cut points and bin counts |
| `outputs/tables/target_distribution.csv` | class balance per scope |
| `outputs/tables/duplicate_summary.csv` | exact duplicate audit |
| `outputs/report.md` | full Markdown report with tables |
| `outputs/run_metadata.json` | versions, thresholds, runtime, seed |
| `outputs/pipeline.log` | execution log |

## Zero-leakage protocol

1. Split before fitting.
2. Threshold optimization uses OOF training predictions only.
3. Feature selection uses training Gini importance only.
4. Quantile boundaries are fitted on training rows only.
5. Rules are mined on training transactions and validated on test transactions.
6. No SMOTE; imbalance is handled inside the forest with balanced subsampling.

## Key results (seed 42, 80/20 holdout)

- Random Forest ROC-AUC: Combined **0.914** (baseline), Red **0.952**, White **0.928**.
- Best minority-class F1: Combined **0.689** (M2), Red **0.753** (M2), White **0.758** (M3).
- `alcohol` is the dominant Gini feature in all three scopes. Red wine adds
  `sulphates`; white wine adds `density`, `chlorides`, `residual sugar` and `pH`.
- 54 rules meet the configured thresholds; **41/54** also meet them on the holdout split.
- Red premium rules consistently combine **high alcohol, high sulphates, low volatile
  acidity and low density**. White premium rules favour **low chlorides, low density,
  high alcohol and higher pH**. These type-specific directions are more trustworthy
  than the pooled Combined rules.
- White wines yield the richest High-quality rule set (21 rules); combined-scope rules
  are retained for comparison but are confounded by wine type.

## Methodological notes

- **No SMOTE.** Synthetic minority examples can leak information if created before
  splitting and can distort probability calibration. Cost-sensitive learning is used
  instead, which is safer for a small, highly imbalanced dataset.
- **Group-wise binning.** Combined-scope rules are type-aware; `alcohol=High` means
  the top tertile within red or white wine, not a shared global cut.
- **Duplicates retained.** The Wine Quality data contains exact duplicate rows.
  They are reported in `duplicate_summary.csv` and retained because the task specifies
  the full 1,599 + 4,898 corpus. This modestly inflates apparent support.
- **Rules are associative, not causal.** Lift measures departure from independence
  in this observational sample. Production recommendations should be validated with
  controlled experiments.
- **Quality is an ordinal sensory score**, not a laboratory measurement. The binary
  `>= 7` cut follows the common premium-quality convention but is a modelling choice.

## References

- Cortez, P., Cerdeira, A., Almeida, F., Matos, T., & Reis, J. (2009).
  *Modeling wine preferences by data mining from physicochemical properties.*
  Decision Support Systems, 47(4), 547-553.
- UCI Machine Learning Repository: Wine Quality
  (<https://archive.ics.uci.edu/dataset/186/wine+quality>).

## Reproducibility

- Global seed `42`; every stochastic component receives it.
- Versions and runtime are written to `run_metadata.json`.
- No hard-coded absolute paths; the CLI accepts `--data-dir` and `--output-dir`.
