"use client";

import { useState } from "react";
import { FeatureImportance } from "@/types";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface FeatureImportanceBarProps {
  importance: FeatureImportance[];
}

export function FeatureImportanceBar({ importance }: FeatureImportanceBarProps) {
  const [selectedScope, setSelectedScope] = useState<string>("Red");
  const [metricType, setMetricType] = useState<"gini" | "perm_mean">("gini");

  const scopeData = importance
    .filter((item) => item.scope === selectedScope)
    .sort((a, b) => (metricType === "gini" ? b.gini - a.gini : b.perm_mean - a.perm_mean));

  const maxVal = Math.max(
    ...scopeData.map((d) => (metricType === "gini" ? d.gini : d.perm_mean)),
    0.01
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Peringkat Kepentingan Fitur (Feature Importance)</span>
            <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-semibold text-rose-300">
              Random Forest
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Menentukan 6 zat kimia paling berpengaruh yang akan diekstraksi ke tahap Association Rule Mining.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Scope Selector */}
          <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-0.5">
            {["Combined", "Red", "White"].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedScope(s)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                  selectedScope === s
                    ? "bg-rose-900 text-white font-semibold shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {s} Wine
              </button>
            ))}
          </div>

          {/* Metric Selector */}
          <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-0.5">
            <button
              onClick={() => setMetricType("gini")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                metricType === "gini"
                  ? "bg-amber-600 text-white font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Gini Importance
            </button>
            <button
              onClick={() => setMetricType("perm_mean")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                metricType === "perm_mean"
                  ? "bg-amber-600 text-white font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Permutation Importance
            </button>
          </div>
        </div>
      </div>

      {/* Bars List */}
      <div className="space-y-3">
        {scopeData.map((item, idx) => {
          const val = metricType === "gini" ? item.gini : item.perm_mean;
          const pct = Math.max(2, (val / maxVal) * 100);
          const isSelected = item.selected_top6;

          return (
            <div key={item.feature} className="group">
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 text-right font-mono text-slate-500 text-[11px]">
                    #{idx + 1}
                  </span>
                  <span
                    className={`font-semibold capitalize ${
                      isSelected ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {item.feature}
                  </span>
                  {isSelected && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-500/20 px-2 py-0.2 text-[9px] font-semibold text-rose-300 border border-rose-500/30">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Top 6 Terpilih
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-400 text-[11px]">
                    Gini: <strong className="text-slate-200">{item.gini.toFixed(4)}</strong>
                  </span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-400 text-[11px]">
                    Perm:{" "}
                    <strong className="text-amber-300">
                      {item.perm_mean.toFixed(4)}
                    </strong>
                    <span className="text-slate-500 text-[10px]">
                      (±{item.perm_std.toFixed(3)})
                    </span>
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-900 border border-slate-800/80">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isSelected
                      ? "bg-gradient-to-r from-rose-700 via-rose-500 to-amber-500 shadow-sm"
                      : "bg-slate-700"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanatory footer */}
      <div className="mt-6 rounded-xl bg-slate-900/60 border border-slate-800 p-3.5 text-xs text-slate-400 flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200">
            Mengapa Memilih Top 6 Berdasarkan Training Gini?
          </strong>{" "}
          Gini importance dihitung dari pengurangan impurity selama pohon keputusan tumbuh pada data training saja. Ini memastikan seleksi fitur bersifat independen dan <em>Zero Data Leakage</em>, menjaga partisi test tetap murni untuk validasi holdout di tahap Association Rules.
        </div>
      </div>
    </div>
  );
}
