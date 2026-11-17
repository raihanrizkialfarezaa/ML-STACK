"use client";

import { useState } from "react";
import { BinningBoundary } from "@/types";

interface BinningViewerProps {
  boundaries: BinningBoundary[];
}

export function BinningViewer({ boundaries }: BinningViewerProps) {
  const [scope, setScope] = useState<string>("Red");

  const filtered = boundaries.filter((b) => b.scope === scope);

  // Group by feature
  const features = Array.from(new Set(filtered.map((b) => b.feature)));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Batas Numerik Diskritisasi (Quantile Tertile Binning)</span>
            <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-semibold text-rose-300">
              Low / Med / High
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Batas angka riil yang dihasilkan dari data training untuk mengubah angka kontinu menjadi kategori diskrit.
          </p>
        </div>

        {/* Scope Selector */}
        <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-0.5">
          {["Combined", "Red", "White"].map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                scope === s
                  ? "bg-rose-900 text-white font-semibold shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {s} Wine
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feat) => {
          const bins = filtered.filter((b) => b.feature === feat);
          return (
            <div
              key={feat}
              className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 hover:border-slate-700 transition-colors"
            >
              <div className="text-xs font-bold text-slate-200 capitalize mb-2">
                {feat}
              </div>
              <div className="space-y-1.5">
                {bins.map((b) => {
                  const isHigh = b.bin === "High";
                  const isLow = b.bin === "Low";
                  const badgeColor = isHigh
                    ? "text-emerald-400 bg-emerald-950/60 border-emerald-800/50"
                    : isLow
                    ? "text-rose-400 bg-rose-950/60 border-rose-800/50"
                    : "text-amber-400 bg-amber-950/60 border-amber-800/50";

                  const lowStr = b.lower_bound === "-inf" ? "≤" : `> ${b.lower_bound}`;
                  const highStr = b.upper_bound === "inf" ? "" : ` s/d ${b.upper_bound}`;

                  return (
                    <div
                      key={b.bin}
                      className="flex items-center justify-between text-xs rounded-lg bg-slate-950/60 px-2.5 py-1.5 border border-slate-900"
                    >
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold border ${badgeColor}`}
                      >
                        {b.bin}
                      </span>
                      <span className="font-mono text-slate-300 text-[11px]">
                        {lowStr}
                        {highStr}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {b.n_train} sampel
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
