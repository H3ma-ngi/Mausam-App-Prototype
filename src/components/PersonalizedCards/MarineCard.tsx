import React from 'react';
import {
  Waves,
  ArrowUpCircle,
  ArrowDownCircle,
  Thermometer,
  ShieldAlert,
  Wind,
  Sparkles,
} from 'lucide-react';
import { MarineData } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface MarineCardProps {
  data: MarineData;
  language: 'en' | 'hi';
}

export const MarineCard: React.FC<MarineCardProps> = ({
  data,
  language,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <article
      id="card-marine"
      aria-label="Beach and Marine Conditions"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-all hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.prefMarine}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'ज्वार-भाटा, समुद्री स्थिति व तटीय सुरक्षा' : 'Tides, Swells & Coastal Fishermen Safety'}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Marine Metrics (Sea, Wave, Temp, Next High Tide) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
            {t.seaCondition}
          </span>
          <span className="text-base font-extrabold text-cyan-700 dark:text-cyan-300 block mt-1">
            {language === 'hi' ? data.seaConditionHi : data.seaCondition}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            Wind: {data.windKnots} knots
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
            {t.waveHeight}
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-white block mt-1">
            {data.waveHeight} m
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            Swell period: 8.5s
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-blue-500" />
            {t.waterTemp}
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-white block mt-1">
            {data.waterTemperature}°C
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            Surface SST
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ArrowUpCircle className="w-3.5 h-3.5 text-indigo-500" />
            {t.nextHighTide}
          </span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white block mt-1">
            {data.nextHighTide}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            Height: {data.highTideHeight}
          </span>
        </div>
      </div>

      {/* Low Tide Info Pill */}
      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/30 text-xs mb-3.5">
        <div className="flex items-center gap-1.5 text-cyan-800 dark:text-cyan-300">
          <ArrowDownCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>
            <strong>{t.nextLowTide}:</strong> {data.nextLowTide} ({data.lowTideHeight})
          </span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          INCOIS Tide Gauge
        </span>
      </div>

      {/* Marine Advisory */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 rounded-xl p-3 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-amber-950 dark:text-amber-200 block mb-0.5">
            {t.marineAdvisory}
          </span>
          <p className="text-amber-900 dark:text-amber-300 leading-relaxed">
            {language === 'hi' ? data.marineAdvisoryHi : data.marineAdvisory}
          </p>
        </div>
      </div>
    </article>
  );
};
