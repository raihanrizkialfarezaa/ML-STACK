import Link from "next/link";
import { wineData } from "@/lib/data";
import {
  Trees,
  ScrollText,
  FlaskConical,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  HelpCircle,
  Download,
  Database,
} from "lucide-react";

export default function HomePage() {
  const redMetrics = wineData.rf_model_comparison.find(
    (m) => m.scope === "Red" && m.model === "M1_Baseline"
  );
  const whiteF1 = wineData.rf_model_comparison.find(
    (m) => m.scope === "White" && m.model === "M3_ThresholdOptimized"
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-rose-950/40 bg-gradient-to-b from-slate-950 via-rose-950/20 to-slate-950 py-16 sm:py-24">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-semibold text-rose-300 mb-6 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Feature-Guided Hybrid Data Mining Framework</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Sinergi Cerdas{" "}
            <span className="bg-gradient-to-r from-rose-400 via-rose-200 to-amber-300 bg-clip-text text-transparent">
              Random Forest
            </span>{" "}
            &amp;{" "}
            <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-rose-400 bg-clip-text text-transparent">
              Association Rules
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed">
            Menembus batas keterbatasan masing-masing algoritma pada dataset <strong>UCI Wine Quality</strong> (6.497 sampel).
            Random Forest memberikan <strong>akurasi prediksi tinggi dan seleksi fitur kunci</strong>, sementara Association Rules menerjemahkan pola tersebut menjadi <strong>aturan aksi produksi (if-then) yang transparan</strong> bagi para pembuat wine.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-white font-mono">
                {redMetrics?.roc_auc.toFixed(3) || "0.952"}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Puncak ROC-AUC (Red Wine)
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-amber-300 font-mono">
                {whiteF1?.f1.toFixed(3) || "0.758"}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                F1-Score Minoritas (White)
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                54 Rules
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                41 Lolos Validasi Holdout
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-rose-300 font-mono">
                6.497
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Total Sampel Wine (0 Missing)
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/random-forest"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-700 to-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-950/50 hover:brightness-110 transition-all"
            >
              <Trees className="h-4 w-4" />
              <span>Modul 1: Random Forest</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/association-rules"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-950/50 hover:brightness-110 transition-all"
            >
              <ScrollText className="h-4 w-4" />
              <span>Modul 2: Association Rules</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/simulator"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-all"
            >
              <FlaskConical className="h-4 w-4 text-rose-400" />
              <span>Buka Simulator Live</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Bagian Masalah & Solusi (Untuk Orang Awam) */}
      <section className="py-16 border-b border-slate-900 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Mengapa Menggabungkan Kedua Algoritma Ini?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-400">
              Analogi sederhana mengapa satu algoritma saja tidak cukup untuk memecahkan masalah industri wine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Box 1: Random Forest */}
            <div className="rounded-2xl border border-rose-950/60 bg-gradient-to-b from-rose-950/20 to-slate-950 p-6 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center gap-2.5 text-rose-400 font-semibold text-sm mb-3">
                  <Trees className="h-5 w-5" />
                  <span>Modul 1: Random Forest (Supervised Learning)</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Si Mesin Prediksi Super Pintar yang &quot;Kotak Hitam&quot;
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Random Forest bekerja seperti <strong>dewan 300 juri ahli</strong> yang masing-masing menganalisis botol wine dari sudut pandang acak. Hasilnya sangat akurat (ROC-AUC &gt; 0.94), tetapi sulit menjelaskan ke petani: <em>&quot;Resep kimia persis apa yang harus saya campur agar panen tahun depan berkualitas tinggi?&quot;</em>
                </p>
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span><strong>Keunggulan:</strong> Sangat akurat, tahan overfitting, mampu menangani korelasi kompleks.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span><strong>Kelemahan:</strong> Model &quot;Black Box&quot; — tidak menghasilkan aturan resep tertulis yang mudah dibaca.</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-rose-950/60 flex justify-between items-center text-xs">
                <span className="text-rose-300 font-medium">Peran dalam Pipeline:</span>
                <span className="font-semibold text-white bg-rose-900/60 px-2.5 py-1 rounded-lg">
                  Prediktor &amp; Seleksi 6 Fitur Kunci
                </span>
              </div>
            </div>

            {/* Box 2: Association Rules */}
            <div className="rounded-2xl border border-amber-950/60 bg-gradient-to-b from-amber-950/20 to-slate-950 p-6 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm mb-3">
                  <ScrollText className="h-5 w-5" />
                  <span>Modul 2: Association Rules (Unsupervised Learning)</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Si Penemu Resep Praktis yang Terancam &quot;Ledakan Aturan&quot;
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Association Rules mencari pola <em>&quot;Jika A dan B, maka C&quot;</em> mirip sistem rekomendasi belanjaan. Outputnya berupa resep gamblang: <em>&quot;Jika alkohol tinggi dan asam cuka rendah, maka 59% peluang wine berkualitas tinggi (Lift 4.39x)&quot;</em>. Namun jika dijalankan tanpa kendali, akan tercipta puluhan ribu aturan sampah.
                </p>
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span><strong>Keunggulan:</strong> Aturan transparan, manusiawi, langsung dapat dijadikan SOP pabrik.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span><strong>Kelemahan:</strong> Rawan <em>Rule Explosion</em> dan tidak bisa memproses angka kontinu tanpa diskritisasi.</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-amber-950/60 flex justify-between items-center text-xs">
                <span className="text-amber-300 font-medium">Peran dalam Pipeline:</span>
                <span className="font-semibold text-white bg-amber-900/60 px-2.5 py-1 rounded-lg">
                  Eksplanasi Resep Bisnis (If-Then)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alur Arsitektur Hybrid (Step by Step) */}
      <section className="py-16 border-b border-slate-900 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300 mb-2">
              <Workflow className="h-3.5 w-3.5 text-rose-400" />
              <span>Pipeline End-to-End</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Arsitektur Framework Hybrid 4 Fase
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Protokol penambangan data bebas kebocoran data (Zero Data Leakage).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Phase 1 */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 relative">
              <div className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider mb-1">
                Fase 1
              </div>
              <h3 className="text-sm font-bold text-white mb-2">
                Integrasi &amp; Pemisahan 3 Scope
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Menggabungkan data Red &amp; White (6.497 baris), membentuk target biner (≥7) &amp; 3-tier. Memisahkan 3 populasi: Combined, Red, dan White untuk mencegah <strong>Simpson&apos;s Paradox</strong>.
              </p>
              <div className="mt-3 text-[11px] font-mono text-slate-500 bg-slate-900/70 p-2 rounded">
                Stratified 80% Train / 20% Test
              </div>
            </div>

            {/* Phase 2 */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 relative">
              <div className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider mb-1">
                Fase 2
              </div>
              <h3 className="text-sm font-bold text-white mb-2">
                Random Forest &amp; Seleksi Fitur
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Melatih 3 varian RF (Baseline, Cost-Sensitive, OOF Threshold). Mengekstrak <strong>Gini Feature Importance</strong> dari data training untuk memilih <strong>Top 6 Zat Kimia Kunci</strong>.
              </p>
              <div className="mt-3 text-[11px] font-mono text-slate-500 bg-slate-900/70 p-2 rounded">
                Top 6: Alcohol, Sulphates, VA, dll.
              </div>
            </div>

            {/* Phase 3 */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 relative">
              <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
                Fase 3
              </div>
              <h3 className="text-sm font-bold text-white mb-2">
                Diskritisasi Tertile per Tipe Wine
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mengubah 6 fitur kontinu menjadi 3 kategori (Low, Med, High) menggunakan batas quantile tertile (33.3% &amp; 66.7%) yang dihitung khusus per tipe wine agar tidak bias skala.
              </p>
              <div className="mt-3 text-[11px] font-mono text-slate-500 bg-slate-900/70 p-2 rounded">
                Contoh: Red Alcohol High &gt; 10.8%
              </div>
            </div>

            {/* Phase 4 */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 relative">
              <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
                Fase 4
              </div>
              <h3 className="text-sm font-bold text-white mb-2">
                FP-Growth &amp; Validasi Holdout
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Menambang aturan if-then yang menargetkan Quality=High &amp; Low. Setiap aturan diuji ulang pada 20% data test: <strong>41 dari 54 aturan terbukti konsisten</strong> di data baru!
              </p>
              <div className="mt-3 text-[11px] font-mono text-slate-500 bg-slate-900/70 p-2 rounded">
                Min Lift 2.0x | Min Conf 50%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Dashboard Visualisasi */}
      <section className="py-12 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-semibold text-rose-300">
                Aset Grafis Resolusi Tinggi (300 DPI)
              </span>
              <h3 className="text-xl font-bold text-white mt-2">
                Dashboard Publikasi 4 Panel
              </h3>
              <p className="text-xs text-slate-400 max-w-2xl mt-1">
                Memuat Panel A (Komparasi Feature Importance), Panel B (Multi-line ROC Curve), Panel C (Bubble Scatter Plot Rules), dan Panel D (Top 10 High Quality Rules ranked by Lift).
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <a
                href="/wine_hybrid_dashboard.png"
                download="wine_hybrid_dashboard.png"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-700 to-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:brightness-110 transition-all"
              >
                <Download className="h-4 w-4" />
                <span>Unduh Gambar (PNG 300 DPI)</span>
              </a>
              <Link
                href="/dataset"
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-all"
              >
                <Database className="h-3.5 w-3.5 text-slate-400" />
                <span>Lihat Data Mentah</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
