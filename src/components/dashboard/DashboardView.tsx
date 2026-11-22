import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getAQIMeta } from '../../utils/aqiUtils';
import { PurposeExplainer } from './PurposeExplainer';
import { LungExposureCalculator } from './LungExposureCalculator';
import { ParticleSizeExplainer } from './ParticleSizeExplainer';
import { DiurnalCurveSection } from './DiurnalCurveSection';
import { AudioBriefing } from './AudioBriefing';
import { 
  Sun, 
  Moon, 
  ArrowRight, 
  TrendingDown, 
  Info, 
  Clock, 
  ShieldCheck, 
  Wind, 
  Droplets, 
  Thermometer, 
  Compass, 
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Baby,
  Users2,
  HeartPulse,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    airData, 
    setActiveTab, 
    language, 
    availableScenarios, 
    selectScenario, 
    activeScenarioId, 
    aqiScale, 
    refreshAirData, 
    isLoadingAir,
    selectedCity
  } = useApp();

  const meta = getAQIMeta(airData.aqi, aqiScale);
  const isHi = language === 'hi';
  const isDemo = activeScenarioId !== 'live';

  // State for interactive features
  const [selectedHourIdx, setSelectedHourIdx] = useState<number>(0);
  const [vulnerableGroup, setVulnerableGroup] = useState<'general' | 'kids' | 'seniors' | 'asthma'>('general');
  const [showDataModal, setShowDataModal] = useState<boolean>(false);

  // Selected hour point
  const currentHourPoint = airData.hourlyCurve[selectedHourIdx] || airData.hourlyCurve[0];

  // Radial Gauge Calculations
  const aqiClamped = Math.min(500, Math.max(0, airData.aqi));
  const gaugePercent = aqiClamped / 500;
  const needleRotation = -90 + (gaugePercent * 180);

  // Vulnerable group tailored advice
  const getVulnerableAdvice = () => {
    if (airData.aqi > 300) {
      switch (vulnerableGroup) {
        case 'kids':
          return 'School buses and playgrounds: Suspend outdoor physical activity. Children inhale 2x more air per kg of body weight than adults.';
        case 'seniors':
          return 'Morning walks strictly suspended. High risk of cardiovascular strain and ischemic episode trigger. Exercise indoors.';
        case 'asthma':
          return 'Keep prescribed bronchodilator/inhaler handy at all times. Use indoor damp mopping and air filtration to prevent acute bronchospasms.';
        default:
          return 'Healthy adults should avoid strenuous outdoor cardio. Micro-ventilation only permitted between 1:30 PM–3:30 PM.';
      }
    } else if (airData.aqi > 150) {
      switch (vulnerableGroup) {
        case 'kids':
          return 'Limit recess outdoor games to under 20 minutes away from main road traffic corridors.';
        case 'seniors':
          return 'Shift brisk morning walking to 11:00 AM or late afternoon when solar warmth has broken boundary fog.';
        case 'asthma':
          return 'Pre-medicate before stepping outdoors if advised by physician. Wear a light protective N95 mask.';
        default:
          return 'Normal daily activities suitable; prefer indoor gym sessions for intense aerobic workouts.';
      }
    } else {
      return 'Air quality is satisfactory. All age groups and vulnerable individuals can safely engage in outdoor routines and open home windows.';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Purpose Explainer Banner: Immediately communicates what this website does! */}
      <PurposeExplainer 
        onExplorePlan={() => setActiveTab('plan')}
        onExploreIndoor={() => setActiveTab('indoor')}
      />

      {/* 2. Real-time Data Integrity & Provenance Banner */}
      <div className="rounded-2xl bg-white border border-warm-200 p-4 shadow-warm-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
            isDemo ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'
          }`} />
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-stone-900">
                {isDemo ? '🧪 DEMO SCENARIO MODE' : '📡 REAL-TIME LIVE GROUND DATA'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-warm-100 text-stone-600 font-semibold border border-warm-200">
                {airData.metadata.provider}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Station: <strong>{airData.metadata.stationName}</strong> • {airData.metadata.lastUpdated}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setShowDataModal(true)}
            className="px-3 py-1.5 rounded-xl bg-warm-50 hover:bg-warm-100 border border-warm-200 text-xs font-bold text-amber-900 transition flex items-center gap-1.5 shadow-sm"
          >
            <Info className="w-3.5 h-3.5 text-amber-700" />
            <span>How Real Data Works</span>
          </button>

          <button
            onClick={() => refreshAirData()}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-warm-sm"
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingAir ? 'animate-spin' : ''}`} />
            <span>Fetch Fresh</span>
          </button>
        </div>
      </div>

      {/* Audio Voice Briefing Component */}
      <AudioBriefing />

      {/* Hero Air Quality Card with Semicircular Radial Gauge */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-white border border-warm-200 p-6 sm:p-8 shadow-warm-lg">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Interactive Radial Gauge & Big AQI Display */}
          <div className="lg:col-span-5 flex flex-col items-center text-center">
            {/* Semicircle Gauge Visual */}
            <div className="relative w-64 h-36 flex flex-col items-center justify-end">
              <svg className="w-64 h-32 overflow-visible" viewBox="0 0 200 110">
                {/* Background Track Arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#e7dfd5"
                  strokeWidth="14"
                  strokeLinecap="round"
                />

                {/* Color-segmented Arcs: Good, Satisfactory, Moderate, Poor, Very Poor, Severe */}
                {/* 1. Good: 0-50 */}
                <path d="M 20 100 A 80 80 0 0 1 35 62" fill="none" stroke="#15803d" strokeWidth="14" strokeLinecap="round" />
                {/* 2. Satisfactory: 51-100 */}
                <path d="M 35 62 A 80 80 0 0 1 65 33" fill="none" stroke="#65a30d" strokeWidth="14" />
                {/* 3. Moderate: 101-200 */}
                <path d="M 65 33 A 80 80 0 0 1 100 20" fill="none" stroke="#d97706" strokeWidth="14" />
                {/* 4. Poor: 201-300 */}
                <path d="M 100 20 A 80 80 0 0 1 135 33" fill="none" stroke="#ea580c" strokeWidth="14" />
                {/* 5. Very Poor: 301-400 */}
                <path d="M 135 33 A 80 80 0 0 1 165 62" fill="none" stroke="#dc2626" strokeWidth="14" />
                {/* 6. Severe: 401-500 */}
                <path d="M 165 62 A 80 80 0 0 1 180 100" fill="none" stroke="#7f1d1d" strokeWidth="14" strokeLinecap="round" />

                {/* Animated Needle */}
                <g transform={`rotate(${needleRotation} 100 100)`} className="transition-transform duration-700 ease-out">
                  <line x1="100" y1="100" x2="100" y2="28" stroke="#26160e" strokeWidth="3.5" strokeLinecap="round" />
                  <circle cx="100" cy="100" r="7" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                </g>
              </svg>

              {/* Min and Max Labels */}
              <div className="w-full flex justify-between px-3 text-[10px] font-bold text-stone-400 -mt-2">
                <span>0 Clean</span>
                <span>250 Poor</span>
                <span>500+ Severe</span>
              </div>
            </div>

            {/* Numerical Readout */}
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-6xl sm:text-7xl font-extrabold tracking-tight text-stone-900 font-serif">
                {airData.aqi}
              </span>
              <div className="text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-800 block">
                  {aqiScale === 'CPCB_INDIA' ? 'CPCB NAQI' : 'US EPA'}
                </span>
                <span className="text-[11px] text-stone-500 font-medium">
                  {airData.dominantPollutant} Dominant
                </span>
              </div>
            </div>

            {/* Status Category Badge */}
            <div 
              className="mt-2 inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm"
              style={{ backgroundColor: meta.badgeBg, color: meta.color, border: `1px solid ${meta.badgeBorder}` }}
            >
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: meta.color }} />
              <span>{isHi ? meta.hiCategory : meta.category}</span>
            </div>

            <p className="mt-2 text-xs text-stone-600 max-w-sm font-medium">
              Fine Particulate PM2.5: <strong className="text-stone-900 font-bold">{airData.pollutants.pm25} µg/m³</strong>
            </p>
          </div>

          {/* Right: Microclimate Inversion & Diurnal Action Highlights */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Real-Time Microclimate & Inversion Box */}
            <div className="p-4 rounded-2xl bg-white border border-warm-200 shadow-warm-sm">
              <div className="flex items-center justify-between pb-2 border-b border-warm-100 mb-2.5">
                <span className="text-xs font-extrabold text-stone-900 flex items-center gap-1.5 font-serif">
                  <Wind className="w-4 h-4 text-orange-700" />
                  Live Atmospheric Stagnation & Microclimate
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  airData.weather.stagnationStatus === 'Severe Inversion Trap'
                    ? 'bg-rose-100 text-rose-900 border border-rose-200'
                    : airData.weather.stagnationStatus === 'Moderate Stagnation'
                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}>
                  {airData.weather.stagnationStatus}
                </span>
              </div>

              {/* 4 Weather Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-2.5">
                <div className="p-2 rounded-xl bg-warm-50/70 border border-warm-100">
                  <span className="text-[10px] text-stone-500 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-amber-700" /> Temp
                  </span>
                  <strong className="text-stone-900 text-sm block mt-0.5">{airData.weather.temperatureC}°C</strong>
                </div>

                <div className="p-2 rounded-xl bg-warm-50/70 border border-warm-100">
                  <span className="text-[10px] text-stone-500 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-orange-700" /> Humidity
                  </span>
                  <strong className="text-stone-900 text-sm block mt-0.5">{airData.weather.humidityPercent}%</strong>
                </div>

                <div className="p-2 rounded-xl bg-warm-50/70 border border-warm-100">
                  <span className="text-[10px] text-stone-500 flex items-center gap-1">
                    <Wind className="w-3 h-3 text-stone-700" /> Wind Velocity
                  </span>
                  <strong className="text-stone-900 text-sm block mt-0.5">{airData.weather.windSpeedKmH} km/h</strong>
                </div>

                <div className="p-2 rounded-xl bg-warm-50/70 border border-warm-100">
                  <span className="text-[10px] text-stone-500 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-stone-700" /> Wind Vector
                  </span>
                  <strong className="text-stone-900 text-[11px] block mt-0.5 truncate">{airData.weather.windDirectionCardinal}</strong>
                </div>
              </div>

              <p className="text-[11px] text-stone-600 leading-normal">
                {airData.weather.stagnationReason}
              </p>
            </div>

            {/* Inversion Windows Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-warm-200 shadow-sm">
                <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  Solar Clearing Window
                </span>
                <p className="text-xs font-bold text-stone-900 mt-1">
                  {airData.dailyForecastSummary.cleanestWindow}
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Boundary inversion lifts as midday sunlight warms the ground.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-warm-200 shadow-sm">
                <span className="text-[11px] font-bold text-rose-800 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-orange-600" />
                  Cold Inversion Trap
                </span>
                <p className="text-xs font-bold text-stone-900 mt-1">
                  {airData.dailyForecastSummary.highestPeakWindow}
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Cold air locks exhaust emissions tightly against city streets.
                </p>
              </div>
            </div>

            {/* Action CTA */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-terracotta-700 text-white shadow-warm-md flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-200 block">
                  Today's Top Action
                </span>
                <p className="text-xs sm:text-sm font-bold mt-0.5">
                  {airData.dailyForecastSummary.recommendedOutdoorTime}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('plan')}
                className="px-4 py-2 rounded-xl bg-white text-stone-900 text-xs font-bold hover:bg-stone-50 transition shadow-sm whitespace-nowrap flex items-center gap-1.5"
              >
                <span>View Full Day Plan</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-800" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* "Can I Do This Right Now?" Quick Activity Verdicts Matrix */}
      <div className="p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif">
              "Can I Do This Right Now?" — Instant Activity Verdicts
            </h3>
            <p className="text-xs text-stone-500">
              Clear, practical decisions based on the current ground inversion reading for {airData.metadata.city}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            {
              title: 'Outdoor Running',
              verdict: airData.aqi > 250 ? 'No — Move Inside' : 'Permitted',
              icon: Activity,
              safe: airData.aqi <= 250,
              desc: airData.aqi > 250 ? 'Tidal volume increase lodges fine soot deep in lungs' : 'Moderate pace safe'
            },
            {
              title: 'Kids Outdoor Play',
              verdict: airData.aqi > 300 ? 'No — Shift to 2 PM' : 'Safe in Park',
              icon: Baby,
              safe: airData.aqi <= 300,
              desc: airData.aqi > 300 ? 'Wait for solar window at 1:30 PM' : 'Afternoon play fine'
            },
            {
              title: 'Open Home Windows',
              verdict: airData.dailyForecastSummary.ventilationSafeNow ? 'Yes (20 mins)' : 'Keep Sealed',
              icon: Wind,
              safe: airData.dailyForecastSummary.ventilationSafeNow,
              desc: airData.dailyForecastSummary.ventilationSafeNow ? 'Safe solar cross-ventilation' : 'Particulate infiltration risk'
            },
            {
              title: 'Two-Wheeler / Bike',
              verdict: airData.aqi > 300 ? 'Wear N95 Mask' : 'Normal Ride',
              icon: AlertCircle,
              safe: airData.aqi <= 300,
              desc: airData.aqi > 300 ? 'Direct exhaust plume exposure' : 'Wear helmet visor'
            },
            {
              title: 'AC Car Recirculation',
              verdict: 'Set to RECIRC',
              icon: CheckCircle,
              safe: true,
              desc: 'Never pull outside air when driving behind diesel trucks'
            }
          ].map((act, i) => {
            const Icon = act.icon;
            return (
              <div
                key={i}
                className={`p-3.5 rounded-2xl border transition-all ${
                  act.safe
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-rose-50/60 border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-800">{act.title}</span>
                  {act.safe ? (
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-700" />
                  )}
                </div>
                <div className={`text-xs font-extrabold ${act.safe ? 'text-amber-900' : 'text-rose-900'}`}>
                  {act.verdict}
                </div>
                <p className="text-[10px] text-stone-500 mt-1 leading-tight">
                  {act.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive 24-Hour Diurnal Wave Curve & Hourly Decision Scrubber */}
      <DiurnalCurveSection
        hourlyCurve={airData.hourlyCurve}
        selectedHourIdx={selectedHourIdx}
        onSelectHour={(idx) => setSelectedHourIdx(idx)}
        scale={aqiScale}
        cleanestWindow={airData.dailyForecastSummary.cleanestWindow}
        highestPeakWindow={airData.dailyForecastSummary.highestPeakWindow}
      />

      {/* Vulnerable Group Impact Selector & Advisory */}
      <div className="p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-warm-200 mb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif">
              Personalized Risk by Household Demographic
            </h3>
            <p className="text-xs text-stone-500">
              Select your group to see medical and behavioral precautions tailored for today's AQI.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'general', label: 'General Adults', icon: Users2 },
              { id: 'kids', label: 'Children / School', icon: Baby },
              { id: 'seniors', label: 'Seniors (65+)', icon: HeartPulse },
              { id: 'asthma', label: 'Asthma / Respiratory', icon: Activity },
            ].map((grp) => {
              const Icon = grp.icon;
              return (
                <button
                  key={grp.id}
                  onClick={() => setVulnerableGroup(grp.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                    vulnerableGroup === grp.id
                      ? 'bg-amber-600 text-white shadow-warm-sm'
                      : 'bg-warm-50 border border-warm-200 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{grp.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-800 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-stone-800 leading-relaxed font-medium">
            {getVulnerableAdvice()}
          </div>
        </div>
      </div>

      {/* 3. Personal Respiratory Health & Inhaled Soot Calculator */}
      <LungExposureCalculator />

      {/* 4. Scientific Primer: Particle Sizes & Inversion Physics */}
      <ParticleSizeExplainer />

      {/* Pollutant Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { name: 'PM2.5', val: `${airData.pollutants.pm25} µg/m³`, desc: 'Fine respirable soot', status: airData.pollutants.pm25 > 60 ? 'Severe' : 'Moderate', color: 'text-rose-700' },
          { name: 'PM10', val: `${airData.pollutants.pm10} µg/m³`, desc: 'Coarse road dust', status: airData.pollutants.pm10 > 100 ? 'Poor' : 'Moderate', color: 'text-orange-700' },
          { name: 'NO2', val: `${airData.pollutants.no2} µg/m³`, desc: 'Diesel traffic exhaust', status: 'Moderate', color: 'text-amber-700' },
          { name: 'CO', val: `${airData.pollutants.co} mg/m³`, desc: 'Incomplete combustion', status: 'Normal', color: 'text-stone-700' },
          { name: 'O3', val: `${airData.pollutants.o3} µg/m³`, desc: 'Surface ozone', status: 'Normal', color: 'text-stone-700' },
          { name: 'SO2', val: `${airData.pollutants.so2 ?? 12} µg/m³`, desc: 'Industrial emissions', status: 'Normal', color: 'text-stone-700' },
        ].map((item, i) => (
          <div key={i} className="p-3.5 rounded-2xl bg-white border border-warm-200 shadow-warm-sm">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">{item.name}</span>
            <div className={`text-base font-extrabold mt-1 ${item.color}`}>{item.val}</div>
            <p className="text-[11px] text-stone-500 mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Data Source Transparency Modal */}
      {showDataModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-warm-200 rounded-3xl p-6 shadow-warm-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-warm-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900 font-serif">
                  Data Sources & Grounding Architecture
                </h3>
              </div>
              <button
                onClick={() => setShowDataModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
              <p>
                <strong>How are you getting real-time data without an API key?</strong><br />
                We integrated the <strong>Open-Meteo Air Quality API</strong>, which assimilates real-time satellite, atmospheric, and ground sensor data from the <strong>European Copernicus Atmosphere Monitoring Service (CAMS)</strong> and <strong>ECMWF</strong>. It is completely public, free, and does not require private API keys.
              </p>

              <div className="p-3 rounded-xl bg-warm-50 border border-warm-200 space-y-1 text-[11px]">
                <div><strong>Current Station:</strong> {airData.metadata.stationName}</div>
                <div><strong>Geolocation:</strong> {airData.metadata.latitude.toFixed(4)}°N, {airData.metadata.longitude.toFixed(4)}°E</div>
                <div><strong>Live Status:</strong> {isDemo ? 'Seeded Scenario Active' : 'Live Real-Time Feed'}</div>
                <div><strong>Conversion Standard:</strong> Central Pollution Control Board (CPCB) NAQI Formula</div>
              </div>

              <p className="text-[11px] text-stone-500">
                You can switch between <strong>Live Ground Station</strong> and <strong>Seeded Winter Smog Scenarios</strong> using the top scenario bar at any time to test different atmospheric conditions.
              </p>
            </div>

            <div className="pt-3 border-t border-warm-200 flex justify-end">
              <button
                onClick={() => setShowDataModal(false)}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-sm hover:bg-amber-700 transition"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
