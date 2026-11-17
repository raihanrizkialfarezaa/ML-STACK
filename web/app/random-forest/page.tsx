"use client";

import { useState } from "react";
import { wineData } from "@/lib/data";
import { FormulaCard } from "@/components/FormulaCard";
import { CodeBlock } from "@/components/CodeBlock";
import { RocChart } from "@/components/RocChart";
import { ConfusionMatrixView } from "@/components/ConfusionMatrixView";
import { FeatureImportanceBar } from "@/components/FeatureImportanceBar";
import {
  Trees,
  Brain,
  Code2,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Award,
} from "lucide-react";

export default function RandomForestPage() {
  const [activeTab, setActiveTab] = useState<"layman" | "math" | "code" | "data">("layman");

  const rfMetrics = wineData.rf_model_comparison;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="border-b border-rose-950/40 pb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-300 border border-rose-500/30">
              <Trees className="h-3.5 w-3.5 text-rose-400" />
              Tugas 1: Supervised Learning
            </span>
            <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
              Bagging Ensemble Algorithm
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Algoritma Random Forest (Bagging)
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
            Membangun hutan 300 pohon keputusan acak untuk memprediksi apakah sebotol wine termasuk kategori premium (skor kualitas ≥ 7). Model ini menangani ketidakseimbangan kelas ekstrem dan mengekstrak zat kimia paling penting.
          </p>

          {/* Quick Metrics */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-xs text-slate-400 font-medium">Puncak ROC-AUC (Red)</div>
              <div className="text-xl font-bold text-white font-mono mt-1">0.9519</div>
              <div className="text-[10px] text-slate-500 mt-0.5">M1 Baseline (200 Trees)</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-xs text-slate-400 font-medium">F1 Tertinggi (White)</div>
              <div className="text-xl font-bold text-amber-300 font-mono mt-1">0.7580</div>
              <div className="text-[10px] text-slate-500 mt-0.5">M3 Threshold Cutoff 0.43</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-xs text-slate-400 font-medium">F1 Tertinggi (Red)</div>
              <div className="text-xl font-bold text-rose-300 font-mono mt-1">0.7532</div>
              <div className="text-[10px] text-slate-500 mt-0.5">M2 Cost-Sensitive (300 Trees)</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-xs text-slate-400 font-medium">Fitur Terpenting #1</div>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-1">Alcohol</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Gini: 20.8% (Comb) / 25.0% (Red)</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {[
            { id: "layman", label: "Penjelasan Orang Awam", icon: Sparkles },
            { id: "math", label: "Teori & Rumus Matematika", icon: Brain },
            { id: "code", label: "Kode Python & Pipeline", icon: Code2 },
            { id: "data", label: "Data & Visualisasi Interaktif", icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                  active
                    ? "bg-rose-950 text-rose-200 border border-rose-800/80 shadow-md"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-rose-400" : "text-slate-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Layman's Explanation */}
        {activeTab === "layman" && (
          <div className="mt-8 space-y-8 animate-fadeIn">
            {/* Analogi Juri */}
            <div className="rounded-2xl border border-rose-950/60 bg-gradient-to-b from-rose-950/20 to-slate-950 p-6 sm:p-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-2">
                <Sparkles className="h-4 w-4" />
                <span>Analogi Kehidupan Sehari-hari</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-white mb-4">
                Analogi Dewan 300 Juri Pencicip Wine
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Bayangkan Anda menyewa <strong>satu orang juri ahli wine</strong>. Dia mungkin sangat cerdas, tetapi dia manusia biasa: dia punya bias pribadi, mungkin dia terlalu suka wine manis, atau dia sedang lelah hari itu. Di machine learning, satu juri ini disebut <strong>Decision Tree (Pohon Keputusan Tunggal)</strong>. Kelemahannya adalah <em>overfitting</em> — dia menghafal detail botol tertentu tetapi sering salah saat mencicipi botol baru.
              </p>

              <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-1">
                    1. Pengambilan Sampel Acak (Bootstrap)
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Alih-alih 1 juri, kita undang <strong>300 juri berbeda</strong>. Tiap juri diberikan nampan sampel wine yang dipilih secara acak (dengan pengembalian). Tidak ada dua juri yang mencicipi kombinasi botol yang 100% sama persis.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                    2. Variasi Pertanyaan (Feature Bagging)
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Setiap juri hanya boleh memeriksa beberapa zat acak di tiap langkah: juri A memeriksa alkohol dan asam cuka; juri B memeriksa sulfat dan gula. Ini mencegah satu zat mendominasi pemikiran seluruh juri.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                    3. Pemungutan Suara Terbanyak (Voting)
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Saat botol wine baru masuk, seluruh 300 juri mencicipi dan memberikan suaranya: <em>&quot;Apakah ini wine kualitas tinggi?&quot;</em> Keputusan akhir diambil dari suara mayoritas. Kesalahan individu juri saling meniadakan, menghasilkan prediksi yang stabil dan super akurat!
                  </p>
                </div>
              </div>
            </div>

            {/* Masalah Class Imbalance */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-3">
                Tantangan Utama: Kelas yang Tidak Seimbang (Class Imbalance)
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Dari 1.599 sampel Red Wine, hanya ada <strong>217 botol (13.57%)</strong> yang tergolong berkualitas tinggi (skor 7 atau 8). Sisanya 86.43% adalah wine biasa (skor 5 dan 6).
              </p>

              <div className="rounded-xl bg-amber-950/30 border border-amber-900/50 p-4 text-xs text-amber-200 leading-relaxed">
                ⚠️ <strong>Jebakan Metrik Akurasi:</strong> Jika sebuah model &quot;pemalas&quot; selalu menebak <em>&quot;Semua wine adalah wine biasa!&quot;</em>, model tersebut sudah mendapatkan <strong>Akurasi 86.4%</strong> tanpa belajar apa-apa! Namun model tersebut gagal menangkap satupun botol premium. Itulah sebabnya kita <strong>WAJIB menggunakan F1-Score dan ROC-AUC</strong>, bukan sekadar Akurasi.
              </div>
            </div>

            {/* Mengapa Tanpa SMOTE */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span>Pilihan Enjiniring: Mengapa Menggunakan Balanced Subsampling, Bukan SMOTE?</span>
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Banyak orang awam mengira SMOTE (membuat data buatan) adalah solusi wajib. Namun di dunia riset profesional pada dataset fisikokimia:
              </p>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                <li>
                  <strong>SMOTE berisiko menciptakan titik kimia palsu:</strong> Interpolasi linier antar molekul kimia dapat menciptakan kombinasi asam, sulfur, dan alkohol yang secara biokimia mustahil terjadi di alam nyata.
                </li>
                <li>
                  <strong>Solusi Lebih Elegan: `class_weight=&apos;balanced_subsample&apos;`:</strong> Setiap kali sebuah pohon keputusan mengambil sampel bootstrap, Random Forest secara otomatis menimbang botol premium lebih berat. Model otomatis memberikan perhatian ekstra pada botol langka tanpa membuat data fiktif!
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Math & Formulas */}
        {activeTab === "math" && (
          <div className="mt-8 space-y-6 animate-fadeIn">
            <FormulaCard
              category="Ensemble Learning"
              title="1. Bootstrap Aggregating (Bagging)"
              formula="f(x) = \frac{1}{B} \sum_{b=1}^{B} f_b(x)"
              laymanExplanation="Prediksi akhir f(x) adalah rata-rata suara dari 300 pohon keputusan acak (B = 300). Pada klasifikasi, jika rata-rata probabilitas > batas ambang, wine dinyatakan Premium."
              technicalDetails="Setiap pohon f_b dilatih pada sampel bootstrap berukuran N yang ditarik dengan pengembalian (sampling with replacement) dari data training. Proses ini mengurangi variansi model (Var) secara drastis sebesar 1/B tanpa menaikkan bias."
              components={[
                { symbol: "B", name: "Jumlah Pohon (Trees)", explanation: "B = 300 pohon keputusan yang dilatih independen" },
                { symbol: "f_b(x)", name: "Prediksi Pohon ke-b", explanation: "Probabilitas kualitas tinggi yang dikeluarkan oleh pohon tunggal ke-b" },
                { symbol: "f(x)", name: "Prediksi Agregat Hutan", explanation: "Nilai probabilitas ensemble akhir dari Random Forest" },
              ]}
            />

            <FormulaCard
              category="Pemisahan Node (Splitting)"
              title="2. Gini Impurity (Tingkat Ketidakmurnian Node)"
              formula="I_G(t) = 1 - \sum_{i=1}^{C} p_i^2"
              laymanExplanation="Mengukur seberapa campur aduk isi sebuah keranjang sampel. Nilai 0 berarti keranjang 100% murni (semuanya wine premium atau semuanya wine biasa). Nilai mendekati 0.5 berarti campur aduk 50-50."
              technicalDetails="Pohon keputusan mencari fitur kimia j dan nilai cutoff s yang memaksimalkan penurunan Gini Impurity: ΔI_G = I_G(t) - (N_L/N) I_G(t_L) - (N_R/N) I_G(t_R). Total penurunan Gini sepanjang 300 pohon menjadi metrik Gini Feature Importance."
              components={[
                { symbol: "I_G(t)", name: "Gini Impurity pada Node t", explanation: "Ketidakmurnian distribusi kelas di cabang pohon t" },
                { symbol: "p_i", name: "Proporsi Kelas i", explanation: "Persentase sampel kelas i (0 atau 1) yang berada di node t" },
                { symbol: "C", name: "Jumlah Kelas", explanation: "C = 2 (Biner: Premium vs Reguler)" },
              ]}
            />

            <FormulaCard
              category="Validasi Seleksi Fitur"
              title="3. Permutation Feature Importance"
              formula="\text{Importance}(X_j) = \text{Score}(X, y) - \text{Score}(X^{\text{perm}_j}, y)"
              laymanExplanation="Cara menguji seberapa penting suatu zat (misal alkohol): kita acak nilai alkohol antar botol wine seperti mengocok kartu remi. Jika akurasi model langsung anjlok drastis setelah diacak, berarti zat tersebut sangat krusial!"
              technicalDetails="Dievaluasi pada data test yang belum pernah dilihat model dengan scoring ROC-AUC dan 10 kali pengacakan acak (n_repeats=10). Mengukur seberapa bergantung model pada korelasi antar fitur yang sebenarnya."
              components={[
                { symbol: "Score(X, y)", name: "Skor Asli", explanation: "ROC-AUC model pada data test murni yang teratur" },
                { symbol: "X^{\\text{perm}_j}", name: "Matriks Fitur Diacak", explanation: "Tabel data di mana kolom kimia ke-j nilainya diacak secara acak" },
                { symbol: "Importance", name: "Penurunan Skor", explanation: "Besarnya penurunan ROC-AUC; semakin besar penurunannya, semakin penting fiturnya" },
              ]}
            />

            <FormulaCard
              category="Evaluasi Ketidakseimbangan Kelas"
              title="4. F1-Score (Harmonic Mean Precision & Recall)"
              formula="F_1 = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}} = \frac{2 \cdot TP}{2 \cdot TP + FP + FN}"
              laymanExplanation="Rata-rata harmonik antara ketepatan tebakan (Presisi) dan kelengkapan penangkapan botol premium (Recall). F1 hanya akan tinggi jika model bagus di kedua aspek sekaligus."
              technicalDetails="Presisi = TP / (TP + FP); Recall = TP / (TP + FN). Karena kelas premium adalah minoritas, F1-Score kelas 1 adalah metrik utama yang dioptimalkan saat mencari ambang batas probabilitas (M3)."
              components={[
                { symbol: "TP", name: "True Positive", explanation: "Wine premium yang berhasil ditebak dengan benar sebagai premium" },
                { symbol: "FP", name: "False Positive", explanation: "Wine biasa yang salah ditebak sebagai premium (alarm palsu)" },
                { symbol: "FN", name: "False Negative", explanation: "Wine premium yang terlewat (salah ditebak biasa)" },
              ]}
            />

            <FormulaCard
              category="Optimasi Ambang Batas"
              title="5. Out-of-Fold (OOF) Probability Threshold Optimization"
              formula="\theta^* = \arg\max_{\theta \in [0.30, 0.65]} F_1\left(y_{\text{train}}, \mathbb{I}(\hat{p}_{\text{OOF}} \ge \theta)\right)"
              laymanExplanation="Secara default, komputer menebak premium jika probabilitasnya ≥ 50% (0.50). Namun pada barang langka, batas 0.50 sering terlalu ketat. Kita menguji ambang antara 0.30 hingga 0.65 pada data latihan menggunakan 5-Fold Cross Validation untuk mencari ambang paling optimal."
              technicalDetails="Penentuan threshold θ* HANYA menggunakan prediksi out-of-fold dari 5-Fold Stratified K-Fold pada data latihan (5.197 baris). Data test (1.300 baris) tidak pernah disentuh saat mencari threshold, mencegah bocornya data ke proses tuning."
              components={[
                { symbol: "\\theta^*", name: "Threshold Optimal", explanation: "Ambang probabilitas terbaik (0.32 untuk Red, 0.43 untuk White)" },
                { symbol: "\\hat{p}_{\\text{OOF}}", name: "Probabilitas Out-of-Fold", explanation: "Prediksi probabilitas dari model yang dilatih pada 4 lipatan dan diuji pada lipatan ke-5" },
              ]}
            />
          </div>
        )}

        {/* Tab 3: Python Code Implementation */}
        {activeTab === "code" && (
          <div className="mt-8 space-y-6 animate-fadeIn">
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 text-xs text-slate-300 leading-relaxed">
              Berikut adalah potongan kode implementasi modul Random Forest yang dibangun di <code>wine_hybrid/modeling.py</code>. Menggunakan <code>scikit-learn</code> dengan arsitektur modular, penanganan ketidakseimbangan kelas, dan seleksi fitur bebas kebocoran.
            </div>

            <CodeBlock
              title="wine_hybrid/modeling.py — Pembuatan & Pelatihan 3 Varian Model"
              language="python"
              highlights={[11, 12, 13, 14, 15, 27, 28, 29]}
              note="class_weight='balanced_subsample' secara otomatis menghitung frekuensi kelas pada setiap sampel bootstrap secara dinamis."
              code={`from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.model_selection import StratifiedKFold, cross_val_predict
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score

# 1. Model Baseline (M1)
baseline = RandomForestClassifier(
    n_estimators=200, random_state=42, n_jobs=-1
)

# 2. Model Cost-Sensitive Tuned (M2)
tuned = RandomForestClassifier(
    n_estimators=300,
    max_depth=16,
    min_samples_split=4,
    class_weight="balanced_subsample",  # Kunci penanganan imbalance tanpa SMOTE!
    random_state=42,
    n_jobs=-1
)

# Latih kedua model pada 80% data training
baseline.fit(X_train, y_train)
tuned.fit(X_train, y_train)

# Dapatkan estimasi probabilitas pada 20% data holdout test
proba_baseline = baseline.predict_proba(X_test)[:, 1]
proba_tuned = tuned.predict_proba(X_test)[:, 1]`}
            />

            <CodeBlock
              title="wine_hybrid/modeling.py — Optimasi Threshold Out-of-Fold Bebas Leakage"
              language="python"
              highlights={[3, 4, 8, 9, 10, 11]}
              note="Threshold hanya dicari dari prediksi cross-validation data latihan, lalu diuji sekali pada data test murni."
              code={`def optimize_threshold_oof(estimator, X_train, y_train, seed=42):
    # 5-Fold Stratified Cross Validation pada data training
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=seed)
    oof_proba = cross_val_predict(
        estimator, X_train, y_train, cv=cv, method="predict_proba"
    )[:, 1]

    best_threshold, best_f1 = 0.50, -1.0
    for threshold in [round(0.30 + 0.01 * i, 2) for i in range(36)]:  # 0.30 s/d 0.65
        preds = (oof_proba >= threshold).astype(int)
        score = f1_score(y_train, preds, zero_division=0)
        if score > best_f1:
            best_threshold, best_f1 = threshold, score

    return best_threshold, oof_proba, best_f1

# Hasil threshold optimal yang ditemukan:
# Red Wine: 0.32 | White Wine: 0.43 | Combined Wine: 0.41`}
            />

            <CodeBlock
              title="wine_hybrid/modeling.py — Ekstraksi Dual Feature Importance"
              language="python"
              highlights={[3, 4, 5, 6, 7]}
              note="Hanya Gini importance dari data training yang dipakai memilih Top 6 untuk Association Rules, agar data test tetap murni untuk validasi holdout."
              code={`# 1. Gini Importance (langsung dari pohon data latihan)
gini_importance = tuned.feature_importances_

# 2. Permutation Importance (uji ketahanan pada data test)
perm = permutation_importance(
    tuned, X_test, y_test,
    scoring="roc_auc",
    n_repeats=10,
    random_state=42,
    n_jobs=-1
)

# Pemilihan Top 6 fitur paling berpengaruh per scope
top6_features = importance_table.sort_values("gini", ascending=False).head(6)["feature"].tolist()`}
            />
          </div>
        )}

        {/* Tab 4: Data & Visualizations */}
        {activeTab === "data" && (
          <div className="mt-8 space-y-8 animate-fadeIn">
            {/* Model Comparison Table */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                <span>Tabel Evaluasi Komparasi Model (9 Skenario Eksperimen)</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Membandingkan 3 model (M1 Baseline, M2 Cost-Sensitive, M3 Threshold-Optimized) pada 3 scope populasi yang berbeda.
              </p>

              <div className="overflow-x-auto rounded-xl border border-slate-800/80">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400">
                    <tr>
                      <th className="py-2.5 px-3 font-medium">Scope</th>
                      <th className="py-2.5 px-3 font-medium">Model</th>
                      <th className="py-2.5 px-3 font-medium">Cutoff</th>
                      <th className="py-2.5 px-3 font-medium">Akurasi</th>
                      <th className="py-2.5 px-3 font-medium">Presisi</th>
                      <th className="py-2.5 px-3 font-medium">Recall</th>
                      <th className="py-2.5 px-3 font-medium">F1-Score</th>
                      <th className="py-2.5 px-3 font-medium">ROC-AUC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                    {rfMetrics.map((row, idx) => {
                      const isBestF1 =
                        (row.scope === "Red" && row.model === "M2_Tuned_CostSensitive") ||
                        (row.scope === "White" && row.model === "M3_ThresholdOptimized") ||
                        (row.scope === "Combined" && row.model === "M2_Tuned_CostSensitive");

                      return (
                        <tr
                          key={idx}
                          className={`hover:bg-slate-900/50 ${
                            isBestF1 ? "bg-rose-950/20 font-semibold" : ""
                          }`}
                        >
                          <td className="py-2 px-3 font-sans font-bold text-slate-200">
                            {row.scope}
                          </td>
                          <td className="py-2 px-3 font-sans text-slate-300">
                            {row.model}
                          </td>
                          <td className="py-2 px-3 text-slate-400">
                            {row.threshold.toFixed(2)}
                          </td>
                          <td className="py-2 px-3">
                            {(row.accuracy * 100).toFixed(2)}%
                          </td>
                          <td className="py-2 px-3 text-amber-300">
                            {(row.precision * 100).toFixed(2)}%
                          </td>
                          <td className="py-2 px-3 text-rose-300">
                            {(row.recall * 100).toFixed(2)}%
                          </td>
                          <td className="py-2 px-3 text-white font-bold">
                            {row.f1.toFixed(4)}
                          </td>
                          <td className="py-2 px-3 text-emerald-400 font-bold">
                            {row.roc_auc.toFixed(4)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interactive ROC Curve */}
            <RocChart
              points={wineData.roc_curves}
              metrics={wineData.rf_model_comparison}
            />

            {/* Interactive Confusion Matrix */}
            <ConfusionMatrixView matrices={wineData.confusion_matrices} />

            {/* Feature Importance Bar */}
            <FeatureImportanceBar importance={wineData.feature_importance} />
          </div>
        )}
      </div>
    </div>
  );
}
