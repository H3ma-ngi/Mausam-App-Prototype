import React from 'react';
import {
  Users,
  Sun,
  CloudRain,
  Eye,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { FamilyData } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface FamilyCardProps {
  data: FamilyData;
  language: 'en' | 'hi';
}

export const FamilyCard: React.FC<FamilyCardProps> = ({
  data,
  language,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <article
      id="card-family"
      aria-label="Family and School Commute"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-all hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.prefFamily}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'स्कूल आवागमन, बाल सुरक्षा एवं मौसमी सावधानी' : 'School Commute & Child Weather Safety'}
            </p>
          </div>
        </div>
      </div>

      {/* School Commute Advisory Banner */}
      <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/50 rounded-xl p-3 mb-3.5 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-purple-950 dark:text-purple-200 block mb-0.5">
            {t.schoolAdvisory}
          </span>
          <p className="text-purple-900 dark:text-purple-300 leading-relaxed">
            "{language === 'hi' ? data.commuteAdvisoryHi : data.commuteAdvisory}"
          </p>
        </div>
      </div>

      {/* Morning vs Afternoon School Commute Split Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {/* Morning Slot */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              {t.morningSlot}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              {language === 'hi' ? data.morningCommute.statusHi : data.morningCommute.status}
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>{language === 'hi' ? 'समय' : 'Time'}:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {data.morningCommute.timeRange}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>{language === 'hi' ? 'मौसम स्थिति' : 'Weather'}:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {language === 'hi' ? data.morningCommute.weatherHi : data.morningCommute.weather} ({data.morningCommute.temp}°C)
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>{t.rainProbability}:</span>
              <span className="font-bold text-sky-600 dark:text-sky-400">
                {data.morningCommute.rainProbability}%
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>{t.visibility}:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {language === 'hi' ? data.morningCommute.visibilityHi : data.morningCommute.visibility}
              </span>
            </div>
          </div>
        </div>

        {/* Afternoon Slot */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-sky-500" />
              {t.afternoonSlot}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300">
              {language === 'hi' ? data.afternoonCommute.statusHi : data.afternoonCommute.status}
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>{language === 'hi' ? 'समय' : 'Time'}:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {data.afternoonCommute.timeRange}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>{language === 'hi' ? 'मौसम स्थिति' : 'Weather'}:</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                {language === 'hi' ? data.afternoonCommute.weatherHi : data.afternoonCommute.weather} ({data.afternoonCommute.temp}°C)
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>{t.rainProbability}:</span>
              <span className="font-extrabold text-rose-600 dark:text-rose-400">
                {data.afternoonCommute.rainProbability}% (High)
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>{t.visibility}:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {language === 'hi' ? data.afternoonCommute.visibilityHi : data.afternoonCommute.visibility}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
