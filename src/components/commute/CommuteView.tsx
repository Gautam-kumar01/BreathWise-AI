import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COMMUTE_MODES } from '../../types/commute';
import { Compass, Leaf, DollarSign, Clock, ShieldCheck, Check, Train, Car, Bike, Footprints } from 'lucide-react';

export const CommuteView: React.FC = () => {
  const { userPreferences, updatePreferences, language } = useApp();
  const [commuteDistanceKm, setCommuteDistanceKm] = useState<number>(14);
  const isHi = language === 'hi';

  const selectedMode = COMMUTE_MODES.find(m => m.id === userPreferences.primaryCommute) || COMMUTE_MODES[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-800">
              <Compass className="w-4 h-4 font-bold" />
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-serif">
              {isHi ? 'प्रदूषण-सजग यात्रा तुलना' : 'Multimodal Commute: Exposure vs. Emissions'}
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Compare travel modes to minimize your personal inhaled particulate dose while calculating carbon saved.
          </p>
        </div>

        {/* Distance Slider */}
        <div className="flex items-center gap-3 bg-warm-50 px-4 py-2.5 rounded-2xl border border-warm-200 text-xs">
          <span className="text-stone-600 font-medium">Trip Distance:</span>
          <span className="text-orange-700 font-extrabold">{commuteDistanceKm} km</span>
          <input
            type="range"
            min="3"
            max="30"
            value={commuteDistanceKm}
            onChange={(e) => setCommuteDistanceKm(Number(e.target.value))}
            className="w-28 accent-amber-600"
          />
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {COMMUTE_MODES.map((mode) => {
          const isCurrent = userPreferences.primaryCommute === mode.id;
          const adjustedCo2 = (mode.co2EmissionsKg * (commuteDistanceKm / 12)).toFixed(2);
          const adjustedCost = Math.round(mode.costInr * (commuteDistanceKm / 12));

          return (
            <div
              key={mode.id}
              onClick={() => updatePreferences({ primaryCommute: mode.id as any })}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'bg-amber-50/50 border-orange-500 shadow-warm-md ring-2 ring-orange-500/20'
                  : 'bg-white border-warm-200 hover:border-amber-300 shadow-warm-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 font-serif">{mode.name}</span>
                  {isCurrent && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-orange-600 text-white font-extrabold uppercase tracking-wider">
                      Active
                    </span>
                  )}
                </div>

                {/* Exposure Dose Gauge */}
                <div className="mt-3 p-2.5 rounded-xl bg-warm-50/80 border border-warm-200">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-stone-500 font-medium">Inhaled Dose:</span>
                    <span className={`font-bold ${
                      mode.inhaledDoseScore <= 3 
                        ? 'text-emerald-700' 
                        : mode.inhaledDoseScore <= 6 
                        ? 'text-amber-700' 
                        : 'text-rose-700'
                    }`}>
                      {mode.inhaledDoseScore}/10 ({mode.inhaledDoseScore <= 3 ? 'Low' : mode.inhaledDoseScore <= 6 ? 'Medium' : 'Severe'})
                    </span>
                  </div>
                  <div className="w-full bg-warm-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full ${
                        mode.inhaledDoseScore <= 3 
                          ? 'bg-emerald-600' 
                          : mode.inhaledDoseScore <= 6 
                          ? 'bg-amber-500' 
                          : 'bg-rose-600'
                      }`}
                      style={{ width: `${mode.inhaledDoseScore * 10}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3.5 space-y-1.5 text-[11px] text-stone-700">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 flex items-center gap-1 font-medium"><Clock className="w-3 h-3 text-stone-400" /> Time</span>
                    <span className="font-bold">{Math.round(mode.travelTimeMin * (commuteDistanceKm / 12))} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 flex items-center gap-1 font-medium"><DollarSign className="w-3 h-3 text-stone-400" /> Cost</span>
                    <span className="font-bold">₹{adjustedCost}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 flex items-center gap-1 font-medium"><Leaf className="w-3 h-3 text-stone-400" /> Carbon</span>
                    <span className="font-bold text-amber-800">{adjustedCo2} kg</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-warm-100">
                <p className="text-[10px] text-stone-500 line-clamp-3 leading-relaxed">
                  {mode.smogRecommendation}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Active Mode Analysis */}
      <div className="p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-sm">
        <h3 className="text-base font-bold text-stone-900 font-serif mb-2">
          Recommended Smog Strategy for: <span className="text-orange-700">{selectedMode.name}</span>
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed mb-4">
          {selectedMode.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
            <span className="font-bold text-emerald-900 block mb-2 text-xs uppercase tracking-wider">
              Health & Operational Advantages:
            </span>
            <ul className="space-y-1 text-stone-700 list-disc list-inside">
              {selectedMode.pros.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <span className="font-bold text-amber-900 block mb-2 text-xs uppercase tracking-wider">
              Smog Inversion Caveats & Precautions:
            </span>
            <ul className="space-y-1 text-stone-700 list-disc list-inside">
              {selectedMode.cons.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
