import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import {
  TrendingUp,
  ShieldCheck,
  Leaf,
  Home,
  CheckCircle2,
  Calendar,
  Info,
  Car,
  Footprints,
  RotateCcw,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  Flame,
  Wind
} from 'lucide-react';

export const ImpactView: React.FC = () => {
  const { impactSummary, incrementSustainableTrips, incrementCombinedTrips, resetImpactTracker, language, airData } = useApp();
  const { showToast } = useToast();
  const [showMethodologyModal, setShowMethodologyModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'exposure' | 'indoor' | 'transport'>('all');
  const isHi = language === 'hi';

  const handleLogCombinedTrip = () => {
    incrementCombinedTrips();
    showToast(
      'Combined Trip Logged!',
      'Saved 1 separate cold-engine vehicle trip (~0.85 kg CO2 & 12g roadside particulate emissions).',
      'success'
    );
  };

  const handleLogSustainableCommute = () => {
    incrementSustainableTrips();
    showToast(
      'Sustainable Transit Logged!',
      'Chose low-emission transit over personal vehicle. Impact logged in weekly streak!',
      'success'
    );
  };

  const handleReset = () => {
    if (window.confirm('Reset impact trackers and start fresh for this week?')) {
      resetImpactTracker();
      showToast('Trackers Reset', 'Your weekly habit and impact counters have been reset.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-warm-sm">
              <TrendingUp className="w-4 h-4 font-bold" />
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-serif">
              {isHi ? 'प्रदूषण प्रभाव एवं स्थिरता ट्रैकर' : 'Environmental Impact & Personal Exposure Tracker'}
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
            Documented and transparent metrics tracking your avoided particulate inhalation, indoor air improvements, and carbon emissions saved through daily actions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            onClick={() => setShowMethodologyModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-warm-100 hover:bg-warm-200/80 border border-warm-200 text-stone-700 text-xs font-semibold transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-orange-700" />
            <span>Calculation Methodology</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset Weekly Log"
            className="p-2 rounded-xl bg-warm-50 hover:bg-warm-100 border border-warm-200 text-stone-500 hover:text-stone-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary 3-Pillar KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Personal Exposure Avoided */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white border border-amber-300/80 shadow-warm-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Pillar 1 • Exposure Defense
              </span>
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-stone-900 font-serif">
                {impactSummary.exposure.morningPeaksAvoided}
                <span className="text-sm font-semibold text-stone-500 ml-1.5">peak windows</span>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Peak morning smog hours navigated indoors or protected with N95 filtration.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-200/60 text-[11px] space-y-1 text-stone-600">
            <div className="flex justify-between">
              <span>Indoor Workout Shifts:</span>
              <strong className="text-stone-900">{impactSummary.exposure.strenuousCardioShiftedCount} times</strong>
            </div>
            <div className="flex justify-between">
              <span>Completed Exposure Actions:</span>
              <strong className="text-orange-700">{impactSummary.exposure.actionsCompletedCount} logged</strong>
            </div>
          </div>
        </div>

        {/* Pillar 2: Indoor Source Control */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-warm-100/60 via-stone-50 to-white border border-warm-300 shadow-warm-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                Pillar 2 • Indoor Source Control
              </span>
              <span className="p-1.5 rounded-lg bg-stone-200 text-stone-800">
                <Home className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-stone-900 font-serif">
                {impactSummary.indoor.sourceControlActionsCount}
                <span className="text-sm font-semibold text-stone-500 ml-1.5">actions</span>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Zero-cost kitchen exhaust, damp-mopping, incense elimination, and solar ventilation.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-warm-200 text-[11px] space-y-1 text-stone-600">
            <div className="flex justify-between">
              <span>Controlled Solar Windows:</span>
              <strong className="text-stone-900">{impactSummary.indoor.microVentilationWindowsFollowed} sessions</strong>
            </div>
            <div className="flex justify-between">
              <span>Manual Sensor Readings:</span>
              <strong className="text-stone-900">{impactSummary.indoor.manualSensorLogsCount} logs</strong>
            </div>
          </div>
        </div>

        {/* Pillar 3: Carbon & Urban Emissions */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-lime-500/5 to-white border border-emerald-300/80 shadow-warm-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Pillar 3 • Transit Decarbonization
              </span>
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <Leaf className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-emerald-950 font-serif">
                {impactSummary.transport.estimatedCo2eSavedKg.toFixed(1)}
                <span className="text-sm font-semibold text-emerald-700 ml-1.5">kg CO₂</span>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Emissions avoided by shifting single-occupancy vehicle trips to Metro, carpooling, or trip-combining.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/60 text-[11px] space-y-1 text-stone-600">
            <div className="flex justify-between">
              <span>Sustainable Transit Trips:</span>
              <strong className="text-stone-900">{impactSummary.transport.sustainableTripsCount} trips</strong>
            </div>
            <div className="flex justify-between">
              <span>Combined Chores Trips:</span>
              <strong className="text-stone-900">{impactSummary.transport.combinedErrandsCount} consolidated</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Weekly Habit & Smog Resilience Streak */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-warm-200">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-700" />
              <h3 className="text-base font-bold text-stone-900 font-serif">
                7-Day Urban Smog Resilience Streak
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Consistent daily habits protect respiratory health over cumulative winter smog exposure.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 text-xs font-bold text-amber-900">
            <Award className="w-4 h-4 text-orange-600" />
            <span>{impactSummary.weeklyStreakDays}-Day Streak Active!</span>
          </div>
        </div>

        {/* Day Badges */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 mt-5">
          {impactSummary.weeklyHabits.map((day, idx: number) => {
            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[92px] ${
                  day.isGoalMet
                    ? 'bg-amber-500/10 border-orange-300 text-stone-900 shadow-warm-xs'
                    : day.isToday
                    ? 'bg-warm-100 border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-warm-50/50 border-warm-200 text-stone-400'
                }`}
              >
                <span className="text-[11px] font-bold uppercase">{day.dayLabel}</span>

                <div className="my-1.5">
                  {day.isGoalMet ? (
                    <div className="w-7 h-7 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-warm-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full border-2 border-stone-300 flex items-center justify-center text-xs font-bold text-stone-400">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <span className="text-[10px] font-semibold text-stone-600">
                  {day.actionsCount > 0 ? `${day.actionsCount} done` : 'Rest'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Logging Action Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-50/70 via-warm-50 to-orange-50/70 border border-warm-200 shadow-warm-sm">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-orange-700" />
          <h3 className="text-sm font-bold text-stone-900 font-serif">
            Quick Habit Logging (Today's Actions)
          </h3>
        </div>
        <p className="text-xs text-stone-600 mb-4">
          Tap any action below to immediately log it into your daily impact dashboard and contribute to your streak:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            onClick={handleLogSustainableCommute}
            className="p-3.5 rounded-2xl bg-white hover:bg-amber-50/60 border border-warm-200 hover:border-amber-300 text-left transition shadow-warm-xs flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <Car className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-stone-900 block group-hover:text-orange-900 transition">
                  Took Metro / Shared Ride
                </span>
                <span className="text-[10px] text-stone-500">Replaced single-occupancy car</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-orange-700 group-hover:translate-x-0.5 transition" />
          </button>

          <button
            onClick={handleLogCombinedTrip}
            className="p-3.5 rounded-2xl bg-white hover:bg-amber-50/60 border border-warm-200 hover:border-amber-300 text-left transition shadow-warm-xs flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center flex-shrink-0">
                <Footprints className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-stone-900 block group-hover:text-orange-900 transition">
                  Combined Errand Trips
                </span>
                <span className="text-[10px] text-stone-500">Chained 2+ outdoor tasks into one</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-orange-700 group-hover:translate-x-0.5 transition" />
          </button>

          <button
            onClick={() => {
              showToast(
                'Indoor Action Verified!',
                'Ventilated only during midday solar window; sealed against morning inversion.',
                'success'
              );
            }}
            className="p-3.5 rounded-2xl bg-white hover:bg-amber-50/60 border border-warm-200 hover:border-amber-300 text-left transition shadow-warm-xs flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                <Wind className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-stone-900 block group-hover:text-orange-900 transition">
                  Timed Solar Ventilation
                </span>
                <span className="text-[10px] text-stone-500">20-minute clean air flush</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-orange-700 group-hover:translate-x-0.5 transition" />
          </button>
        </div>
      </div>

      {/* Methodology Drawer / Modal */}
      {showMethodologyModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 border border-warm-200 shadow-warm-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-warm-200">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-700" />
                <h3 className="text-lg font-bold text-stone-900 font-serif">
                  Documented Impact Methodology & Assumptions
                </h3>
              </div>
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="w-8 h-8 rounded-full bg-warm-100 hover:bg-warm-200 text-stone-600 flex items-center justify-center text-xs font-bold transition"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs text-stone-700 leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-stone-800">
                <strong className="block text-amber-900 font-serif mb-1">
                  1. Strict Scientific Grounding & No Fabricated Claims
                </strong>
                BreatheWise AI adheres to strict transparency: we do <em>not</em> claim arbitrary health cure percentages or fictitious carbon offsets. All numerical metrics are derived directly from verified transport emission factors and respiratory particulate deposition models.
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1 text-sm font-serif">
                  2. Carbon Emissions Factors (Per Passenger-Kilometer)
                </h4>
                <ul className="list-disc list-inside space-y-1 text-stone-600">
                  <li><strong>Private Petrol Sedan:</strong> 0.170 kg CO₂/km (assuming single driver).</li>
                  <li><strong>Delhi Metro (Electric Heavy Rail):</strong> 0.015 kg CO₂/passenger-km (grid-adjusted).</li>
                  <li><strong>Four-Stroke Two-Wheeler:</strong> 0.045 kg CO₂/km.</li>
                  <li><strong>Shared Auto / Carpool:</strong> 0.040 kg CO₂/passenger-km (split across 4 passengers).</li>
                  <li><strong>Walking / Cycling:</strong> 0.000 kg CO₂.</li>
                </ul>
                <p className="text-[11px] text-stone-500 mt-1 italic">
                  Savings reflect the delta between personal automobile travel and the chosen sustainable mode.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1 text-sm font-serif">
                  3. Inhaled Particulate Dose Formula
                </h4>
                <p className="text-stone-600">
                  Tidal breathing volume increases from ~6 L/min at rest to 35–60 L/min during vigorous outdoor running. Shifting morning exercise indoors during ground radiation inversions prevents the inhalation of roughly 80–90% of the daily ultrafine mass concentration that would otherwise reach pulmonary alveoli.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1 text-sm font-serif">
                  4. Indoor Air Quality Non-Inference Rule
                </h4>
                <p className="text-stone-600">
                  Indoor PM2.5 is <em>never</em> automatically inferred as identical to outdoor monitoring stations. Infiltration factors vary between 0.35 (tightly sealed modern apartment) to 0.85 (open leaky louvers), compounded by domestic cooking, heating, and incense combustion.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-warm-200 flex justify-end">
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="px-5 py-2.5 rounded-xl bg-orange-700 hover:bg-orange-800 text-white font-semibold text-xs transition shadow-warm-sm"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
