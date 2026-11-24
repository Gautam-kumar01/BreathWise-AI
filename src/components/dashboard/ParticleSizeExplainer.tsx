import React, { useState } from 'react';
import { Layers, Wind, AlertCircle, ShieldCheck, ArrowDown, ArrowUp } from 'lucide-react';

export const ParticleSizeExplainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'particles' | 'inversion'>('particles');

  return (
    <div className="p-4 sm:p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-sm">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-warm-200 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Layers className="w-4 h-4 font-bold" />
            </span>
            <h3 className="text-base font-bold text-stone-900 font-serif">
              Scientific Primer: What Are You Inhaling?
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Understanding why winter smog behaves differently from normal dust and how it affects human lungs.
          </p>
        </div>

        <div className="flex bg-warm-100 p-1 rounded-2xl border border-warm-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('particles')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'particles' ? 'bg-amber-600 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Particle Size & Lungs
          </button>
          <button
            onClick={() => setActiveTab('inversion')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'inversion' ? 'bg-amber-600 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Winter Smog Inversion Physics
          </button>
        </div>
      </div>

      {activeTab === 'particles' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Card 1: Human Hair vs Dust */}
          <div className="p-4 rounded-2xl bg-warm-50 border border-warm-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-stone-800">Human Hair</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-bold">~70 µm</span>
              </div>
              <div className="w-full h-8 bg-stone-300 rounded-lg flex items-center justify-center text-stone-600 text-[10px] font-bold mb-3">
                Visible to the naked human eye
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Standard biological scale. Beach sand is ~90 µm. A single strand of hair is nearly 30 times larger than fine particulate soot.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-warm-200 text-[10px] text-stone-400">
              Filtered naturally by nose and throat hairs.
            </div>
          </div>

          {/* Card 2: PM10 Coarse Dust */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-amber-900">PM10 (Coarse Dust)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">&lt; 10 µm</span>
              </div>
              <div className="w-full h-8 bg-amber-200 rounded-lg flex items-center justify-center text-amber-900 text-[10px] font-bold mb-3">
                Construction dust, pollen & road grit
              </div>
              <p className="text-[11px] text-stone-700 leading-relaxed">
                Deposited primarily in the upper respiratory tract (nasopharynx and trachea). Causes coughing, sneezing, and eye irritation.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-200 text-[10px] text-amber-800 font-semibold">
              Blocked by standard surgical masks.
            </div>
          </div>

          {/* Card 3: PM2.5 Ultrafine Soot */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-rose-950">PM2.5 (Fine Combustion Soot)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-bold">&lt; 2.5 µm</span>
              </div>
              <div className="w-full h-8 bg-rose-300 rounded-lg flex items-center justify-center text-rose-950 text-[10px] font-bold mb-3">
                Vehicle exhaust, biomass smoke, diesel
              </div>
              <p className="text-[11px] text-stone-800 leading-relaxed">
                <strong>Dangerous:</strong> Bypasses all upper airway defenses. Penetrates deep into lung alveoli and crosses directly into the bloodstream.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-rose-200 text-[10px] text-rose-900 font-bold">
              Requires certified N95 filtration to block.
            </div>
          </div>
        </div>
      ) : (
        /* Temperature Inversion Physics Diagram */
        <div className="p-5 rounded-2xl bg-warm-50 border border-warm-200 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Normal daytime mixing */}
            <div className="p-4 rounded-xl bg-white border border-warm-200 shadow-sm">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-2">
                <ArrowUp className="w-4 h-4 text-emerald-600" />
                Normal Daytime: Smoke Disperses Freely
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Sunlight warms the ground. Hot air rises naturally through convection, carrying vehicle exhaust and factory plumes high into the upper troposphere where strong winds dilute them.
              </p>
              <div className="mt-3 p-2 rounded-lg bg-emerald-50 text-[10px] text-emerald-900 font-semibold">
                Result: Safe afternoon breathing window (1:30 PM - 3:30 PM).
              </div>
            </div>

            {/* Winter night inversion */}
            <div className="p-4 rounded-xl bg-white border border-rose-200 shadow-sm">
              <div className="flex items-center gap-1.5 font-bold text-rose-900 mb-2">
                <ArrowDown className="w-4 h-4 text-rose-700" />
                Winter Inversion Trap: Smoke Capped at Ground
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                During cold winter nights, the ground cools rapidly. A layer of warm air settles above cold, dense surface air, acting as an impenetrable lid. Smog cannot rise and remains concentrated at head height.
              </p>
              <div className="mt-3 p-2 rounded-lg bg-rose-50 text-[10px] text-rose-900 font-semibold">
                Result: Hazardous morning peak (6:30 AM - 9:30 AM). Never run outdoors.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
