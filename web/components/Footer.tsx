export function Footer() {
  return (
    <footer className="border-t border-neutral-900 bg-black py-12 text-neutral-500 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                Random Forest Monograph
              </span>
              <span className="rounded border border-neutral-800 bg-neutral-900 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400">
                v2.0
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-neutral-400">
              Dokumentasi komprehensif implementasi algoritma Random Forest (Bagging Ensemble) pada dataset UCI Wine Quality (N = 6.497). Disusun dengan metodologi bebas kebocoran data (*Zero Data Leakage*) dan penjelasan matematis terinci.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Referensi Akademis Utama
            </h4>
            <div className="mt-3 space-y-2 text-xs leading-relaxed text-neutral-400">
              <p>
                <strong>Cortez et al. (2009)</strong>: <em>Modeling wine preferences by data mining from physicochemical properties</em>. Decision Support Systems, Elsevier, 47(4):547-553.
              </p>
              <p>
                <strong>Breiman, L. (2001)</strong>: <em>Random Forests</em>. Machine Learning, Springer, 45(1):5-32.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Spesifikasi Lingkungan
            </h4>
            <ul className="mt-3 space-y-1 font-mono text-xs text-neutral-400">
              <li>• Dataset: UCI Machine Learning Repository</li>
              <li>• Framework: Scikit-Learn 1.9.1 / Python 3.12</li>
              <li>• Pipeline: Self-contained Google Colab</li>
              <li>• Frontend: Next.js 16 + Tailwind CSS</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between font-mono text-[11px] text-neutral-600 gap-2">
          <p>© 2026 Wine Quality Machine Learning Monograph. Edukasi &amp; Riset Terbuka.</p>
          <p>Pure Monochrome Edition • Zero Extraneous Scripts</p>
        </div>
      </div>
    </footer>
  );
}
