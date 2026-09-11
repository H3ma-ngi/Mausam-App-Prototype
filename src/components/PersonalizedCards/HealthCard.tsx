import React from 'react';
import {
  Heart,
  Wind,
  Flower2,
  Sun,
  Droplets,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { HealthData } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface HealthCardProps {
  data: HealthData;
  language: 'en' | 'hi';
}

export const HealthCard: React.FC<HealthCardProps> = ({
  data,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const getAqiBadgeColor = (category: string) => {
    switch (category) {
      case 'Good':
        return 'bg-emerald-500 text-white';
      case 'Satisfactory':
        return 'bg-green-500 text-white';
      case 'Moderate':
        return 'bg-amber-500 text-slate-900 font-bold';
      case 'Poor':
        return 'bg-orange-500 text-white';
      case 'Very Poor':
        return 'bg-rose-600 text-white';
      case 'Severe':
        return 'bg-purple-700 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  return (
    <article
      id="card-health"
      aria-label="Health and Air Quality"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-all hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.prefHealth}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'वायु गुणवत्ता, परागकण व स्वास्थ्य परामर्श' : 'Air Quality, Pollen & Biometeorology'}
            </p>
          </div>
        </div>
      </div>

      {/* Main AQI & Pollen Highlight Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5">
        {/* AQI */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Wind className="w-3.5 h-3.5 text-sky-500" />
            AQI Index
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {data.aqi}
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getAqiBadgeColor(
                data.aqiCategory
              )}`}
            >
              {language === 'hi' ? data.aqiCategoryHi : data.aqiCategory}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            {data.primaryPollutant}
          </span>
        </div>

        {/* Pollen */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Flower2 className="w-3.5 h-3.5 text-purple-500" />
            {t.pollenCount}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {data.pollenCount}
            </span>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
              {language === 'hi' ? data.pollenLevelHi : data.pollenLevel}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            {language === 'hi' ? data.dominantPollenTypeHi : data.dominantPollenType}
          </span>
        </div>

        {/* UV Index */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            {t.uvIndex}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {data.uvIndex}
            </span>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
              {data.uvIndex >= 7 ? 'High' : 'Moderate'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            {data.uvIndex >= 7 ? 'Sun protection advised' : 'Safe exposure'}
          </span>
        </div>

        {/* Humidity */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            {t.humidity}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {data.humidity}%
            </span>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              Humid
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            High respiratory vapor
          </span>
        </div>
      </div>

      {/* Health Advisory */}
      <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/50 rounded-xl p-3 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-sky-950 dark:text-sky-200 block mb-0.5">
            {t.healthAdvisory}
          </span>
          <p className="text-sky-900 dark:text-sky-300 leading-relaxed">
            "{language === 'hi' ? data.healthAdvisoryHi : data.healthAdvisory}"
          </p>
        </div>
      </div>
    </article>
  );
};
