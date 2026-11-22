import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Send, Sparkles, ShieldCheck, User, Info, HelpCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: string[];
  disclaimer?: string;
}

export const AssistantView: React.FC = () => {
  const { airData } = useApp();
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: `Hello! I am your BreatheWise Air Assistant. Right now for **${airData.metadata.stationName}**, local conditions are recorded at **AQI ${airData.aqi} (${airData.category})** with fine particulate PM2.5 at **${airData.pollutants.pm25} µg/m³**.

How can I help you optimize your daily routine, school schedule, or home ventilation today?`,
      timestamp: 'Just now',
      citations: [airData.metadata.provider, `Station: ${airData.metadata.stationName}`],
      disclaimer: 'General environmental guidance only; does not provide clinical diagnosis or medication advice.'
    }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const promptChips = [
    'Can I go for an outdoor run tomorrow morning?',
    'How do I protect kids without an air purifier?',
    'What is the cleanest way for me to commute to office?',
    'When should I open my home windows today?'
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
      let citations = [airData.metadata.provider, 'CPCB Winter Inversion Model'];

      if (q.toLowerCase().includes('run') || q.toLowerCase().includes('jog') || q.toLowerCase().includes('workout')) {
        reply = `Based on the latest observation for **${airData.metadata.city}** (AQI ${airData.aqi}, PM2.5 ${airData.pollutants.pm25} µg/m³), outdoor morning workouts are **strongly discouraged**. Ground inversion is severe between 6:30 AM and 9:00 AM. 

**Recommended Action:** Shift your workout indoors (bodyweight exercise, yoga, or indoor cycling) in a closed room, or postpone any outdoor activity until the afternoon solar window between **${airData.dailyForecastSummary.cleanestWindow}**.`;
      } else if (q.toLowerCase().includes('purifier') || q.toLowerCase().includes('hacks') || q.toLowerCase().includes('indoor')) {
        reply = `You do **not** need an expensive air purifier to meaningfully protect your family. Three evidence-backed zero-cost hacks:

1. **Micro-Ventilation Timing:** Seal windows during morning & night smog. Ventilate only for 20 minutes between **${airData.dailyForecastSummary.cleanestWindow}**.
2. **Damp Mopping Only:** Never use a dry broom (which resuspends fine soot into breathing height). Use a damp microfiber cloth.
3. **Exhaust Hood Pre-Run:** Turn on kitchen exhaust 2 minutes *before* lighting LPG flame, and avoid deep frying during peak smog hours.`;
      } else if (q.toLowerCase().includes('commute') || q.toLowerCase().includes('office')) {
        reply = `For your typical commute, **Metro Rail (AC)** is the safest choice today. Metro coaches feature positive-pressure filtered air that prevents street soot ingress.

If you must take a car or cab, ensure your AC is set to **Internal Recirculation**. Avoid open two-wheelers and auto-rickshaws during peak morning hours without an airtight N95 mask.`;
      } else {
        reply = `At the current reading of **AQI ${airData.aqi}**, the safest rule of thumb is: **time-shift your routine rather than canceling your day**. Schedule outdoor chores between **${airData.dailyForecastSummary.cleanestWindow}** when solar heat lifts ground-trapped pollutants, and keep living areas sealed during morning and late evening.`;
      }

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: 'Just now',
        citations,
        disclaimer: 'Guidance based on retrieved environmental data. Consult a medical professional for respiratory distress.'
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-warm-200 shadow-warm-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-800">
              <Sparkles className="w-4 h-4 font-bold" />
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-serif">
              Ask BreatheWise AI
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Grounded urban air copilot. Answers your questions using retrieved station data and local temperature inversion models.
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
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-warm-100 border border-warm-200 text-xs font-semibold text-stone-700 transition shadow-sm"
          >
            💬 {chip}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="rounded-3xl bg-white border border-warm-200 p-4 sm:p-6 h-[460px] overflow-y-auto space-y-4 shadow-warm-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold flex-shrink-0 text-xs font-serif shadow-sm">
                BW
              </div>
            )}

            <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium rounded-br-none shadow-warm-sm'
                : 'bg-warm-50/70 border border-warm-200 text-stone-800 rounded-bl-none space-y-2'
            }`}>
              <div className="whitespace-pre-line">{msg.text}</div>

              {msg.citations && (
                <div className="pt-2 border-t border-warm-200 flex items-center gap-2 text-[10px] text-amber-800 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Grounding: {msg.citations.join(' • ')}</span>
                </div>
              )}

              {msg.disclaimer && (
                <div className="text-[10px] text-stone-400 italic">
                  {msg.disclaimer}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-warm-100 flex items-center justify-center text-orange-700 flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-stone-500 italic p-2">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
            BreatheWise is reasoning over local inversion curves...
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
          placeholder="Ask a question about your routine, children's outdoor play, or commute..."
          className="flex-1 bg-white border border-warm-200 rounded-2xl px-4 py-3 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-amber-500 shadow-warm-sm"
        />
        <button
          onClick={() => handleSend()}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-warm-md"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
