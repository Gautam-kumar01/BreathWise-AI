import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CalendarClock, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  Sparkles,
  Filter,
  RefreshCw,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

export const PlanView: React.FC = () => {
  const { userPreferences, toggleActionCompletion, language, airData } = useApp();
  const isHi = language === 'hi';
  const [expandedId, setExpandedId] = useState<string | null>('rec-1');
  const [activeFilter, setActiveFilter] = useState<'all' | 'morning' | 'commute' | 'midday' | 'evening'>('all');

  const recommendations = [
    {
      id: 'rec-1',
      slot: 'morning',
      timeSlot: 'Morning (6:30 AM – 9:00 AM)',
      title: 'Shift Strenuous Outdoor Exercise to Indoor Alternative',
      actionText: 'Cancel outdoor running or brisk walking in parks. Perform a 25-minute indoor mobility or bodyweight workout in a closed room.',
      urgency: airData.aqi > 300 ? 'critical' : 'recommended',
      provenance: {
        environmentalTrigger: `PM2.5 is ${airData.pollutants.pm25} µg/m³ during peak radiation inversion.`,
        matchedPreference: `User routine: Outdoor exercise (${userPreferences.exercisePreference})`,
        causalReasoning: 'Aerobic exertion increases tidal breathing volume by 6x–10x, deeply lodging ultrafine particles into lung alveoli.',
        lowCostAlternative: 'Indoor jump rope or resistance training with windows closed. Cost: ₹0.',
        uncertainties: 'Assumes indoor space has not been exposed to morning frying or incense.',
        estimatedExposureReduction: 'Avoids ~85% peak inhaled particulate dose during highest morning hazard window.'
      }
    },
    {
      id: 'rec-2',
      slot: 'commute',
      timeSlot: 'Commute (8:30 AM – 9:30 AM)',
      title: 'Opt for Sealed Metro Transit or AC Recirculation',
      actionText: 'If traveling, prefer Delhi Metro over open two-wheelers. If in cab/car, turn AC switch to "Internal Recirculation".',
      urgency: 'critical',
      provenance: {
        environmentalTrigger: `Roadside PM2.5 and diesel NO2 peak to ${airData.pollutants.no2} µg/m³ in dense traffic corridors.`,
        matchedPreference: `Commute mode: ${userPreferences.primaryCommute}`,
        causalReasoning: 'Open two-wheelers and autos sit at exhaust-pipe level, receiving direct unfiltered soot plumes.',
        lowCostAlternative: 'Wear a tight-fitting N95 mask if two-wheeler travel is unavoidable. Cost: ~₹30.',
        uncertainties: 'Last-mile walking to metro station still presents brief exposure.',
        estimatedExposureReduction: 'Reduces commute particulate exposure by ~70% compared to open motorcycle.'
      }
    },
    {
      id: 'rec-3',
      slot: 'midday',
      timeSlot: 'Midday (1:30 PM – 3:30 PM)',
      title: 'Solar Inversion Break: Controlled Micro-Ventilation',
      actionText: 'Open cross-ventilation windows for 20 minutes away from main street to purge indoor stale CO2.',
      urgency: 'recommended',
      provenance: {
        environmentalTrigger: `Solar heating breaks boundary layer inversion; AQI drops to daily low (~${Math.round(airData.aqi * 0.65)}).`,
        matchedPreference: 'Indoor household air quality management',
        causalReasoning: 'CO2 buildup from closed rooms causes headaches and cognitive fatigue; 1:30–3:30 PM is the safest daily exchange window.',
        lowCostAlternative: 'Air out rooms using opposite-facing balcony doors. Cost: ₹0.',
        uncertainties: 'Keep window duration under 25 minutes if nearby construction dust is present.',
        estimatedExposureReduction: 'Balances fresh oxygen influx while minimizing peak soot ingress.'
      }
    },
    {
      id: 'rec-4',
      slot: 'evening',
      timeSlot: 'Evening & Dinner (7:30 PM – 9:30 PM)',
      title: 'Zero Indoor Incense & Exhaust Fan Protocol',
      actionText: 'Run kitchen exhaust fan during all cooking. Avoid lighting dhoop, agarbatti, or scented candles.',
      urgency: 'critical',
      provenance: {
        environmentalTrigger: 'Evening cooling traps domestic cooking and neighborhood biomass smoke.',
        matchedPreference: `Household: ${userPreferences.household}, Exhaust fan present: ${userPreferences.hasKitchenExhaust ? 'Yes' : 'No'}`,
        causalReasoning: 'A single incense stick emits particulate mass equivalent to multiple cigarettes in an unventilated room.',
        lowCostAlternative: 'Use electric camphor warmers or lid-covered simmering. Cost: ₹0.',
        uncertainties: 'Does not replace certified medical grade purifiers, but suppresses primary indoor sources.',
        estimatedExposureReduction: 'Prevents indoor PM2.5 spikes from exceeding 350 µg/m³ in living quarters.'
      }
    }
  ];

  const filtered = activeFilter === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.slot === activeFilter);

  const completedCount = userPreferences.completedActionIds.length;
  const progressPercent = Math.round((completedCount / recommendations.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header with Progress Bar */}
      <div className="p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <CalendarClock className="w-4 h-4 font-bold" />
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-serif">
              {isHi ? 'आपकी व्यक्तिगत वायु कार्ययोजना' : 'Personalized Daily Air-Quality Action Plan'}
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Engineered specifically for your household, commute mode, and today's diurnal smog inversion curve.
          </p>
        </div>

        {/* Progress summary widget */}
        <div className="flex items-center gap-4 bg-warm-50/80 border border-warm-200/90 px-4 py-2.5 rounded-2xl">
          <div>
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Today's Actions Completed
            </div>
            <div className="text-sm font-extrabold text-stone-900">
              <span className="text-orange-700">{completedCount}</span> of {recommendations.length} ({progressPercent}%)
            </div>
          </div>
          <div className="w-12 h-12 relative flex items-center justify-center">
            <svg className="w-10 h-10 transform -rotate-90">
              <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" className="text-warm-200" fill="transparent" />
              <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - progressPercent} className="text-orange-600 transition-all duration-500" fill="transparent" />
            </svg>
            <span className="absolute text-[10px] font-bold text-stone-800">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-warm-200 pb-2 overflow-x-auto">
        {[
          { id: 'all', label: 'All Routine Blocks' },
          { id: 'morning', label: '🌅 Morning (6-9 AM)' },
          { id: 'commute', label: '🚗 Commute Transit' },
          { id: 'midday', label: '☀️ Midday Solar Dip' },
          { id: 'evening', label: '🌙 Evening & Night' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
              activeFilter === f.id
                ? 'bg-amber-600 text-white shadow-warm-sm'
                : 'bg-white border border-warm-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {filtered.map((rec) => {
          const isDone = userPreferences.completedActionIds.includes(rec.id);
          const isExpanded = expandedId === rec.id;

          return (
            <div
              key={rec.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isDone 
                  ? 'bg-emerald-50/40 border-emerald-300 shadow-sm' 
                  : 'bg-white border-warm-200 hover:border-amber-300 shadow-warm-sm'
              }`}
            >
              <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5 flex-1">
                  <button
                    onClick={() => toggleActionCompletion(rec.id)}
                    className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center transition border ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-warm-300 hover:border-amber-500 text-transparent bg-stone-50'
                    }`}
                    title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-warm-100 text-stone-800 flex items-center gap-1 border border-warm-200">
                        <Clock className="w-3 h-3 text-amber-700" />
                        {rec.timeSlot}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        rec.urgency === 'critical' 
                          ? 'bg-rose-100 text-rose-900 border border-rose-200' 
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}>
                        {rec.urgency}
                      </span>
                    </div>

                    <h3 className={`text-base font-bold mt-2 font-serif ${isDone ? 'text-stone-400 line-through' : 'text-stone-900'}`}>
                      {rec.title}
                    </h3>

                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {rec.actionText}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warm-50 hover:bg-warm-100 text-xs font-bold text-amber-900 border border-warm-200 transition shadow-sm"
                  >
                    <span>{isExpanded ? 'Hide Evidence' : 'Why this recommendation?'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Signature Differentiator: Expandable "Why this recommendation?" Drawer */}
              {isExpanded && (
                <div className="bg-warm-50/80 border-t border-warm-200 p-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-warm-200">
                    <span className="font-bold text-orange-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-orange-700" />
                      Transparent Data Provenance & Scientific Justification (XAI)
                    </span>
                    <span className="text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {rec.provenance.estimatedExposureReduction}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="p-3.5 rounded-xl bg-white border border-warm-200 shadow-sm">
                      <strong className="text-stone-500 text-[11px] uppercase tracking-wider block mb-1">1. Environmental Trigger:</strong>
                      <p className="text-stone-900 font-medium">{rec.provenance.environmentalTrigger}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-warm-200 shadow-sm">
                      <strong className="text-stone-500 text-[11px] uppercase tracking-wider block mb-1">2. User Context Matched:</strong>
                      <p className="text-stone-900 font-medium">{rec.provenance.matchedPreference}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-warm-200 shadow-sm md:col-span-2">
                      <strong className="text-stone-500 text-[11px] uppercase tracking-wider block mb-1">3. Causal Scientific Mechanism:</strong>
                      <p className="text-stone-800 leading-relaxed">{rec.provenance.causalReasoning}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 shadow-sm">
                      <strong className="text-amber-900 text-[11px] uppercase tracking-wider block mb-1">4. Zero-Cost / Low-Cost Alternative:</strong>
                      <p className="text-stone-900 font-medium">{rec.provenance.lowCostAlternative}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-stone-50 border border-warm-200 shadow-sm">
                      <strong className="text-orange-800 text-[11px] uppercase tracking-wider block mb-1">5. Stated Uncertainty & Assumptions:</strong>
                      <p className="text-stone-700">{rec.provenance.uncertainties}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
