"use client";

import { useState } from "react";
import { ConfusionMatrixItem } from "@/types";

interface ConfusionMatrixViewProps {
  matrices: ConfusionMatrixItem[];
}

export function ConfusionMatrixView({ matrices }: ConfusionMatrixViewProps) {
  const [scope, setScope] = useState<string>("Red");
  const [model, setModel] = useState<string>("M2_Tuned_CostSensitive");

  const current = matrices.find(
    (m) => m.scope === scope && m.model === model
  ) || matrices[0];

  if (!current) return null;

  const { true_negative, false_positive, false_negative, true_positive, n_test } = current;

  // Derived metrics
  const accuracy = (true_positive + true_negative) / n_test;
  const precision =
    true_positive + false_positive > 0
      ? true_positive / (true_positive + false_positive)
      : 0;
  const recall =
    true_positive + false_negative > 0
      ? true_positive / (true_positive + false_negative)
      : 0;
  const specificity =
    true_negative + false_positive > 0
      ? true_negative / (true_negative + false_positive)
      : 0;
  const f1 =
    precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Matriks Kebingungan (Confusion Matrix)</span>
            <span className="text-xs font-normal text-slate-400">
              Evaluasi Klasifikasi Holdout Test (N = {n_test})
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Menganalisis jenis kesalahan prediksi: False Positive (alarm palsu) vs False Negative (wine bagus terlewat).
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="Combined">Combined Wine (N=1300)</option>
            <option value="Red">Red Wine (N=320)</option>
            <option value="White">White Wine (N=980)</option>
          </select>

          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="M1_Baseline">M1: Baseline (Cutoff 0.50)</option>
            <option value="M2_Tuned_CostSensitive">M2: Cost-Sensitive (Cutoff 0.50)</option>
            <option value="M3_ThresholdOptimized">M3: OOF Optimized (Cutoff {current.threshold.toFixed(2)})</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* 2x2 Matrix Grid */}
        <div className="flex flex-col items-center">
          <div className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider text-center">
            Prediksi Model (Predicted Class)
          </div>

          <div className="flex items-center gap-2">
            <div className="writing-mode-vertical text-[11px] font-bold text-slate-400 uppercase tracking-wider -rotate-90 select-none">
              Kenyataan (True)
            </div>

            <div className="grid grid-cols-2 gap-2.5 w-full max-w-[320px]">
              {/* Header labels */}
              <div className="text-center text-[11px] font-medium text-slate-400 pb-1">
                Prediksi: Reguler (0)
              </div>
              <div className="text-center text-[11px] font-medium text-rose-300 pb-1 font-semibold">
                Prediksi: Premium (1)
              </div>

              {/* Row 1: True Regular */}
              <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/40 p-4 text-center">
                <div className="text-xs text-emerald-400 font-semibold mb-1">
                  True Negative (TN)
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {true_negative}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Wine reguler ditebak reguler
                </div>
              </div>

              <div className="rounded-xl border border-amber-900/60 bg-amber-950/40 p-4 text-center">
                <div className="text-xs text-amber-400 font-semibold mb-1">
                  False Positive (FP)
                </div>
                <div className="text-2xl font-extrabold text-amber-200 font-mono">
                  {false_positive}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Reguler salah dikira premium
                </div>
              </div>

              {/* Row 2: True Premium */}
              <div className="rounded-xl border border-rose-900/60 bg-rose-950/40 p-4 text-center">
                <div className="text-xs text-rose-400 font-semibold mb-1">
                  False Negative (FN)
                </div>
                <div className="text-2xl font-extrabold text-rose-300 font-mono">
                  {false_negative}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Premium terlewat (ditebak biasa)
                </div>
              </div>

              <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/40 p-4 text-center">
                <div className="text-xs text-emerald-400 font-semibold mb-1">
                  True Positive (TP)
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {true_positive}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Wine premium berhasil ditangkap!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Derived Statistics Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
            <div className="text-xs text-slate-400 font-medium">Akurasi Global</div>
            <div className="mt-1 text-xl font-bold text-white font-mono">
              {(accuracy * 100).toFixed(2)}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              (TP + TN) / Total Sampel
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
            <div className="text-xs text-slate-400 font-medium">Presisi Premium</div>
            <div className="mt-1 text-xl font-bold text-amber-300 font-mono">
              {(precision * 100).toFixed(2)}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              TP / (TP + FP)
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
            <div className="text-xs text-slate-400 font-medium">Recall (Sensitivitas)</div>
            <div className="mt-1 text-xl font-bold text-rose-300 font-mono">
              {(recall * 100).toFixed(2)}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              TP / (TP + FN)
            </div>
          </div>

          <div className="rounded-xl border border-rose-950 bg-rose-950/30 p-3.5 border">
            <div className="text-xs text-rose-300 font-semibold">F1-Score Minoritas</div>
            <div className="mt-1 text-xl font-extrabold text-rose-200 font-mono">
              {f1.toFixed(4)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Harmonic Mean Presisi &amp; Recall
            </div>
          </div>

          <div className="col-span-2 rounded-xl bg-slate-900/80 border border-slate-800 p-3 text-xs text-slate-400">
            🔎 <strong className="text-slate-200">Interpretasi Lapangan:</strong> Model{" "}
            <span className="text-rose-300 font-semibold">{model}</span> pada scope{" "}
            <span className="text-white font-semibold">{scope}</span> berhasil menangkap{" "}
            <strong className="text-emerald-400 font-mono">{true_positive}</strong> dari{" "}
            {true_positive + false_negative} total botol wine premium yang ada di data test.
          </div>
        </div>
      </div>
    </div>
  );
}
