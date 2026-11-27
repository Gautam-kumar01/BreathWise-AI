import React, { useState, memo } from 'react';
import { useApp } from '../../context/AppContext';
import { HeartPulse, Cigarette } from 'lucide-react';

export const LungExposureCalculator: React.FC = memo(() => {
  const { airData } = useApp();

  const [activity, setActivity] = useState<'running' | 'commute_bike' | 'walking' | 'metro'>('running');
  const [durationMin, setDurationMin] = useState<number>(45);
  const [maskType, setMaskType] = useState<'none' | 'cloth' | 'n95'>('none');

  // Minute ventilation rates (Liters per minute) based on pulmonary physiology:
  // Strenuous outdoor running: ~50 L/min
  // Open bike/commute: ~25 L/min
  // Walking/errands: ~20 L/min
  // Metro AC transit: ~12 L/min
  const ventilationRates = {
    running: 50,
    commute_bike: 25,
    walking: 20,
    metro: 12
  };

  // Mask filtration efficiency against fine PM2.5:
  const maskEfficiency = {
    none: 0.0,
    cloth: 0.20, // Cloth masks only filter ~20% of ultrafine particles
    n95: 0.95    // Properly fitted N95 filters 95%+
  };

  // Ambient PM2.5 concentration (µg/m³)
  const ambientPM25 = airData.pollutants.pm25;

  // Total air inhaled in cubic meters (m³)
  const ventilationRate = ventilationRates[activity];
  const totalVolumeM3 = (ventilationRate * durationMin) / 1000;

  // Inhaled particulate mass deposited (µg)
  const filterFactor = 1 - maskEfficiency[maskType];
  const inhaledMassUg = Math.round(totalVolumeM3 * ambientPM25 * filterFactor);

  // Passive cigarette particulate equivalent proxy (Berkeley Earth scientific benchmark: ~22 µg/m³ continuous = 1 cig/day)
  const cigEquivalent = (inhaledMassUg / 22).toFixed(1);

  // Strain Category
  const getStrainCategory = () => {
    if (inhaledMassUg > 120) return { label: 'Severe Pulmonary Strain', color: 'text-rose-700', bg: 'bg-rose-100', border: 'border-rose-300' };
    if (inhaledMassUg > 50) return { label: 'High Alveolar Ingress', color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-300' };
    if (inhaledMassUg > 20) return { label: 'Moderate Exposure', color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-300' };
    return { label: 'Low / Controlled Dose', color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-300' };
  };

  const strain = getStrainCategory();

  return (
    <div className="p-4 sm:p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-warm-200 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-800">
              <HeartPulse className="w-4 h-4 font-bold" />
            </span>
            <h3 className="text-base font-bold text-stone-900 font-serif">
              Personal Respiratory Health & Inhaled Soot Calculator
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Simulates your lung particulate deposition based on current local PM2.5 ({ambientPM25} µg/m³), physical exertion, and mask protection.
          </p>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-warm-100 text-stone-600 border border-warm-200 self-start sm:self-auto">
              Pulmonary Exposure Science
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Controls: Activity, Duration, Mask */}
        <div className="lg:col-span-7 space-y-4">
          {/* 1. Activity Choice */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
              1. Select Planned Activity (Exertion Level)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'running', label: 'Outdoor Running', rate: '50 L/min' },
                { id: 'commute_bike', label: 'Scooter Commute', rate: '25 L/min' },
                { id: 'walking', label: 'Brisk Walking', rate: '20 L/min' },
                { id: 'metro', label: 'AC Metro Train', rate: '12 L/min' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivity(item.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    activity === item.id
                      ? 'bg-amber-100 border-amber-500 text-amber-950 font-bold shadow-sm'
                      : 'bg-warm-50/60 border-warm-200 text-stone-600 hover:bg-white'
                  }`}
                >
                  <span className="text-xs block">{item.label}</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">{item.rate}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Duration Slider */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-600 mb-1.5">
              <span className="uppercase tracking-wider text-stone-500">2. Exposure Duration:</span>
              <span className="text-amber-900 font-extrabold">{durationMin} Minutes</span>
            </div>
            <input
              type="range"
              min="15"
              max="120"
              step="15"
              value={durationMin}
              onChange={(e) => setDurationMin(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>15 min</span>
              <span>45 min</span>
              <span>1.5 hrs</span>
              <span>2 hrs</span>
            </div>
          </div>

          {/* 3. Mask Protection */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
              3. Respiratory Mask Worn
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'none', label: 'No Mask', eff: '0% Filtered' },
                { id: 'cloth', label: 'Cloth / Surgical', eff: '20% Filtered' },
                { id: 'n95', label: 'Certified N95 / FFP2', eff: '95% Filtered' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMaskType(m.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    maskType === m.id
                      ? 'bg-amber-100 border-amber-500 text-amber-950 font-bold shadow-sm'
                      : 'bg-warm-50/60 border-warm-200 text-stone-600 hover:bg-white'
                  }`}
                >
                  <span className="text-xs block">{m.label}</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">{m.eff}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Results Card */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-warm-50 border border-warm-200 text-center flex flex-col justify-between h-full">
          <div>
            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border mb-3 ${strain.bg} ${strain.color} ${strain.border}`}>
              {strain.label}
            </span>

            <div className="text-xs text-stone-500 font-semibold uppercase">
              Estimated Inhaled PM2.5 Soot
            </div>
            <div className="text-4xl font-extrabold text-stone-900 font-serif mt-1">
              {inhaledMassUg} <span className="text-base font-sans font-normal text-stone-500">µg</span>
            </div>

            {/* Cigarette equivalence proxy */}
            <div className="mt-3.5 p-3 rounded-xl bg-white border border-warm-200 shadow-sm flex items-center justify-center gap-2 text-xs">
              <Cigarette className="w-4 h-4 text-orange-700 flex-shrink-0" />
              <span className="text-stone-700">
                Exposure Equivalent to: <strong className="text-orange-800 font-bold">~{cigEquivalent} passive cigarettes</strong>
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-warm-200 text-left text-[11px] text-stone-600 leading-relaxed">
            {maskType === 'none' && inhaledMassUg > 40 ? (
              <p className="text-orange-900 font-medium">
                💡 <strong>Actionable Hack:</strong> Putting on a snug N95 mask will immediately drop your inhaled dose from <strong>{inhaledMassUg} µg</strong> down to <strong>{Math.round(totalVolumeM3 * ambientPM25 * 0.05)} µg</strong>!
              </p>
            ) : maskType === 'n95' ? (
              <p className="text-emerald-800 font-medium">
                ✅ <strong>Excellent Protection:</strong> Your N95 is successfully shielding your lungs from 95% of toxic combustion particulates.
              </p>
            ) : (
              <p className="text-stone-600">
                Notice how aerobic running increases breathing volume by 4x, rapidly compounding fine particulate lung penetration.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
