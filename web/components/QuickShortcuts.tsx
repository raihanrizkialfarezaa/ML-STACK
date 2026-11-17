"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Command,
  Search,
  ArrowUp,
  X,
  Keyboard,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Code2,
  FileText,
  Calculator,
  BarChart3,
  FlaskConical,
  Trees,
} from "lucide-react";

interface SectionItem {
  id: string;
  num: string;
  title: string;
  category: string;
  desc: string;
  iconName: string;
}

const SECTIONS: SectionItem[] = [
  {
    id: "pendahuluan",
    num: "1",
    title: "1. Pendahuluan & Formulasi Mutu",
    category: "Konsep Dasar",
    desc: "Latar belakang masalah, target biner mutu >= 7, split Red vs White",
    iconName: "FileText",
  },
  {
    id: "variabel",
    num: "2",
    title: "2. 11 Variabel Fisikokimia",
    category: "Fitur Kimia",
    desc: "Tabel 11 parameter kimiawi, peran rasa, perbandingan Red vs White",
    iconName: "FlaskConical",
  },
  {
    id: "integritas",
    num: "3",
    title: "3. Integritas Data & Anti-Bocor",
    category: "Pembersihan",
    desc: "Zero missing values, stratifikasi 80/20, pencegahan data leakage",
    iconName: "FileText",
  },
  {
    id: "mekanisme",
    num: "4",
    title: "4. Mekanisme Kerja Random Forest",
    category: "Algoritma",
    desc: "Bootstrap aggregating, random feature subspace, voting konsensus",
    iconName: "Trees",
  },
  {
    id: "perhitungan",
    num: "5",
    title: "5. Bedah Hitungan Matematika & Kasus Riil",
    category: "Kalkulasi",
    desc: "Analogi toples 100 botol, Gini Gain +0.1371, voting Botol #42 (72%)",
    iconName: "Calculator",
  },
  {
    id: "eksperimen",
    num: "6",
    title: "6. Hasil Eksperimen 9 Varian Model",
    category: "Evaluasi",
    desc: "Komparasi M1, M2, M3 di 3 scope, lonjakan recall Red ke 74.42%",
    iconName: "BarChart3",
  },
  {
    id: "dashboard",
    num: "7",
    title: "7. Dashboard Visualisasi 4-Panel",
    category: "Visualisasi",
    desc: "Kurva ROC-AUC, grouped feature importance, rekomendasi enologi",
    iconName: "BarChart3",
  },
  {
    id: "bedah-kode",
    num: "8",
    title: "8. Bedah Kode Pipeline Python",
    category: "Source Code",
    desc: "Anatomi line-by-line 6 modul random_forest_colab.py & balanced subsample",
    iconName: "Code2",
  },
  {
    id: "colab-script",
    num: "9",
    title: "9. Google Colab & Skrip Mandiri",
    category: "Eksekusi",
    desc: "2 langkah eksekusi Colab, auto-download UCI, reproduksibilitas Seed 42",
    iconName: "ExternalLink",
  },
];

export function QuickShortcuts() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll position for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const jumpTo = (id: string, label: string) => {
    setPaletteOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
      setToast(`Menuju: ${label}`);
      setTimeout(() => setToast(null), 2000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState(null, "", window.location.pathname);
    setToast("Kembali ke Awal Monograf");
    setTimeout(() => setToast(null), 1500);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      const isInput =
        activeTag === "input" ||
        activeTag === "textarea" ||
        document.activeElement?.getAttribute("contenteditable") === "true";

      // Toggle Palette with Ctrl+K, Cmd+K, or Slash "/" or "k" when not in input
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
        return;
      }

      if (!isInput) {
        if (e.key === "k" || e.key === "K" || e.key === "/") {
          e.preventDefault();
          setPaletteOpen((prev) => !prev);
          return;
        }

        if (e.key === "t" || e.key === "T") {
          e.preventDefault();
          scrollToTop();
          return;
        }

        // Direct number keys '1' to '9'
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 9) {
          const target = SECTIONS[num - 1];
          if (target) {
            e.preventDefault();
            jumpTo(target.id, target.title);
          }
          return;
        }
      }

      // Close modal on Escape
      if (e.key === "Escape" && paletteOpen) {
        setPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paletteOpen]);

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!search.trim()) return SECTIONS;
    const q = search.toLowerCase();
    return SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.num === q
    );
  }, [search]);

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-neutral-700 bg-black/95 px-4 py-2 font-mono text-xs text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="h-3.5 w-3.5 text-neutral-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Floating Shortcut Action Dock */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        {/* Back to Top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            title="Kembali ke Atas (Tekan T)"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950/90 text-neutral-400 hover:border-neutral-500 hover:text-white hover:bg-neutral-900 transition-all shadow-xl backdrop-blur-md"
            aria-label="Kembali ke Atas"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}

        {/* Command Palette Button */}
        <button
          onClick={() => setPaletteOpen(true)}
          title="Buka Navigasi Pintasan (Tekan K atau 1-9)"
          className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/95 px-3.5 py-2 font-mono text-xs text-neutral-300 hover:border-neutral-600 hover:text-white hover:bg-neutral-900 transition-all shadow-xl backdrop-blur-md"
        >
          <Keyboard className="h-3.5 w-3.5 text-neutral-400" />
          <span className="hidden sm:inline">Pintasan</span>
          <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-[10px] text-neutral-400 border border-neutral-800">
            1 – 9
          </span>
          <span className="hidden md:inline rounded bg-neutral-900 px-1.5 py-0.5 text-[10px] text-neutral-400 border border-neutral-800">
            ⌘K
          </span>
        </button>
      </div>

      {/* Command Palette / Quick Jump Modal */}
      {paletteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-xl border border-neutral-800 bg-neutral-950 p-4 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header & Search */}
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
              <div className="flex items-center gap-2 text-white font-mono text-xs font-bold uppercase tracking-wider">
                <Command className="h-4 w-4" />
                <span>Navigasi Pintas Monograf (Quick Jump)</span>
              </div>
              <button
                onClick={() => setPaletteOpen(false)}
                className="rounded p-1 text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                autoFocus
                placeholder="Cari bagian (misal: botol 42, alkohol, gini, colab, kode)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border border-neutral-800 bg-black py-2 pl-9 pr-4 font-mono text-xs text-white placeholder-neutral-600 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              />
            </div>

            {/* List of Sections */}
            <div className="max-h-80 overflow-y-auto space-y-1 pr-1 font-mono text-xs">
              {filteredSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => jumpTo(sec.id, sec.title)}
                  className="w-full flex items-center justify-between gap-3 rounded-lg border border-transparent p-2.5 text-left text-neutral-300 hover:border-neutral-800 hover:bg-neutral-900/70 hover:text-white transition-all group"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-neutral-900 border border-neutral-800 text-[11px] font-bold text-neutral-300 group-hover:border-neutral-600 group-hover:text-white">
                      {sec.num}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">
                        {sec.title}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate font-sans">
                        {sec.desc}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-neutral-600 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}

              {filteredSections.length === 0 && (
                <div className="py-8 text-center text-xs text-neutral-500 font-sans">
                  Tidak ditemukan bagian yang cocok dengan &quot;{search}&quot;.
                </div>
              )}
            </div>

            {/* Footer Cheatsheet Hints */}
            <div className="flex flex-wrap items-center justify-between border-t border-neutral-900 pt-3 text-[11px] text-neutral-500 font-mono">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="rounded border border-neutral-800 bg-neutral-900 px-1 py-0.5 text-neutral-300">
                    1-9
                  </kbd>{" "}
                  Lompat Langsung
                </span>
                <span>
                  <kbd className="rounded border border-neutral-800 bg-neutral-900 px-1 py-0.5 text-neutral-300">
                    T
                  </kbd>{" "}
                  Ke Atas
                </span>
                <span>
                  <kbd className="rounded border border-neutral-800 bg-neutral-900 px-1 py-0.5 text-neutral-300">
                    Esc
                  </kbd>{" "}
                  Tutup
                </span>
              </div>
              <div className="text-[10px] text-neutral-600">
                Pintasan Keyboard Aktif
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
