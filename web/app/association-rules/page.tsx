"use client";

import { useState } from "react";
import { wineData } from "@/lib/data";
import { FormulaCard } from "@/components/FormulaCard";
import { CodeBlock } from "@/components/CodeBlock";
import { RulesTable } from "@/components/RulesTable";
import { RulesScatterPlot } from "@/components/RulesScatterPlot";
import { BinningViewer } from "@/components/BinningViewer";
import {
  ScrollText,
  Brain,
  Code2,
  BarChart3,
  Sparkles,
  AlertTriangle,
  Layers,
} from "lucide-react";

export default function AssociationRulesPage() {
  const [activeTab, setActiveTab] = useState<"layman" | "math" | "code" | "data">("layman");

  const rules = wineData.association_rules_all_scopes;
  const holdoutPassed = rules.filter((r) => r.holdout_pass).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="border-b border-amber-950/40 pb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
              <ScrollText className="h-3.5 w-3.5 text-amber-400" />
              Tugas 2: Unsupervised Pattern Mining
            </span>
            <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
              FP-Growth &amp; Apriori Rules
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Association Rule Mining (Penambangan Aturan Asosiasi)
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
            Mengekstraksi aturan resep kimia yang jelas berupa hubungan implikasi <em>&quot;Jika (Antecedent), Maka (Consequent)&quot;</em> yang memisahkan wine berkualitas tinggi dari wine cacat.
          </p>

          {/* Quick Metrics */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-xs text-slate-400 font-medium">Total Aturan Valid</div>
              <div className="text-xl font-bold text-white font-mono mt-1">
                {rules.length} Rules
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Memenuhi Min Lift &amp; Conf</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-xs text-slate-400 font-medium">Lolos Holdout Test (20%)</div>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
                {holdoutPassed} / {rules.length} (75.9%)
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Terbukti di Data Baru</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-xs text-slate-400 font-medium">Puncak Lift (Red Wine)</div>
              <div className="text-xl font-bold text-rose-300 font-mono mt-1">4.39x</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Peluang Naik 439% Lebih Tinggi</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-xs text-slate-400 font-medium">Puncak Lift (White Wine)</div>
              <div className="text-xl font-bold text-amber-300 font-mono mt-1">2.69x</div>
              <div className="text-[10px] text-slate-500 mt-0.5">21 Aturan High Quality Mined</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {[
            { id: "layman", label: "Penjelasan Orang Awam", icon: Sparkles },
            { id: "math", label: "Teori & Rumus Matematika", icon: Brain },
            { id: "code", label: "Kode Python & FP-Growth", icon: Code2 },
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
                    ? "bg-amber-950 text-amber-200 border border-amber-800/80 shadow-md"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-amber-400" : "text-slate-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Layman */}
        {activeTab === "layman" && (
          <div className="mt-8 space-y-8 animate-fadeIn">
            {/* Analogi Keranjang Resep */}
            <div className="rounded-2xl border border-amber-950/60 bg-gradient-to-b from-amber-950/20 to-slate-950 p-6 sm:p-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-2">
                <Sparkles className="h-4 w-4" />
                <span>Analogi Kehidupan Sehari-hari</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-white mb-4">
                Analogi Resep Rahasia Master Sommelier
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Di supermarket, analisis asosiasi digunakan untuk menemukan pola: <em>&quot;Orang yang membeli Roti dan Mentega, biasanya juga membeli Selai&quot;</em>. Pada tugas Wine Quality ini, kita membalik pertanyaan tersebut untuk menemukan resep pembuatan wine:
              </p>
              <div className="my-4 rounded-xl bg-slate-900/80 border border-slate-800 p-4 font-mono text-xs text-amber-200 text-center">
                &quot;Jika [Kadar Alkohol TINGGI] &amp; [Kadar Asam Cuka RENDAH] &amp; [Kadar Sulfat TINGGI], maka <strong>Pasti Kualitas Wine TINGGI</strong>&quot;
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Keunggulan utama teknik ini dibanding Random Forest adalah <strong>transparansi penuh</strong>. Hasilnya bukan angka probabilitas abstrak (seperti 0.83), melainkan petunjuk langsung yang bisa dibaca dan dieksekusi oleh kepala produksi kilang anggur.
              </p>
            </div>

            {/* Mengapa Butuh Binning */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="h-5 w-5 text-amber-400" />
                <span>Mengapa Angka Kontinu Harus Diubah Menjadi Kategori (Diskritisasi)?</span>
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Association Rules diciptakan untuk data transaksional diskrit (seperti nama barang). Komputer tidak bisa mencari asosiasi dari angka desimal kontinu yang unik:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-4">
                  <div className="font-bold text-rose-300 mb-1">❌ Tanpa Diskritisasi (Gagal)</div>
                  <p className="text-slate-400">
                    Botol A punya alkohol <code>10.42%</code>, botol B punya <code>10.43%</code>. Komputer menganggap keduanya barang yang berbeda 100%! Frekuensi kemunculan aturan menjadi 0% dan tidak ada pola yang ditemukan.
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4">
                  <div className="font-bold text-emerald-300 mb-1">✅ Dengan Quantile Tertile (Berhasil)</div>
                  <p className="text-slate-400">
                    Kita membagi seluruh data menjadi 3 kelompok berukuran sama: sepertiga terendah disebut <strong>Low</strong>, sepertiga tengah disebut <strong>Med</strong>, dan sepertiga tertinggi disebut <strong>High</strong>. Sekarang jutaan kombinasi desimal terangkum rapi!
                  </p>
                </div>
              </div>
            </div>

            {/* Bahaya Simpson's Paradox */}
            <div className="rounded-2xl border border-rose-950/60 bg-gradient-to-b from-rose-950/20 to-slate-950 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm mb-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Peringatan Kritis: Bahaya Simpson&apos;s Paradox</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Mengapa Red Wine dan White Wine Tidak Boleh Dicampur Begitu Saja?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                <strong>Simpson&apos;s Paradox</strong> adalah fenomena statistik berbahaya di mana sebuah tren yang tampak jelas saat data digabungkan ternyata berbalik arah 180° saat data dipecah ke kelompok aslinya.
              </p>
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 text-xs text-slate-300 space-y-2">
                <p>
                  🍷 <strong>Contoh Kasus Riil pada Wine:</strong> White Wine secara alami membutuhkan <strong>Total Sulfur Dioksida jauh lebih tinggi (median ~134 mg/dm³)</strong> dibanding Red Wine (median ~38 mg/dm³) agar warnanya tidak menguning dan basi.
                </p>
                <p>
                  Jika kita menggabungkan keduanya dan membuat satu patokan <em>&quot;Sulfur Dioksida High&quot;</em> secara global, maka hampir seluruh botol White Wine akan terlabel <em>High</em>, sementara seluruh Red Wine terlabel <em>Low</em>. Akibatnya, aturan yang ditemukan bukan resep kualitas, melainkan cuma membedakan warna anggur!
                </p>
                <div className="mt-2 text-amber-300 font-semibold">
                  🛡️ Solusi Kita: Kami menerapkan <em>Group-wise Quantile Binning</em> dan memisahkan Scope Red Wine vs White Wine secara mandiri.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Math & Formulas */}
        {activeTab === "math" && (
          <div className="mt-8 space-y-6 animate-fadeIn">
            <FormulaCard
              category="Metrik Frekuensi"
              title="1. Support (Tingkat Kemunculan Relatif)"
              formula="\text{supp}(X \Rightarrow Y) = P(X \cap Y) = \frac{\sigma(X \cup Y)}{N}"
              laymanExplanation="Seberapa sering kombinasi bahan X dan hasil Y muncul bersamaan di seluruh gudang wine kita. Nilai Support 0.05 berarti 5% dari seluruh botol wine di dataset memiliki ciri tersebut."
              technicalDetails="Ambang batas minimal: min_support = 0.025 (2.5%) untuk Quality=High karena proporsi kelas premium hanya ~13%-21%. Untuk Quality=Low, min_support = 0.05 (5.0%)."
              components={[
                { symbol: "\\sigma(X \\cup Y)", name: "Frekuensi Transaksi", explanation: "Jumlah botol yang memenuhi kondisi X dan sekaligus memiliki hasil Y" },
                { symbol: "N", name: "Total Sampel Populasi", explanation: "Jumlah total baris dalam dataset training (N = 5.197 pada Combined)" },
                { symbol: "P(X \\cap Y)", name: "Probabilitas Gabungan", explanation: "Peluang acak sebotol wine memiliki kombinasi X dan kualitas Y" },
              ]}
            />

            <FormulaCard
              category="Metrik Kepastian"
              title="2. Confidence (Tingkat Akurasi Aturan Bersyarat)"
              formula="\text{conf}(X \Rightarrow Y) = P(Y \mid X) = \frac{\text{supp}(X \cup Y)}{\text{supp}(X)}"
              laymanExplanation="Jika sebotol wine sudah pasti memiliki zat X, berapa persen peluang wine tersebut benar-benar berkualitas Y? Nilai 0.60 berarti 60% dari botol yang memenuhi syarat X terbukti berkelas Y."
              technicalDetails="Confidence adalah estimasi probabilitas bersyarat P(Y|X). Ambang batas minimal yang kita tetapkan adalah min_confidence = 0.50 (50%) untuk Quality=High dan 0.65 (65%) untuk Quality=Low."
              components={[
                { symbol: "\\text{supp}(X \\cup Y)", name: "Support Gabungan", explanation: "Proporsi botol yang memiliki kondisi X dan hasil Y bersamaan" },
                { symbol: "\\text{supp}(X)", name: "Support Antecedent", explanation: "Proporsi botol yang memiliki kondisi X saja" },
              ]}
            />

            <FormulaCard
              category="Metrik Keunggulan (Paling Kritis)"
              title="3. Lift Ratio (Tingkat Pengganda Peluang di Atas Kebetulan Acak)"
              formula="\text{lift}(X \Rightarrow Y) = \frac{\text{conf}(X \Rightarrow Y)}{\text{supp}(Y)} = \frac{P(X \cap Y)}{P(X) \cdot P(Y)}"
              laymanExplanation="Berapa KALI LIPAT peluang kualitas tinggi meningkat jika kita menerapkan resep X dibanding menebak wine biasa secara acak? Lift = 1 berarti kombinasi itu cuma kebetulan. Lift > 2.0 berarti resep tersebut sangat ampuh dan valid!"
              technicalDetails="Lift mengukur keberangkatan dari independensi statistik. Jika Lift > 1, kemunculan X meningkatkan peluang Y secara positif. Aturan terbaik kita pada Red Wine mencapai Lift 4.39x (439% di atas peluang acak)."
              components={[
                { symbol: "\\text{conf}(X \\Rightarrow Y)", name: "Confidence Aturan", explanation: "Akurasi bersyarat saat resep X diterapkan" },
                { symbol: "\\text{supp}(Y)", name: "Support Baseline Consequent", explanation: "Peluang alami wine premium di alam (hanya 13.57% di Red Wine)" },
              ]}
            />

            <FormulaCard
              category="Metrik Korelasi Absolut"
              title="4. Leverage (Margin Keuntungan Probabilitas)"
              formula="\text{leverage}(X \Rightarrow Y) = P(X \cap Y) - P(X) \cdot P(Y)"
              laymanExplanation="Berapa proporsi botol tambahan yang berhasil dinaikkan kualitasnya oleh resep X di atas ekspektasi kebetulan acak. Nilai 0 berarti X dan Y independen sempurna."
              technicalDetails="Leverage selalu bernilai antara -0.25 hingga +0.25. Berbeda dari Lift yang bersifat rasio relatif, Leverage mengukur dampak volume absolut pada populasi."
              components={[
                { symbol: "P(X \\cap Y)", name: "Probabilitas Teramati", explanation: "Proporsi riil sampel yang memiliki X dan Y bersamaan" },
                { symbol: "P(X) \\cdot P(Y)", name: "Probabilitas Ekspektasi Bebas", explanation: "Proporsi teoretis jika X dan Y sama sekali tidak berhubungan" },
              ]}
            />

            <FormulaCard
              category="Metrik Arah Implikasi"
              title="5. Conviction (Ketahanan terhadap Kesalahan Prediksi)"
              formula="\text{conviction}(X \Rightarrow Y) = \frac{1 - \text{supp}(Y)}{1 - \text{conf}(X \Rightarrow Y)}"
              laymanExplanation="Mengukur seberapa sering resep X SALAH jika aturan ini hanya tebakan acak. Nilai infinity (inf) berarti aturan ini 100% sempurna tanpa pernah membuat kesalahan satupun."
              technicalDetails="Conviction tidak simetris (conv(X=>Y) ≠ conv(Y=>X)), sehingga mengukur arah kausalitas implikasi logis yang jauh lebih ketat dibanding Lift."
              components={[
                { symbol: "1 - \\text{supp}(Y)", name: "Proporsi Bukan Y", explanation: "Frekuensi wine yang BUKAN kualitas tinggi di dataset" },
                { symbol: "1 - \\text{conf}", name: "Tingkat Kesalahan Aturan", explanation: "Frekuensi di mana kondisi X terpenuhi tetapi wine GAGAL menjadi kualitas Y" },
              ]}
            />
          </div>
        )}

        {/* Tab 3: Code Implementation */}
        {activeTab === "code" && (
          <div className="mt-8 space-y-6 animate-fadeIn">
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 text-xs text-slate-300 leading-relaxed">
              Berikut adalah potongan kode implementasi modul Association Rules yang dibangun di <code>wine_hybrid/associations.py</code>. Mendukung <strong>FP-Growth</strong> berkecepatan tinggi via <code>mlxtend</code> dan memiliki mesin <strong>Pure Python Fallback</strong> otomatis yang bekerja tanpa external library!
            </div>

            <CodeBlock
              title="wine_hybrid/associations.py — Eksekusi FP-Growth & Filter Target Kualitas"
              language="python"
              highlights={[8, 9, 13, 14, 15, 16, 21]}
              note="num_itemsets=len(frequent) wajib disertakan pada versi mlxtend terbaru untuk menghitung Support dan Conviction secara presisi."
              code={`from mlxtend.frequent_patterns import fpgrowth, association_rules

# 1. Menambang Frequent Itemsets berukuran 1 s/d 4 item
frequent = fpgrowth(
    onehot_train_df,
    min_support=0.025,  # 2.5% support minimum
    use_colnames=True,
    max_len=4
)

# 2. Menghasilkan seluruh aturan asosiasi dengan metrik Confidence
rules = association_rules(
    frequent,
    metric="confidence",
    min_threshold=0.50, # 50% confidence minimum
    num_itemsets=len(frequent)
)

# 3. Filter ketat: Consequent HANYA boleh {'Quality=High'} atau {'Quality=Low'}
target_high = frozenset({'Quality=High'})
mask_high = (
    (rules['consequents'] == target_high) &
    (rules['antecedents'].apply(lambda a: 1 <= len(a) <= 3)) & # Panjang 1-3 zat
    (rules['lift'] >= 2.00) # Wajib Lift >= 2.0x
)
high_quality_rules = rules[mask_high].sort_values('lift', ascending=False)`}
            />

            <CodeBlock
              title="wine_hybrid/associations.py — Protokol Validasi Holdout Bebas Overfitting"
              language="python"
              highlights={[5, 6, 12, 13, 14, 15]}
              note="Setiap aturan yang ditemukan di data latihan diuji ulang pada 20% data test yang belum pernah dilihat sama sekali."
              code={`def add_holdout_metrics(rules_df, onehot_test_df, cfg):
    # Menguji konsistensi aturan pada data test murni
    test_target = onehot_test_df[f"Quality={cfg.tier}"].to_numpy(dtype=bool)
    target_support_test = float(test_target.mean())

    supports, confidences, lifts, passes = [], [], [], []
    for antecedent in rules_df["antecedents"]:
        # Mask boolean kondisi antecedent pada data test
        mask = np.ones(len(onehot_test_df), dtype=bool)
        for item in antecedent:
            mask &= onehot_test_df[item].to_numpy(dtype=bool)

        union = mask & test_target
        sup_test = float(union.mean())
        ant_sup_test = float(mask.mean())

        conf_test = sup_test / ant_sup_test if ant_sup_test > 0 else 0
        lift_test = conf_test / target_support_test if target_support_test > 0 else 0

        # Aturan dianggap lolos holdout jika tetap melampaui threshold di data test
        is_pass = (
            sup_test >= cfg.min_support and
            conf_test >= cfg.min_confidence and
            lift_test >= cfg.min_lift
        )
        passes.append(is_pass)

    rules_df["holdout_pass"] = passes
    return rules_df`}
            />

            <CodeBlock
              title="wine_hybrid/associations.py — Mesin Fallback Pure-Python (Zero Dependency)"
              language="python"
              highlights={[5, 6, 7, 8]}
              note="Menghasilkan aturan 100% identik dengan selisih metrik Lift di bawah 3.1e-15 saat dijalankan tanpa mlxtend."
              code={`import itertools

def mine_fallback(onehot_df, cfg):
    # Pencarian kombinasi k-itemset menggunakan itertools murni
    items = [c for c in onehot_df.columns if not c.startswith("Quality=")]
    target = onehot_df[f"Quality={cfg.tier}"].to_numpy(dtype=bool)
    n_rows = len(onehot_df)

    valid_rules = []
    for k in range(1, 4):  # 1 s/d 3 item antecedents
        for combo in itertools.combinations(items, k):
            antecedent_mask = np.ones(n_rows, dtype=bool)
            for item in combo:
                antecedent_mask &= onehot_df[item].to_numpy(dtype=bool)

            ant_sup = float(antecedent_mask.mean())
            if ant_sup < cfg.min_support: continue

            union = antecedent_mask & target
            sup = float(union.mean())
            if sup < cfg.min_support: continue

            conf = sup / ant_sup
            if conf < cfg.min_confidence: continue

            lift = conf / float(target.mean())
            if lift >= cfg.min_lift:
                valid_rules.append({"antecedents": combo, "lift": lift, ...})`}
            />
          </div>
        )}

        {/* Tab 4: Data & Visualizations */}
        {activeTab === "data" && (
          <div className="mt-8 space-y-8 animate-fadeIn">
            {/* Binning Viewer */}
            <BinningViewer boundaries={wineData.binning_boundaries} />

            {/* Bubble Scatter Plot */}
            <RulesScatterPlot rules={wineData.association_rules_all_scopes} />

            {/* Rules Explorer Table */}
            <RulesTable rules={wineData.association_rules_all_scopes} />
          </div>
        )}
      </div>
    </div>
  );
}
