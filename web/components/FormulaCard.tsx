import { ReactNode } from "react";
import { MathView } from "./MathView";
import { BookOpen, Sparkles, BrainCircuit } from "lucide-react";

interface FormulaComponent {
  symbol: string;
  name: string;
  explanation: string;
}

interface FormulaCardProps {
  title: string;
  formula: string;
  category: string;
  laymanExplanation: string;
  technicalDetails: string;
  components?: FormulaComponent[];
  example?: ReactNode;
}

export function FormulaCard({
  title,
  formula,
  category,
  laymanExplanation,
  technicalDetails,
  components = [],
  example,
}: FormulaCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 shadow-xl">
      {/* Category & Title */}
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-300 border border-rose-500/20">
          {category}
        </span>
      </div>
      <h3 className="mt-2 text-lg font-bold text-white tracking-tight">
        {title}
      </h3>

      {/* Formula Display */}
      <div className="my-4 rounded-xl border border-rose-950/60 bg-slate-950/90 p-4 text-center shadow-inner">
        <MathView math={formula} block={true} className="text-base sm:text-lg text-amber-200" />
      </div>

      {/* Penjelasan Orang Awam */}
      <div className="mb-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
          <Sparkles className="h-4 w-4" />
          <span>Intisari untuk Orang Awam (Analogi Praktis)</span>
        </div>
        <p className="mt-1.5 text-xs text-amber-100/90 leading-relaxed">
          {laymanExplanation}
        </p>
      </div>

      {/* Rincian Komponen Rumus */}
      {components.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
            <BookOpen className="h-3.5 w-3.5 text-rose-400" />
            <span>Keterangan Komponen Rumus:</span>
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-800/80 bg-slate-900/50">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400">
                <tr>
                  <th className="py-1.5 px-3 font-mono font-medium">Simbol</th>
                  <th className="py-1.5 px-3 font-medium">Nama Variabel</th>
                  <th className="py-1.5 px-3 font-medium">Penjelasan Makna</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {components.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-1.5 px-3 font-mono text-amber-300 font-semibold whitespace-nowrap">
                      {item.symbol}
                    </td>
                    <td className="py-1.5 px-3 font-medium text-slate-200">
                      {item.name}
                    </td>
                    <td className="py-1.5 px-3 text-slate-400">
                      {item.explanation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Teknis */}
      <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-3.5 text-xs text-slate-300">
        <div className="flex items-center gap-2 font-semibold text-rose-300 mb-1">
          <BrainCircuit className="h-3.5 w-3.5" />
          <span>Penalaran Matematis &amp; Implementasi Algoritma</span>
        </div>
        <p className="text-slate-400 leading-relaxed">{technicalDetails}</p>
        {example && <div className="mt-2.5 pt-2.5 border-t border-slate-800">{example}</div>}
      </div>
    </div>
  );
}
