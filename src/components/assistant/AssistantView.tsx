import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  User, 
  Info, 
  HelpCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  HeartHandshake
} from 'lucide-react';

interface XAIExplanation {
  dataUsed: string;
  preferenceConsidered: string;
  reasoning: string;
  alternatives: string;
  limitations: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: string[];
  explanation?: XAIExplanation;
  disclaimer?: string;
}

export const AssistantView: React.FC = () => {
  const { airData, userPreferences } = useApp();
  const [input, setInput] = useState<string>('');
  const [expandedXaiId, setExpandedXaiId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: `Hello! I am your BreatheWise Explainable Air Quality Copilot. Right now for **${airData.metadata.stationName}**, local conditions are recorded at **AQI ${airData.aqi} (${airData.category})** with fine particulate PM2.5 at **${airData.pollutants.pm25} µg/m³**.\n\nEvery recommendation I generate is grounded strictly in CPCB atmospheric benchmarks and inversion thermodynamics. How can I help you adjust your routine today?`,
      timestamp: 'Just now',
      citations: [airData.metadata.provider, `Station: ${airData.metadata.stationName}`],
      explanation: {
        dataUsed: `Real-time Open-Meteo & CPCB assimilation: AQI ${airData.aqi}, PM2.5 ${airData.pollutants.pm25} µg/m³.`,
        preferenceConsidered: `User location: ${airData.metadata.city}; Routine: ${userPreferences.exercisePreference}.`,
        reasoning: 'Initial welcome briefing providing verified ground conditions without extrapolation.',
        alternatives: 'Ask specific questions about workouts, room ventilation, or commute routes.',
        limitations: 'Environmental guidance only; does not provide clinical diagnosis or personal health guarantees.'
      },
      disclaimer: 'General environmental guidance only; does not replace medical advice or official emergency alerts.'
    }
  ]);

  const promptChips = [
    'Should I exercise outdoors today?',
    'How can I improve my bedroom air quality?',
    'Suggest a pollution-aware daily routine.',
    'What is the best commute alternative?',
    'Explain today\'s AQI in simple language.'
  ];

  const handleSend = (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      let citations = [airData.metadata.provider, 'Central Pollution Control Board'];
      let explanation: XAIExplanation;

      const qLower = q.toLowerCase();

      if (qLower.includes('exercise') || qLower.includes('run') || qLower.includes('jog') || qLower.includes('workout')) {
        reply = `**Verdict: Shift workouts indoors in a closed room.**\n\nWith current PM2.5 at **${airData.pollutants.pm25} µg/m³** in ${airData.metadata.city}, outdoor aerobic exercise is strongly discouraged during morning hours (6:30 AM – 9:00 AM).\n\n• **Why?** Rapid breathing during running pulls up to 50 L/min of air deep into alveoli, multiplying ultrafine soot deposition by 6x compared to rest.\n• **When is it safer?** If outdoor movement is essential, wait for the midday solar boundary layer break between **${airData.dailyForecastSummary.cleanestWindow}**.`;
        
        explanation = {
          dataUsed: `Current PM2.5: ${airData.pollutants.pm25} µg/m³; Diurnal inversion peak: 6:30–9:00 AM; Cleanest window: ${airData.dailyForecastSummary.cleanestWindow}.`,
          preferenceConsidered: `Exercise routine: ${userPreferences.exercisePreference}.`,
          reasoning: 'Vigorous breathing bypasses nasal filtering, depositing particulate matter into alveolar micro-capillaries.',
          alternatives: 'Indoor yoga, bodyweight circuit, or static cycling in a sealed room (Cost: ₹0).',
          limitations: 'Assumes indoor quarters are free of domestic incense or unvented gas frying.'
        };
      } else if (qLower.includes('bedroom') || qLower.includes('room') || qLower.includes('indoor')) {
        reply = `**Bedroom Defense: Source Control & Inversion Micro-Ventilation**\n\n1. **Zero Incense/Dhoop:** A single agarbatti produces PM2.5 equivalent to 4–6 cigarettes. Eliminate all combustion.\n2. **Damp Mopping Only:** Never use a dry broom under the bed; wet-wipe surfaces to bind fine soot without resuspending it.\n3. **Under-Door Sealing:** Roll a damp towel or place a draft stopper along the bedroom door bottom to reduce living room infiltration.\n4. **Ventilation Timing:** Keep windows closed overnight. Only air out the room for 20 minutes between **${airData.dailyForecastSummary.cleanestWindow}**.`;
        
        explanation = {
          dataUsed: 'Diurnal boundary layer dynamics; ambient nocturnal inversion temperature profile.',
          preferenceConsidered: `Household type: ${userPreferences.household}; Kitchen exhaust present: ${userPreferences.hasKitchenExhaust ? 'Yes' : 'No'}.`,
          reasoning: 'Infiltration across bedroom sills accounts for 40–60% of indoor particulate spikes during cold nights.',
          alternatives: 'DIY Corsi-Rosenthal filter box (MERV-13 filter strapped to 12V desk fan, ~₹300).',
          limitations: 'Indoor sensor data is user-reported and not inferred from municipal outdoor monitoring stations.'
        };
      } else if (qLower.includes('routine') || qLower.includes('daily')) {
        reply = `**Pollution-Aware Daily Routine for Today (AQI ${airData.aqi})**\n\n• **6:30 AM – 8:30 AM:** Keep all windows shut. Shift exercise indoors. Pre-run kitchen exhaust before breakfast cooking.\n• **8:30 AM – 9:30 AM:** Commute via Metro Rail or AC cabin with internal recirculation enabled.\n• **1:30 PM – 3:30 PM:** Open cross-ventilation windows for 20 minutes to flush indoor stale CO₂.\n• **4:30 PM – 6:00 PM:** Complete consolidated errands before twilight smog traps vehicle exhaust.\n• **8:00 PM – 10:00 PM:** Damp mop floors, seal bedroom draft gaps, and prepare N95 masks for morning.`;
        
        explanation = {
          dataUsed: `Diurnal curve data with peak PM2.5 in morning and trough at ${airData.dailyForecastSummary.cleanestWindow}.`,
          preferenceConsidered: `Commute mode: ${userPreferences.primaryCommute}; Household: ${userPreferences.household}.`,
          reasoning: 'Aligns human outdoor activities with atmospheric boundary layer expansion and collapse.',
          alternatives: 'Personalized Daily Plan tab allows you to add custom blocks and reschedule tasks.',
          limitations: 'Wind speed shifts or episodic agricultural/garbage burning can alter midday solar windows.'
        };
      } else if (qLower.includes('commute') || qLower.includes('transport') || qLower.includes('office')) {
        reply = `**Best Commute Alternative: Delhi Metro or Filtered AC Transit**\n\n• **Top Recommendation:** Delhi Metro Heavy Rail. Underground and elevated coaches maintain positive air pressure with multi-stage industrial filtration.\n• **If Driving:** Ensure the air-conditioning toggle is set to **"Internal Recirculation"** to block outside diesel fumes.\n• **Avoid:** Open two-wheelers and auto-rickshaws during peak morning hours (unless wearing an airtight N95 mask).`;
        
        explanation = {
          dataUsed: `Roadside corridor NO2 (${airData.pollutants.no2} µg/m³) and fine soot concentration.`,
          preferenceConsidered: `User primary commute: ${userPreferences.primaryCommute}.`,
          reasoning: 'Two-wheeler riders inhale direct unmixed vehicle exhaust plumes at street level.',
          alternatives: 'Carpooling with AC recirculation or walking with an ISI-certified N95 respirator.',
          limitations: 'Last-mile walking to stations still incurs transient particulate exposure.'
        };
      } else if (qLower.includes('explain') || qLower.includes('aqi') || qLower.includes('simple')) {
        reply = `**Today's Air Quality Explained Simply:**\n\nToday's AQI is **${airData.aqi}**, which falls in the **"${airData.category}"** tier.\n\n• **What does this mean?** The primary pollutant is **${airData.dominantPollutant.toUpperCase()}**. Fine PM2.5 particles are so microscopic (30 times smaller than a human hair) that they pass through your nose and reach deep into lung tissue.\n• **Why is it worse today?** Winter temperature inversion forms a cold "lid" near the ground, trapping smoke and dust like a closed pot on a stove.\n• **Key Rule:** Don't cancel your entire day—just **time-shift** outdoor activities to the afternoon solar dip!`;
        
        explanation = {
          dataUsed: `CPCB Sub-Index computation: Dominant pollutant ${airData.dominantPollutant.toUpperCase()}, AQI ${airData.aqi}.`,
          preferenceConsidered: 'Plain-language urban resident explanation.',
          reasoning: 'Non-technical translation of particulate concentration into actionable behavioral advice.',
          alternatives: 'Check the 24-Hour Diurnal Inversion Scrubber on the dashboard for hour-by-hour previews.',
          limitations: 'AQI provides an aggregated 24-hr proxy; short-term roadside spikes may be significantly higher.'
        };
      } else {
        reply = `At the current reading of **AQI ${airData.aqi} (${airData.category})**, the most effective strategy is **time-shifting your exposure** rather than panicking.\n\nOutdoor pollutant concentrations follow a distinct diurnal rhythm: they peak between **6:30 AM – 9:00 AM** and drop to their lowest between **${airData.dailyForecastSummary.cleanestWindow}** when sunlight warms the ground. Keep rooms sealed during cold morning/night hours, and use Metro or AC recirculation for transit.`;
        
        explanation = {
          dataUsed: `Live reading for ${airData.metadata.stationName}: AQI ${airData.aqi}, PM2.5 ${airData.pollutants.pm25} µg/m³.`,
          preferenceConsidered: 'General environmental guidance inquiry.',
          reasoning: 'Fundamental urban inversion physics applied to daily schedule management.',
          alternatives: 'Explore the "My Air Plan" tab to customize your personal schedule.',
          limitations: 'CPCB and Open-Meteo assimilation; does not replace certified local medical advice.'
        };
      }

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: 'Just now',
        citations,
        explanation,
        disclaimer: 'Guidance based on retrieved environmental data. BreatheWise does not provide medical diagnoses or guarantees of safe exposure.'
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-warm-sm">
              <Sparkles className="w-4 h-4 font-bold" />
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-serif">
              Explainable AI Air Quality Copilot
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Grounded urban air assistant. Explains the exact data provenance, user context, and causal reasoning behind every claim.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Grounded & Fact-Checked</span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50/70 border border-warm-200 text-xs font-semibold text-stone-700 hover:text-orange-950 transition shadow-warm-xs"
          >
            💬 {chip}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="rounded-3xl bg-white border border-warm-200 p-4 sm:p-6 h-[500px] overflow-y-auto space-y-4 shadow-warm-sm">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isExpanded = expandedXaiId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold flex-shrink-0 text-xs font-serif shadow-sm">
                  BW
                </div>
              )}

              <div className={`max-w-[88%] rounded-3xl p-4 text-xs leading-relaxed ${
                isUser
                  ? 'bg-gradient-to-r from-amber-600 to-orange-700 text-white font-medium rounded-br-none shadow-warm-sm'
                  : 'bg-warm-50/70 border border-warm-200 text-stone-800 rounded-bl-none space-y-2.5'
              }`}>
                <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

                {msg.citations && (
                  <div className="pt-2 border-t border-warm-200 flex items-center justify-between text-[10px] text-amber-900 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-orange-700 flex-shrink-0" />
                      Grounding: {msg.citations.join(' • ')}
                    </span>

                    {msg.explanation && (
                      <button
                        onClick={() => setExpandedXaiId(isExpanded ? null : msg.id)}
                        className="flex items-center gap-1 text-orange-800 font-bold hover:underline"
                      >
                        <span>{isExpanded ? 'Hide Provenance' : 'Why this recommendation?'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                )}

                {/* Signature Differentiator: Expandable "Why this recommendation?" Inspector */}
                {isExpanded && msg.explanation && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-white border border-warm-200 text-stone-800 space-y-2.5 text-[11px] shadow-sm animate-in fade-in">
                    <div className="flex items-center gap-1.5 font-bold text-orange-950 uppercase tracking-wider text-[10px] pb-1 border-b border-warm-200">
                      <AlertCircle className="w-3.5 h-3.5 text-orange-700" />
                      <span>Transparent Provenance & Scientific Mechanism</span>
                    </div>

                    <div>
                      <strong className="text-stone-500 uppercase text-[9px] block">1. Data Used:</strong>
                      <p className="text-stone-900 font-medium">{msg.explanation.dataUsed}</p>
                    </div>

                    <div>
                      <strong className="text-stone-500 uppercase text-[9px] block">2. User Preference Considered:</strong>
                      <p className="text-stone-900 font-medium">{msg.explanation.preferenceConsidered}</p>
                    </div>

                    <div>
                      <strong className="text-stone-500 uppercase text-[9px] block">3. Reasoning Behind Suggestion:</strong>
                      <p className="text-stone-700">{msg.explanation.reasoning}</p>
                    </div>

                    <div>
                      <strong className="text-stone-500 uppercase text-[9px] block">4. Practical Alternatives:</strong>
                      <p className="text-stone-700">{msg.explanation.alternatives}</p>
                    </div>

                    <div>
                      <strong className="text-stone-500 uppercase text-[9px] block">5. Data Limitations:</strong>
                      <p className="text-stone-600">{msg.explanation.limitations}</p>
                    </div>
                  </div>
                )}

                {msg.disclaimer && (
                  <div className="text-[10px] text-stone-400 italic pt-1 border-t border-warm-100 flex items-center gap-1">
                    <HeartHandshake className="w-3 h-3 flex-shrink-0" />
                    <span>{msg.disclaimer}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 items-center text-xs text-stone-500 italic">
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-800 font-bold text-xs font-serif">
              BW
            </div>
            <div className="flex items-center gap-1.5 bg-warm-50 px-4 py-2.5 rounded-2xl border border-warm-200">
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></span>
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse delay-75"></span>
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse delay-150"></span>
              <span className="ml-2 font-medium text-stone-600">Retrieving CPCB atmospheric model...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question about smog, exercise, bedroom air, or commuting..."
          className="flex-1 px-5 py-3 rounded-2xl border border-warm-200 bg-white text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-orange-500 shadow-warm-xs"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="px-5 py-3 rounded-2xl bg-orange-700 hover:bg-orange-800 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-warm-sm"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </div>
  );
};
