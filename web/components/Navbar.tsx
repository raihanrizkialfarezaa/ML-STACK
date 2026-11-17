"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Trees,
  ScrollText,
  FlaskConical,
  Database,
  Layers,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Hybrid Framework",
      href: "/",
      icon: Layers,
      description: "Overview & Sinergi Model",
    },
    {
      name: "Modul 1: Random Forest",
      href: "/random-forest",
      icon: Trees,
      badge: "Bagging",
      description: "Prediksi & Feature Importance",
    },
    {
      name: "Modul 2: Association Rules",
      href: "/association-rules",
      icon: ScrollText,
      badge: "FP-Growth",
      description: "Aturan Asosiasi If-Then",
    },
    {
      name: "Lab Simulator",
      href: "/simulator",
      icon: FlaskConical,
      badge: "Live",
      highlight: true,
      description: "Uji Profil Kimia & Cek Rules",
    },
    {
      name: "Dataset & Kimia",
      href: "/dataset",
      icon: Database,
      description: "11 Zat & Audit Data",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-rose-950/40 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 via-rose-800 to-amber-600 shadow-md shadow-rose-950/50 transition-transform group-hover:scale-105">
            <FlaskConical className="h-5 w-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-tight text-white group-hover:text-rose-200">
                Wine Quality AI
              </span>
              <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-semibold text-rose-300 border border-rose-500/30">
                Hybrid Mining
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Random Forest + Association Rules
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  active
                    ? "bg-rose-950/70 text-rose-200 shadow-inner border border-rose-800/50 font-semibold"
                    : item.highlight
                    ? "bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    active
                      ? "text-rose-400"
                      : item.highlight
                      ? "text-amber-400"
                      : "text-slate-400"
                  }`}
                />
                <span>{item.name}</span>
                {item.badge && (
                  <span
                    className={`rounded px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider ${
                      item.highlight
                        ? "bg-amber-400/20 text-amber-200 animate-pulse"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/simulator"
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-rose-950/40 hover:brightness-110 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-200" />
            <span>Coba Simulator</span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                    active
                      ? "bg-rose-950/80 text-rose-200 border border-rose-800/50"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-rose-400" />
                    <div>
                      <div>{item.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  {item.badge && (
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
