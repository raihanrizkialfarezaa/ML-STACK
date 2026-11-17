"use client";

import { useState, useMemo } from "react";
import { AssociationRule } from "@/types";
import { Search, ShieldCheck, AlertCircle, ArrowUpDown } from "lucide-react";

interface RulesTableProps {
  rules: AssociationRule[];
  defaultScope?: string;
  defaultTier?: string;
}

export function RulesTable({
  rules,
  defaultScope = "all",
  defaultTier = "all",
}: RulesTableProps) {
  const [scopeFilter, setScopeFilter] = useState<string>(defaultScope);
  const [tierFilter, setTierFilter] = useState<string>(defaultTier);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"lift" | "confidence" | "support">("lift");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [onlyHoldoutPass, setOnlyHoldoutPass] = useState<boolean>(false);

  const filteredRules = useMemo(() => {
    return rules
      .filter((r) => {
        if (scopeFilter !== "all" && r.scope !== scopeFilter) return false;
        if (tierFilter !== "all" && r.consequent_tier !== tierFilter) return false;
        if (onlyHoldoutPass && !r.holdout_pass) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            r.antecedents.toLowerCase().includes(q) ||
            r.rule_id.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
        return sortOrder === "desc" ? valB - valA : valA - valB;
      });
  }, [rules, scopeFilter, tierFilter, searchQuery, sortBy, sortOrder, onlyHoldoutPass]);

  const toggleSort = (field: "lift" | "confidence" | "support") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Eksplorer Aturan Asosiasi (Association Rules Browser)</span>
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-mono text-slate-300">
                {filteredRules.length} Aturan Ditemukan
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Aturan bersyarat pola <em>Jika (Antecedent) Maka (Consequent)</em> yang ditambang dengan FP-Growth.
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-slate-900">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Cari zat (misal: alcohol, sulphates)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Scope */}
          <div>
            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="all">Semua Scope (Combined + Red + White)</option>
              <option value="Combined">Combined Wine (6 rules H, 7 rules L)</option>
              <option value="Red">Red Wine Only (6 rules H, 7 rules L)</option>
              <option value="White">White Wine Only (21 rules H, 7 rules L)</option>
            </select>
          </div>

          {/* Target Consequent */}
          <div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="all">Semua Target Kualitas</option>
              <option value="High">Target: Quality=High (≥ 7)</option>
              <option value="Low">Target: Quality=Low (≤ 5)</option>
            </select>
          </div>

          {/* Holdout Toggle */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyHoldoutPass}
                onChange={(e) => setOnlyHoldoutPass(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-rose-600 focus:ring-0"
              />
              <span>Hanya yang Lolos Holdout Test (41/54)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400">
            <tr>
              <th className="py-2.5 px-3 font-mono font-medium">ID &amp; Scope</th>
              <th className="py-2.5 px-3 font-medium">Kondisi (Antecedents)</th>
              <th className="py-2.5 px-3 font-medium">Hasil (Consequent)</th>
              <th
                onClick={() => toggleSort("support")}
                className="py-2.5 px-3 font-medium cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Support</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => toggleSort("confidence")}
                className="py-2.5 px-3 font-medium cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Confidence</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => toggleSort("lift")}
                className="py-2.5 px-3 font-medium cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Lift Ratio</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-medium">Holdout Test</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredRules.map((rule) => {
              const isHigh = rule.consequent_tier === "High";

              return (
                <tr key={rule.rule_id} className="hover:bg-slate-900/60 transition-colors">
                  {/* ID & Scope */}
                  <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                    <span className="font-semibold text-slate-200">
                      {rule.rule_id}
                    </span>
                    <div className="text-[10px] text-slate-500">{rule.scope} Wine</div>
                  </td>

                  {/* Antecedents */}
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1 items-center">
                      {rule.antecedents.split(" & ").map((item, i) => {
                        const [feat, val] = item.split("=");
                        const colorClass =
                          val === "High"
                            ? "bg-emerald-950/70 text-emerald-300 border-emerald-800/50"
                            : val === "Low"
                            ? "bg-rose-950/70 text-rose-300 border-rose-800/50"
                            : "bg-amber-950/70 text-amber-300 border-amber-800/50";

                        return (
                          <span
                            key={i}
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono border ${colorClass}`}
                          >
                            <span className="font-semibold">{feat}</span>
                            <span className="mx-0.5 text-slate-400">=</span>
                            <span className="font-bold">{val}</span>
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  {/* Consequent */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                        isHigh
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                      }`}
                    >
                      {rule.consequent}
                    </span>
                  </td>

                  {/* Support */}
                  <td className="py-3 px-3 font-mono text-slate-200 whitespace-nowrap">
                    {(rule.support * 100).toFixed(2)}%
                    <div className="text-[10px] text-slate-500">
                      Test: {(rule.support_test * 100).toFixed(2)}%
                    </div>
                  </td>

                  {/* Confidence */}
                  <td className="py-3 px-3 font-mono whitespace-nowrap">
                    <strong className="text-amber-300">
                      {(rule.confidence * 100).toFixed(2)}%
                    </strong>
                    <div className="text-[10px] text-slate-400">
                      Test: {(rule.confidence_test * 100).toFixed(2)}%
                    </div>
                  </td>

                  {/* Lift */}
                  <td className="py-3 px-3 font-mono whitespace-nowrap">
                    <span className="rounded bg-slate-900 px-2 py-0.5 text-xs font-bold text-emerald-400 border border-slate-800">
                      {rule.lift.toFixed(2)}x
                    </span>
                    <div className="text-[10px] text-slate-500">
                      Test: {rule.lift_test.toFixed(2)}x
                    </div>
                  </td>

                  {/* Holdout Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {rule.holdout_pass ? (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-800/60">
                        <ShieldCheck className="h-3 w-3" />
                        Lolos Test
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-950/60 px-2 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-800/60">
                        <AlertCircle className="h-3 w-3" />
                        Train Only
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
