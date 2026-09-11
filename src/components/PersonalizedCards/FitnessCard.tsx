import React from 'react';
import {
  Activity,
  Sunrise,
  Sunset,
  Flame,
  Wind,
  Sun,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { FitnessData } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface FitnessCardProps {
  data: FitnessData;
  language: 'en' | 'hi';
}

export const FitnessCard: React.FC<FitnessCardProps> = ({
  data,
  language,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <article
      id="card-fitness"
      aria-label="Fitness and Outdoor Weather"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-all hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.prefFitness}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'धावक व आउटडोर वर्कआउट परामर्श' : 'Runner & Outdoor Workout Index'}
            </p>
          </div>
        </div>
      </div>

      {/* Best Running Hours (Prominent PS mandate) */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/80 dark:border-amber-800/40 rounded-xl p-3.5 mb-3.5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {t.bestRunningHours}
          </span>
          <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded bg-amber-200/50 dark:bg-amber-900/40">
            {language === 'hi' ? data.bestRunningHoursHi : data.bestRunningHours}
          </span>
        </div>
        <p className="text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed mt-1">
          <strong className="font-semibold">{t.runningReason}:</strong>{' '}
          {language === 'hi' ? data.runningReasonHi : data.runningReason}
        </p>
      </div>

      {/* Heat Alert Banner (Prominently visible if active) */}
      {data.heatAlert?.active && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl p-3 mb-3.5 flex items-start gap-2.5">
          <Flame className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="flex items-center gap-2 font-bold text-rose-900 dark:text-rose-200">
              <span>{t.heatHazard} ({data.heatAlert?.level || 'Moderate'})</span>
            </div>
            <p className="text-[11px] text-rose-800 dark:text-rose-300 leading-relaxed mt-0.5">
              {language === 'hi' ? data.heatAlert?.messageHi : data.heatAlert?.message}
            </p>
          </div>
        </div>
      )}

      {/* Fitness Metrics Grid: Sunrise, Sunset, Wind, Outdoor Score, UV */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] mb-1">
            <Sunrise className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.sunrise}</span>
          </div>
          <span className="font-bold text-slate-900 dark:text-white">
            {data.sunrise}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] mb-1">
            <Sunset className="w-3.5 h-3.5 text-orange-500" />
            <span>{t.sunset}</span>
          </div>
          <span className="font-bold text-slate-900 dark:text-white">
            {data.sunset}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] mb-1">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>{language === 'hi' ? 'आउटडोर स्थिति' : 'Outdoor Suitability'}</span>
          </div>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {data.activityScoreCategory}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] mb-1">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.uvIndex}</span>
          </div>
          <span className="font-bold text-slate-900 dark:text-white truncate">
            {language === 'hi' ? data.uvConditionsHi : data.uvConditions}
          </span>
        </div>
      </div>
    </article>
  );
};
