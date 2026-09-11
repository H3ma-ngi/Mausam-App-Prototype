import React from 'react';
import {
  Car,
  AlertTriangle,
  Clock,
  Navigation,
  ShieldAlert,
  Gauge,
  Sparkles,
  ArrowRight,
  Eye,
  CloudRain,
} from 'lucide-react';
import { CommuteData } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface CommuteCardProps {
  data: CommuteData;
  language: 'en' | 'hi';
}

export const CommuteCard: React.FC<CommuteCardProps> = ({
  data,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const routeRisk = data.routeRisk || {
    score: data.currentRoute?.riskScore ?? 78,
    level: data.currentRoute?.riskCategory ?? 'High',
    levelHi:
      data.currentRoute?.riskCategory === 'Low'
        ? 'निम्न जोखिम'
        : data.currentRoute?.riskCategory === 'Moderate'
        ? 'मध्यम जोखिम'
        : 'उच्च जोखिम',
  };

  const getRiskBadgeStyles = (level: string) => {
    switch (level) {
      case 'High':
        return 'bg-rose-600 text-white';
      case 'Moderate':
        return 'bg-amber-500 text-slate-900 font-bold';
      case 'Low':
      default:
        return 'bg-emerald-600 text-white';
    }
  };

  return (
    <article
      id="card-commute"
      aria-label="Smart Commute and Route Risk"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-all hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.prefCommute}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'स्मार्ट आवागमन, मार्ग-जोखिम व मौसम विलंब' : 'Intelligent Route Risk & Rain Disruption'}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Risk & Delay Banner (Prominently displays: Route Risk High, Delay +29 mins, Alternative Route) */}
      <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-xl p-3.5 mb-3.5">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {t.routeRisk}:
            </span>
            <span
              className={`text-xs font-black uppercase px-2 py-0.5 rounded ${getRiskBadgeStyles(
                routeRisk.level
              )}`}
            >
              {language === 'hi' ? routeRisk.levelHi : routeRisk.level}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-extrabold text-rose-700 dark:text-rose-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.delay}: +{data.currentRoute?.delayMin ?? 0} mins</span>
          </div>
        </div>

        {/* Road condition & weather warning */}
        <p className="text-xs text-rose-900 dark:text-rose-200 font-medium leading-relaxed">
          ⚠️ {language === 'hi' ? data.roadConditionHi : data.roadCondition}
        </p>
      </div>

      {/* Comparison: Current Route vs Alternative Route (Save ~19 mins) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
        {/* Current Route */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {language === 'hi' ? data.currentRoute?.nameHi : data.currentRoute?.name}
            </span>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/40">
              {language === 'hi'
                ? data.currentRoute?.trafficLevelHi || 'भारी'
                : data.currentRoute?.trafficLevel || 'Heavy'}
            </span>
          </div>
          <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>{language === 'hi' ? 'दूरी व समय' : 'Distance & Time'}:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {data.currentRoute?.distanceKm} km • {data.currentRoute?.durationMin} min
              </span>
            </div>
            <div className="flex justify-between text-rose-600 dark:text-rose-400 font-semibold">
              <span>{language === 'hi' ? 'मौसम विलंब' : 'Weather Delay'}:</span>
              <span>+{data.currentRoute?.delayMin} min</span>
            </div>
          </div>
        </div>

        {/* Alternative Route (Saves ~19 mins) */}
        {data.betterRoute && (
          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 truncate">
                {language === 'hi' ? data.betterRoute.nameHi : data.betterRoute.name}
              </span>
              <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50">
                Save ~{data.betterRoute.savingsMin ?? 15} mins
              </span>
            </div>
            <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>{language === 'hi' ? 'वैकल्पिक मार्ग' : 'Alt Route'}:</span>
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  {data.betterRoute.distanceKm} km • {data.betterRoute.durationMin} min
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                <span>{language === 'hi' ? 'यातायात स्थिति' : 'Traffic'}:</span>
                <span>
                  {language === 'hi'
                    ? data.betterRoute.trafficLevelHi || 'मध्यम'
                    : data.betterRoute.trafficLevel || 'Moderate'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Environmental Metrics (Rain Impact, Visibility, Wind) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <CloudRain className="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <span className="text-slate-600 dark:text-slate-300 truncate">
            {language === 'hi' ? data.rainImpactHi : data.rainImpact}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="text-slate-600 dark:text-slate-300 truncate">
            {data.visibilityKm} km visibility
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-slate-600 dark:text-slate-300 truncate">
            Hydroplaning alert
          </span>
        </div>
      </div>
    </article>
  );
};
