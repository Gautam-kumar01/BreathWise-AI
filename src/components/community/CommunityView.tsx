import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Share2, Check, Download, ShieldCheck, AlertTriangle, FileText } from 'lucide-react';

export const CommunityView: React.FC = () => {
  const { airData, language } = useApp();
  const [copied, setCopied] = useState<boolean>(false);
  const [bulletinType, setBulletinType] = useState<'rwa' | 'school'>('rwa');
  const isHi = language === 'hi';

  const shareText = `📢 BreatheWise Community Air Advisory [${airData.metadata.stationName}]
Status: AQI ${airData.aqi} (${airData.category}) | Dominant: PM2.5
📅 Safe Ventilation Window: ${airData.dailyForecastSummary.cleanestWindow}
⚠️ Severe Smog Peak Window: ${airData.dailyForecastSummary.highestPeakWindow}

Actionable Guidelines for Residents:
1. Shift children & senior morning walks indoors.
2. Zero outdoor leaf burning or domestic waste combustion.
3. Carpool or use Delhi Metro for office commutes.
4. Keep windows sealed until 1:30 PM.

Shared via BreatheWise AI Urban Companion.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadTextFile = () => {
    const blob = new Blob([shareText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BreatheWise_Advisory_${airData.metadata.city}_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-800">
              <Users className="w-4 h-4 font-bold" />
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-serif">
              {isHi ? 'सामुदायिक सूचना एवं व्हाट्सएप बुलेटिन' : 'Community Bulletin & RWA Shareable'}
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Generate grounded, actionable advisories formatted for WhatsApp groups, housing societies (RWAs), and school notices.
          </p>
        </div>

        <div className="flex bg-warm-100 p-1 rounded-2xl border border-warm-200 text-xs font-bold">
          <button
            onClick={() => setBulletinType('rwa')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              bulletinType === 'rwa' ? 'bg-amber-600 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Housing Society (RWA)
          </button>
          <button
            onClick={() => setBulletinType('school')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              bulletinType === 'school' ? 'bg-amber-600 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            School / Parent Advisory
          </button>
        </div>
      </div>

      {/* Visual Shareable Card Preview */}
      <div className="max-w-2xl mx-auto rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-warm-50 border border-warm-300 p-6 sm:p-8 shadow-warm-lg relative overflow-hidden">
        {/* Subtle warm glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-warm-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold font-serif shadow-sm">
              BW
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-serif">BreatheWise Community Advisory</h3>
              <p className="text-[11px] text-stone-500">{airData.metadata.stationName} • {airData.metadata.lastUpdated}</p>
            </div>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
            CPCB Stage Alert
          </span>
        </div>

        {/* Main AQI Section */}
        <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-stone-500 uppercase font-bold tracking-wider">Observed Inversion Level</div>
            <div className="text-4xl sm:text-5xl font-black text-stone-900 font-serif mt-1">
              AQI {airData.aqi}
            </div>
            <div className="text-xs text-stone-600 mt-1 font-medium">
              Category: <strong className="text-orange-800 font-bold">{airData.category}</strong> (PM2.5: {airData.pollutants.pm25} µg/m³)
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white border border-warm-200 shadow-sm">
              <span className="text-[10px] text-stone-500 font-medium block">Clearing Window</span>
              <strong className="text-amber-900 font-bold">{airData.dailyForecastSummary.cleanestWindow}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-warm-200 shadow-sm">
              <span className="text-[10px] text-stone-500 font-medium block">Hazard Peak</span>
              <strong className="text-rose-900 font-bold">{airData.dailyForecastSummary.highestPeakWindow}</strong>
            </div>
          </div>
        </div>

        {/* Guidelines List */}
        <div className="space-y-3 bg-white p-5 rounded-2xl border border-warm-200 shadow-sm text-xs">
          <div className="font-bold text-orange-900 uppercase tracking-wider text-[11px] mb-1">
            {bulletinType === 'rwa' ? 'RWA Community Action Directives:' : 'School / Child Safety Rules:'}
          </div>

          {bulletinType === 'rwa' ? (
            <>
              <div className="flex items-start gap-2.5 text-stone-800">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                <span><strong>No Biomass/Waste Burning:</strong> Strictly prohibit security guards and residents from burning wood or dry leaves for winter warmth; provide electric room heaters.</span>
              </div>
              <div className="flex items-start gap-2.5 text-stone-800">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                <span><strong>Senior Walking Advisory:</strong> Suspend early morning walking sessions in society parks before 10:00 AM during temperature inversion.</span>
              </div>
              <div className="flex items-start gap-2.5 text-stone-800">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                <span><strong>Dust Control:</strong> Water spraying on internal compound roads to suppress fine particulate resuspension.</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2.5 text-stone-800">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                <span><strong>Outdoor Sports Suspended:</strong> Move morning assemblies and physical education classes indoors until afternoon sunshine.</span>
              </div>
              <div className="flex items-start gap-2.5 text-stone-800">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                <span><strong>Ventilation Timing:</strong> Keep classroom windows sealed during morning bus arrival hours (7:30 AM–9:30 AM).</span>
              </div>
              <div className="flex items-start gap-2.5 text-stone-800">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                <span><strong>Bus Waiting Safety:</strong> Recommend N95 masks for children standing at outdoor morning bus pickup spots.</span>
              </div>
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-6 pt-4 border-t border-warm-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-stone-500 font-medium">
            Source: CPCB Official Standard • BreatheWise Grounding
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={downloadTextFile}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-warm-100 hover:bg-warm-200 text-stone-800 font-bold text-xs transition shadow-sm"
              title="Download text file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              onClick={copyToClipboard}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs transition shadow-warm-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied for WhatsApp!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Copy WhatsApp Advisory</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
