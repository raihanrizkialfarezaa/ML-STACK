"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

interface CodeBlockProps {
  title?: string;
  language?: string;
  code: string;
  highlights?: number[];
  note?: string;
}

export function CodeBlock({
  title = "Python Pipeline",
  language = "python",
  code,
  highlights = [],
  note,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const lines = code.trim().split("\n");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/80 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal className="h-4 w-4 text-rose-400" />
          <span className="font-mono font-medium text-slate-200">{title}</span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-400 font-mono">
            {language}
          </span>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 rounded bg-slate-800/70 px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          title="Salin Kode"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-400" />
              <span>Salin</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-200">
        <pre className="table w-full">
          <tbody>
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = highlights.includes(lineNum);
              return (
                <tr
                  key={idx}
                  className={`table-row ${
                    isHighlighted ? "bg-rose-950/30 text-rose-200 font-semibold" : ""
                  }`}
                >
                  <td className="table-cell select-none pr-4 text-right text-slate-600 w-8">
                    {lineNum}
                  </td>
                  <td className="table-cell whitespace-pre">{line}</td>
                </tr>
              );
            })}
          </tbody>
        </pre>
      </div>

      {note && (
        <div className="border-t border-slate-800/80 bg-slate-900/40 px-4 py-2 text-[11px] text-slate-400">
          💡 <span className="font-medium text-slate-300">Catatan Enjiniring:</span>{" "}
          {note}
        </div>
      )}
    </div>
  );
}
