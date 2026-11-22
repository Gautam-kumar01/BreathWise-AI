import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { COMMUTE_MODES } from '../../types/commute';
import { 
  Compass, 
  Leaf, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Check, 
  Train, 
  Car, 
  Bike, 
  Footprints, 
  MapPin, 
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CommuteView: React.FC = () => {
  const { userPreferences, updatePreferences, incrementSustainableTrips, language } = useApp();
  const { showToast } = useToast();
  const [commuteDistanceKm, setCommuteDistanceKm] = useState<number>(14);
  const [origin, setOrigin] = useState<string>('Rohini Sector 14');
  const [destination, setDestination] = useState<string>('Connaught Place');
  const isHi = language === 'hi';

  const selectedMode = COMMUTE_MODES.find(m => m.id === userPreferences.primaryCommute) || COMMUTE_MODES[0];

  const handleSelectAndLog = (modeId: string, modeName: string) => {
    updatePreferences({ primaryCommute: modeId as any });
    incrementSustainableTrips();
    showToast(
      'Commute Choice Logged!',
      `Selected ${modeName} for your ${commuteDistanceKm} km trip. Added to weekly impact streak!`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-warm-sm">
              <Compass className="w-4 h-4 font-bold" />
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-serif">
              {isHi ? 'प्रदूषण-सजग यात्रा तुलना' : 'Multimodal Commute: Inhaled Dose vs. Carbon Emissions'}
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
            Compare 5 transportation modes for your exact route. Balance personal particulate inhalation risk against urban emissions.
          </p>
        </div>

        {/* Distance Slider */}
        <div className="flex items-center gap-3 bg-warm-50 px-4 py-2.5 rounded-2xl border border-warm-200 text-xs self-stretch md:self-auto justify-between md:justify-start">
          <span className="text-stone-600 font-medium">Trip Distance:</span>
          <span className="text-orange-700 font-extrabold">{commuteDistanceKm} km</span>
          <input
            type="range"
            min="3"
            max="35"
            value={commuteDistanceKm}
            onChange={(e) => setCommuteDistanceKm(Number(e.target.value))}
            className="w-28 accent-amber-600"
          />
        </div>
      </div>

      {/* Origin / Destination Input Bar */}
      <div className="p-4 rounded-2xl bg-white border border-warm-200 shadow-warm-xs grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-warm-50 border border-warm-200">
          <MapPin className="w-4 h-4 text-orange-700 flex-shrink-0" />
          <span className="text-stone-500 font-semibold">Origin:</span>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="bg-transparent w-full text-stone-900 font-medium outline-none"
            placeholder="Starting location"
          />
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-warm-50 border border-warm-200">
          <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span className="text-stone-500 font-semibold">Destination:</span>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="bg-transparent w-full text-stone-900 font-medium outline-none"
            placeholder="Destination location"
          />
        </div>
      </div>

      {/* Mode Comparison Grid (5 Feasible Modes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {COMMUTE_MODES.map((mode) => {
          const isCurrent = userPreferences.primaryCommute === mode.id;
          const adjustedCo2 = (mode.co2EmissionsKg * (commuteDistanceKm / 12)).toFixed(2);
          const adjustedCost = Math.round(mode.costInr * (commuteDistanceKm / 12));
          const adjustedTime = Math.round(mode.travelTimeMin * (commuteDistanceKm / 12));

          return (
            <div
              key={mode.id}
              className={`p-4 rounded-3xl border transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'bg-amber-50/50 border-orange-500 shadow-warm-md ring-2 ring-orange-500/20'
                  : 'bg-white border-warm-200 hover:border-amber-300 shadow-warm-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 font-serif">{mode.name}</span>
                  {isCurrent && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-orange-700 text-white font-extrabold uppercase tracking-wider">
                      Selected
                    </span>
                  )}
                </div>

                {/* Inhaled Particulate Dose Gauge */}
                <div className="mt-3 p-2.5 rounded-2xl bg-warm-50/80 border border-warm-200">
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
                    <span className="font-bold">{adjustedTime} min</span>
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
                <p className="text-[10px] text-stone-500 line-clamp-3 leading-relaxed mb-3">
                  {mode.smogRecommendation}
                </p>

                <button
                  onClick={() => handleSelectAndLog(mode.id, mode.name)}
                  className={`w-full py-1.5 px-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-orange-700 text-white'
                      : 'bg-warm-100 hover:bg-warm-200 text-stone-800'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isCurrent ? 'Active Mode' : 'Choose Mode'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Active Mode Analysis */}
      <div className="p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-sm">
        <h3 className="text-base font-bold text-stone-900 font-serif mb-2">
          Recommended Smog Strategy for: <span className="text-orange-700">{selectedMode.name}</span> ({origin} → {destination})
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

      {/* Transparent Emissions & Inhaled Dose Methodology Box */}
      <div className="p-5 rounded-3xl bg-warm-50/80 border border-warm-200 text-xs text-stone-600 leading-relaxed space-y-2">
        <div className="flex items-center gap-2 font-bold text-stone-900 font-serif">
          <Info className="w-4 h-4 text-orange-700" />
          <span>Emissions & Exposure Calculation Assumptions:</span>
        </div>
        <p className="text-[11px]">
          • <strong>Emissions Factors:</strong> Metro electric grid: 0.015 kg CO₂/pass-km. 4-person carpool: 0.040 kg CO₂/pass-km. Solo petrol car: 0.170 kg CO₂/km. Four-stroke motorcycle: 0.045 kg CO₂/km. Active walking/cycling: 0 kg CO₂.
        </p>
        <p className="text-[11px]">
          • <strong>Inhaled Dose Score:</strong> Combines ambient tailpipe proximity with minute ventilation volume (6 L/min at rest in car/metro vs 35+ L/min while walking or cycling briskly in traffic plumes).
        </p>
      </div>
    </div>
  );
};
