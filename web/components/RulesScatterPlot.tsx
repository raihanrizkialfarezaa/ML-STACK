"use client";

import { useState } from "react";
import { AssociationRule } from "@/types";

interface RulesScatterPlotProps {
  rules: AssociationRule[];
}

export function RulesScatterPlot({ rules }: RulesScatterPlotProps) {
  const [selectedScope, setSelectedScope] = useState<string>("Combined");
  const [hoveredRule, setHoveredRule] = useState<AssociationRule | null>(null);

  const scopeRules = rules.filter(
    (r) => selectedScope === "all" || r.scope === selectedScope
  );

  // SVG configuration
  const pad = 50;
  const size = 380;

  // Domain calculation
  const minSup = Math.min(...rules.map((r) => r.support), 0.02);
  const maxSup = Math.max(...rules.map((r) => r.support), 0.12);
  const minConf = Math.min(...rules.map((r) => r.confidence), 0.45);
  const maxConf = Math.max(...rules.map((r) => r.confidence), 0.95);

  const toX = (s: number) => pad + ((s - minSup) / (maxSup - minSup)) * size;
  const toY = (c: number) => pad + size - ((c - minConf) / (maxConf - minConf)) * size;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Bubble Scatter Plot: Support vs Confidence</span>
            <span className="text-xs font-normal text-slate-400">
              Ukuran &amp; Warna = Nilai Lift
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Menganalisis seberapa sering aturan muncul (Support) versus seberapa pasti aturan tersebut benar (Confidence).
          </p>
        </div>

        <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-0.5">
          {["Combined", "Red", "White", "all"].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedScope(s)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                selectedScope === s
                  ? "bg-rose-900 text-white font-semibold shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {s === "all" ? "Semua" : `${s}`}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex flex-col items-center">
        <svg
          viewBox="0 0 480 460"
          className="w-full max-w-[460px] h-auto select-none"
        >
          {/* Grid lines */}
          {[0.03, 0.05, 0.07, 0.09, 0.11].map((s) => (
            <g key={s}>
              <line
                x1={toX(s)}
                y1={pad}
                x2={toX(s)}
                y2={pad + size}
                stroke="#1e293b"
                strokeDasharray="3 3"
              />
              <text
                x={toX(s)}
                y={pad + size + 16}
                fill="#64748b"
                fontSize="9"
                textAnchor="middle"
              >
                {(s * 100).toFixed(1)}%
              </text>
            </g>
          ))}

          {[0.5, 0.6, 0.7, 0.8, 0.9].map((c) => (
            <g key={c}>
              <line
                x1={pad}
                y1={toY(c)}
                x2={pad + size}
                y2={toY(c)}
                stroke="#1e293b"
                strokeDasharray="3 3"
              />
              <text
                x={pad - 8}
                y={toY(c) + 3}
                fill="#64748b"
                fontSize="9"
                textAnchor="end"
              >
                {(c * 100).toFixed(0)}%
              </text>
            </g>
          ))}

          {/* Bubbles */}
          {scopeRules.map((r) => {
            const isHigh = r.consequent_tier === "High";
            const cx = toX(r.support);
            const cy = toY(r.confidence);
            const radius = Math.max(5, Math.min(18, r.lift * 3.5));

            return (
              <g
                key={r.rule_id}
                onMouseEnter={() => setHoveredRule(r)}
                className="cursor-pointer transition-transform hover:opacity-100"
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill={isHigh ? "#10b981" : "#ef4444"}
                  fillOpacity={0.65}
                  stroke={isHigh ? "#34d399" : "#f87171"}
                  strokeWidth="1.5"
                  className="hover:stroke-white hover:stroke-2"
                />
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={pad + size / 2}
            y={pad + size + 35}
            fill="#94a3b8"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
          >
            Support (Frekuensi Kemunculan Aturan)
          </text>
          <text
            x={-pad - size / 2}
            y={15}
            fill="#94a3b8"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
            transform="rotate(-90)"
          >
            Confidence (Tingkat Kepastian / Akurasi Aturan)
          </text>
        </svg>

        {/* Hover detail card */}
        <div className="w-full mt-3 min-h-[70px] rounded-xl bg-slate-900/80 border border-slate-800 p-3 text-xs">
          {hoveredRule ? (
            <div>
              <div className="flex items-center justify-between text-slate-300 font-mono text-[11px] mb-1">
                <span className="font-bold text-amber-300">
                  {hoveredRule.rule_id} ({hoveredRule.scope} Wine)
                </span>
                <span className="text-emerald-400 font-bold">
                  Lift: {hoveredRule.lift.toFixed(2)}x
                </span>
              </div>
              <div className="text-white font-medium">
                {hoveredRule.rule}
              </div>
              <div className="flex gap-4 mt-1 text-[11px] text-slate-400">
                <span>Support: {(hoveredRule.support * 100).toFixed(2)}%</span>
                <span>Confidence: {(hoveredRule.confidence * 100).toFixed(2)}%</span>
                <span>
                  Holdout Pass:{" "}
                  <strong
                    className={
                      hoveredRule.holdout_pass ? "text-emerald-400" : "text-amber-400"
                    }
                  >
                    {hoveredRule.holdout_pass ? "Ya" : "Hanya Train"}
                  </strong>
                </span>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 italic text-center py-2">
              Arahkan kursor pada lingkaran (bubble) untuk melihat rincian aturan asosiasi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
