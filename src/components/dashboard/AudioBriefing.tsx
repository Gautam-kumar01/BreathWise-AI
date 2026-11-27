import React, { useState, useEffect, memo } from 'react';
import { useApp } from '../../context/AppContext';
import { Volume2, Pause, Play, Radio } from 'lucide-react';

export const AudioBriefing: React.FC = memo(() => {
  const { airData, language } = useApp();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const isHi = language === 'hi';

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const playAudio = () => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any existing speech

    const englishText = `Good day. Here is your BreatheWise Air Quality briefing for ${airData.metadata.city}. 
Current atmospheric air quality is index ${airData.aqi}, classified as ${airData.category}, with fine particulate PM 2.5 measuring ${airData.pollutants.pm25} micrograms per cubic meter. 
Attention: Ground temperature inversion is creating peak pollution between ${airData.dailyForecastSummary.highestPeakWindow}. 
Please avoid strenuous outdoor cardio during these morning hours. 
Your safest outdoor and window micro-ventilation window is between ${airData.dailyForecastSummary.cleanestWindow}, when midday solar radiation disperses surface smog. 
${airData.dailyForecastSummary.recommendedOutdoorTime}. 
Have a healthy, protected day.`;

    const hindiText = `नमस्कार। यह ${airData.metadata.city} के लिए ब्रीदवाइज़ वायु बुलेटिन है। 
वर्तमान वायु गुणवत्ता सूचकांक ${airData.aqi} है, जो ${airData.category} श्रेणी में आता है। 
सावधान रहें: तापमान इन्वर्जन के कारण सुबह प्रदूषण चरम पर रहेगा। 
सुबह के समय बाहर व्यायाम करने से बचें। 
घर की खिड़कियाँ खोलने और बाहर निकलने का सबसे सुरक्षित समय दोपहर ${airData.dailyForecastSummary.cleanestWindow} के बीच है। 
स्वस्थ और सुरक्षित रहें।`;

    const textToSpeak = isHi ? hindiText : englishText;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95; // slightly slower for high clarity
    utterance.pitch = 1.0;

    if (isHi) {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  if (!isSupported) return null;

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-warm-100 border border-warm-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
          isPlaying ? 'bg-orange-600 text-white animate-pulse' : 'bg-white border border-warm-200 text-orange-800'
        }`}>
          {isPlaying ? <Radio className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-stone-900 font-serif">
              {isHi ? 'दैनिक ऑडियो वायु बुलेटिन' : 'Daily 20-Second Audio Air Briefing'}
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 uppercase border border-amber-200">
              Voice AI
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">
            {isHi 
              ? 'व्यस्त आवागमन से पहले आज की मुख्य सावधानियाँ सुनें' 
              : 'Listen to key temperature inversion alerts and safest exercise times on the go.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {isPlaying ? (
          <button
            onClick={stopAudio}
            className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Stop Audio</span>
          </button>
        ) : (
          <button
            onClick={playAudio}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-warm-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Listen Briefing</span>
          </button>
        )}
      </div>
    </div>
  );
});
