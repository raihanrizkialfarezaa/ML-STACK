"use client";

import { useState, useMemo } from "react";
import { wineData, FEATURE_INFO } from "@/lib/data";
import {
  FlaskConical,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  RotateCcw,
} from "lucide-react";

interface WineProfile {
  alcohol: number;
  "volatile acidity": number;
  sulphates: number;
  density: number;
  chlorides: number;
  "residual sugar": number;
  "citric acid": number;
  pH: number;
  "total sulfur dioxide": number;
  "free sulfur dioxide": number;
  "fixed acidity": number;
}

export default function SimulatorPage() {
  const [wineType, setWineType] = useState<"Red" | "White">("Red");

  // Default presets
  const redDefault: WineProfile = {
    alcohol: 11.5,
    "volatile acidity": 0.38,
    sulphates: 0.72,
    density: 0.9958,
    chlorides: 0.068,
    "residual sugar": 2.2,
    "citric acid": 0.35,
    pH: 3.35,
    "total sulfur dioxide": 30.0,
    "free sulfur dioxide": 14.0,
    "fixed acidity": 8.2,
  };

  const whiteDefault: WineProfile = {
    alcohol: 11.8,
    "volatile acidity": 0.22,
    sulphates: 0.52,
    density: 0.9920,
    chlorides: 0.034,
    "residual sugar": 4.5,
    "citric acid": 0.34,
    pH: 3.28,
    "total sulfur dioxide": 120.0,
    "free sulfur dioxide": 32.0,
    "fixed acidity": 6.8,
  };

  const [profile, setProfile] = useState<WineProfile>(redDefault);

  // Switch wine type
  const handleTypeChange = (type: "Red" | "White") => {
    setWineType(type);
    setProfile(type === "Red" ? redDefault : whiteDefault);
  };

  // Preset loaders
  const loadPreset = (presetName: string) => {
    if (presetName === "red_premium") {
      setWineType("Red");
      setProfile({
        alcohol: 12.2,
        "volatile acidity": 0.32,
        sulphates: 0.78,
        density: 0.9950,
        chlorides: 0.060,
        "residual sugar": 2.1,
        "citric acid": 0.42,
        pH: 3.38,
        "total sulfur dioxide": 22.0,
        "free sulfur dioxide": 16.0,
        "fixed acidity": 8.6,
      });
    } else if (presetName === "red_spoiled") {
      setWineType("Red");
      setProfile({
        alcohol: 9.2,
        "volatile acidity": 0.76,
        sulphates: 0.48,
        density: 0.9982,
        chlorides: 0.095,
        "residual sugar": 2.8,
        "citric acid": 0.10,
        pH: 3.52,
        "total sulfur dioxide": 58.0,
        "free sulfur dioxide": 8.0,
        "fixed acidity": 7.0,
      });
    } else if (presetName === "white_premium") {
      setWineType("White");
      setProfile({
        alcohol: 12.4,
        "volatile acidity": 0.20,
        sulphates: 0.55,
        density: 0.9912,
        chlorides: 0.031,
        "residual sugar": 4.8,
        "citric acid": 0.35,
        pH: 3.30,
        "total sulfur dioxide": 115.0,
        "free sulfur dioxide": 35.0,
        "fixed acidity": 6.6,
      });
    } else if (presetName === "white_low") {
      setWineType("White");
      setProfile({
        alcohol: 9.3,
        "volatile acidity": 0.42,
        sulphates: 0.44,
        density: 0.9965,
        chlorides: 0.056,
        "residual sugar": 9.2,
        "citric acid": 0.24,
        pH: 3.08,
        "total sulfur dioxide": 160.0,
        "free sulfur dioxide": 20.0,
        "fixed acidity": 6.5,
      });
    }
  };

  // Get discretization bin boundaries for current wine type
  const boundaries = useMemo(() => {
    return wineData.binning_boundaries.filter((b) => b.scope === wineType);
  }, [wineType]);

  // Determine current qualitative tertile bin for each feature
  const activeBins = useMemo(() => {
    const bins: Record<string, "Low" | "Med" | "High"> = {};

    for (const [feat, val] of Object.entries(profile)) {
      const featBins = boundaries.filter((b) => b.feature === feat);
      if (featBins.length === 0) continue;

      for (const b of featBins) {
        const lower = b.lower_bound === "-inf" ? -Infinity : Number(b.lower_bound);
        const upper = b.upper_bound === "inf" ? Infinity : Number(b.upper_bound);

        if (val > lower && val <= upper) {
          bins[feat] = b.bin as "Low" | "Med" | "High";
          break;
        }
      }
      if (!bins[feat]) {
        // Fallback for edge cases
        bins[feat] = val <= 10 ? "Low" : "High";
      }
    }
    return bins;
  }, [profile, boundaries]);

  // Match active association rules
  const matchingRules = useMemo(() => {
    const scopeRules = wineData.association_rules_all_scopes.filter(
      (r) => r.scope === wineType
    );

    return scopeRules.filter((rule) => {
      // rule.antecedents format: "alcohol=High & sulphates=High & volatile acidity=Low"
      const items = rule.antecedents.split(" & ");
      return items.every((item) => {
        const [feat, expectedVal] = item.split("=");
        return activeBins[feat] === expectedVal;
      });
    });
  }, [wineType, activeBins]);

  const highRules = matchingRules.filter((r) => r.consequent_tier === "High");
  const lowRules = matchingRules.filter((r) => r.consequent_tier === "Low");

  const bestHighRule = highRules.sort((a, b) => b.lift - a.lift)[0];
  const bestLowRule = lowRules.sort((a, b) => b.lift - a.lift)[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-rose-950/40 pb-6 mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-300 border border-rose-500/30">
              <FlaskConical className="h-3.5 w-3.5 text-rose-400" />
              Live Wine Lab Simulator
            </span>
            <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
              Real-time Rule Matcher
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Simulator Profil Kimia &amp; Pencocok Aturan Asosiasi
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
            Atur komposisi fisikokimia wine di bawah ini. Simulator secara instan menentukan status kategori (Low/Med/High) dan mencocokkan dengan <strong>54 Aturan Asosiasi Riil</strong> yang ditambang oleh model FP-Growth.
          </p>

          {/* Quick Presets */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-1">Preset Cepat:</span>
            <button
              onClick={() => loadPreset("red_premium")}
              className="rounded-lg bg-rose-950/70 border border-rose-700/60 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-900 transition-colors"
            >
              🍷 Red Wine Juara (Premium)
            </button>
            <button
              onClick={() => loadPreset("red_spoiled")}
              className="rounded-lg bg-slate-900 border border-rose-900/40 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors"
            >
              ⚠️ Red Wine Asam / Rusak (Low)
            </button>
            <button
              onClick={() => loadPreset("white_premium")}
              className="rounded-lg bg-amber-950/70 border border-amber-700/60 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-900 transition-colors"
            >
              🥂 White Wine Grand Cru (Premium)
            </button>
            <button
              onClick={() => loadPreset("white_low")}
              className="rounded-lg bg-slate-900 border border-amber-900/40 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors"
            >
              🧊 White Wine Hambar / Pahit (Low)
            </button>
          </div>
        </div>

        {/* Wine Type Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-1">
            <button
              onClick={() => handleTypeChange("Red")}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                wineType === "Red"
                  ? "bg-gradient-to-r from-rose-800 to-rose-700 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🍷 Red Wine (Scope N=1.599)
            </button>
            <button
              onClick={() => handleTypeChange("White")}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                wineType === "White"
                  ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🥂 White Wine (Scope N=4.898)
            </button>
          </div>

          <button
            onClick={() => setProfile(wineType === "Red" ? redDefault : whiteDefault)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Default</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 11 Chemical Sliders (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
              <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
                <span>Parameter Zat Fisikokimia Wine</span>
                <span className="text-xs font-normal text-slate-400">
                  Label Tertile Aktif
                </span>
              </h3>

              <div className="space-y-4">
                {(Object.keys(profile) as Array<keyof WineProfile>).map((key) => {
                  const info = FEATURE_INFO[key];
                  const currentVal = profile[key];
                  const currentBin = activeBins[key];

                  const isHigh = currentBin === "High";
                  const isLow = currentBin === "Low";
                  const badgeColor = isHigh
                    ? "text-emerald-300 bg-emerald-950/70 border-emerald-800/60"
                    : isLow
                    ? "text-rose-300 bg-rose-950/70 border-rose-800/60"
                    : "text-amber-300 bg-amber-950/70 border-amber-800/60";

                  // Define slider ranges
                  const min = info?.typicalRange[0] || 0;
                  const max = info?.typicalRange[1] || 20;
                  const step = key === "density" ? 0.0002 : key === "chlorides" ? 0.002 : 0.05;

                  return (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div>
                          <span className="font-semibold text-slate-200 capitalize">
                            {key}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1.5">
                            ({info?.unit})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">
                            {key === "density" ? currentVal.toFixed(4) : currentVal.toFixed(2)}
                          </span>
                          <span
                            className={`rounded px-2 py-0.2 text-[10px] font-bold border ${badgeColor}`}
                          >
                            {currentBin}
                          </span>
                        </div>
                      </div>

                      <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={currentVal}
                        onChange={(e) => {
                          const num = parseFloat(e.target.value);
                          setProfile((prev) => ({ ...prev, [key]: num }));
                        }}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                      />

                      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>Min: {min}</span>
                        <span className="text-slate-400">{info?.layman}</span>
                        <span>Max: {max}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Rule Matcher & Diagnostic Output (5 cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-20">
            {/* Verdict Card */}
            <div
              className={`rounded-2xl border p-6 shadow-xl transition-all ${
                bestHighRule
                  ? "border-emerald-600/60 bg-gradient-to-b from-emerald-950/40 to-slate-950"
                  : bestLowRule
                  ? "border-rose-600/60 bg-gradient-to-b from-rose-950/40 to-slate-950"
                  : "border-slate-800 bg-slate-950"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Diagnosis Kualitas Wine
                </span>
                {bestHighRule ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Potensi Premium (High Quality)
                  </span>
                ) : bestLowRule ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-300 border border-rose-500/40">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Risiko Cacat (Low Quality)
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                    Kualitas Rata-rata (Regular / Med)
                  </span>
                )}
              </div>

              {/* Status Header */}
              {bestHighRule ? (
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Memenuhi Resep Wine Premium! 🍷✨
                  </h3>
                  <p className="mt-1.5 text-xs text-emerald-200/90 leading-relaxed">
                    Kombinasi zat kimia ini memicu aturan asosiasi <strong>{bestHighRule.rule_id}</strong> dengan nilai <strong>Lift {bestHighRule.lift.toFixed(2)}x</strong> dan tingkat keyakinan <strong>{(bestHighRule.confidence * 100).toFixed(1)}%</strong>!
                  </p>
                </div>
              ) : bestLowRule ? (
                <div>
                  <h3 className="text-xl font-bold text-rose-200">
                    Peringatan: Komposisi Cacat Terdeteksi! ⚠️
                  </h3>
                  <p className="mt-1.5 text-xs text-rose-300/90 leading-relaxed">
                    Kombinasi zat ini memicu aturan cacat <strong>{bestLowRule.rule_id}</strong> dengan akurasi <strong>{(bestLowRule.confidence * 100).toFixed(1)}% wine dinilai buruk</strong> oleh panel sommelier.
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-bold text-slate-200">
                    Belum Memicu Aturan Ekstrem
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    Komposisi saat ini berada di kategori tengah (Regular Quality). Sesuaikan alkohol, sulfat, atau asam asetat untuk mencapai profil premium.
                  </p>
                </div>
              )}
            </div>

            {/* Matching Rules Box */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center justify-between">
                <span>Aturan Asosiasi yang Aktif Terpicu</span>
                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-mono text-slate-300">
                  {matchingRules.length} Aturan Cocok
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mb-4">
                Aturan yang seluruh prasyaratnya (antecedent) terpenuhi oleh slider kimia di sebelah kiri.
              </p>

              {matchingRules.length > 0 ? (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {matchingRules.map((rule) => {
                    const isHigh = rule.consequent_tier === "High";
                    return (
                      <div
                        key={rule.rule_id}
                        className={`rounded-xl border p-3 text-xs ${
                          isHigh
                            ? "border-emerald-800/60 bg-emerald-950/30 text-emerald-100"
                            : "border-rose-800/60 bg-rose-950/30 text-rose-100"
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                          <span className="font-bold text-white">{rule.rule_id}</span>
                          <span className="font-extrabold text-amber-300">
                            Lift: {rule.lift.toFixed(2)}x
                          </span>
                        </div>
                        <div className="font-medium text-slate-200">
                          {rule.rule}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-800/60">
                          <span>Confidence: {(rule.confidence * 100).toFixed(1)}%</span>
                          <span>Support: {(rule.support * 100).toFixed(2)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-4 text-xs text-slate-500 text-center italic">
                  Tidak ada aturan spesifik yang terpicu. Coba geser slider Alkohol ke level High atau Volatile Acidity ke level Low/High.
                </div>
              )}
            </div>

            {/* Enological Winemaker Advice */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-2">
                <Lightbulb className="h-4 w-4" />
                <span>Rekomendasi Ahli Pembuat Wine (Actionable Enology)</span>
              </div>
              <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                {wineType === "Red" ? (
                  <>
                    <p>
                      🍷 <strong>Untuk Red Wine Juara:</strong> Pastikan fermentasi tuntas untuk menghasilkan <strong>Alkohol &gt; 10.8%</strong>. Jaga kadar <strong>Volatile Acidity (asam asetat) di bawah 0.43 g/dm³</strong> dengan sanitasi tangki yang higienis.
                    </p>
                    <p>
                      Tambahkan <strong>Sulphates &gt; 0.68 g/dm³</strong> untuk menstabilkan molekul antosianin pewarna anggur dan mencegah oksidasi.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      🥂 <strong>Untuk White Wine Segar:</strong> Kunci utama ada pada <strong>Chlorides &lt; 0.038 g/dm³</strong> (hindari air payau) dan <strong>Densitas &lt; 0.9924 g/cm³</strong>.
                    </p>
                    <p>
                      Kadar alkohol di atas 11.0% yang dipadukan dengan pH moderat (&gt; 3.24) memberikan mouthfeel seimbang tanpa rasa terbakar.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
