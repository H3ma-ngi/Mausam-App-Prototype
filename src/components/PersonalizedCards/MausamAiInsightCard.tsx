import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  RefreshCw,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { CurrentWeather, PreferenceId } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface MausamAiInsightCardProps {
  weather: CurrentWeather;
  preferences: PreferenceId[];
  language: 'en' | 'hi';
}

export const MausamAiInsightCard: React.FC<MausamAiInsightCardProps> = ({
  weather,
  preferences,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<'gemini' | 'rule-engine'>('rule-engine');
  const [insight, setInsight] = useState<{
    summary: string;
    recommendation: string;
  }>({
    summary:
      language === 'hi'
        ? `पुणे में वर्तमान तापमान ${weather.temperature}°C और नमी ${weather.humidity}% है। दोपहर में बादलों की गरज के साथ हल्की बारिश का अनुमान है।`
        : `Pune is experiencing warm and humid conditions (${weather.temperature}°C, ${weather.humidity}% humidity) with isolated afternoon showers likely.`,
    recommendation:
      language === 'hi'
        ? 'धावकों के लिए सुबह का समय सर्वश्रेष्ठ रहेगा। दोपहर के समय छतरी साथ रखें तथा हाइड्रेटेड रहें।'
        : 'Outdoor fitness is optimal before 8:00 AM. Keep an umbrella handy for midday transit and maintain electrolyte hydration.',
  });

  const fetchInsight = async (forceGemini = true) => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weather,
          preferences,
          language,
          forceGemini,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setInsight({
          summary: data.data.summary,
          recommendation: data.data.recommendation,
        });
        setSource(data.data.source || 'rule-engine');
      }
    } catch (err) {
      console.warn('Insight fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article
      id="card-mausam-ai"
      aria-label="Mausam AI Weather Insight"
      className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 text-white rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white">
                {language === 'hi' ? 'मौसम एआई अंतर्दृष्टि' : 'Mausam AI Synoptic Brief'}
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  source === 'gemini'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                }`}
              >
                {source === 'gemini' ? (
                  <>
                    <Bot className="w-3 h-3" />
                    <span>Gemini 2.5 Flash</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3 h-3" />
                    <span>Rule Engine</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {language === 'hi'
                ? 'प्राथमिकता-आधारित प्राकृतिक भाषा मौसमी सारांश'
                : 'Personalized natural-language weather intelligence'}
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchInsight(true)}
          disabled={loading}
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 shrink-0 self-start sm:self-auto"
          title="Refresh insight"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">
            {loading
              ? language === 'hi'
                ? 'विश्लेषण...'
                : 'Analyzing...'
              : language === 'hi'
              ? 'ताज़ा करें'
              : 'Generate AI Insight'}
          </span>
        </button>
      </div>

      <div className="space-y-2.5 text-xs">
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block mb-1">
            {language === 'hi' ? 'मौसम संक्षेप' : 'Condition Summary'}
          </span>
          <p className="text-slate-200 leading-relaxed font-normal">
            {insight.summary}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block mb-0.5">
              {language === 'hi' ? 'स्मार्ट व्यक्तिगत सिफारिश' : 'Actionable Recommendation'}
            </span>
            <p className="text-slate-200 leading-relaxed font-normal">
              {insight.recommendation}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
