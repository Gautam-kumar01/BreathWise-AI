import React, { useState } from 'react';
import { 
  Wind, 
  HeartPulse, 
  CalendarClock, 
  Home, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  X,
  ArrowRight
} from 'lucide-react';

interface PurposeExplainerProps {
  onExplorePlan: () => void;
  onExploreIndoor: () => void;
}

export const PurposeExplainer: React.FC<PurposeExplainerProps> = ({ onExplorePlan, onExploreIndoor }) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  if (isDismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white border border-warm-300 p-4 sm:p-7 shadow-warm-md">
      {/* Dismiss Button */}
      <button 
        onClick={() => setIsDismissed(true)}
        className="absolute top-3.5 right-3.5 p-1.5 rounded-full hover:bg-warm-100 text-stone-400 hover:text-stone-700 transition"
        title="Minimize overview"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header Tag */}
      <div className="flex items-center gap-2 mb-2 pr-8">
        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider bg-orange-100 text-orange-950 border border-orange-300">
          <Sparkles className="w-3.5 h-3.5 text-orange-700 flex-shrink-0" />
          What is BreatheWise AI?
        </span>
        <span className="text-[11px] text-stone-500 font-medium hidden sm:inline">
          Climate Sensing • Respiratory Protection • Routine Optimization
        </span>
      </div>

      {/* Main Punchy Value Proposition */}
      <div className="max-w-3xl mb-4 sm:mb-5">
        <h1 className="text-lg sm:text-2xl font-black text-stone-900 font-serif tracking-tight leading-snug">
          Not just a scary AQI number. Your personal defense companion for severe smog seasons.
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
          Standard weather apps show red numbers that cause panic without giving solutions. 
          <strong> BreatheWise AI</strong> translates real-time air pollution and atmospheric inversion data into 
          <strong> practical schedule changes, zero-cost indoor hacks, and safer commutes</strong> tailored to your family.
        </p>
      </div>

      {/* 4 Interactive Visual Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 pt-1">
        {/* Pillar 1 */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-warm-200 shadow-xs flex flex-col justify-between hover:border-amber-300 transition">
          <div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 mb-2">
              <Wind className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h4 className="text-xs font-bold text-stone-900 font-serif">1. Atmospheric Inversion Sensing</h4>
            <p className="text-[11px] text-stone-500 mt-1 leading-normal">
              Detects cold boundary layers trapping toxic vehicular soot near ground level during night and early morning.
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-warm-100 text-[10px] font-bold text-amber-900 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-amber-700" /> Real-time Inversion Data
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-warm-200 shadow-xs flex flex-col justify-between hover:border-orange-300 transition">
          <div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-800 mb-2">
              <HeartPulse className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h4 className="text-xs font-bold text-stone-900 font-serif">2. Respiratory Dose Defense</h4>
            <p className="text-[11px] text-stone-500 mt-1 leading-normal">
              Estimates actual inhaled alveolar particle mass and provides safeguards for kids, seniors, and asthma patients.
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-warm-100 text-[10px] font-bold text-orange-900 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-orange-700" /> Inhaled Dose Proxy
          </div>
        </div>

        {/* Pillar 3 */}
        <div 
          onClick={onExplorePlan}
          className="p-3.5 sm:p-4 rounded-2xl bg-white border border-warm-200 shadow-xs flex flex-col justify-between hover:border-amber-400 cursor-pointer transition group"
        >
          <div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 mb-2 group-hover:scale-105 transition-transform">
              <CalendarClock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h4 className="text-xs font-bold text-stone-900 font-serif">3. Time-Shifted Daily Plans</h4>
            <p className="text-[11px] text-stone-500 mt-1 leading-normal">
              Never cancel your day: simply shift morning workouts or errands to clean afternoon solar windows (1:30 PM–3:30 PM).
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-warm-100 text-[10px] font-bold text-amber-800 flex items-center justify-between">
            <span>Explore 7-Hour Plan</span> <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Pillar 4 */}
        <div 
          onClick={onExploreIndoor}
          className="p-3.5 sm:p-4 rounded-2xl bg-white border border-warm-200 shadow-xs flex flex-col justify-between hover:border-orange-400 cursor-pointer transition group"
        >
          <div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-warm-100 flex items-center justify-center text-stone-800 mb-2 group-hover:scale-105 transition-transform">
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h4 className="text-xs font-bold text-stone-900 font-serif">4. Zero-Cost Indoor Defense</h4>
            <p className="text-[11px] text-stone-500 mt-1 leading-normal">
              Keep rooms clean without ₹25k purifiers using kitchen exhaust pre-run, damp mopping, and window draft sealing.
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-warm-100 text-[10px] font-bold text-stone-800 flex items-center justify-between">
            <span>Explore Room Hacks</span> <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
