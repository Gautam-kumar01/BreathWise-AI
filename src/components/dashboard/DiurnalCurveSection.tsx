import React from 'react';
import { DiurnalPoint, AQIScale } from '../../types/air';
import { getAQIMeta } from '../../utils/aqiUtils';
import { 
  Sun, 
  Moon, 
  Clock, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  Wind, 
  Thermometer,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface DiurnalCurveSectionProps {
  hourlyCurve: DiurnalPoint[];
  selectedHourIdx: number;
  onSelectHour: (idx: number) => void;
  scale: AQIScale;
  cleanestWindow: string;
  highestPeakWindow: string;
}

export const DiurnalCurveSection: React.FC<DiurnalCurveSectionProps> = ({
  hourlyCurve,
  selectedHourIdx,
  onSelectHour,
  scale,
  cleanestWindow,
  highestPeakWindow
}) => {
  const currentPoint = hourlyCurve[selectedHourIdx] || hourlyCurve[0];
  const meta = getAQIMeta(currentPoint.aqi, scale);

  // SVG Chart Dimensions
  const svgWidth = 800;
  const svgHeight = 150;
  const padX = 40;
  const padY = 25;
  const chartW = svgWidth - padX * 2;
  const chartH = svgHeight - padY * 2;

  // Dynamic Y-Scale so low-AQI days (e.g. 80) don't look completely squashed or empty!
  const maxDataAqi = Math.max(...hourlyCurve.map(p => p.aqi), 100);
  const maxScale = Math.min(500, Math.max(200, Math.ceil((maxDataAqi + 40) / 50) * 50));

  // Compute coordinate points
  const points = hourlyCurve.map((p, i) => {
    const x = padX + (i / Math.max(1, hourlyCurve.length - 1)) * chartW;
    const clampedAqi = Math.min(maxScale, Math.max(0, p.aqi));
    const y = padY + chartH - (clampedAqi / maxScale) * chartH;
    return { x, y, point: p, idx: i };
  });

  // SVG Path strings
  const linePath = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${padY + chartH} L ${points[0].x} ${padY + chartH} Z`
    : '';

  // Grid line thresholds (e.g. 50, 100, 200, 300)
  const gridLevels = [50, 100, 200, 300, 400].filter(lvl => lvl <= maxScale);

  return (
    <div className="rounded-3xl bg-white border border-warm-200 p-6 shadow-warm-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-warm-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-800">
              <TrendingDown className="w-4 h-4 font-bold" />
            </span>
            <h3 className="text-base font-bold text-stone-900 font-serif">
              24-Hour Diurnal Inversion Curve & Interactive Scrubber
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time smog wave simulation showing how solar radiation lifts ground pollutants during midday.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-medium text-stone-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Solar Dip Window
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            Cold Inversion Trap
          </span>
        </div>
      </div>

      {/* Selected Hour Interactive Intelligence Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-warm-50 border border-warm-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-warm-200 flex items-center justify-center text-stone-800 shadow-sm font-bold text-xs">
            {currentPoint.hour >= 6 && currentPoint.hour < 18 ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-purple-700" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-stone-900">
                {currentPoint.timeLabel} Forecast:
              </span>
              <span 
                className="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase"
                style={{ backgroundColor: meta.badgeBg, color: meta.color, border: `1px solid ${meta.badgeBorder}` }}
              >
                AQI {currentPoint.aqi} • {meta.category}
              </span>
            </div>
            <p className="text-[11px] text-stone-600 mt-0.5">
              PM2.5 Soot: <strong>{currentPoint.pm25} µg/m³</strong> • Temp: <strong>{currentPoint.temperatureC}°C</strong> • Inversion Risk: <strong>{currentPoint.inversionRisk}</strong>
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
            Hour Verdict
          </span>
          <span className="text-xs font-bold text-orange-900 block mt-0.5">
            {currentPoint.activityVerdict}
          </span>
        </div>
      </div>

      {/* Continuous SVG Diurnal Wave Chart (Never Blank!) */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-warm-50/50 border border-warm-200 p-2">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="w-full h-44 overflow-visible select-none"
        >
          <defs>
            {/* Smooth Warm Gradient for Area Fill */}
            <linearGradient id="diurnalWarmFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ea580c" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#d97706" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
            </linearGradient>

            {/* Inversion Peak Warning Zone Gradient */}
            <linearGradient id="inversionZone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.02" />
            </linearGradient>

            {/* Solar Clearing Window Gradient */}
            <linearGradient id="solarWindow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#15803d" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#15803d" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Dotted Horizontal Grid Lines with AQI Markers */}
          {gridLevels.map((lvl) => {
            const y = padY + chartH - (lvl / maxScale) * chartH;
            return (
              <g key={lvl}>
                <line
                  x1={padX}
                  y1={y}
                  x2={svgWidth - padX}
                  y2={y}
                  stroke="#dfd7cb"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={padX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#8c7866"
                  fontWeight="bold"
                >
                  {lvl}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          {areaPath && (
            <path d={areaPath} fill="url(#diurnalWarmFill)" />
          )}

          {/* Continuous Glowing Line Path */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#ea580c"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Clickable Nodes for each hour */}
          {points.map((pt) => {
            const isSelected = selectedHourIdx === pt.idx;
            const isVent = pt.point.isSafeVentilationWindow;
            const nodeMeta = getAQIMeta(pt.point.aqi, scale);

            return (
              <g 
                key={pt.idx} 
                onClick={() => onSelectHour(pt.idx)} 
                className="cursor-pointer group"
              >
                {/* Active Selection Glow Ring */}
                {isSelected && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="12"
                    fill="none"
                    stroke="#ea580c"
                    strokeWidth="2.5"
                    strokeDasharray="3 3"
                    className="animate-spin"
                  />
                )}

                {/* Node Outer Ring */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? "6.5" : "4.5"}
                  fill={isSelected ? "#ea580c" : "#ffffff"}
                  stroke={nodeMeta.color}
                  strokeWidth="2.5"
                  className="transition-all duration-200 group-hover:scale-125"
                />

                {/* AQI text above point */}
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fontSize={isSelected ? "11" : "10"}
                  fontWeight="bold"
                  fill={isSelected ? "#993f26" : "#443427"}
                >
                  {pt.point.aqi}
                </text>

                {/* Hour label below baseline */}
                <text
                  x={pt.x}
                  y={padY + chartH + 16}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight={isSelected ? "bold" : "normal"}
                  fill={isSelected ? "#7d3522" : "#8c7866"}
                >
                  {pt.point.timeLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Rich Horizontal Hourly Decision Cards (Zero Blank Space!) */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-stone-600 mb-2.5">
          <span>Detailed Hourly Timeline (Click any card to select):</span>
          <span className="text-[11px] text-stone-400 font-medium hidden sm:inline">
            Scroll horizontally to view 24h
          </span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          {hourlyCurve.map((point, idx) => {
            const isSelected = selectedHourIdx === idx;
            const nodeMeta = getAQIMeta(point.aqi, scale);
            const isDay = point.hour >= 6 && point.hour < 18;

            return (
              <button
                key={idx}
                onClick={() => onSelectHour(idx)}
                className={`min-w-[125px] sm:min-w-[140px] p-3 rounded-2xl border text-left transition-all duration-200 flex-shrink-0 flex flex-col justify-between shadow-sm ${
                  isSelected
                    ? 'bg-amber-50 border-orange-500 ring-2 ring-orange-500/20 shadow-warm-md'
                    : 'bg-white border-warm-200 hover:border-amber-300 hover:bg-stone-50'
                }`}
              >
                <div>
                  {/* Time & Day/Night Icon */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-stone-900">{point.timeLabel}</span>
                    {isDay ? (
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-purple-600" />
                    )}
                  </div>

                  {/* AQI Badge */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-stone-900 font-serif">
                      {point.aqi}
                    </span>
                    <span 
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase"
                      style={{ backgroundColor: nodeMeta.badgeBg, color: nodeMeta.color, border: `1px solid ${nodeMeta.badgeBorder}` }}
                    >
                      {nodeMeta.category}
                    </span>
                  </div>

                  {/* PM2.5 & Temp */}
                  <div className="mt-2 text-[10px] text-stone-500 space-y-0.5">
                    <div>PM2.5: <strong className="text-stone-800">{point.pm25} µg/m³</strong></div>
                    <div>Temp: <strong className="text-stone-800">{point.temperatureC}°C</strong></div>
                  </div>
                </div>

                {/* Verdict Tag */}
                <div className="mt-2.5 pt-2 border-t border-warm-100">
                  <span className={`text-[9px] font-bold block truncate ${
                    point.isSafeVentilationWindow 
                      ? 'text-emerald-700' 
                      : point.aqi > 300 
                      ? 'text-rose-700' 
                      : 'text-amber-800'
                  }`}>
                    {point.activityVerdict || 'Moderate routine'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
