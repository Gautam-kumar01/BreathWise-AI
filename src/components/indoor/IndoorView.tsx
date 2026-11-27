import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { INDOOR_HACKS } from '../../data/indoorChecklist';
import { RoomType, IndoorSensorLog } from '../../types/indoor';
import { 
  Home, 
  Wind, 
  Check, 
  Gauge, 
  PlusCircle,
  Activity,
  Trash2,
  Wrench,
  AlertTriangle
} from 'lucide-react';

export const IndoorView: React.FC = () => {
  const { airData, language, sensorLogs, addSensorLog, removeSensorLog } = useApp();
  const { showToast } = useToast();
  const [selectedRoom, setSelectedRoom] = useState<RoomType | 'all'>('all');
  const [completedHacks, setCompletedHacks] = useState<string[]>([]);
  const isHi = language === 'hi';

  // Manual Sensor Modal State
  const [showSensorModal, setShowSensorModal] = useState<boolean>(false);
  const [sensorRoom, setSensorRoom] = useState<RoomType>('bedroom');
  const [sensorPm25, setSensorPm25] = useState<number>(45);
  const [sensorCo2, setSensorCo2] = useState<number>(750);
  const [sensorDevice, setSensorDevice] = useState<string>('Sensirion SPS30 / DIY Monitor');
  const [sensorNote, setSensorNote] = useState<string>('');

  // Interactive Indoor Simulation State
  const [simCooking, setSimCooking] = useState<boolean>(false);
  const [simWindowsOpen, setSimWindowsOpen] = useState<boolean>(false);
  const [simIncense, setSimIncense] = useState<boolean>(false);
  const [simPurifier, setSimPurifier] = useState<boolean>(true);

  const isSafeToVentilate = airData.dailyForecastSummary.ventilationSafeNow;

  // Compute simulated indoor PM2.5 based on microclimate parameters
  const calculateIndoorPM25 = () => {
    let base = airData.pollutants.pm25 * (simWindowsOpen ? 0.85 : 0.40); // infiltration factor
    if (simCooking) base += 85;
    if (simIncense) base += 130;
    if (simPurifier) base *= 0.35;
    return Math.round(base);
  };

  const simulatedPM25 = calculateIndoorPM25();

  const filteredHacks = selectedRoom === 'all' 
    ? INDOOR_HACKS 
    : INDOOR_HACKS.filter(h => h.room === selectedRoom);

  const toggleHack = (id: string, title: string) => {
    const isDone = completedHacks.includes(id);
    setCompletedHacks(prev => 
      isDone ? prev.filter(x => x !== id) : [...prev, id]
    );
    showToast(
      isDone ? 'Indoor Hack Reopened' : 'Indoor Hack Completed!',
      isDone ? `Reopened "${title}"` : `Applied "${title}" in your household defense.`,
      isDone ? 'info' : 'success'
    );
  };

  const handleAddSensorLog = (e: React.FormEvent) => {
    e.preventDefault();
    addSensorLog({
      room: sensorRoom,
      pm25: Number(sensorPm25),
      co2Ppm: sensorCo2 ? Number(sensorCo2) : undefined,
      deviceModel: sensorDevice || 'Manual Laser Monitor',
      note: sensorNote || undefined
    });
    showToast('Indoor Reading Logged!', `Recorded PM2.5 of ${sensorPm25} µg/m³ for ${sensorRoom}.`, 'success');
    setShowSensorModal(false);
    setSensorNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-warm-sm">
              <Home className="w-4 h-4 font-bold" />
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-serif">
              {isHi ? 'घरेलू वायु सुरक्षा एवं वेंटिलेशन' : 'Indoor Air Defense & Source Control Matrix'}
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
            Room-by-room evidence-based guidance for 5 environments. Prioritizes zero-cost source suppression, micro-ventilation timing, and filter maintenance.
          </p>
        </div>

        <button
          onClick={() => setShowSensorModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-orange-700 hover:bg-orange-800 text-white text-xs font-semibold transition shadow-warm-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Manual Sensor Reading</span>
        </button>
      </div>

      {/* Dynamic Ventilation Decision Matrix Banner */}
      <div className={`p-4 sm:p-6 rounded-3xl border shadow-warm-md transition-all ${
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
                Atmospheric Inversion Decision Engine
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-0.5 font-serif">
                {isSafeToVentilate 
                  ? 'Permitted for Controlled Cross-Ventilation (20 Mins)' 
                  : 'DO NOT Open External Windows Right Now'}
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

      {/* User-Reported Sensor Readings Section */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-sm">
        <div className="flex items-center justify-between pb-3 border-b border-warm-200">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-700" />
            <h3 className="text-sm font-bold text-stone-900 font-serif">
              User-Reported Indoor Sensor Measurements
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
            User-Reported • Never Inferred from Outdoor
          </span>
        </div>

        <p className="text-xs text-stone-500 mt-2 mb-4">
          Indoor air quality depends on your walls, cooking, and habits. Measurements below are logged by you, completely separate from municipal weather station reports.
        </p>

        {sensorLogs.length === 0 ? (
          <div className="p-5 text-center bg-warm-50/60 rounded-2xl border border-warm-200 text-stone-500 text-xs">
            No indoor sensor logs recorded yet. If you have an air monitor (IKEA, Sensirion, AirVisual, etc.), click <strong>"Log Manual Sensor Reading"</strong> above to track your rooms.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sensorLogs.map((log: IndoorSensorLog) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-warm-50/70 border border-warm-200 flex flex-col justify-between relative group shadow-warm-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 uppercase tracking-wider font-serif">
                      {log.room}
                    </span>
                    <button
                      onClick={() => removeSensorLog(log.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 rounded-lg transition"
                      title="Delete log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-orange-700">{log.pm25}</span>
                    <span className="text-xs text-stone-500 font-semibold">µg/m³ PM2.5</span>
                    {log.co2Ppm && (
                      <span className="text-xs text-stone-600 ml-2 font-medium">
                        • {log.co2Ppm} ppm CO₂
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] font-medium text-stone-700 mt-1">
                    {log.interpretation}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-warm-200 text-[10px] text-stone-400 flex justify-between items-center">
                  <span>Device: {log.deviceModel}</span>
                  <span>{log.recordedAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Micro-Physics Simulator */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-sm">
        <div className="flex items-center justify-between pb-3 border-b border-warm-200 mb-4">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-orange-700" />
            <h3 className="text-sm font-bold text-stone-900 font-serif">
              Indoor Air Quality Simulator & Source Control Testbed
            </h3>
          </div>
          <span className="text-[11px] text-stone-500 hidden sm:inline">
            Physics-calibrated particulate mass balance
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                {simCooking ? '+85 µg/m³ PM2.5' : 'Stove Off'}
              </span>
            </button>

            <button
              onClick={() => setSimWindowsOpen(!simWindowsOpen)}
              className={`p-3 rounded-2xl border text-left transition shadow-sm ${
                simWindowsOpen
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-stone-400 block">External Windows</span>
              <span className="text-xs font-bold block mt-1">{simWindowsOpen ? 'Windows Open' : 'Windows Sealed'}</span>
              <span className={`text-[10px] font-semibold mt-1 inline-block ${simWindowsOpen ? 'text-rose-700' : 'text-amber-800'}`}>
                {simWindowsOpen ? '85% Infiltration' : '40% Infiltration'}
              </span>
            </button>

            <button
              onClick={() => setSimIncense(!simIncense)}
              className={`p-3 rounded-2xl border text-left transition shadow-sm ${
                simIncense
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-warm-50 border-warm-200 text-stone-600'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Agarbatti / Dhoop</span>
              <span className="text-xs font-bold block mt-1">{simIncense ? 'Incense Burning' : 'Zero Incense'}</span>
              <span className={`text-[10px] font-semibold mt-1 inline-block ${simIncense ? 'text-rose-700' : 'text-stone-400'}`}>
                {simIncense ? '+130 µg/m³ PM2.5' : '0 Emission'}
              </span>
            </button>

            <button
              onClick={() => setSimPurifier(!simPurifier)}
              className={`p-3 rounded-2xl border text-left transition shadow-sm ${
                simPurifier
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-warm-50 border-warm-200 text-stone-600'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Purifier / DIY Box</span>
              <span className="text-xs font-bold block mt-1">{simPurifier ? 'HEPA Running' : 'Purifier Off'}</span>
              <span className={`text-[10px] font-semibold mt-1 inline-block ${simPurifier ? 'text-emerald-700' : 'text-stone-400'}`}>
                {simPurifier ? '-65% Particulates' : 'No Filtration'}
              </span>
            </button>
          </div>

          <div className="md:col-span-4 p-4 rounded-2xl bg-warm-50/80 border border-warm-200 flex flex-col items-center text-center">
            <span className="text-[11px] font-bold uppercase text-stone-500">
              Estimated Indoor PM2.5
            </span>
            <div className="text-3xl font-black text-stone-900 font-serif my-1">
              <span className={simulatedPM25 > 120 ? 'text-rose-700' : simulatedPM25 > 60 ? 'text-orange-700' : 'text-emerald-700'}>
                {simulatedPM25}
              </span>
              <span className="text-sm font-semibold text-stone-500 ml-1.5">µg/m³</span>
            </div>
            <p className="text-[10px] text-stone-500">
              Outdoor baseline: {airData.pollutants.pm25} µg/m³. Source control and sealing dramatically reduce personal intake.
            </p>
          </div>
        </div>
      </div>

      {/* 5-Room Filter Tabs */}
      <div className="flex gap-2 border-b border-warm-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All 5 Rooms' },
          { id: 'bedroom', label: '🛏️ Bedroom' },
          { id: 'living', label: '🛋️ Living Room' },
          { id: 'kitchen', label: '🍳 Kitchen' },
          { id: 'study', label: '📚 Study & Home Office' },
          { id: 'classroom', label: '🏫 School Classroom' },
        ].map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRoom(r.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap shadow-sm min-h-[36px] ${
              selectedRoom === r.id
                ? 'bg-orange-700 text-white shadow-warm-sm'
                : 'bg-white border border-warm-200 text-stone-600 hover:text-stone-900 hover:bg-warm-100'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Low-Cost Room-Based Guidance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHacks.map((hack) => {
          const isDone = completedHacks.includes(hack.id);
          return (
            <div
              key={hack.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-300 shadow-sm'
                  : 'bg-white border-warm-200 hover:border-amber-300 shadow-warm-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-warm-100 text-stone-800 uppercase tracking-wider">
                      {hack.room}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      hack.impactScore === 'Essential'
                        ? 'bg-rose-100 text-rose-900 border border-rose-200'
                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}>
                      {hack.impactScore}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {hack.costTier}
                  </span>
                </div>

                <h3 className={`text-base font-bold mt-2.5 font-serif ${isDone ? 'text-stone-400 line-through' : 'text-stone-900'}`}>
                  {hack.title}
                </h3>

                <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                  {hack.action}
                </p>

                <div className="mt-3 p-3 rounded-2xl bg-warm-50/80 border border-warm-200 text-[11px] text-stone-600 leading-relaxed">
                  <strong className="text-stone-800 block mb-0.5">Scientific Reason:</strong>
                  {hack.evidenceWhy}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-warm-100 flex items-center justify-between">
                <span className="text-[10px] text-stone-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  {hack.safetyCaution}
                </span>

                <button
                  onClick={() => toggleHack(hack.id, hack.title)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-warm-100 hover:bg-warm-200 text-stone-800'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  <span>{isDone ? 'Implemented' : 'Mark Applied'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Air Purifier & Filter Maintenance Guide */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-warm-200 mb-4">
          <Wrench className="w-4 h-4 text-orange-700" />
          <h3 className="text-sm font-bold text-stone-900 font-serif">
            Air Purifier & Filter Maintenance Protocol
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-warm-50/80 border border-warm-200">
            <span className="font-bold text-stone-900 block mb-1">
              1. Wash Pre-Filter (Every 14 Days)
            </span>
            <p className="text-stone-600 leading-relaxed">
              Remove the outer plastic mesh screen and wash it under tap water. Dust accumulation chokes airflow and cuts CADR by up to 40%.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-warm-50/80 border border-warm-200">
            <span className="font-bold text-stone-900 block mb-1">
              2. Never Wash True HEPA Core
            </span>
            <p className="text-stone-600 leading-relaxed">
              Water destroys the electrostatic meltblown micro-fibers in HEPA filters. Only vacuum the surface gently outdoors with an N95 mask on.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-warm-50/80 border border-warm-200">
            <span className="font-bold text-stone-900 block mb-1">
              3. Room Air Purifier Placement
            </span>
            <p className="text-stone-600 leading-relaxed">
              Keep purifiers at least 1 foot away from walls. Elevate off the floor if possible to circulate clean air directly into the head-level breathing zone.
            </p>
          </div>
        </div>
      </div>

      {/* Manual Sensor Log Modal */}
      {showSensorModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-warm-200 shadow-warm-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-warm-200">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-orange-700" />
                <h3 className="text-base font-bold text-stone-900 font-serif">
                  Log Manual Indoor Air Sensor Reading
                </h3>
              </div>
              <button
                onClick={() => setShowSensorModal(false)}
                className="w-7 h-7 rounded-full bg-warm-100 hover:bg-warm-200 text-stone-600 flex items-center justify-center text-xs font-bold transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSensorLog} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Target Room / Environment:
                </label>
                <select
                  value={sensorRoom}
                  onChange={(e) => setSensorRoom(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-warm-300 bg-warm-50 text-stone-900 font-medium"
                >
                  <option value="bedroom">Bedroom</option>
                  <option value="living">Living Room</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="study">Study / Home Office</option>
                  <option value="classroom">School Classroom</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    PM2.5 (µg/m³):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={sensorPm25}
                    onChange={(e) => setSensorPm25(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-warm-300 text-stone-900 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    CO₂ (ppm, optional):
                  </label>
                  <input
                    type="number"
                    min="300"
                    max="5000"
                    value={sensorCo2}
                    onChange={(e) => setSensorCo2(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-warm-300 text-stone-900"
                    placeholder="e.g. 750"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Sensor Device Model:
                </label>
                <input
                  type="text"
                  value={sensorDevice}
                  onChange={(e) => setSensorDevice(e.target.value)}
                  placeholder="e.g. IKEA VINDSTYRKA, Sensirion, AirVisual"
                  className="w-full px-3 py-2 rounded-xl border border-warm-300 text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Context / Notes:
                </label>
                <input
                  type="text"
                  value={sensorNote}
                  onChange={(e) => setSensorNote(e.target.value)}
                  placeholder="e.g. 10 mins after cooking; windows sealed"
                  className="w-full px-3 py-2 rounded-xl border border-warm-300 text-stone-900"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[10px] text-amber-900">
                ⚠️ Explicit Grounding Rule: This reading will be tagged as <strong>User-Reported Data</strong> and will never be presented as official CPCB station data.
              </div>

              <div className="pt-3 border-t border-warm-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSensorModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-warm-100 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-700 hover:bg-orange-800 text-white font-semibold transition shadow-warm-sm"
                >
                  Save Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
