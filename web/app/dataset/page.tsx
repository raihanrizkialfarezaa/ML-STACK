"use client";

import { wineData, FEATURE_INFO } from "@/lib/data";
import {
  Database,
  FileSpreadsheet,
  AlertCircle,
  FlaskConical,
  CheckCircle2,
  Download,
  Info,
} from "lucide-react";

export default function DatasetPage() {
  const targetDist = wineData.target_distribution;
  const duplicates = wineData.duplicate_summary;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="border-b border-rose-950/40 pb-6 mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-300 border border-rose-500/30">
              <Database className="h-3.5 w-3.5 text-rose-400" />
              Dataset &amp; Kimia Wine
            </span>
            <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
              UCI Machine Learning Repository
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Eksplorasi Dataset &amp; 11 Fitur Fisikokimia
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
            Data berasal dari sampel varian wine <em>Vinho Verde</em> dari Portugal utara (Cortez et al., 2009). Memiliki 11 pengukuran laboratorium objektif dan 1 skor kualitas sensorik subyektif dari panelis sommelier ahli.
          </p>

          {/* Quick Stats Grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-xs text-slate-400 font-medium">Red Wine Samples</div>
              <div className="text-xl font-bold text-rose-400 font-mono mt-1">1.599</div>
              <div className="text-[10px] text-slate-500 mt-0.5">217 Premium (13.57%)</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-xs text-slate-400 font-medium">White Wine Samples</div>
              <div className="text-xl font-bold text-amber-300 font-mono mt-1">4.898</div>
              <div className="text-[10px] text-slate-500 mt-0.5">1.060 Premium (21.64%)</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-xs text-slate-400 font-medium">Nilai Kosong (Missing)</div>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-1">0 (Bersih)</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Tanpa Imputasi Sintetik</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-xs text-slate-400 font-medium">Format Delimiter</div>
              <div className="text-xl font-bold text-slate-200 font-mono mt-1">Semicolon (;)</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Standard European CSV</div>
            </div>
          </div>
        </div>

        {/* 11 Chemical Features Guide */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">
              Kamus 11 Zat Fisikokimia &amp; Sensori Rasa Wine
            </h2>
          </div>
          <p className="text-xs text-slate-400 mb-6 max-w-3xl">
            Memahami fungsi kimiawi dan biologis dari masing-masing variabel membantu kita mengerti mengapa model Random Forest dan Association Rules memilih kombinasi zat tersebut.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(FEATURE_INFO).map(([key, info]) => (
              <div
                key={key}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5 hover:border-slate-700 transition-colors flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-white capitalize">
                      {key}
                    </span>
                    <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-mono text-amber-300 border border-slate-800">
                      {info.unit}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-rose-300 mb-2">
                    {info.nameId}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {info.description}
                  </p>
                  <div className="rounded-xl bg-slate-900/70 border border-slate-800/80 p-3 text-xs text-slate-400 mb-3">
                    <strong className="text-slate-200">Sensasi di Lidah:</strong>{" "}
                    {info.layman}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-900 text-[11px] text-slate-400">
                  <span className="text-slate-300 font-medium">Pengaruh ke Model:</span>{" "}
                  {info.impact}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Target Distribution & Class Imbalance */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <FileSpreadsheet className="h-5 w-5 text-rose-400" />
            <h2 className="text-xl font-bold text-white">
              Distribusi Kelas Kualitas &amp; Formulasi Target
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-3">
                Distribusi Kategori 3-Tier &amp; Biner High Quality
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-800/80">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400">
                    <tr>
                      <th className="py-2.5 px-3 font-sans">Scope</th>
                      <th className="py-2.5 px-3">Total (N)</th>
                      <th className="py-2.5 px-3">Low (≤5)</th>
                      <th className="py-2.5 px-3">Med (=6)</th>
                      <th className="py-2.5 px-3 text-amber-300">High (≥7)</th>
                      <th className="py-2.5 px-3 text-rose-300">% Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {targetDist.map((row) => (
                      <tr key={row.scope} className="hover:bg-slate-900/50">
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-200">
                          {row.scope}
                        </td>
                        <td className="py-2.5 px-3">{row.n_rows.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-rose-400">{row.tier_low}</td>
                        <td className="py-2.5 px-3 text-slate-400">{row.tier_med}</td>
                        <td className="py-2.5 px-3 font-bold text-amber-300">
                          {row.tier_high}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-white">
                          {row.quality_high_pct.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-xs text-slate-400 leading-relaxed space-y-1">
                <p>
                  • <strong>Target Biner (Random Forest):</strong> <code>high_quality = 1</code> jika skor ≥ 7 (Premium), dan <code>0</code> jika skor ≤ 6 (Reguler).
                </p>
                <p>
                  • <strong>Target 3-Tier (Association Rules):</strong> <code>Quality=High</code> (≥ 7), <code>Quality=Med</code> (= 6), dan <code>Quality=Low</code> (≤ 5).
                </p>
              </div>
            </div>

            {/* Imbalance explanation card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-2">
                  <Info className="h-4 w-4" />
                  <span>Karakteristik Ketidakseimbangan (Class Imbalance)</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  Mengapa Distribusi Ini Menantang?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Skor kualitas wine diberikan oleh juri dalam rentang diskrit 0 s/d 10. Namun dalam data riil, skor paling rendah adalah <strong>3</strong> dan paling tinggi adalah <strong>9</strong> (tidak ada wine bernilai 0, 1, 2, atau 10).
                </p>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Mayoritas botol terkonsentrasi di skor rata-rata <strong>5</strong> dan <strong>6</strong>. Wine yang sangat istimewa (skor 7, 8, 9) sangat langka, terutama pada Red Wine di mana hanya 13.57% sampel yang berkualitas tinggi.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-400">
                🛡️ <strong>Mitigasi Data Leakage:</strong> Kami menggunakan <em>Stratified Splitting</em> pada 80% train / 20% test, sehingga rasio kelas premium tetap terjaga persis sama di data latihan dan data uji.
              </div>
            </div>
          </div>
        </section>

        {/* Duplicate Rows Transparency */}
        <section className="mb-12">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Transparansi Ilmiah: Audit 1.177 Baris Duplikat (18.11%)
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Dalam repositori UCI Machine Learning Wine Quality, terdapat baris yang memiliki nilai fisikokimia dan skor kualitas yang identik 100%. Berikut rinciannya:
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-800/80 mb-4">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400">
                  <tr>
                    <th className="py-2 px-3 font-sans">Scope</th>
                    <th className="py-2 px-3">Total Baris</th>
                    <th className="py-2 px-3 text-amber-300">Baris Duplikat Eksak</th>
                    <th className="py-2 px-3 text-rose-300">Persentase Duplikat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {duplicates.map((d) => (
                    <tr key={d.scope} className="hover:bg-slate-900/50">
                      <td className="py-2 px-3 font-sans font-bold text-slate-200">
                        {d.scope}
                      </td>
                      <td className="py-2 px-3">{d.n_rows.toLocaleString()}</td>
                      <td className="py-2 px-3 text-amber-300">{d.duplicate_rows}</td>
                      <td className="py-2 px-3 font-bold text-white">
                        {d.duplicate_pct.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-xs text-slate-400 leading-relaxed space-y-1.5">
              <p>
                <strong>Mengapa baris duplikat ini dipertahankan?</strong> Spesifikasi penugasan dan standar benchmark UCI mensyaratkan penggunaan keseluruhan korpus (N = 6.497). Menghapus baris duplikat secara sepihak akan mengubah distribusi data benchmark.
              </p>
              <p>
                <strong>Dampak Metodologis:</strong> Baris duplikat dapat sedikit meningkatkan nilai Support pada Association Rules. Namun berkat <strong>protokol holdout re-scoring kami</strong>, aturan tetap divalidasi pada partisi test yang terpisah.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
