"use client";

import Image from "next/image";
import { useState } from "react";
import { MathView } from "@/components/MathView";
import { wineData, FEATURE_INFO } from "@/lib/data";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowDown,
  ArrowUpRight,
  Copy,
  Check,
  Download,
  Layers,
  Activity,
  Award,
  Sparkles,
} from "lucide-react";

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function SinglePageMonograph() {
  const [copied, setCopied] = useState(false);
  const [activeScope, setActiveScope] = useState<"Combined" | "Red" | "White">("Red");

  const rfMetrics = wineData.rf_model_comparison;
  const targetDist = wineData.target_distribution;
  const duplicateSummary = wineData.duplicate_summary;
  const featureImp = wineData.feature_importance;

  const copyColabCode = () => {
    const code = `# Eksekusi langsung di Google Colab:
!git clone https://github.com/rezar/wine-quality-random-forest.git || true
%run random_forest_colab.py`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 selection:bg-neutral-800 selection:text-white font-sans">
      {/* ==================================================================== */}
      {/* HERO SECTION (MONOCHROME EDITORIAL) */}
      {/* ==================================================================== */}
      <section className="relative border-b border-neutral-900 bg-gradient-to-b from-neutral-950 via-black to-black pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Badge Tag */}
          <div className="inline-flex items-center gap-2 rounded border border-neutral-800 bg-neutral-900/80 px-3 py-1 font-mono text-[11px] text-neutral-400 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            <span>DOKUMENTASI TEKNIS &amp; BEDAH MATEMATIS LENGKAP</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-tight">
            Klasifikasi Kualitas Wine dengan{" "}
            <span className="italic underline decoration-neutral-700 underline-offset-8">
              Random Forest
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-3xl text-sm sm:text-base leading-relaxed text-neutral-400 font-sans">
            Kajian mendalam teori dasar, formulasi matematika, mekanisme algoritma <em>Bagging Ensemble</em>, bedah perhitungan angka langkah-demi-langkah, hingga mitigasi jebakan statistik pada dataset fisikokimia <strong>UCI Wine Quality (N = 6.497)</strong>. Dirancang komprehensif agar dapat dipahami secara intuitif oleh orang awam sekaligus memenuhi standar ketat verifikasi sains data.
          </p>

          {/* Key Metric Strips */}
          <div className="mt-10 grid grid-cols-2 gap-px border border-neutral-800 bg-neutral-800 sm:grid-cols-4 rounded overflow-hidden">
            <div className="bg-black p-4">
              <div className="font-mono text-xs text-neutral-500">TOTAL SAMPEL (N)</div>
              <div className="mt-1 font-mono text-2xl font-bold text-white">6.497</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">1.599 Red &amp; 4.898 White</div>
            </div>

            <div className="bg-black p-4">
              <div className="font-mono text-xs text-neutral-500">FITUR FISIKOKIMIA</div>
              <div className="mt-1 font-mono text-2xl font-bold text-white">11 Zat</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">0 Nilai Kosong (Imputasi 0%)</div>
            </div>

            <div className="bg-black p-4">
              <div className="font-mono text-xs text-neutral-500">POHON KEPUTUSAN</div>
              <div className="mt-1 font-mono text-2xl font-bold text-white">300 Trees</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">Balanced Subsampling</div>
            </div>

            <div className="bg-black p-4">
              <div className="font-mono text-xs text-neutral-500">PUNCAK ROC-AUC</div>
              <div className="mt-1 font-mono text-2xl font-bold text-white">0.952</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">Red Wine Holdout Test</div>
            </div>
          </div>

          {/* Quick Table of Contents Menu */}
          <div className="mt-10 rounded border border-neutral-800/80 bg-neutral-950/60 p-5">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-3">
              <BookOpen className="h-4 w-4 text-white" />
              <span>Daftar Isi Monograf (Lompat ke Bagian):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 font-mono text-xs text-neutral-400">
              <a href="#pendahuluan" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span className="text-neutral-600">§1.</span> Latar Belakang &amp; Target
              </a>
              <a href="#variabel" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span className="text-neutral-600">§2.</span> Anatomi 11 Variabel Kimia
              </a>
              <a href="#integritas" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span className="text-neutral-600">§3.</span> Integritas &amp; Jebakan Data
              </a>
              <a href="#mekanisme" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span className="text-neutral-600">§4.</span> Cara Kerja Random Forest
              </a>
              <a href="#perhitungan" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span className="text-neutral-600">§5.</span> Bedah Hitungan Matematika
              </a>
              <a href="#eksperimen" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span className="text-neutral-600">§6.</span> Hasil Eksperimen 9 Model
              </a>
              <a href="#dashboard" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span className="text-neutral-600">§7.</span> Dashboard 4-Panel Publikasi
              </a>
              <a href="#colab-script" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span className="text-neutral-600">§8.</span> Script Python &amp; Google Colab
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Single Page Content Container */}
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-24">
        {/* ==================================================================== */}
        {/* BAGIAN 1: PENDAHULUAN & LATAR BELAKANG */}
        {/* ==================================================================== */}
        <section id="pendahuluan" className="scroll-mt-20 border-t border-neutral-900 pt-12">
          <div className="flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-widest">
            <span>Bagian 01</span>
            <span>/</span>
            <span>Konseptual Dasar</span>
          </div>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-normal text-white">
            1. Latar Belakang Masalah &amp; Formulasi Klasifikasi Kualitas
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-neutral-300">
            <p>
              Penilaian kualitas wine secara tradisional sangat bergantung pada <strong>degustasi sensorik manusia (organoleptik)</strong> yang dilakukan oleh dewan sommelier (ahli pencicip anggur bersertifikat). Walaupun sommelier memiliki kepekaan rasa yang tinggi, metode ini memiliki kelemahan fatal di dunia industri:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-neutral-400">
              <li>
                <strong className="text-neutral-200">Sangat Subjektif:</strong> Preferensi pribadi, suasana hati, atau waktu pencicipan dapat membiaskan penilaian.
              </li>
              <li>
                <strong className="text-neutral-200">Kelelahan Sensorik (Olfactory &amp; Gustatory Fatigue):</strong> Lidah manusia akan mati rasa setelah mencicipi belasan botol wine beralkohol dan berasam tinggi secara berurutan.
              </li>
              <li>
                <strong className="text-neutral-200">Biaya Mahal &amp; Tidak Skalabel:</strong> Tidak mungkin menyewa panel sommelier bintang lima untuk menguji jutaan botol yang keluar dari jalur perakitan pabrik setiap hari.
              </li>
            </ul>

            <div className="my-6 rounded border border-neutral-800 bg-neutral-950 p-4">
              <div className="font-mono text-xs font-semibold text-white uppercase tracking-wider mb-1">
                💡 Ide Pokok Machine Learning:
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Jika rasa enak dan seimbang sebotol wine sebenarnya ditentukan oleh molekul kimia di dalamnya (kadar alkohol, keasaman, gula sisa, dan senyawa sulfur), maka kita dapat <strong>mengukur molekul kimia tersebut di laboratorium secara objektif</strong>, lalu melatih model komputer untuk memprediksi apakah sommelier akan menilai wine tersebut istimewa atau biasa saja.
              </p>
            </div>

            <h3 className="text-lg font-medium text-white pt-4">
              Dataset Vinho Verde dari Portugal (Cortez et al., 2009)
            </h3>
            <p>
              Dataset yang digunakan berasal dari penelitian ilmiah terkemuka oleh <strong>Paulo Cortez dan rekan-rekan (2009)</strong> di University of Minho, Portugal. Data ini mengambil sampel dari varietas anggur <em>Vinho Verde</em> (wine hijau khas Portugal utara).
            </p>
            <p>
              Dataset terdiri dari 2 berkas terpisah: <strong>1.599 sampel Red Wine</strong> dan <strong>4.898 sampel White Wine</strong>, dengan total <strong>6.497 sampel</strong>. Masing-masing sampel memiliki 11 uji fisikokimia laboratorium dan 1 skor kualitas rata-rata dari minimal tiga sommelier profesional independen dalam rentang skala penilaian 0 (terburuk) sampai 10 (terbaik).
            </p>

            <h3 className="text-lg font-medium text-white pt-4">
              Formulasi Masalah: Mengapa Diubah Menjadi Klasifikasi Biner?
            </h3>
            <p>
              Dalam data riil, skor kualitas sommelier hanya tersebar dari nilai terendah <strong>3</strong> hingga nilai tertinggi <strong>9</strong> (tidak pernah ada botol yang dinilai 0, 1, 2, ataupun 10 sempurna). Sebagian besar botol (lebih dari 80%) berkumpul di nilai rata-rata 5 dan 6.
            </p>
            <p>
              Dalam praktik bisnis kilang anggur, yang paling dibutuhkan adalah keputusan biner yang tegas: <em>&quot;Apakah anggur ini layak dilabeli varian cadangan Premium dengan harga mahal, atau harus dibotolkan sebagai varian harian biasa?&quot;</em>
            </p>

            <div className="my-4">
              <MathView
                math={`y = \\begin{cases} 1 & \\text{jika } \\text{quality} \\ge 7 \\quad (\\text{Kualitas Tinggi / Premium}) \\\\ 0 & \\text{jika } \\text{quality} \\le 6 \\quad (\\text{Kualitas Biasa / Reguler}) \\end{cases}`}
                block={true}
              />
            </div>

            <p className="text-xs text-neutral-400">
              Dengan formulasi ini, kita mengubah persoalan regresi dengan derau subjektif menjadi <strong>tugas klasifikasi biner presisi tinggi</strong>.
            </p>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* BAGIAN 2: ANATOMI LENGKAP 11 VARIABEL FISIKOKIMIA */}
        {/* ==================================================================== */}
        <section id="variabel" className="scroll-mt-20 border-t border-neutral-900 pt-12">
          <div className="flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-widest">
            <span>Bagian 02</span>
            <span>/</span>
            <span>Domain Enologi</span>
          </div>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-normal text-white">
            2. Anatomi Lengkap 11 Variabel Fisikokimia Wine
          </h2>
          <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
            Setiap fitur diukur melalui uji laboratorium kimia bersertifikasi. Memahami arti biologis dan sensori rasa setiap zat sangat penting agar kita tahu mengapa Random Forest memilih zat tertentu sebagai penentu kualitas.
          </p>

          {/* Master Table of 11 Features */}
          <div className="mt-8 overflow-x-auto rounded border border-neutral-800">
            <table className="w-full text-left text-xs font-sans">
              <thead className="border-b border-neutral-800 bg-neutral-900/90 font-mono text-neutral-300">
                <tr>
                  <th className="py-3 px-3">No</th>
                  <th className="py-3 px-3">Variabel Fisikokimia</th>
                  <th className="py-3 px-3">Satuan</th>
                  <th className="py-3 px-3">Rentang Riil</th>
                  <th className="py-3 px-3">Sensasi di Lidah Orang Awam</th>
                  <th className="py-3 px-3">Pengaruh Terhadap Mutu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 text-neutral-300">
                {Object.entries(FEATURE_INFO).map(([key, info], idx) => (
                  <tr key={key} className="hover:bg-neutral-900/40">
                    <td className="py-3 px-3 font-mono text-neutral-500">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white capitalize">{key}</div>
                      <div className="text-[11px] text-neutral-500">{info.nameId}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-400">{info.unit}</td>
                    <td className="py-3 px-3 font-mono text-neutral-400 whitespace-nowrap">
                      {info.typicalRange[0]} - {info.typicalRange[1]}
                    </td>
                    <td className="py-3 px-3 max-w-xs text-neutral-300 leading-relaxed">
                      {info.layman}
                    </td>
                    <td className="py-3 px-3 max-w-xs text-neutral-400 leading-relaxed text-[11px]">
                      {info.impact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Deep-Dive Card per Feature Group */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded border border-neutral-800 bg-neutral-950 p-5">
              <div className="font-mono text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Kelompok Asam Organik (Acidity)
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                Terdiri dari <strong>Fixed Acidity</strong> (asam tartarat utama anggur), <strong>Citric Acid</strong> (asam sitrat citrus), dan <strong>Volatile Acidity</strong> (asam asetat).
              </p>
              <div className="rounded bg-black p-3 border border-neutral-900 text-xs text-neutral-300 space-y-1.5">
                <p>
                  • <em>Fixed Acidity</em> menjaga kesegaran wine agar tidak hambar (*flabby*).
                </p>
                <p>
                  • <em>Volatile Acidity</em> adalah <strong>musuh nomor satu pembuat wine</strong>. Jika ragi terkontaminasi bakteri udara, wine akan teroksidasi menjadi asam cuka dapur yang baunya menyengat dan rasanya menusuk tenggorokan. Nilai volatile acidity tinggi hampir selalu menjatuhkan wine ke kategori mutu terendah.
                </p>
              </div>
            </div>

            <div className="rounded border border-neutral-800 bg-neutral-950 p-5">
              <div className="font-mono text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Kelompok Pengawet &amp; Antioksidan (Sulfur)
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                Terdiri dari <strong>Free SO₂</strong>, <strong>Total SO₂</strong>, dan mineral <strong>Sulphates</strong> (kalium sulfat).
              </p>
              <div className="rounded bg-black p-3 border border-neutral-900 text-xs text-neutral-300 space-y-1.5">
                <p>
                  • Sulfur dioksida adalah perisai pelindung yang membunuh bakteri liar pembusuk anggur dan mencegah pencokelatan warna (*browning*).
                </p>
                <p>
                  • Pada Red Wine, senyawa <em>Sulphates</em> bertindak menstabilkan pigmen antosianin (warna merah pekat anggur). Jika kadar sulfat kurang, wine merah cepat pudar dan aromanya menjadi apak.
                </p>
              </div>
            </div>

            <div className="rounded border border-neutral-800 bg-neutral-950 p-5">
              <div className="font-mono text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Kelompok Kepadatan &amp; Alkohol (Density &amp; Alcohol)
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                Terdiri dari <strong>Alcohol (% vol)</strong>, <strong>Residual Sugar</strong>, dan <strong>Density (g/cm³)</strong>.
              </p>
              <div className="rounded bg-black p-3 border border-neutral-900 text-xs text-neutral-300 space-y-1.5">
                <p>
                  • Etanol lebih ringan dari air (0.789 g/cm³), sementara gula lebih berat dari air (&gt; 1.0 g/cm³).
                </p>
                <p>
                  • Wine bermutu tinggi umumnya mengalami fermentasi optimal hingga tuntas: menghasilkan alkohol tinggi (&gt; 11.5%) dengan kadar gula sisa yang terkendali, sehingga massa jenis (<em>density</em>) turun di bawah 0.994 g/cm³.
                </p>
              </div>
            </div>

            <div className="rounded border border-neutral-800 bg-neutral-950 p-5">
              <div className="font-mono text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Kelompok Mineral &amp; Keseimbangan (Chlorides &amp; pH)
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                Terdiri dari <strong>Chlorides (kadar garam terlarut)</strong> dan derajat keasaman <strong>pH</strong>.
              </p>
              <div className="rounded bg-black p-3 border border-neutral-900 text-xs text-neutral-300 space-y-1.5">
                <p>
                  • Klorida berasal dari tanah tempat pohon anggur ditanam. Kadar garam yang berlebih membuat wine terasa payau dan merusak keaslian aroma buah.
                </p>
                <p>
                  • pH mengontrol efektivitas sulfur dioksida. Semakin asam wine (pH 3.0 - 3.4), semakin awet dan segar cita rasa wine di dalam botol.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* BAGIAN 3: INTEGRITAS DATA & JEBAKAN STATISTIK */}
        {/* ==================================================================== */}
        <section id="integritas" className="scroll-mt-20 border-t border-neutral-900 pt-12">
          <div className="flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-widest">
            <span>Bagian 03</span>
            <span>/</span>
            <span>Validitas Metodologis</span>
          </div>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-normal text-white">
            3. Integritas Data, Simpson&apos;s Paradox &amp; Pencegahan Kebocoran (Data Leakage)
          </h2>

          <div className="mt-6 space-y-6 text-sm leading-relaxed text-neutral-300">
            {/* Class Imbalance Box */}
            <div className="rounded border border-neutral-800 bg-neutral-950 p-6">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-white" />
                <span>Tantangan 1: Ketimpangan Kelas Ekstrem (Class Imbalance)</span>
              </h3>
              <p className="mt-3 text-neutral-400 text-xs leading-relaxed">
                Di dunia nyata, barang mewah bernilai tinggi selalu berjumlah sedikit. Hal yang sama berlaku pada wine:
              </p>

              {/* Distribution Table */}
              <div className="my-4 overflow-x-auto rounded border border-neutral-800">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="border-b border-neutral-800 bg-neutral-900 text-neutral-300">
                    <tr>
                      <th className="py-2.5 px-3">Populasi (Scope)</th>
                      <th className="py-2.5 px-3">Total Sampel (N)</th>
                      <th className="py-2.5 px-3">Reguler / Kelas 0 (Skor ≤6)</th>
                      <th className="py-2.5 px-3 text-white">Premium / Kelas 1 (Skor ≥7)</th>
                      <th className="py-2.5 px-3 text-white">% Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 text-neutral-400">
                    {targetDist.map((td) => (
                      <tr key={td.scope}>
                        <td className="py-2 px-3 font-sans font-semibold text-white">{td.scope} Wine</td>
                        <td className="py-2 px-3">{formatNumber(td.n_rows)}</td>
                        <td className="py-2 px-3">{formatNumber(td.n_rows - td.quality_high_n)}</td>
                        <td className="py-2 px-3 text-white font-bold">{formatNumber(td.quality_high_n)}</td>
                        <td className="py-2 px-3 text-white font-bold">{td.quality_high_pct.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded bg-black p-4 border border-neutral-900 text-xs text-neutral-300 space-y-2">
                <div className="font-mono font-bold text-white">
                  ⚠️ Jebakan Ilusi Akurasi (The Accuracy Paradox):
                </div>
                <p>
                  Perhatikan angka pada <strong>Red Wine</strong>: hanya 217 botol dari 1.599 yang berkualitas premium (<strong>13.57%</strong>).
                  Jika seorang pembuat model pemalas membuat program sederhana yang selalu mencetak <em>&quot;Semua botol adalah wine biasa (0)!&quot;</em> tanpa memeriksa zat kimianya sama sekali, program tersebut sudah memperoleh <strong>Akurasi 86.43%</strong>!
                </p>
                <p>
                  Namun bagi pemilik kilang anggur, model pemalas itu sama sekali tidak berguna karena ia gagal mendeteksi satupun (0%) botol premium yang bernilai jual tinggi. Itulah alasan mengapa dalam penugasan machine learning profesional, <strong>Akurasi bukanlah metrik utama</strong>; kita wajib mengevaluasi <strong>Precision, Recall, F1-Score, dan ROC-AUC</strong>.
                </p>
              </div>
            </div>

            {/* Why not SMOTE */}
            <div className="rounded border border-neutral-800 bg-neutral-950 p-6">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-white" />
                <span>Solusi Penanganan Imbalance: Mengapa Memilih Balanced Subsampling, Bukan SMOTE?</span>
              </h3>
              <p className="mt-3 text-neutral-400 text-xs leading-relaxed">
                Banyak praktisi pemula tergesa-gesa memakai <em>SMOTE (Synthetic Minority Over-sampling Technique)</em> untuk menduplikasi data minoritas secara buatan. Namun pada dataset kimiawi seperti wine:
              </p>
              <div className="my-3 space-y-2 text-xs text-neutral-300">
                <p>
                  • <strong>Bahaya Molekul Halusinatif:</strong> SMOTE bekerja dengan cara menarik garis linier antar dua titik data lalu menaruh titik baru di tengahnya. Pada sistem kesetimbangan asam-basa cairan anggur, kombinasi linier sembarang antara asam tartarat, pH, dan SO₂ dapat menciptakan titik data fiktif yang secara termodinamika biokimia <strong>mustahil ada di alam nyata</strong>.
                </p>
                <p>
                  • <strong>Solusi Enjiniring Bersih: `class_weight=&apos;balanced_subsample&apos;`:</strong> Pada algoritma Random Forest, kita menginstruksikan setiap pohon untuk menghitung bobot penalti secara dinamis pada tiap sampel bootstrap. Kesalahan salah menebak botol premium diberi bobot penalti ~3.6x lebih berat daripada salah menebak botol reguler. Hasilnya, model menjadi sangat peka mendeteksi botol premium <strong>tanpa mengotori dataset dengan data buatan</strong>.
                </p>
              </div>
            </div>

            {/* Simpson's Paradox */}
            <div className="rounded border border-neutral-800 bg-neutral-950 p-6">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-white" />
                <span>Tantangan 2: Bahaya Simpson&apos;s Paradox (Red vs White Wine)</span>
              </h3>
              <p className="mt-3 text-neutral-400 text-xs leading-relaxed">
                <strong>Simpson&apos;s Paradox</strong> adalah jebakan statistik berbahaya di mana sebuah pola yang tampak jelas ketika data digabung ternyata berbalik arah 180 derajat ketika data dipecah ke dalam kelompok aslinya.
              </p>
              <div className="my-3 rounded bg-black p-4 border border-neutral-900 text-xs text-neutral-300 space-y-2">
                <p>
                  🍷 <strong>Fakta Biokimia:</strong> White Wine secara alami membutuhkan <strong>Total Sulfur Dioksida jauh lebih tinggi (median ~134 mg/dm³)</strong> dibanding Red Wine (median ~38 mg/dm³) karena red wine memiliki kandungan tanin tinggi yang sudah bertindak sebagai antioksidan alami, sedangkan white wine tidak memilikinya.
                </p>
                <p>
                  Jika kita hanya menganalisis satu populasi gabungan (*Combined*), model dapat keliru mengira bahwa sulfur tinggi berkorelasi dengan jenis anggur tertentu, bukan penentu kualitas yang sesungguhnya. Oleh sebab itu, kami mewajibkan pemisahan eksperimen menjadi <strong>3 Scope Mandiri: Combined Wine, Red Wine, dan White Wine</strong>.
                </p>
              </div>
            </div>

            {/* Duplicates Audit */}
            <div className="rounded border border-neutral-800 bg-neutral-950 p-6">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-white" />
                <span>Tantangan 3: Audit Transparansi 1.177 Baris Duplikat (18.11%)</span>
              </h3>
              <p className="mt-3 text-neutral-400 text-xs leading-relaxed">
                Di dalam berkas asli repositori UCI Machine Learning Wine Quality, terdapat baris yang memiliki nilai fisikokimia identik dan skor kualitas yang sama:
              </p>

              <div className="my-4 overflow-x-auto rounded border border-neutral-800">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="border-b border-neutral-800 bg-neutral-900 text-neutral-300">
                    <tr>
                      <th className="py-2 px-3">Scope Populasi</th>
                      <th className="py-2 px-3">Total Baris</th>
                      <th className="py-2 px-3">Baris Duplikat Eksak</th>
                      <th className="py-2 px-3">% Duplikat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 text-neutral-400">
                    {duplicateSummary.map((d) => (
                      <tr key={d.scope}>
                        <td className="py-2 px-3 font-sans font-semibold text-white">{d.scope} Wine</td>
                        <td className="py-2 px-3">{formatNumber(d.n_rows)}</td>
                        <td className="py-2 px-3">{formatNumber(d.duplicate_rows)}</td>
                        <td className="py-2 px-3 text-white font-bold">{d.duplicate_pct.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed">
                <strong>Alasan Mempertahankan Baris Ini:</strong> Dalam protokol benchmark standar sains data Cortez et al. (2009), keseluruhan korpus 6.497 baris digunakan untuk menjamin replikasi hasil eksperimen yang identik di seluruh dunia. Baris duplikat ini mencerminkan sampel dari kelompok tangki fermentasi yang sama.
              </p>
            </div>

            {/* Zero Data Leakage Protocol */}
            <div className="rounded border border-neutral-800 bg-neutral-950 p-6">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-white" />
                <span>Protokol Zero Data Leakage (Pencegahan Kebocoran Data)</span>
              </h3>
              <p className="mt-3 text-neutral-400 text-xs leading-relaxed">
                Kebocoran data (*data leakage*) terjadi jika informasi dari data uji merembes ke proses pelatihan model. Protokol pengamanan yang kami jalankan:
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-neutral-300 list-disc list-inside">
                <li>
                  <strong>Stratified 80% Train / 20% Test Split:</strong> Proporsi kelas premium dipertahankan persis sama di data latih dan data uji (`stratify=y`).
                </li>
                <li>
                  <strong>Holdout Test Terisolasi Penuh:</strong> Data uji (20%) disimpan rapat dan tidak pernah disentuh selama pelatihan model maupun selama pencarian ambang batas probabilitas (*threshold tuning*).
                </li>
                <li>
                  <strong>Out-of-Fold (OOF) Tuning:</strong> Ambang batas probabilitas hanya dicari dari prediksi silang 5-Fold Cross Validation pada data latih saja.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* BAGIAN 4: CARA KERJA RANDOM FOREST */}
        {/* ==================================================================== */}
        <section id="mekanisme" className="scroll-mt-20 border-t border-neutral-900 pt-12">
          <div className="flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-widest">
            <span>Bagian 04</span>
            <span>/</span>
            <span>Arsitektur Algoritma</span>
          </div>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-normal text-white">
            4. Cara Kerja Algoritma Random Forest (Bagging Ensemble)
          </h2>

          <div className="mt-6 space-y-6 text-sm leading-relaxed text-neutral-300">
            {/* Analogi Juri */}
            <div className="rounded border border-neutral-800 bg-neutral-950 p-6">
              <div className="font-mono text-xs text-neutral-500 uppercase tracking-wider mb-1">
                Analogi Kehidupan Sehari-hari untuk Orang Awam
              </div>
              <h3 className="text-lg font-serif text-white mb-3">
                Dari Satu Orang Juri yang Bias Menuju Dewan 300 Juri Independen
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Bayangkan Anda merekrut <strong>satu orang juri ahli wine</strong>. Dia mungkin pandai, tetapi dia manusia biasa: dia punya bias pribadi, mungkin dia sedang lelah hari itu, atau dia terlalu menyukai wine manis. Di machine learning, satu juri ini disebut <strong>Decision Tree (Pohon Keputusan Tunggal)</strong>.
              </p>
              <p className="mt-2 text-neutral-400 text-xs leading-relaxed">
                Kelemahan pohon tunggal adalah <em>overfitting</em>: ia menghafal detail botol yang pernah dilihatnya, tetapi sering salah ketika disajikan botol baru.
              </p>
              <p className="mt-2 text-neutral-300 text-xs leading-relaxed font-semibold">
                Random Forest memecahkan masalah ini dengan mengundang <strong>dewan 300 juri independen</strong>:
              </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded bg-black p-3.5 border border-neutral-900">
                  <div className="font-mono text-xs font-bold text-white mb-1">
                    1. Nampan Sampel Acak (Bootstrap)
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Setiap juri diberikan nampan sampel wine yang diambil secara acak dengan pengembalian (*sampling with replacement*). Tidak ada dua juri yang mencicipi kombinasi botol yang sama persis.
                  </p>
                </div>

                <div className="rounded bg-black p-3.5 border border-neutral-900">
                  <div className="font-mono text-xs font-bold text-white mb-1">
                    2. Variasi Pertanyaan (Feature Subspace)
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Di setiap langkah pengujian, juri hanya boleh memeriksa <MathView math="\sqrt{11} \approx 3" /> zat acak. Juri A memeriksa alkohol dan asam cuka; juri B memeriksa sulfat dan gula. Ini mencegah satu zat mendikte seluruh juri.
                  </p>
                </div>

                <div className="rounded bg-black p-3.5 border border-neutral-900">
                  <div className="font-mono text-xs font-bold text-white mb-1">
                    3. Suara Mayoritas (Majority Voting)
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Ketika botol baru masuk, ke-300 juri memberikan suaranya: <em>&quot;Apakah ini premium?&quot;</em> Keputusan diambil dari persentase suara terbanyak. Kesalahan juri perorangan saling meniadakan secara statistik!
                  </p>
                </div>
              </div>
            </div>

            {/* Teorema Pengurangan Variansi */}
            <div className="rounded border border-neutral-800 bg-neutral-950 p-6">
              <h3 className="text-base font-semibold text-white mb-2">
                Landasan Teoretis: Teorema Pengurangan Variansi Breiman (2001)
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Secara matematis, jika kita memiliki <MathView math="B" /> buah pohon keputusan yang masing-masing memiliki variansi <MathView math="\sigma^2" /> dan rata-rata korelasi antar-pohon sebesar <MathView math="\rho" />, maka variansi dari rata-rata prediksi ensemble hutan adalah:
              </p>

              <div className="my-4">
                <MathView
                  math={`\\text{Var}\\left(\\frac{1}{B} \\sum_{b=1}^B f_b(x)\\right) = \\rho \\sigma^2 + \\frac{1 - \\rho}{B} \\sigma^2`}
                  block={true}
                />
              </div>

              <div className="space-y-2 text-xs text-neutral-300 leading-relaxed">
                <p>
                  • Ketika jumlah pohon <MathView math="B" /> diperbanyak (misalnya <MathView math="B = 300" />), suku kedua <MathView math="\frac{1 - \rho}{B} \sigma^2" /> <strong>menyusut mendekati nol</strong>.
                </p>
                <p>
                  • Sisa variansi yang tidak bisa hilang adalah suku pertama: <MathView math="\rho \sigma^2" />. Agar suku pertama ini juga sekecil mungkin, kita harus memperkecil nilai korelasi <MathView math="\rho" /> antar-pohon.
                </p>
                <p>
                  • Inilah alasan brilian di balik <strong>Random Feature Subspace</strong>: dengan memaksa setiap pemisahan cabang pohon hanya memilih dari <MathView math="m = \lfloor \sqrt{11} \rfloor = 3" /> variabel acak, korelasi <MathView math="\rho" /> antar-pohon ditekan hingga sangat rendah, menghasilkan model ensemble yang sangat stabil dan kebal terhadap *overfitting*.
                </p>
              </div>
            </div>

            {/* Out-of-Bag Theory */}
            <div className="rounded border border-neutral-800 bg-neutral-950 p-6">
              <h3 className="text-base font-semibold text-white mb-2">
                Sampel Out-of-Bag (OOB) dan Rasio Keajaiban Euler (1/e ≈ 36.8%)
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Saat sebuah pohon mengambil sampel bootstrap berukuran <MathView math="N" /> dengan pengembalian dari data berukuran <MathView math="N" />, peluang sebaris data tertentu <strong>TIDAK PERNAH TERPILIH</strong> sama sekali adalah:
              </p>

              <div className="my-4">
                <MathView
                  math={`P(\\text{tidak terpilih}) = \\left(1 - \\frac{1}{N}\\right)^N \\xrightarrow{N \\to \\infty} \\frac{1}{e} \\approx 0.367879 \\quad (36.79\\%)`}
                  block={true}
                />
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                Artinya, sekitar sepertiga (36.8%) data latih sama sekali tidak pernah dilihat oleh pohon tersebut selama pelatihan! Data yang tidak terpilih ini disebut <strong>Out-of-Bag (OOB) samples</strong>, dan secara otomatis dapat digunakan sebagai penguji internal independen tanpa memerlukan data validasi eksternal.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* BAGIAN 5: BEDAH HITUNGAN MATEMATIKA LENGKAP & USE CASE RIIL */}
        {/* ==================================================================== */}
        <section id="perhitungan" className="scroll-mt-20 border-t border-neutral-900 pt-12">
          <div className="flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-widest">
            <span>Bagian 05</span>
            <span>/</span>
            <span>Bedah Hitungan &amp; Use Case Lengkap</span>
          </div>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-normal text-white">
            5. Alur Kerja Logika &amp; Bedah Hitungan Matematika: Dari Sampel 100 Botol hingga Vonis Akhir
          </h2>
          <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
            Banyak orang mengira machine learning adalah &quot;kotak hitam ajaib&quot; yang rumit. Sebenarnya, seluruh keputusan Random Forest didasarkan pada perhitungan aritmatika dasar yang sangat runtut. Di bawah ini kami bedah prosesnya secara transparan: mulai dari logika pemilihan pertanyaan pohon, pembentukan dewan 300 juri, simulasi uji coba 1 botol riil dari kebun anggur, hingga kalkulasi skor keyakinan akhir.
          </p>

          {/* Infographic Step Flow */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono text-xs text-center">
            <div className="rounded border border-neutral-800 bg-neutral-950 p-3">
              <div className="text-neutral-500">TAHAP 1</div>
              <div className="font-bold text-white mt-1">Sampel 100 Botol</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">80 Reguler, 20 Premium</div>
            </div>
            <div className="rounded border border-neutral-800 bg-neutral-950 p-3">
              <div className="text-neutral-500">TAHAP 2</div>
              <div className="font-bold text-white mt-1">Pohon Bertanya</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">Gini Split &amp; Penurunan Error</div>
            </div>
            <div className="rounded border border-neutral-800 bg-neutral-950 p-3">
              <div className="text-neutral-500">TAHAP 3</div>
              <div className="font-bold text-white mt-1">Dewan 300 Pohon</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">Bootstrap &amp; 3 Zat Acak</div>
            </div>
            <div className="rounded border border-neutral-800 bg-neutral-950 p-3">
              <div className="text-neutral-500">TAHAP 4</div>
              <div className="font-bold text-white mt-1">Uji Botol #42</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">Voting 300 Pohon (72%)</div>
            </div>
            <div className="rounded border border-neutral-800 bg-neutral-950 p-3">
              <div className="text-neutral-500">TAHAP 5</div>
              <div className="font-bold text-white mt-1">Vonis Pabrik</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">Label: WINE PREMIUM</div>
            </div>
          </div>

          <div className="mt-10 space-y-12 text-sm leading-relaxed text-neutral-300">
            {/* -------------------------------------------------------------- */}
            {/* TAHAP 1: GINI IMPURITY & ANALOGI TOPLES KELERENG */}
            {/* -------------------------------------------------------------- */}
            <div className="rounded border border-neutral-800 bg-neutral-950 p-6">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 font-mono text-[11px] text-white">
                    1
                  </span>
                  <span>Tahap 1: Pengambilan 100 Botol Sampel &amp; Logika Gini Impurity (Toples Kelereng)</span>
                </h3>
                <span className="font-mono text-xs text-neutral-500">Konsep Ketidakmurnian</span>
              </div>

              <div className="rounded bg-black p-4 border border-neutral-900 text-xs text-neutral-300 space-y-2 mb-4">
                <div className="font-bold text-white font-mono uppercase tracking-wider">
                  Analogi Sederhana untuk Orang Awam (Toples Kelereng):
                </div>
                <p>
                  Bayangkan kita memiliki sebuah toples kaca berisi <strong>100 buah kelereng</strong>.
                  Sebanyak <strong>80 kelereng berwarna hitam (Wine Reguler)</strong> dan <strong>20 kelereng berwarna emas (Wine Premium)</strong>.
                </p>
                <p>
                  Jika Anda menutup mata lalu mengambil satu kelereng secara acak, seberapa besar kemungkinan Anda akan keliru menebak warnanya?
                  Ukuran &quot;kegaduhan atau ketidakpastian&quot; isi toples inilah yang dalam matematika disebut <strong>Gini Impurity (Ketidakmurnian Gini)</strong>.
                </p>
                <p>
                  • Jika isi toples <strong>100% kelereng emas murni</strong>, Gini bernilai <strong>0</strong> (sempurna, tidak ada keraguan sama sekali).<br />
                  • Jika isi toples campur aduk acak 50:50, Gini mencapai puncak tertingginya yaitu <strong>0.50</strong> (sangat membingungkan).
                </p>
              </div>

              <p className="text-xs text-neutral-400 mb-2">
                Rumus Gini Impurity dihitung dari 1 dikurangi penjumlahan kuadrat peluang masing-masing kelas:
              </p>

              <MathView
                math={`I_G = 1 - (p_0^2 + p_1^2)`}
                block={true}
              />

              <div className="my-4 rounded border border-neutral-800 bg-black p-4 space-y-2 text-xs font-mono">
                <div className="text-white font-bold border-b border-neutral-900 pb-1.5">
                  HITUNGAN NYATA PADA 100 BOTOL SEBELUM DIBELAH:
                </div>
                <div>• Peluang terpilih botol reguler (Kelas 0): <MathView math="p_0 = \frac{80}{100} = 0.80" /></div>
                <div>• Peluang terpilih botol premium (Kelas 1): <MathView math="p_1 = \frac{20}{100} = 0.20" /></div>
                <div className="pt-2 text-white font-bold">
                  <MathView
                    math={`I_G(\\text{induk}) = 1 - \\left(0.80^2 + 0.20^2\\right) = 1 - (0.64 + 0.04) = 1 - 0.68 = \\mathbf{0.3200}`}
                    block={true}
                  />
                </div>
                <div className="text-neutral-400 font-sans text-[11px] pt-1">
                  Artinya: Pada kondisi awal, tingkat ketidakmurnian toples data kita bernilai <strong>0.3200</strong>.
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* TAHAP 2: POHON BERTANYA & GINI GAIN */}
            {/* -------------------------------------------------------------- */}
            <div className="rounded border border-neutral-800 bg-neutral-950 p-6">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 font-mono text-[11px] text-white">
                    2
                  </span>
                  <span>Tahap 2: Pohon Mencari Pertanyaan Pemisah Terbaik (Gini Gain / Penurunan Error)</span>
                </h3>
                <span className="font-mono text-xs text-neutral-500">Pemisahan Cabang</span>
              </div>

              <p className="text-xs text-neutral-400 mb-3">
                Tugas pohon keputusan adalah mengajukan pertanyaan fisikokimia biner (Ya/Tidak) yang paling ampuh memisahkan botol premium dari botol reguler.
                Setelah menguji ratusan kemungkinan batas zat kimia, pohon menemukan pertanyaan terbaik:
              </p>

              <div className="rounded border border-neutral-800 bg-black p-3.5 text-center font-mono text-sm text-white font-bold my-3">
                ❓ Pertanyaan Pohon: &quot;Apakah Kadar Alkohol &gt; 10.5%?&quot;
              </div>

              <p className="text-xs text-neutral-400 mb-3">
                Dengan pertanyaan ini, toples berisi 100 botol terbagi rapi ke dalam dua nampan anak:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nampan Kiri */}
                <div className="rounded border border-neutral-800 bg-black p-4 space-y-2 text-xs font-mono">
                  <div className="text-white font-bold border-b border-neutral-900 pb-1">
                    Nampan Kiri (Alkohol &gt; 10.5%):
                  </div>
                  <div className="text-neutral-400">Total sampel masuk: <strong>30 botol</strong></div>
                  <div>• Botol Premium = 18 botol → <MathView math="p_{1,L} = \frac{18}{30} = 0.60" /></div>
                  <div>• Botol Reguler = 12 botol → <MathView math="p_{0,L} = \frac{12}{30} = 0.40" /></div>
                  <div className="pt-2 text-white font-bold">
                    <MathView
                      math={`I_G(t_L) = 1 - (0.60^2 + 0.40^2) = 1 - 0.52 = \\mathbf{0.4800}`}
                    />
                  </div>
                  <div className="text-neutral-400 font-sans text-[11px] pt-1">
                    Komentar: Nampan ini sangat kaya botol premium (60% botol di sini premium).
                  </div>
                </div>

                {/* Nampan Kanan */}
                <div className="rounded border border-neutral-800 bg-black p-4 space-y-2 text-xs font-mono">
                  <div className="text-white font-bold border-b border-neutral-900 pb-1">
                    Nampan Kanan (Alkohol ≤ 10.5%):
                  </div>
                  <div className="text-neutral-400">Total sampel masuk: <strong>70 botol</strong></div>
                  <div>• Botol Premium = 2 botol → <MathView math="p_{1,R} = \frac{2}{70} \approx 0.0286" /></div>
                  <div>• Botol Reguler = 68 botol → <MathView math="p_{0,R} = \frac{68}{70} \approx 0.9714" /></div>
                  <div className="pt-2 text-white font-bold">
                    <MathView
                      math={`I_G(t_R) = 1 - (0.0286^2 + 0.9714^2) = \\mathbf{0.0556}`}
                    />
                  </div>
                  <div className="text-neutral-400 font-sans text-[11px] pt-1">
                    Komentar: Hampir 97% isinya botol reguler biasa, ketidakmurniannya sangat rendah.
                  </div>
                </div>
              </div>

              {/* Hitung Gini Gain */}
              <div className="mt-4 rounded border border-neutral-800 bg-black p-4 space-y-3 text-xs font-mono">
                <div className="text-white font-bold border-b border-neutral-900 pb-1.5">
                  MENGHITUNG KEUNTUNGAN PEMISAHAN (GINI GAIN / ΔI_G):
                </div>
                <p className="text-neutral-400 font-sans">
                  Pohon menghitung rata-rata ketidakmurnian baru dari kedua nampan berdasarkan proporsi botolnya:
                </p>
                <div className="text-white">
                  <MathView
                    math={`\\text{Gini Rata-Rata Anak} = \\left(\\frac{30}{100} \\times 0.4800\\right) + \\left(\\frac{70}{100} \\times 0.0556\\right) = 0.1440 + 0.0389 = \\mathbf{0.1829}`}
                    block={true}
                  />
                </div>
                <p className="text-neutral-400 font-sans">
                  Selisih ketidakmurnian sebelum vs sesudah pemisahan adalah keuntungan informasi (Gini Gain):
                </p>
                <div className="text-white font-bold">
                  <MathView
                    math={`\\Delta I_G = I_G(\\text{induk}) - \\text{Gini Anak} = 0.3200 - 0.1829 = \\mathbf{+0.1371}`}
                    block={true}
                  />
                </div>
                <div className="text-neutral-300 font-sans text-xs border-t border-neutral-900 pt-2">
                  🎉 <strong>Keputusan Pohon:</strong> Karena menghasilkan penurunan ketidakmurnian sebesar <strong>+0.1371 (13.71%)</strong>, pohon menyetujui pertanyaan alkohol ini!
                  Cabang ini kemudian dilanjutkan dengan pertanyaan kedua pada nampan kiri: <em>&quot;Apakah Asam Cuka (Volatile Acidity) ≤ 0.40 g/dm³?&quot;</em>.
                  Dari 18 botol premium tersebut, sebanyak 16 botol terbukti memiliki asam cuka rendah. Terbentuklah aturan daun (*leaf node*):
                  <span className="block mt-1 font-mono text-white bg-neutral-900 p-2 rounded">
                    JIKA (Alkohol &gt; 10.5%) DAN (Asam Cuka ≤ 0.40 g/dm³) → PELUANG PREMIUM = 88.9%!
                  </span>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* TAHAP 3: MEMBANGUN DEWAN 300 POHON */}
            {/* -------------------------------------------------------------- */}
            <div className="rounded border border-neutral-800 bg-neutral-950 p-6">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 font-mono text-[11px] text-white">
                    3
                  </span>
                  <span>Tahap 3: Mengapa Butuh Dewan Hutan 300 Pohon (Bukan 1 Pohon Saja)?</span>
                </h3>
                <span className="font-mono text-xs text-neutral-500">Prinsip Ensemble</span>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-neutral-300">
                <p>
                  Satu pohon keputusan di atas sudah cukup pintar, tetapi memiliki kelemahan fatal: <strong>terlalu menghafal data 100 botol tersebut</strong> (*overfitting*). Jika besok ada botol baru dari varietas anggur yang sedikit berbeda, pohon tunggal rawan salah tebak.
                </p>
                <p>
                  Random Forest mengatasi masalah ini dengan melantik <strong>300 Pohon Keputusan Independen</strong> menggunakan dua prinsip pengacakan:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="rounded bg-black p-3.5 border border-neutral-900">
                    <div className="font-mono text-xs font-bold text-white mb-1">
                      A. Undian Sampel Acak (Bootstrap)
                    </div>
                    <p className="text-neutral-400">
                      Masing-masing dari 300 pohon diberi nampan data yang diambil secara acak dengan pengembalian. Sekitar 36.8% botol tidak pernah dilihat oleh pohon tertentu (*Out-of-Bag*), menjamin setiap pohon memiliki pengalaman belajar yang berbeda.
                    </p>
                  </div>
                  <div className="rounded bg-black p-3.5 border border-neutral-900">
                    <div className="font-mono text-xs font-bold text-white mb-1">
                      B. Batasan Pertanyaan (Feature Subspace)
                    </div>
                    <p className="text-neutral-400">
                      Di setiap persimpangan ranting, pohon tidak boleh melihat seluruh 11 zat kimia sekaligus. Pohon hanya boleh memilih dari <MathView math="\sqrt{11} \approx 3" /> zat acak. Pohon 1 mengecek alkohol &amp; sulfat; Pohon 2 mengecek densitas &amp; gula. Tidak ada satu zat pun yang bisa mendikte seluruh hutan.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* TAHAP 4: USE CASE RIIL UJI BOTOL #42 */}
            {/* -------------------------------------------------------------- */}
            <div className="rounded border border-neutral-800 bg-neutral-950 p-6">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white font-mono text-[11px] text-black font-bold">
                    4
                  </span>
                  <span>Tahap 4 (Use Case Riil): Menguji Botol Baru #42 dari Tangki Fermentasi Kilang</span>
                </h3>
                <span className="font-mono text-xs text-white bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  Simulasi Nyata
                </span>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                Sebuah botol wine baru diambil dari tangki fermentasi #42. Sampel cairan diuji di laboratorium dan menghasilkan 11 parameter kimiawi sebagai berikut:
              </p>

              {/* Lab Test Card for Bottle #42 */}
              <div className="rounded border border-neutral-800 bg-black p-4">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-2 mb-3">
                  <div className="font-mono text-xs font-bold text-white">
                    HASIL UJI FISIKOKIMIA RESMI: BOTOL SAMPLE #42 (RED WINE)
                  </div>
                  <div className="font-mono text-[11px] text-neutral-500">Status: Belum Diketahui Mutunya</div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                  <div className="rounded bg-neutral-950 p-2 border border-neutral-900">
                    <div className="text-neutral-500 text-[10px]">1. ALCOHOL</div>
                    <div className="text-white font-bold">11.8 % vol</div>
                    <div className="text-[10px] text-neutral-400">Tinggi (Bagus)</div>
                  </div>
                  <div className="rounded bg-neutral-950 p-2 border border-neutral-900">
                    <div className="text-neutral-500 text-[10px]">2. VOLATILE ACIDITY</div>
                    <div className="text-white font-bold">0.32 g/dm³</div>
                    <div className="text-[10px] text-neutral-400">Rendah (Segar)</div>
                  </div>
                  <div className="rounded bg-neutral-950 p-2 border border-neutral-900">
                    <div className="text-neutral-500 text-[10px]">3. SULPHATES</div>
                    <div className="text-white font-bold">0.73 g/dm³</div>
                    <div className="text-[10px] text-neutral-400">Stabil (Kuat)</div>
                  </div>
                  <div className="rounded bg-neutral-950 p-2 border border-neutral-900">
                    <div className="text-neutral-500 text-[10px]">4. DENSITY</div>
                    <div className="text-white font-bold">0.9935 g/cm³</div>
                    <div className="text-[10px] text-neutral-400">Fermentasi Tuntas</div>
                  </div>
                  <div className="rounded bg-neutral-950 p-2 border border-neutral-900">
                    <div className="text-neutral-500 text-[10px]">5. CITRIC ACID</div>
                    <div className="text-white font-bold">0.38 g/dm³</div>
                    <div className="text-[10px] text-neutral-400">Aroma Buah Cukup</div>
                  </div>
                  <div className="rounded bg-neutral-950 p-2 border border-neutral-900">
                    <div className="text-neutral-500 text-[10px]">6. RESIDUAL SUGAR</div>
                    <div className="text-white font-bold">2.20 g/dm³</div>
                    <div className="text-[10px] text-neutral-400">Kering Seimbang</div>
                  </div>
                  <div className="rounded bg-neutral-950 p-2 border border-neutral-900">
                    <div className="text-neutral-500 text-[10px]">7. TOTAL SO₂</div>
                    <div className="text-white font-bold">34.0 mg/dm³</div>
                    <div className="text-[10px] text-neutral-400">Antioksidan Aman</div>
                  </div>
                  <div className="rounded bg-neutral-950 p-2 border border-neutral-900">
                    <div className="text-neutral-500 text-[10px]">8. pH</div>
                    <div className="text-white font-bold">3.36</div>
                    <div className="text-[10px] text-neutral-400">Keasaman Ideal</div>
                  </div>
                </div>
              </div>

              {/* Voting Process in the Forest */}
              <div className="mt-4 space-y-3 text-xs leading-relaxed text-neutral-300">
                <p>
                  Data 11 angka di atas disodorkan secara serentak ke <strong>seluruh 300 pohon keputusan</strong> di dalam Random Forest. Setiap pohon menelusuri ranting-ranting keputusannya sendiri:
                </p>
                <div className="rounded bg-black p-4 border border-neutral-900 font-mono text-xs space-y-2">
                  <div>• <strong>Pohon #1 s/d #120:</strong> Mengevaluasi Alkohol (11.8% &gt; 10.5%) dan Asam Cuka (0.32 ≤ 0.40) → Memilih: <span className="text-white font-bold">PREMIUM (1)</span></div>
                  <div>• <strong>Pohon #121 s/d #180:</strong> Mengevaluasi Sulfat (0.73 &gt; 0.65) dan Densitas (0.9935 &lt; 0.994) → Memilih: <span className="text-white font-bold">PREMIUM (1)</span></div>
                  <div>• <strong>Pohon #181 s/d #216:</strong> Mengevaluasi Asam Sitrat dan pH → Memilih: <span className="text-white font-bold">PREMIUM (1)</span></div>
                  <div>• <strong>Pohon #217 s/d #300:</strong> Pohon-pohon yang cabangnya menguji klorida atau sulfur bebas merasa ragu → Memilih: <span className="text-neutral-500 font-bold">REGULER (0)</span></div>

                  <div className="mt-3 pt-3 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div>
                      HASIL PEMILU 300 POHON:
                    </div>
                    <div className="flex gap-4">
                      <span className="text-white font-bold">Suara Premium: 216 Pohon (72.0%)</span>
                      <span className="text-neutral-500">Suara Reguler: 84 Pohon (28.0%)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-neutral-400 text-xs">
                    Rata-rata suara dari ke-300 pohon menghasilkan skor probabilitas ensemble (<MathView math="\hat{p}" />):
                  </p>
                  <MathView
                    math={`\\hat{p} = \\frac{\\sum_{b=1}^{300} \\mathbb{I}(\\text{Pohon}_b = 1)}{300} = \\frac{216}{300} = \\mathbf{0.7200 \\quad (72.0\\%)}`}
                    block={true}
                  />
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* TAHAP 5: PENENTUAN VONIS PABRIK & SERTIFIKASI */}
            {/* -------------------------------------------------------------- */}
            <div className="rounded border border-neutral-800 bg-neutral-950 p-6">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white font-mono text-[11px] text-black font-bold">
                    5
                  </span>
                  <span>Tahap 5: Penentuan Vonis Akhir Berdasarkan Ambang Batas (Decision Cutoff)</span>
                </h3>
                <span className="font-mono text-xs text-neutral-500">Output Pabrik</span>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-neutral-300">
                <p>
                  Apakah skor probabilitas 72.0% sudah cukup untuk melabeli botol ini sebagai produk premium?
                  Sistem komputer membandingkan nilai <MathView math="\hat{p} = 0.7200" /> dengan <strong>Ambang Batas Optimal</strong> yang telah dikalibrasi pada model M3 Red Wine (<MathView math="\theta^* = 0.32" />):
                </p>

                <div className="my-2 rounded border border-neutral-800 bg-black p-3.5 text-center font-mono text-sm">
                  Aturan Vonis: Jika <MathView math="\hat{p} \ge \theta^*" /> maka Klasifikasikan sebagai <strong>PREMIUM (1)</strong>
                </div>

                <div className="my-2">
                  <MathView
                    math={`0.7200 \\ge 0.3200 \\implies \\mathbf{\\hat{y} = 1 \\quad (PREMIUM)}`}
                    block={true}
                  />
                </div>

                {/* Final Decision Ticket */}
                <div className="mt-4 rounded border-2 border-neutral-700 bg-black p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                      CERTIFICATE OF QUALITY CLASSIFICATION
                    </span>
                    <span className="rounded bg-white px-2 py-0.5 font-mono text-xs font-bold text-black">
                      PASSED • GRADE A
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                    <div>
                      <div className="text-neutral-500 text-[10px]">ID IDENTIFIKASI</div>
                      <div className="text-white font-bold">VINHO-VERDE-BATCH-42</div>
                    </div>
                    <div>
                      <div className="text-neutral-500 text-[10px]">KONSENSUS DEWAN JURI</div>
                      <div className="text-white font-bold">72.0% (216 / 300 Pohon)</div>
                    </div>
                    <div>
                      <div className="text-neutral-500 text-[10px]">VONIS SISTEM</div>
                      <div className="text-white font-bold uppercase underline decoration-white underline-offset-4">
                        WINE PREMIUM (CADANGAN EMAS)
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-900 pt-3 text-neutral-400 font-sans text-xs leading-relaxed">
                    📝 <strong>Penjelasan Enologi kepada Pemilik Pabrik:</strong> Botol #42 dinyatakan Premium karena memiliki alkohol matang sempurna (11.8%) yang memberikan sensasi rasa tebal dan hangat, dipadukan dengan asam asetat yang sangat rendah (0.32 g/dm³) sehingga wine bersih dari aroma cuka, serta dilindungi sulfat optimal (0.73 g/dm³) yang menjamin warna merah cerah bertahan bertahun-tahun di dalam botol. Botol ini layak dijual dengan harga premium bintang lima.
                  </div>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* TAHAP 6: EVALUASI KEJUJURAN MODEL PADA 320 DATA UJI */}
            {/* -------------------------------------------------------------- */}
            <div className="rounded border border-neutral-800 bg-neutral-950 p-6">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
                <h3 className="text-base font-semibold text-white">
                  Tahap 6: Bagaimana Kita Menguji Kejujuran Model pada 320 Botol Data Uji?
                </h3>
                <span className="font-mono text-xs text-neutral-500">Evaluasi Metrik Riil</span>
              </div>

              <p className="text-xs text-neutral-400 mb-4">
                Setelah model selesai dilatih, kita mengujinya pada <strong>320 botol Red Wine baru</strong> yang belum pernah disentuh sama sekali selama pelatihan. Hasilnya dirangkum dalam Matriks Kebingungan (*Confusion Matrix*):
              </p>

              <div className="my-4 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center text-xs">
                <div className="rounded border border-neutral-800 bg-black p-3">
                  <div className="text-neutral-500">True Negative (TN)</div>
                  <div className="text-xl font-bold text-white mt-1">275</div>
                  <div className="text-[10px] text-neutral-500">Reguler ditebak reguler (Benar)</div>
                </div>
                <div className="rounded border border-neutral-800 bg-black p-3">
                  <div className="text-neutral-500">False Positive (FP)</div>
                  <div className="text-xl font-bold text-white mt-1">2</div>
                  <div className="text-[10px] text-neutral-500">Reguler dikira premium (Alarm Palsu)</div>
                </div>
                <div className="rounded border border-neutral-800 bg-black p-3">
                  <div className="text-neutral-500">False Negative (FN)</div>
                  <div className="text-xl font-bold text-white mt-1">16</div>
                  <div className="text-[10px] text-neutral-500">Premium terlewat (Lolos)</div>
                </div>
                <div className="rounded border border-neutral-800 bg-black p-3">
                  <div className="text-neutral-500">True Positive (TP)</div>
                  <div className="text-xl font-bold text-white mt-1">27</div>
                  <div className="text-[10px] text-neutral-500">Premium tertangkap (Sukses)</div>
                </div>
              </div>

              <div className="space-y-4 my-5 font-mono text-xs text-neutral-300">
                <div className="rounded bg-black p-3.5 border border-neutral-900">
                  <div className="text-white font-bold mb-1">1. Presisi (Precision) Kelas Premium: 93.10%</div>
                  <MathView math={`\\text{Precision} = \\frac{TP}{TP + FP} = \\frac{27}{27 + 2} = \\frac{27}{29} = \\mathbf{93.10\\%}`} />
                  <div className="font-sans text-[11px] text-neutral-400 mt-1">
                    Arti Praktis: Ketika model berani berkata <em>&quot;Botol ini adalah Premium!&quot;</em>, ada <strong>93.1% kepastian bahwa botol itu memang benar-benar enak</strong>. Hanya 2 botol biasa yang salah dilabeli premium.
                  </div>
                </div>

                <div className="rounded bg-black p-3.5 border border-neutral-900">
                  <div className="text-white font-bold mb-1">2. Recall (Sensitivitas Tangkapan): 62.79%</div>
                  <MathView math={`\\text{Recall} = \\frac{TP}{TP + FN} = \\frac{27}{27 + 16} = \\frac{27}{43} = \\mathbf{62.79\\%}`} />
                  <div className="font-sans text-[11px] text-neutral-400 mt-1">
                    Arti Praktis: Dari total 43 botol premium langka yang tersebar di kebun, model berhasil menyaring 27 botol (hampir 2 dari 3 botol premium berhasil diselamatkan).
                  </div>
                </div>

                <div className="rounded bg-black p-4 border border-neutral-900">
                  <div className="text-white font-bold mb-1">
                    3. Mengapa Wajib Rata-Rata Harmonik (F1-Score = 0.7500)?
                  </div>
                  <p className="font-sans text-xs text-neutral-300 leading-relaxed mb-2">
                    Jika kita memakai rata-rata sekolah biasa (aritmatika): (93.10% + 62.79%) / 2 = 77.95%.
                    Namun di bidang data science, jika model hanya menebak 1 botol premium seumur hidupnya, presisinya bisa saja 100% padahal recall-nya 1%. Rata-rata aritmatika bisa menipu.
                    Oleh sebab itu digunakan <strong>Rata-Rata Harmonik (F1-Score)</strong>:
                  </p>
                  <MathView
                    math={`F_1 = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}} = 2 \\times \\frac{0.9310 \\times 0.6279}{0.9310 + 0.6279} = \\mathbf{0.7500}`}
                    block={true}
                  />
                  <div className="font-sans text-[11px] text-neutral-400 mt-1">
                    Skor F1 sebesar <strong>0.7500</strong> membuktikan bahwa Random Forest mencapai keseimbangan harmonis antara ketajaman mengenali wine langka dan kejujuran tanpa banyak alarm palsu.
                  </div>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* TAHAP 7: KALIBRASI AMBANG BATAS PROBABILITAS OOF */}
            {/* -------------------------------------------------------------- */}
            <div className="rounded border border-neutral-800 bg-neutral-950 p-6">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
                <h3 className="text-base font-semibold text-white">
                  Tahap 7: Rahasia Lonjakan Recall Model M3 Melalui Out-of-Fold Tuning
                </h3>
                <span className="font-mono text-xs text-neutral-500">Ambang Batas 0.32</span>
              </div>

              <p className="text-xs text-neutral-400 mb-3">
                Secara default, komputer menetapkan ambang kelulusan standar 50% (<MathView math="\theta = 0.50" />).
                Namun karena wine premium adalah barang langka (hanya 13.5%), juri pohon sering kali bersikap terlalu hati-hati sehingga banyak botol premium terlewat.
              </p>

              <div className="overflow-x-auto my-3 rounded border border-neutral-800">
                <table className="w-full text-left font-mono text-xs text-neutral-400">
                  <thead className="border-b border-neutral-800 bg-neutral-900 text-neutral-300">
                    <tr>
                      <th className="py-2 px-3">Ambang Kelulusan (θ)</th>
                      <th className="py-2 px-3">Presisi</th>
                      <th className="py-2 px-3">Recall (Tangkapan)</th>
                      <th className="py-2 px-3 text-white">F1-Score</th>
                      <th className="py-2 px-3">Penjelasan Praktis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    <tr>
                      <td className="py-2 px-3">0.50 (Default M1/M2)</td>
                      <td className="py-2 px-3">72.4%</td>
                      <td className="py-2 px-3">49.4%</td>
                      <td className="py-2 px-3">0.5872</td>
                      <td className="py-2 px-3 text-neutral-500">Terlalu pelit, separuh botol premium terbuang</td>
                    </tr>
                    <tr className="bg-neutral-900 text-white font-bold">
                      <td className="py-2 px-3 text-white">0.32 (Optimal Model M3)</td>
                      <td className="py-2 px-3">51.8%</td>
                      <td className="py-2 px-3">70.1%</td>
                      <td className="py-2 px-3 text-white">0.5947</td>
                      <td className="py-2 px-3 text-white">TITIK EMAS: F1-Score Paling Maksimal</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">0.20 (Terlalu Rendah)</td>
                      <td className="py-2 px-3">33.5%</td>
                      <td className="py-2 px-3">86.2%</td>
                      <td className="py-2 px-3">0.4820</td>
                      <td className="py-2 px-3 text-neutral-500">Terlalu gampang meloloskan wine biasa</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="font-sans text-xs text-neutral-300 pt-2">
                🎯 <strong>Hasil Spektakuler pada Data Uji Holdout:</strong> Saat ambang optimal <MathView math="\theta^* = 0.32" /> diterapkan pada data uji holdout Red Wine, <strong>Recall melonjak drastis dari 62.79% menjadi 74.42%</strong>!
                Artinya, hampir <strong>3 dari setiap 4 botol premium</strong> yang dipanen dari kebun berhasil diselamatkan dan dipasarkan sebagai produk bernilai tinggi.
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* BAGIAN 6: HASIL EKSPERIMEN NYATA 9 MODEL */}
        {/* ==================================================================== */}
        <section id="eksperimen" className="scroll-mt-20 border-t border-neutral-900 pt-12">
          <div className="flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-widest">
            <span>Bagian 06</span>
            <span>/</span>
            <span>Hasil Empiris</span>
          </div>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-normal text-white">
            6. Hasil Eksperimen 9 Varian Model pada Data Uji Holdout (20%)
          </h2>
          <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
            Berikut adalah hasil evaluasi resmi dari 3 model (M1 Baseline, M2 Cost-Sensitive, M3 Threshold-Optimized) yang diuji secara ketat pada partisi 20% holdout test yang belum pernah dilihat model selama pelatihan.
          </p>

          {/* Master Evaluation Table */}
          <div className="mt-6 overflow-x-auto rounded border border-neutral-800">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-neutral-800 bg-neutral-900 font-sans text-neutral-300">
                <tr>
                  <th className="py-3 px-3">Scope Populasi</th>
                  <th className="py-3 px-3">Varian Model</th>
                  <th className="py-3 px-3">Ambang (Cutoff)</th>
                  <th className="py-3 px-3">Akurasi</th>
                  <th className="py-3 px-3">Presisi</th>
                  <th className="py-3 px-3 text-white">Recall</th>
                  <th className="py-3 px-3 text-white">F1-Score</th>
                  <th className="py-3 px-3 text-white">ROC-AUC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 text-neutral-400">
                {rfMetrics.map((row, idx) => {
                  const isTopRow =
                    (row.scope === "Red" && row.model === "M2_Tuned_CostSensitive") ||
                    (row.scope === "White" && row.model === "M3_ThresholdOptimized") ||
                    (row.scope === "Combined" && row.model === "M2_Tuned_CostSensitive");

                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-neutral-900/60 ${isTopRow ? "bg-neutral-900/40 text-neutral-200" : ""}`}
                    >
                      <td className="py-2.5 px-3 font-sans font-semibold text-white">
                        {row.scope} Wine
                      </td>
                      <td className="py-2.5 px-3 text-neutral-300 font-sans">
                        {row.model === "M1_Baseline"
                          ? "M1: Baseline (200 Trees)"
                          : row.model === "M2_Tuned_CostSensitive"
                          ? "M2: Cost-Sensitive (300 Trees)"
                          : "M3: Threshold-Optimized (OOF)"}
                      </td>
                      <td className="py-2.5 px-3">{row.threshold.toFixed(2)}</td>
                      <td className="py-2.5 px-3">{(row.accuracy * 100).toFixed(2)}%</td>
                      <td className="py-2.5 px-3">{(row.precision * 100).toFixed(2)}%</td>
                      <td className="py-2.5 px-3 font-bold text-white">{(row.recall * 100).toFixed(2)}%</td>
                      <td className="py-2.5 px-3 font-bold text-white">{row.f1.toFixed(4)}</td>
                      <td className="py-2.5 px-3 font-bold text-white">{row.roc_auc.toFixed(4)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Deep Explanation of Findings */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded border border-neutral-800 bg-neutral-950 p-4">
              <div className="font-mono text-xs text-neutral-500 uppercase tracking-wider mb-1">
                Temuan 1: Puncak ROC-AUC Red Wine
              </div>
              <h4 className="font-semibold text-white text-sm mb-2">
                Red Wine Mencapai ROC-AUC 0.9519
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Kemampuan pemisahan diskriminatif pada Red Wine sangat superior (AUC &gt; 0.95). Artinya, jika kita mengambil 1 botol premium acak dan 1 botol reguler acak, terdapat peluang 95.19% model memberi skor probabilitas lebih tinggi pada botol premium tersebut.
              </p>
            </div>

            <div className="rounded border border-neutral-800 bg-neutral-950 p-4">
              <div className="font-mono text-xs text-neutral-500 uppercase tracking-wider mb-1">
                Temuan 2: Lonjakan Recall di Model M3
              </div>
              <h4 className="font-semibold text-white text-sm mb-2">
                White Wine Recall Capai 78.30%
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Pada White Wine, penyesuaian threshold dari 0.50 ke 0.43 (M3) melesatkan metrik Recall dari 62.74% menjadi <strong>78.30%</strong>. Model berhasil mengidentifikasi 166 dari 212 botol premium di data uji holdout, menaikkan F1-score menjadi 0.7580.
              </p>
            </div>

            <div className="rounded border border-neutral-800 bg-neutral-950 p-4">
              <div className="font-mono text-xs text-neutral-500 uppercase tracking-wider mb-1">
                Temuan 3: Driver Kunci Lintas Scope
              </div>
              <h4 className="font-semibold text-white text-sm mb-2">
                Alkohol Tetap Tak Tergoyahkan (#1)
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Di semua populasi (Combined, Red, dan White), <strong>Alcohol</strong> mendominasi dengan Gini Importance antara 18.5% s/d 25.0%. Diikuti oleh <strong>Sulphates</strong> pada Red Wine dan <strong>Density</strong> pada White Wine.
              </p>
            </div>
          </div>

          {/* Ranking Top 5 Drivers per Scope */}
          <div className="mt-8 rounded border border-neutral-800 bg-neutral-950 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">
                Peringkat Zat Kimia Penentu Kualitas (Dual Feature Importance)
              </h3>
              <div className="flex gap-1 bg-black p-1 rounded border border-neutral-800 font-mono text-xs">
                {(["Combined", "Red", "White"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveScope(s)}
                    className={`px-3 py-1 rounded transition-colors ${
                      activeScope === s ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {s} Wine
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded border border-neutral-800">
              <table className="w-full text-left font-mono text-xs">
                <thead className="border-b border-neutral-800 bg-neutral-900 font-sans text-neutral-300">
                  <tr>
                    <th className="py-2.5 px-3">Peringkat</th>
                    <th className="py-2.5 px-3">Nama Zat Kimia</th>
                    <th className="py-2.5 px-3 text-white">Gini Importance (Data Latih)</th>
                    <th className="py-2.5 px-3 text-white">Permutation Drop ROC-AUC (Data Uji)</th>
                    <th className="py-2.5 px-3">Tafsiran Makna</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 text-neutral-300">
                  {featureImp
                    .filter((f) => f.scope === activeScope)
                    .sort((a, b) => b.gini - a.gini)
                    .map((item, idx) => (
                      <tr key={item.feature} className="hover:bg-neutral-900/50">
                        <td className="py-2.5 px-3 text-neutral-500 font-bold">#{idx + 1}</td>
                        <td className="py-2.5 px-3 font-sans font-semibold text-white capitalize">
                          {item.feature}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-white">
                          {(item.gini * 100).toFixed(2)}%
                        </td>
                        <td className="py-2.5 px-3 text-neutral-200">
                          -{(item.perm_mean * 100).toFixed(2)}% (±{(item.perm_std * 100).toFixed(1)}%)
                        </td>
                        <td className="py-2.5 px-3 font-sans text-neutral-400 text-[11px]">
                          {idx === 0
                            ? "Prediktor primer: alkohol tinggi mencerminkan kematangan buah sempurna."
                            : idx === 1
                            ? "Prediktor sekunder paling berpengaruh dalam struktur rasa."
                            : "Faktor penyeimbang pendukung stabilitas sensori."}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* BAGIAN 7: DASHBOARD VISUALISASI PUBLIKASI 4-PANEL */}
        {/* ==================================================================== */}
        <section id="dashboard" className="scroll-mt-20 border-t border-neutral-900 pt-12">
          <div className="flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-widest">
            <span>Bagian 07</span>
            <span>/</span>
            <span>Visualisasi Komprehensif</span>
          </div>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-normal text-white">
            7. Dashboard Visualisasi 4-Panel Publikasi (300 DPI)
          </h2>
          <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
            Grafik 4-panel di bawah ini merangkum seluruh hasil pemodelan dan dapat diunduh untuk kebutuhan laporan, skripsi, maupun publikasi makalah ilmiah.
          </p>

          {/* Image Container with subtle border */}
          <div className="mt-8 rounded border border-neutral-800 bg-neutral-950 p-2 sm:p-4 overflow-hidden">
            <div className="relative w-full aspect-[18/13] bg-black rounded overflow-hidden">
              <Image
                src="/wine_random_forest_dashboard.png"
                alt="Dashboard Publikasi 4-Panel Random Forest Wine Quality"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-900 text-xs">
              <div className="text-neutral-400 font-mono">
                File: <span className="text-white">wine_random_forest_dashboard.png</span> (650 KB, 300 DPI)
              </div>
              <a
                href="/wine_random_forest_dashboard.png"
                download="wine_random_forest_dashboard.png"
                className="flex items-center gap-1.5 rounded border border-neutral-700 bg-neutral-900 px-3.5 py-1.5 font-mono text-xs text-white hover:bg-white hover:text-black hover:border-white transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Unduh Gambar Dashboard (PNG Resolusi Penuh)</span>
              </a>
            </div>
          </div>

          {/* Panel by Panel Anatomy */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed text-neutral-400">
            <div className="rounded border border-neutral-800 bg-neutral-950 p-4">
              <div className="font-mono font-bold text-white mb-1">
                Panel A: Grouped Bar Feature Importance
              </div>
              <p>
                Menampilkan perbandingan bobot kepentingan 11 zat kimia di 3 scope (Combined, Red, White). Terlihat jelas bagaimana <em>Alcohol</em> menjadi pemuncak mutlak di seluruh scope, disusul peran spesifik <em>Sulphates</em> yang sangat tinggi di Red Wine dan <em>Density</em> di White Wine.
              </p>
            </div>

            <div className="rounded border border-neutral-800 bg-neutral-950 p-4">
              <div className="font-mono font-bold text-white mb-1">
                Panel B: Kurva ROC-AUC Multi-Line
              </div>
              <p>
                Memplot rasio True Positive Rate terhadap False Positive Rate pada seluruh spektrum ambang batas probabilitas. Garis lengkung yang menempel ke pojok kiri atas membuktikan keunggulan diskriminasi model (Red Wine AUC = 0.952, White Wine AUC = 0.928).
              </p>
            </div>

            <div className="rounded border border-neutral-800 bg-neutral-950 p-4">
              <div className="font-mono font-bold text-white mb-1">
                Panel C: Heatmap Matriks Kebingungan 2x2
              </div>
              <p>
                Menampilkan jumlah riil botol True Negative (TN), False Positive (FP), False Negative (FN), dan True Positive (TP) pada data uji holdout. Sangat sedikit alarm palsu (FP hanya 2 botol di Red Wine).
              </p>
            </div>

            <div className="rounded border border-neutral-800 bg-neutral-950 p-4">
              <div className="font-mono font-bold text-white mb-1">
                Panel D: Komparasi F1-Score Lintas Model
              </div>
              <p>
                Menunjukkan efek langsung optimasi threshold OOF (M3) yang berhasil mengerek F1-score pada White Wine hingga menyentuh 0.758, menyeimbangkan presisi dan kelengkapan tangkapan botol premium.
              </p>
            </div>
          </div>

          {/* Actionable Enology Guide */}
          <div className="mt-8 rounded border border-neutral-800 bg-neutral-950 p-6">
            <h3 className="text-base font-semibold text-white mb-3">
              Rekomendasi Praktis untuk Pembuat Wine (Actionable Enology Guidelines)
            </h3>
            <div className="space-y-3 text-xs leading-relaxed text-neutral-300">
              <p>
                Dari temuan matematis model Random Forest di atas, kepala produksi kilang anggur dapat menerapkan 4 pedoman praktis berikut:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="rounded bg-black p-3.5 border border-neutral-900">
                  <div className="font-mono font-bold text-white mb-1">
                    1. Jaga Kematangan Buah &amp; Alkohol &gt; 11%
                  </div>
                  <p className="text-neutral-400">
                    Pemanenan buah anggur harus dilakukan saat kadar gula alami cukup tinggi untuk menghasilkan alkohol di atas 10.8% - 11.5% tanpa perlu chaptalisasi buatan.
                  </p>
                </div>

                <div className="rounded bg-black p-3.5 border border-neutral-900">
                  <div className="font-mono font-bold text-white mb-1">
                    2. Sanitasi Ketat Tangki Fermentasi
                  </div>
                  <p className="text-neutral-400">
                    Kendalikan pertumbuhan bakteri asam asetat (*Acetobacter*) agar kadar <em>Volatile Acidity</em> tetap di bawah 0.45 g/dm³. Ini mencegah wine beraroma cuka.
                  </p>
                </div>

                <div className="rounded bg-black p-3.5 border border-neutral-900">
                  <div className="font-mono font-bold text-white mb-1">
                    3. Suplementasi Sulfat pada Red Wine
                  </div>
                  <p className="text-neutral-400">
                    Jaga kadar kalium sulfat di atas 0.68 g/dm³ untuk menstabilkan pigmen antosianin dan mempertahankan warna merah marun cerah sepanjang masa penuaan (*aging*).
                  </p>
                </div>

                <div className="rounded bg-black p-3.5 border border-neutral-900">
                  <div className="font-mono font-bold text-white mb-1">
                    4. Minimalkan Klorida &amp; Densitas pada White Wine
                  </div>
                  <p className="text-neutral-400">
                    Gunakan air irigasi non-salin untuk menjaga klorida di bawah 0.040 g/dm³, dan pastikan fermentasi tuntas agar densitas berada di bawah 0.993 g/cm³.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* BAGIAN 8: SKRIP PYTHON & GOOGLE COLAB REPRODUCIBILITY */}
        {/* ==================================================================== */}
        <section id="colab-script" className="scroll-mt-20 border-t border-neutral-900 pt-12 pb-8">
          <div className="flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-widest">
            <span>Bagian 08</span>
            <span>/</span>
            <span>Reproduksibilitas Kode</span>
          </div>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-normal text-white">
            8. Skrip Python Mandiri &amp; Petunjuk Eksekusi Google Colab
          </h2>
          <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
            Seluruh pipeline pelatihan, evaluasi, hingga pembuatan dashboard gambar telah dikemas ke dalam satu file mandiri <strong>`random_forest_colab.py`</strong> dan notebook <strong>`wine_quality_random_forest.ipynb`</strong>.
          </p>

          {/* Quick Colab Run Guide */}
          <div className="mt-6 rounded border border-neutral-800 bg-neutral-950 p-6">
            <h3 className="text-base font-semibold text-white mb-2">
              Cara Menjalankan di Google Colab (Hanya Butuh 2 Langkah):
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-xs text-neutral-300 pl-1">
              <li>
                Buka <a href="https://colab.research.google.com/" target="_blank" rel="noreferrer" className="text-white underline">Google Colab</a> dan buat <em>New Notebook</em>.
              </li>
              <li>
                Salin dan jalankan kode di bawah ini, atau upload file <code>random_forest_colab.py</code> lalu jalankan <code>%run random_forest_colab.py</code>. Skrip akan otomatis mengunduh dataset resmi dari UCI tanpa perlu upload CSV manual!
              </li>
            </ol>

            {/* Code Box */}
            <div className="mt-4 relative rounded border border-neutral-800 bg-black p-4 font-mono text-xs text-neutral-300">
              <button
                onClick={copyColabCode}
                className="absolute top-3 right-3 flex items-center gap-1 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-[11px] text-neutral-300 hover:bg-white hover:text-black transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Tersalin!" : "Salin Perintah"}</span>
              </button>

              <pre className="overflow-x-auto text-neutral-400">
                <code>{`# 1. Unduh script self-contained dari repositori
!curl -O https://raw.githubusercontent.com/rezar/wine-quality-random-forest/main/random_forest_colab.py

# 2. Jalankan skrip (otomatis mendownload dataset UCI, melatih 9 model, dan menggambar grafik)
%run random_forest_colab.py`}</code>
              </pre>
            </div>
          </div>

          {/* Summary Checklist */}
          <div className="mt-8 rounded border border-neutral-900 bg-neutral-950/40 p-5">
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Daftar Verifikasi Akhir Pipeline:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-400 font-sans">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0" />
                <span>Zero Data Leakage (Stratified 80/20 train-test)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0" />
                <span>Tanpa SMOTE (Biokimia asli tetap terjaga)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0" />
                <span>Evaluasi 3 Scope (Anti Simpson&apos;s Paradox)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0" />
                <span>Dual Feature Importance (Gini &amp; Permutation)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0" />
                <span>Optimasi Threshold OOF bebas kebocoran</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0" />
                <span>Ekspor CSV &amp; Gambar Publikasi 300 DPI</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
