"use client";

import { useState } from "react";
import { Menu, X, ArrowUpRight, BookOpen } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "1. Pendahuluan", href: "#pendahuluan" },
    { name: "2. 11 Variabel", href: "#variabel" },
    { name: "3. Integritas Data", href: "#integritas" },
    { name: "4. Mekanisme RF", href: "#mekanisme" },
    { name: "5. Bedah Hitungan", href: "#perhitungan" },
    { name: "6. Hasil Eksperimen", href: "#eksperimen" },
    { name: "7. Dashboard", href: "#dashboard" },
    { name: "8. Bedah Kode", href: "#bedah-kode" },
    { name: "9. Google Colab", href: "#colab-script" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800/80 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-700 bg-neutral-900 text-white font-mono text-xs font-bold transition-colors group-hover:border-neutral-500">
            RF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider uppercase text-white">
                Random Forest
              </span>
              <span className="text-neutral-600">/</span>
              <span className="text-xs text-neutral-400 font-sans">
                Wine Quality Monograph
              </span>
            </div>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 font-mono text-[11px]">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded px-2.5 py-1 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Quick jump to Colab / Script */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="#colab-script"
            className="flex items-center gap-1.5 rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 font-mono text-xs text-neutral-200 hover:bg-white hover:text-black hover:border-white transition-all"
          >
            <span>Script Python</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded p-1.5 text-neutral-400 hover:bg-neutral-900 hover:text-white lg:hidden"
          aria-label="Toggle Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="border-b border-neutral-800 bg-neutral-950 px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1 font-mono text-xs">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded px-3 py-2 text-neutral-300 hover:bg-neutral-900 hover:text-white"
              >
                {item.name}
              </a>
            ))}
            <div className="mt-2 pt-2 border-t border-neutral-900">
              <a
                href="#colab-script"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded bg-neutral-900 px-3 py-2 text-white"
              >
                <span>Unduh / Salin Script Colab</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
