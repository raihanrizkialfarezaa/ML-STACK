"use client";

import { useState, useMemo } from "react";
import { ROCCurvePoint, RFModelMetric } from "@/types";

interface RocChartProps {
  points: ROCCurvePoint[];
  metrics: RFModelMetric[];
}

export function RocChart({ points, metrics }: RocChartProps) {
  const [selectedScope, setSelectedScope] = useState<string>("all");
  const [selectedModel, setSelectedModel] = useState<string>("M2_Tuned_CostSensitive");
  const [hoveredPoint, setHoveredPoint] = useState<{
    fpr: number;
    tpr: number;
    scope: string;
  } | null>(null);

  const scopes = ["Combined", "Red", "White"];
  const colors: Record<string, string> = {
    Combined: "#a855f7", // purple
    Red: "#ef4444", // red
    White: "#f59e0b", // amber/gold
  };

  const filteredLines = useMemo(() => {
    return scopes.map((scope) => {
      const scopePoints = points
        .filter((p) => p.scope === scope && p.model === selectedModel)
        .sort((a, b) => a.fpr - b.fpr);

      const metric = metrics.find(
        (m) => m.scope === scope && m.model === selectedModel
      );

      return {
        scope,
        points: scopePoints,
        auc: metric ? metric.roc_auc : 0,
        color: colors[scope],
      };
    });
  }, [points, metrics, selectedModel]);

  // SVG coordinate conversions (viewbox 0 0 500 500, with padding)
  const pad = 50;
  const size = 400;

  const toSvgX = (fpr: number) => pad + fpr * size;
  const toSvgY = (tpr: number) => pad + size - tpr * size;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Kurva ROC (Receiver Operating Characteristic)</span>
            <span className="text-xs font-normal text-slate-400">
              Evaluasi Test Holdout (20%)
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Mengukur kemampuan model memisahkan wine kualitas tinggi (≥7) dari wine reguler pada semua ambang probabilitas.
          </p>
        </div>

        {/* Model Filter */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "M1_Baseline", label: "M1 Baseline" },
            { id: "M2_Tuned_CostSensitive", label: "M2 Cost-Sensitive" },
            { id: "M3_ThresholdOptimized", label: "M3 Optimized" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModel(m.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                selectedModel === m.id
                  ? "bg-rose-900 text-rose-100 border border-rose-700"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative flex justify-center">
        <svg
          viewBox="0 0 500 500"
          className="w-full max-w-[480px] h-auto select-none"
        >
          {/* Grid lines */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((val) => (
            <g key={val}>
              {/* Horizontal */}
              <line
                x1={pad}
                y1={toSvgY(val)}
                x2={pad + size}
                y2={toSvgY(val)}
                stroke="#1e293b"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={pad - 10}
                y={toSvgY(val) + 4}
                fill="#64748b"
                fontSize="10"
                textAnchor="end"
                fontFamily="sans-serif"
              >
                {val.toFixed(1)}
              </text>

              {/* Vertical */}
              <line
                x1={toSvgX(val)}
                y1={pad}
                x2={toSvgX(val)}
                y2={pad + size}
                stroke="#1e293b"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={toSvgX(val)}
                y={pad + size + 18}
                fill="#64748b"
                fontSize="10"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                {val.toFixed(1)}
              </text>
            </g>
          ))}

          {/* Diagonal Random Guess line */}
          <line
            x1={toSvgX(0)}
            y1={toSvgY(0)}
            x2={toSvgX(1)}
            y2={toSvgY(1)}
            stroke="#475569"
            strokeDasharray="6 6"
            strokeWidth="1.5"
          />
          <text
            x={toSvgX(0.7)}
            y={toSvgY(0.75)}
            fill="#64748b"
            fontSize="9"
            fontStyle="italic"
            transform={`rotate(-45, ${toSvgX(0.7)}, ${toSvgY(0.75)})`}
          >
            Tebakan Acak (AUC = 0.50)
          </text>

          {/* ROC Curves */}
          {filteredLines.map((line) => {
            if (line.points.length === 0) return null;
            if (selectedScope !== "all" && selectedScope !== line.scope) return null;

            const pathD = line.points
              .map((p, idx) => `${idx === 0 ? "M" : "L"} ${toSvgX(p.fpr)} ${toSvgY(p.tpr)}`)
              .join(" ");

            return (
              <path
                key={line.scope}
                d={pathD}
                fill="none"
                stroke={line.color}
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 drop-shadow"
              />
            );
          })}

          {/* Interactive transparent overlay for hover */}
          <rect
            x={pad}
            y={pad}
            width={size}
            height={size}
            fill="transparent"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const svgX = ((e.clientX - rect.left) / rect.width) * 500;
              const fprVal = Math.max(0, Math.min(1, (svgX - pad) / size));

              // Find closest point in first visible scope
              const targetScope = selectedScope === "all" ? "Red" : selectedScope;
              const line = filteredLines.find((l) => l.scope === targetScope);
              if (line && line.points.length > 0) {
                let closest = line.points[0];
                let minDiff = Infinity;
                for (const p of line.points) {
                  const diff = Math.abs(p.fpr - fprVal);
                  if (diff < minDiff) {
                    minDiff = diff;
                    closest = p;
                  }
                }
                setHoveredPoint({ fpr: closest.fpr, tpr: closest.tpr, scope: line.scope });
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
          />

          {/* Hover indicator dot */}
          {hoveredPoint && (
            <circle
              cx={toSvgX(hoveredPoint.fpr)}
              cy={toSvgY(hoveredPoint.tpr)}
              r="5"
              fill={colors[hoveredPoint.scope]}
              stroke="#ffffff"
              strokeWidth="2"
            />
          )}

          {/* Axis Labels */}
          <text
            x={pad + size / 2}
            y={pad + size + 40}
            fill="#94a3b8"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
          >
            False Positive Rate (1 - Specificity)
          </text>
          <text
            x={-pad - size / 2}
            y={15}
            fill="#94a3b8"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            transform="rotate(-90)"
          >
            True Positive Rate (Recall / Sensitivity)
          </text>
        </svg>
      </div>

      {/* Legend & AUC Summary */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t border-slate-900 pt-4 text-xs">
        <button
          onClick={() => setSelectedScope("all")}
          className={`px-2 py-1 rounded text-xs transition-colors ${
            selectedScope === "all" ? "text-white font-bold bg-slate-800" : "text-slate-400"
          }`}
        >
          Tampilkan Semua
        </button>
        {filteredLines.map((line) => (
          <button
            key={line.scope}
            onClick={() => setSelectedScope(line.scope)}
            className={`flex items-center gap-2 px-2 py-1 rounded transition-colors ${
              selectedScope === line.scope
                ? "bg-slate-800 text-white font-bold"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: line.color }}
            />
            <span>
              {line.scope} Wine:{" "}
              <strong className="text-white font-mono">
                AUC = {line.auc.toFixed(3)}
              </strong>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
