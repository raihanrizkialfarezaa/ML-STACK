import Link from "next/link";
import { ExternalLink, BookOpen, GitBranch, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-10 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Col 1: Overview */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-serif text-base font-bold text-white">
                Wine Quality Hybrid Mining
              </span>
              <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-rose-300">
                v1.0.0
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Implementasi framework hybrid machine learning: menggabungkan
              ketepatan prediktif <strong>Random Forest (Bagging)</strong> dengan
              kejelasan logika aturan <strong>Association Rule Mining (FP-Growth)</strong> pada
              dataset UCI Machine Learning Wine Quality (1.599 Red &amp; 4.898 White Wine).
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 rounded bg-slate-900 px-2 py-1 border border-slate-800">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                Zero Data Leakage (Stratified 80/20)
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-slate-900 px-2 py-1 border border-slate-800">
                <GitBranch className="h-3 w-3 text-amber-400" />
                Holdout Rule Validation (41/54 passed)
              </span>
            </div>
          </div>

          {/* Col 2: Navigasi Cepat */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Daftar Halaman
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-rose-300 transition-colors">
                  Overview Hybrid Framework
                </Link>
              </li>
              <li>
                <Link
                  href="/random-forest"
                  className="hover:text-rose-300 transition-colors"
                >
                  Modul 1: Random Forest (Bagging)
                </Link>
              </li>
              <li>
                <Link
                  href="/association-rules"
                  className="hover:text-rose-300 transition-colors"
                >
                  Modul 2: Association Rules (FP-Growth)
                </Link>
              </li>
              <li>
                <Link
                  href="/simulator"
                  className="hover:text-rose-300 transition-colors"
                >
                  Lab Simulator &amp; Rule Matcher
                </Link>
              </li>
              <li>
                <Link
                  href="/dataset"
                  className="hover:text-rose-300 transition-colors"
                >
                  Dataset &amp; Kimia Wine
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Referensi & Sitasi */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Referensi Akademis
            </h4>
            <div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-400">
              <p>
                <strong>Cortez et al. (2009)</strong>: <em>Modeling wine preferences by data mining from physicochemical properties</em>. Decision Support Systems.
              </p>
              <a
                href="https://archive.ics.uci.edu/dataset/186/wine+quality"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 text-[11px]"
              >
                <span>UCI Machine Learning Repository</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>© 2026 Wine Quality Hybrid AI Framework. Dibuat untuk tujuan edukasi &amp; riset machine learning.</p>
          <p>Scikit-Learn 1.9.1 • MLxtend 0.25.0 • Next.js 16 • Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
