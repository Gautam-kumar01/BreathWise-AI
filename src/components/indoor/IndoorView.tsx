import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INDOOR_HACKS } from '../../data/indoorChecklist';
import { 
  Home, 
  Wind, 
  ShieldAlert, 
  Check, 
  Sparkles, 
  Gauge, 
  Flame, 
  DoorClosed, 
  Eye, 
  HelpCircle 
} from 'lucide-react';

export const IndoorView: React.FC = () => {
  const { airData, language } = useApp();
  const [selectedRoom, setSelectedRoom] = useState<'all' | 'kitchen' | 'bedroom' | 'living'>('all');
  const [completedHacks, setCompletedHacks] = useState<string[]>([]);
  const isHi = language === 'hi';

  // Interactive Indoor Simulation State
  const [simCooking, setSimCooking] = useState<boolean>(true);
  const [simWindowsOpen, setSimWindowsOpen] = useState<boolean>(false);
  const [simIncense, setSimIncense] = useState<boolean>(false);
  const [simPurifier, setSimPurifier] = useState<boolean>(false);

  const isSafeToVentilate = airData.dailyForecastSummary.ventilationSafeNow;

  // Compute simulated indoor PM2.5 based on parameters
  const calculateIndoorPM25 = () => {
    let base = airData.pollutants.pm25 * (simWindowsOpen ? 0.85 : 0.45); // infiltration
    if (simCooking) base += 75;
    if (simIncense) base += 120;
    if (simPurifier) base *= 0.35;
    return Math.round(base);
  };

  const simulatedPM25 = calculateIndoorPM25();

  const filteredHacks = selectedRoom === 'all' 
    ? INDOOR_HACKS 
    : INDOOR_HACKS.filter(h => h.room === selectedRoom);

  const toggleHack = (id: string) => {
    setCompletedHacks(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-800">
              <Home className="w-4 h-4 font-bold" />
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-serif">
              {isHi ? 'घरेलू वायु सुरक्षा एवं वेंटिलेशन' : 'Indoor Air Defense & Ventilation Matrix'}
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Evidence-based source control and ventilation timing to keep indoor air clean without requiring expensive purifiers.
          </p>
        </div>
      </div>

      {/* Dynamic Ventilation Decision Matrix Banner */}
      <div className={`p-6 rounded-3xl border shadow-warm-md transition-all ${
        isSafeToVentilate
          ? 'bg-gradient-to-r from-amber-50 via-lime-50/50 to-stone-50 border-amber-300'
          : 'bg-gradient-to-r from-orange-50 via-amber-50 to-warm-100 border-orange-300'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`p-3.5 rounded-2xl flex-shrink-0 shadow-sm ${
              isSafeToVentilate 
                ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                : 'bg-orange-100 text-orange-900 border border-orange-200'
            }`}>
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-amber-800 block">
                Live Inversion-Aware Decision Engine
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-0.5 font-serif">
                {isSafeToVentilate 
                  ? 'Permitted for Controlled Cross-Ventilation (20 Mins)' 
                  : 'DO NOT Open Windows Right Now'}
              </h3>
              <p className="text-xs text-stone-600 mt-1 max-w-xl leading-relaxed">
                {airData.dailyForecastSummary.ventilationReason}
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-warm-200 sm:pl-6 self-stretch flex sm:flex-col justify-between items-center sm:items-end bg-white/70 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-warm-200">
            <span className="text-xs font-semibold text-stone-500">Outdoor PM2.5</span>
            <span className="text-2xl font-black text-orange-700">{airData.pollutants.pm25} µg/m³</span>
            <span className="text-[10px] text-stone-400 font-medium">Safe Limit: &lt;60 µg/m³</span>
          </div>
        </div>
      </div>

      {/* Interactive Indoor Air Quality Simulator */}
      <div className="p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-sm">
        <div className="flex items-center justify-between pb-3 border-b border-warm-200 mb-4">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-orange-700" />
            <h3 className="text-sm font-bold text-stone-900 font-serif">
              Indoor Air Quality Simulator & Source Control Testbed
            </h3>
          </div>
          <span className="text-[11px] text-stone-500 hidden sm:inline">
            Interactive micro-physics estimation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Controls */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Toggle 1: Cooking */}
            <button
              onClick={() => setSimCooking(!simCooking)}
              className={`p-3 rounded-2xl border text-left transition shadow-sm ${
                simCooking
                  ? 'bg-orange-50 border-orange-300 text-orange-950'
                  : 'bg-warm-50 border-warm-200 text-stone-600'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Stove / Tadka</span>
              <span className="text-xs font-bold block mt-1">Cooking Active</span>
              <span className={`text-[10px] font-semibold mt-1 inline-block ${simCooking ? 'text-orange-700' : 'text-stone-400'}`}>
                {simCooking ? '+75 µg/m³ PM2.5' : 'Stove Off'}
              </span>
            </button>

            {/* Toggle 2: Windows */}
            <button
              onClick={() => setSimWindowsOpen(!simWindowsOpen)}
              className={`p-3 rounded-2xl border text-left transition shadow-sm ${
                simWindowsOpen
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Windows</span>
              <span className="text-xs font-bold block mt-1">
                {simWindowsOpen ? 'Windows Open' : 'Windows Sealed'}
              </span>
              <span className="text-[10px] font-semibold mt-1 inline-block text-stone-500">
                {simWindowsOpen ? 'Smog ingress 85%' : 'Infiltration 45%'}
              </span>
            </button>

            {/* Toggle 3: Incense */}
            <button
              onClick={() => setSimIncense(!simIncense)}
              className={`p-3 rounded-2xl border text-left transition shadow-sm ${
                simIncense
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-warm-50 border-warm-200 text-stone-600'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Incense / Dhoop</span>
              <span className="text-xs font-bold block mt-1">Agarbatti Burning</span>
              <span className={`text-[10px] font-semibold mt-1 inline-block ${simIncense ? 'text-rose-700' : 'text-stone-400'}`}>
                {simIncense ? '+120 µg/m³ PM2.5' : 'Zero Burning'}
              </span>
            </button>

            {/* Toggle 4: Purifier / DIY Filter */}
            <button
              onClick={() => setSimPurifier(!simPurifier)}
              className={`p-3 rounded-2xl border text-left transition shadow-sm ${
                simPurifier
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-warm-50 border-warm-200 text-stone-600'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Filtration</span>
              <span className="text-xs font-bold block mt-1">Purifier / DIY Fan</span>
              <span className={`text-[10px] font-semibold mt-1 inline-block ${simPurifier ? 'text-emerald-700' : 'text-stone-400'}`}>
                {simPurifier ? 'Active (-65%)' : 'None Active'}
              </span>
            </button>
          </div>

          {/* Outcome Meter */}
          <div className="md:col-span-4 p-4 rounded-2xl bg-warm-50 border border-warm-200 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
              Estimated Room PM2.5
            </span>
            <div className={`text-4xl font-extrabold font-serif mt-1 ${
              simulatedPM25 > 150 ? 'text-rose-700' : simulatedPM25 > 60 ? 'text-orange-700' : 'text-emerald-700'
            }`}>
              {simulatedPM25} <span className="text-xs font-sans font-medium text-stone-500">µg/m³</span>
            </div>
            <p className="text-[11px] text-stone-600 mt-1">
              {simulatedPM25 > 150
                ? 'High risk: Aggravates respiratory irritation. Turn off incense and run kitchen exhaust.'
                : simulatedPM25 > 60
                ? 'Moderate level. Keep room sealed from outdoor road dust.'
                : 'Clean indoor pocket. Safe breathing zone for family.'}
            </p>
          </div>
        </div>
      </div>

      {/* Room Category Tabs */}
      <div className="flex gap-2 border-b border-warm-200 pb-2 overflow-x-auto">
        {[
          { id: 'all', label: 'All Action Hacks' },
          { id: 'kitchen', label: '🍳 Kitchen (Cooking Smoke)' },
          { id: 'bedroom', label: '🛏️ Bedroom (Night Inversion)' },
          { id: 'living', label: '🛋️ Living Room (Dust & Infiltration)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedRoom(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition shadow-sm ${
              selectedRoom === tab.id
                ? 'bg-amber-600 text-white shadow-warm-sm'
                : 'bg-white border border-warm-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hacks Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHacks.map((hack) => {
          const isDone = completedHacks.includes(hack.id);
          return (
            <div
              key={hack.id}
              className={`p-5 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-300 shadow-sm'
                  : 'bg-white border-warm-200 hover:border-amber-300 shadow-warm-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-warm-100 text-stone-800 border border-warm-200">
                    {hack.room}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                    {hack.costTier}
                  </span>
                </div>

                <button
                  onClick={() => toggleHack(hack.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition ${
                    isDone
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-warm-300 hover:border-amber-500 text-transparent bg-stone-50'
                  }`}
                  title={isDone ? 'Mark as pending' : 'Mark applied'}
                >
                  <Check className="w-4 h-4 fill-current" />
                </button>
              </div>

              <h4 className={`text-base font-bold mt-2.5 font-serif ${isDone ? 'text-stone-400 line-through' : 'text-stone-900'}`}>
                {hack.title}
              </h4>

              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {hack.action}
              </p>

              <div className="mt-3.5 pt-3 border-t border-warm-100 space-y-2 text-[11px]">
                <div className="text-stone-600">
                  <strong className="text-amber-900 font-bold">Why it works: </strong>
                  {hack.evidenceWhy}
                </div>
                <div className="text-orange-900/90 flex items-start gap-1.5 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 text-orange-700 mt-0.5" />
                  <span>{hack.safetyCaution}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
