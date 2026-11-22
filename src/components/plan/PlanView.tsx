import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { RecommendationItem, ActionStatus } from '../../types/plan';
import { 
  CalendarClock, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  Sparkles,
  Filter,
  PlusCircle,
  XCircle,
  RotateCcw,
  CalendarDays,
  ShieldCheck,
  FileEdit,
  ArrowRight
} from 'lucide-react';

export const PlanView: React.FC = () => {
  const { 
    userPreferences, 
    toggleActionCompletion, 
    customTasks, 
    addCustomTask, 
    rescheduleTask, 
    skipTask, 
    restoreTask, 
    language, 
    airData 
  } = useApp();
  const { showToast } = useToast();
  const isHi = language === 'hi';

  const [expandedId, setExpandedId] = useState<string | null>('rec-1');
  const [activeFilter, setActiveFilter] = useState<'all' | 'morning' | 'commute' | 'midday' | 'evening' | 'prep'>('all');
  
  // Custom Task Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAction, setNewAction] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('Morning (7:00 AM – 8:30 AM)');
  const [newSlotCategory, setNewSlotCategory] = useState<'morning' | 'commute' | 'midday' | 'evening' | 'prep'>('morning');
  const [newAlternative, setNewAlternative] = useState('');

  // Reschedule Modal State
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newRescheduledTime, setNewRescheduledTime] = useState('2:00 PM (Solar Inversion Break)');

  // Comprehensive 7-Slot Daily Smog Action Plan
  const defaultRecommendations: RecommendationItem[] = [
    {
      id: 'rec-1',
      slot: 'morning',
      timeSlot: 'Morning Routine (6:30 AM – 7:45 AM)',
      title: 'Postpone Ventilation & Shift Strenuous Exercise Indoors',
      actionText: 'Keep external windows firmly closed. Replace morning outdoor jogging or park walks with indoor mobility, bodyweight drills, or yoga in a sealed room.',
      urgency: airData.aqi > 250 ? 'critical' : 'recommended',
      provenance: {
        environmentalTrigger: `PM2.5 is ${airData.pollutants.pm25} µg/m³ during nocturnal radiation inversion boundary trapping.`,
        matchedPreference: `Exercise preference: ${userPreferences.exercisePreference}`,
        causalReasoning: 'Vigorous aerobic exertion multiplies minute ventilation from ~6 L/min to >40 L/min, driving soot deep into alveolar tissue.',
        lowCostAlternative: 'Indoor jump rope, static cycling, or yoga with doors sealed. Zero equipment cost: ₹0.',
        uncertainties: 'Assumes indoor space has not been exposed to early morning frying or biomass smoke.',
        estimatedExposureReduction: 'Avoids ~85% peak inhaled particulate dose during the hazardous morning inversion.'
      }
    },
    {
      id: 'rec-2',
      slot: 'commute',
      timeSlot: 'Office & School Commute (8:30 AM – 9:45 AM)',
      title: 'Air-Filtered Commute: Prefer Metro or Cabin AC Recirculation',
      actionText: 'Choose Delhi Metro or AC bus over open two-wheelers. If traveling in car/taxi, ensure the AC button is set to "Internal Recirculation" with fan speed 2.',
      urgency: 'critical',
      provenance: {
        environmentalTrigger: `Corridor NO2 & fine soot peak at ${airData.pollutants.no2} µg/m³ from diesel truck congestion and low wind speed.`,
        matchedPreference: `Primary Commute: ${userPreferences.primaryCommute}`,
        causalReasoning: 'Open two-wheelers and auto-rickshaws position commuters directly at exhaust tailpipe level with zero mechanical filtration.',
        lowCostAlternative: 'Wear an airtight ISI-marked N95 mask if two-wheeler or walking commute is unavoidable. Cost: ~₹30.',
        uncertainties: 'Last-mile walking to stations still presents moderate outdoor exposure.',
        estimatedExposureReduction: 'Cuts transit particulate inhalation by ~70% compared to open road exposure.'
      }
    },
    {
      id: 'rec-3',
      slot: 'midday',
      timeSlot: 'Solar Inversion Break (1:30 PM – 3:30 PM)',
      title: 'Controlled Cross-Ventilation & Stale CO₂ Purge',
      actionText: 'Open opposing windows away from traffic for exactly 20 minutes to purge built-up indoor carbon dioxide without letting excessive soot settle.',
      urgency: 'recommended',
      provenance: {
        environmentalTrigger: `Solar heating warms the surface, raising the boundary layer mixing height and dropping AQI to diurnal low (~${Math.round(airData.aqi * 0.65)}).`,
        matchedPreference: 'Indoor family air safety protocol',
        causalReasoning: 'Sealed rooms easily exceed 1,400 ppm CO2, causing afternoon lethargy and headaches. Midday is the scientifically safest air exchange window.',
        lowCostAlternative: 'Open opposite doors to create a gentle 15-minute cross-breeze. Cost: ₹0.',
        uncertainties: 'Keep duration under 25 minutes if neighborhood construction or sweeping is nearby.',
        estimatedExposureReduction: 'Replaces stale indoor CO2 with fresh oxygen while staying within the day\'s lowest ambient PM2.5 period.'
      }
    },
    {
      id: 'rec-4',
      slot: 'evening',
      timeSlot: 'Afternoon Errands & Market Trips (4:30 PM – 6:00 PM)',
      title: 'Consolidated Chores Trip Before Boundary Layer Descent',
      actionText: 'Complete neighborhood grocery runs, pharmacy pick-ups, or outdoor errands before 6:00 PM before cooling air traps evening biomass and vehicle smoke.',
      urgency: 'recommended',
      provenance: {
        environmentalTrigger: 'Sunset ground cooling triggers rapid compression of the thermal boundary layer between 6:00 PM and 7:30 PM.',
        matchedPreference: 'Daily chores & shopping routine',
        causalReasoning: 'Trip chaining prevents cold vehicle engine restarts and limits exposure before the intense evening smog spike.',
        lowCostAlternative: 'Combine multiple errands into a single 30-minute excursion. Cost: ₹0.',
        uncertainties: 'High commercial market foot traffic can create localized dust resuspension.',
        estimatedExposureReduction: 'Prevents stepping outdoors into the second daily pollution peak.'
      }
    },
    {
      id: 'rec-5',
      slot: 'evening',
      timeSlot: 'Evening Cooking & Living Room Defense (7:30 PM – 9:30 PM)',
      title: 'Pre-Run Exhaust Fan & Zero Agarbatti/Incense Protocol',
      actionText: 'Turn on kitchen exhaust 2 minutes BEFORE lighting the stove. Keep bedroom doors shut. Do not burn scented candles, dhoop, or mosquito coils.',
      urgency: 'critical',
      provenance: {
        environmentalTrigger: 'Night inversion traps neighborhood domestic emissions, outdoor AQI climbs toward nocturnal peak.',
        matchedPreference: `Household: ${userPreferences.household}, Kitchen exhaust: ${userPreferences.hasKitchenExhaust ? 'Present' : 'None'}`,
        causalReasoning: 'Indoor oil vapor aerosolization and incense smoke add 150–400 µg/m³ of ultrafine carbon directly into family breathing spaces.',
        lowCostAlternative: 'Use electric camphor warmers or liquid mosquito vaporizers; cook with lids tightly secured. Cost: ₹0.',
        uncertainties: 'Non-ducted exhaust fans may recirculate partial fumes without an open exterior vent.',
        estimatedExposureReduction: 'Prevents indoor PM2.5 from exceeding 300 µg/m³ during dinner hours.'
      }
    },
    {
      id: 'rec-6',
      slot: 'prep',
      timeSlot: 'Tomorrow\'s Preparation (9:30 PM – 10:30 PM)',
      title: 'Seal Sleeping Quarters & Prepare N95 Masks for Morning',
      actionText: 'Damp-mop bedroom floor to trap settled dust. Place door draft blocker under bedroom door. Inspect N95 respirators for tomorrow\'s morning departure.',
      urgency: 'recommended',
      provenance: {
        environmentalTrigger: 'Nighttime ground stagnation results in maximum particle concentration between 11 PM and 8 AM.',
        matchedPreference: 'Night recovery & sleep defense',
        causalReasoning: 'We spend 7–8 continuous hours breathing in the bedroom. Sealing infiltration prevents nighttime respiratory irritation and morning throat phlegm.',
        lowCostAlternative: 'Roll a damp towel along bottom door crack. Cost: ₹0.',
        uncertainties: 'In older non-airtight buildings, small window frame leaks can still permit 30-40% soot infiltration.',
        estimatedExposureReduction: 'Lowers sleeping particulate exposure dose by ~50% across an 8-hour sleep cycle.'
      }
    }
  ];

  // Merge default recommendations with custom user tasks
  const allRecommendations: RecommendationItem[] = [
    ...defaultRecommendations.map(rec => {
      const customOverride = customTasks.find(c => c.id === rec.id);
      if (customOverride) {
        return {
          ...rec,
          status: customOverride.status,
          rescheduledTime: customOverride.rescheduledTime
        };
      }
      return rec;
    }),
    ...customTasks.filter(c => c.isCustomTask)
  ];

  const filtered = activeFilter === 'all'
    ? allRecommendations
    : allRecommendations.filter(r => r.slot === activeFilter);

  const completedCount = allRecommendations.filter(
    r => userPreferences.completedActionIds.includes(r.id) || r.status === 'completed'
  ).length;

  const totalActiveTasks = allRecommendations.filter(r => r.status !== 'skipped').length;
  const progressPercent = totalActiveTasks > 0 ? Math.round((completedCount / totalActiveTasks) * 100) : 0;

  const handleCreateCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAction.trim()) return;

    addCustomTask({
      slot: newSlotCategory,
      timeSlot: newTimeSlot,
      title: newTitle,
      actionText: newAction,
      urgency: 'recommended',
      isCustomTask: true,
      tags: ['custom'],
      provenance: {
        environmentalTrigger: `User scheduled during local AQI ${airData.aqi} conditions in ${airData.metadata.city}.`,
        matchedPreference: 'User-defined daily schedule entry',
        causalReasoning: 'Custom activity aligned with diurnal air quality optimization.',
        lowCostAlternative: newAlternative || 'Perform indoors or schedule during midday solar window.',
        uncertainties: 'Custom entry; monitor personal comfort and symptom response.',
        estimatedExposureReduction: 'Custom user routine action'
      }
    });

    showToast('Activity Added!', `"${newTitle}" added to your daily schedule plan.`, 'success');
    setShowAddModal(false);
    setNewTitle('');
    setNewAction('');
    setNewAlternative('');
  };

  const handleRescheduleSubmit = (id: string) => {
    if (!newRescheduledTime.trim()) return;
    rescheduleTask(id, newRescheduledTime);
    showToast('Time Rescheduled!', `Activity moved to ${newRescheduledTime}.`, 'info');
    setReschedulingId(null);
  };

  const handleSkip = (id: string, title: string) => {
    skipTask(id);
    showToast('Activity Skipped', `"${title}" marked as skipped for today.`, 'warning');
  };

  const handleRestore = (id: string, title: string) => {
    restoreTask(id);
    showToast('Activity Restored', `"${title}" has been restored to pending.`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header with Progress Bar & Add Activity Button */}
      <div className="p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-warm-sm">
              <CalendarClock className="w-4 h-4 font-bold" />
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-serif">
              {isHi ? 'आपकी व्यक्तिगत वायु कार्ययोजना' : 'AI Personalized Daily Smog Routine Planner'}
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
            Time-calibrated schedule tailored to {airData.metadata.stationName}'s atmospheric inversion curve, commute choice, and household profile.
          </p>
        </div>

        {/* Action Controls & Progress Widget */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-orange-700 hover:bg-orange-800 text-white text-xs font-semibold transition shadow-warm-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Custom Activity</span>
          </button>

          <div className="flex items-center gap-3 bg-warm-50/90 border border-warm-200/90 px-4 py-2 rounded-2xl">
            <div>
              <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                Progress
              </div>
              <div className="text-sm font-extrabold text-stone-900">
                <span className="text-orange-700">{completedCount}</span> / {totalActiveTasks}
              </div>
            </div>
            <div className="w-10 h-10 relative flex items-center justify-center">
              <svg className="w-9 h-9 transform -rotate-90">
                <circle cx="18" cy="18" r="14" stroke="currentColor" strokeWidth="3" className="text-warm-200" fill="transparent" />
                <circle 
                  cx="18" 
                  cy="18" 
                  r="14" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeDasharray="88" 
                  strokeDashoffset={88 - (88 * progressPercent) / 100} 
                  className="text-orange-600 transition-all duration-500" 
                  fill="transparent" 
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-stone-800">{progressPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Routine Filter Tabs */}
      <div className="flex gap-2 border-b border-warm-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All 7 Routine Blocks' },
          { id: 'morning', label: '🌅 Morning (6:30–9 AM)' },
          { id: 'commute', label: '🚗 Transit Commute' },
          { id: 'midday', label: '☀️ Midday Solar Break' },
          { id: 'evening', label: '🌙 Evening & Cooking' },
          { id: 'prep', label: '🛏️ Tomorrow\'s Prep' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap shadow-sm min-h-[36px] ${
              activeFilter === f.id
                ? 'bg-orange-700 text-white shadow-warm-sm'
                : 'bg-white border border-warm-200 text-stone-600 hover:text-stone-900 hover:bg-warm-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Routine Blocks List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-warm-200 text-stone-500 text-xs">
            No activities in this routine block. You can click <strong>"Add Custom Activity"</strong> above to schedule one.
          </div>
        ) : (
          filtered.map((rec) => {
            const isDone = userPreferences.completedActionIds.includes(rec.id) || rec.status === 'completed';
            const isSkipped = rec.status === 'skipped';
            const isRescheduled = !!rec.rescheduledTime;
            const isExpanded = expandedId === rec.id;

            return (
              <div
                key={rec.id}
                className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                  isSkipped
                    ? 'bg-stone-100/70 border-warm-200 opacity-60'
                    : isDone
                    ? 'bg-emerald-50/40 border-emerald-300 shadow-sm'
                    : isRescheduled
                    ? 'bg-amber-50/30 border-amber-300 shadow-warm-sm'
                    : 'bg-white border-warm-200 hover:border-amber-300 shadow-warm-sm'
                }`}
              >
                {/* Main Card Content */}
                <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1">
                    {/* Completion Checkbox */}
                    <button
                      disabled={isSkipped}
                      onClick={() => {
                        toggleActionCompletion(rec.id);
                        showToast(
                          isDone ? 'Marked Incomplete' : 'Activity Completed!',
                          isDone ? `Reopened "${rec.title}"` : `Completed "${rec.title}". Great work on reducing your pollution footprint!`,
                          isDone ? 'info' : 'success'
                        );
                      }}
                      className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center transition border flex-shrink-0 ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : isSkipped
                          ? 'border-stone-300 bg-stone-200 text-stone-400 cursor-not-allowed'
                          : 'border-warm-300 hover:border-orange-500 text-transparent bg-stone-50'
                      }`}
                      title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      <CheckCircle2 className="w-4 h-4 fill-current" />
                    </button>

                    <div>
                      {/* Meta badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-warm-100 text-stone-800 flex items-center gap-1 border border-warm-200">
                          <Clock className="w-3 h-3 text-amber-700" />
                          {rec.rescheduledTime ? (
                            <span className="text-orange-800 font-extrabold flex items-center gap-1">
                              Rescheduled: {rec.rescheduledTime}
                            </span>
                          ) : (
                            rec.timeSlot
                          )}
                        </span>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          rec.urgency === 'critical' 
                            ? 'bg-rose-100 text-rose-900 border border-rose-200' 
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {rec.urgency}
                        </span>

                        {rec.isCustomTask && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                            Custom Task
                          </span>
                        )}

                        {isSkipped && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                            Skipped for Today
                          </span>
                        )}
                      </div>

                      <h3 className={`text-base font-bold mt-2 font-serif ${isDone ? 'text-stone-400 line-through' : 'text-stone-900'}`}>
                        {rec.title}
                      </h3>

                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {rec.actionText}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions: Complete / Skip / Reschedule / Evidence */}
                  <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
                    {isSkipped ? (
                      <button
                        onClick={() => handleRestore(rec.id, rec.title)}
                        className="px-2.5 py-1.5 rounded-xl bg-warm-100 hover:bg-warm-200 text-xs font-semibold text-stone-700 transition flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3 text-stone-600" />
                        <span>Restore</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setReschedulingId(rec.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-warm-50 hover:bg-warm-100 text-xs font-semibold text-stone-700 border border-warm-200 transition"
                          title="Reschedule this task"
                        >
                          Reschedule
                        </button>

                        <button
                          onClick={() => handleSkip(rec.id, rec.title)}
                          className="px-2 py-1.5 rounded-xl text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-warm-100 transition"
                          title="Skip for today"
                        >
                          Skip
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warm-100/70 hover:bg-warm-200/80 text-xs font-bold text-orange-950 border border-warm-200 transition shadow-sm"
                    >
                      <span>{isExpanded ? 'Hide' : 'Why this recommendation?'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Inline Reschedule Dialog */}
                {reschedulingId === rec.id && (
                  <div className="p-4 bg-amber-50/80 border-t border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-700" />
                      <span className="font-bold text-stone-900">Set new suggested time:</span>
                      <input
                        type="text"
                        value={newRescheduledTime}
                        onChange={(e) => setNewRescheduledTime(e.target.value)}
                        placeholder="e.g. 2:00 PM (Solar Inversion Break)"
                        className="px-3 py-1.5 rounded-lg border border-warm-300 text-xs w-64 bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRescheduleSubmit(rec.id)}
                        className="px-3 py-1.5 rounded-lg bg-orange-700 text-white font-semibold text-xs hover:bg-orange-800 transition"
                      >
                        Confirm Time
                      </button>
                      <button
                        onClick={() => setReschedulingId(null)}
                        className="px-2.5 py-1.5 text-stone-600 hover:text-stone-900 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Signature Differentiator: Expandable "Why this recommendation?" Provenance Drawer */}
                {isExpanded && (
                  <div className="bg-warm-50/80 border-t border-warm-200 p-5 space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-warm-200">
                      <span className="font-bold text-orange-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-orange-700" />
                        Transparent Data Provenance & Scientific Justification (XAI)
                      </span>
                      <span className="text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {rec.provenance.estimatedExposureReduction}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div className="p-3.5 rounded-2xl bg-white border border-warm-200 shadow-sm">
                        <strong className="text-stone-500 text-[10px] uppercase tracking-wider block mb-1">
                          1. Relevant Environmental Data Used:
                        </strong>
                        <p className="text-stone-900 font-semibold">{rec.provenance.environmentalTrigger}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white border border-warm-200 shadow-sm">
                        <strong className="text-stone-500 text-[10px] uppercase tracking-wider block mb-1">
                          2. User Routine & Context Matched:
                        </strong>
                        <p className="text-stone-900 font-semibold">{rec.provenance.matchedPreference}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white border border-warm-200 shadow-sm md:col-span-2">
                        <strong className="text-stone-500 text-[10px] uppercase tracking-wider block mb-1">
                          3. Causal Scientific Reasoning:
                        </strong>
                        <p className="text-stone-800 leading-relaxed">{rec.provenance.causalReasoning}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-sm">
                        <strong className="text-amber-900 text-[10px] uppercase tracking-wider block mb-1">
                          4. Practical Low-Cost / Zero-Cost Alternative:
                        </strong>
                        <p className="text-stone-900 font-medium">{rec.provenance.lowCostAlternative}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-stone-50 border border-warm-200 shadow-sm">
                        <strong className="text-orange-900 text-[10px] uppercase tracking-wider block mb-1">
                          5. Model Limitations & Uncertainty:
                        </strong>
                        <p className="text-stone-700">{rec.provenance.uncertainties}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-warm-200 shadow-warm-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-warm-200">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-orange-700" />
                <h3 className="text-base font-bold text-stone-900 font-serif">
                  Add Custom Activity to Daily Smog Plan
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-warm-100 hover:bg-warm-200 text-stone-600 flex items-center justify-center text-xs font-bold transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomTask} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Routine Category / Timing Block:
                </label>
                <select
                  value={newSlotCategory}
                  onChange={(e) => setNewSlotCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-warm-300 bg-warm-50 text-stone-900 font-medium"
                >
                  <option value="morning">Morning Routine (6:00 – 9:00 AM)</option>
                  <option value="commute">Commute Transit (8:30 – 10:00 AM)</option>
                  <option value="midday">Midday Solar Break (1:00 – 3:30 PM)</option>
                  <option value="evening">Evening Routine & Cooking (6:00 – 9:00 PM)</option>
                  <option value="prep">Tomorrow's Night Prep (9:30 – 10:30 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Time Slot Label:
                </label>
                <input
                  type="text"
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  placeholder="e.g. Afternoon (2:30 PM – 3:30 PM)"
                  className="w-full px-3 py-2 rounded-xl border border-warm-300 text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Activity Title:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Child Evening Play in Community Club House"
                  className="w-full px-3 py-2 rounded-xl border border-warm-300 text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Action Instructions:
                </label>
                <textarea
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  placeholder="e.g. Shift outdoor turf play to the indoor recreation hall to avoid evening ground smog accumulation."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-warm-300 text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Practical Alternative (Low/Zero Cost):
                </label>
                <input
                  type="text"
                  value={newAlternative}
                  onChange={(e) => setNewAlternative(e.target.value)}
                  placeholder="e.g. Board games, indoor gymnastics, or library time. Cost: ₹0."
                  className="w-full px-3 py-2 rounded-xl border border-warm-300 text-stone-900"
                />
              </div>

              <div className="pt-3 border-t border-warm-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-warm-100 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-700 hover:bg-orange-800 text-white font-semibold transition shadow-warm-sm"
                >
                  Add to My Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};