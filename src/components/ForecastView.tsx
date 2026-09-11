import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CloudRain,
  Sun,
  Droplets,
  Wind,
  Compass,
  CheckCircle,
  Thermometer,
  ChevronRight,
} from 'lucide-react';
import { HourlyForecast, DailyForecast, CurrentWeather } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ForecastViewProps {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  weather: CurrentWeather;
  language: 'en' | 'hi';
}

export const ForecastView: React.FC<ForecastViewProps> = ({
  hourly = [],
  daily = [],
  weather,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const safeHourly = hourly || [];
  const safeDaily = daily || [];

  // Active Day Toggle State (0 = Today, 1 = Tomorrow, etc.)
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);

  const activeDay = safeDaily[selectedDayIdx] || safeDaily[0] || {
    day: 'Today',
    dayHi: 'आज',
    date: '10 Sep',
    condition: 'Partly Cloudy',
    conditionHi: 'आंशिक बादल',
    icon: '⛅',
    tempHigh: 31,
    tempLow: 22,
    rainProb: 35,
  };

  return (
    <div id="forecast-view" className="space-y-4 w-full max-w-full overflow-hidden">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 inline-block">
              IMD Synoptic Bulletin
            </span>
            <h2 className="text-xl font-extrabold tracking-tight mt-1 truncate">
              {weather.location}
            </h2>
            <p className="text-xs text-sky-100 mt-0.5 truncate">
              {language === 'hi'
                ? 'अगले 7 दिनों का मौसम पूर्वानुमान एवं मौसमी रुझान'
                : 'Next 7 Days Weather Outlook & Diurnal Trends'}
            </p>
          </div>
          <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-white/20 pt-2 sm:pt-0 shrink-0">
            <span className="text-3xl font-black">{weather.temperature}°C</span>
            <span className="text-xs text-sky-100 block">
              {language === 'hi' ? weather.conditionHi : weather.condition}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Day Toggle Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            <span>{language === 'hi' ? 'दिन चुनें (Day Toggle)' : 'Select Forecast Day'}</span>
          </h3>
          <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400">
            {language === 'hi'
              ? `चयनित: ${activeDay.dayHi || activeDay.day}`
              : `Active: ${activeDay.day}`}
          </span>
        </div>

        {/* Day Selector Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin w-full max-w-full">
          {safeDaily.map((day, idx) => {
            const isSelected = selectedDayIdx === idx;
            return (
              <button
                key={idx}
                id={`day-toggle-btn-${idx}`}
                onClick={() => setSelectedDayIdx(idx)}
                type="button"
                className={`flex flex-col items-center justify-between p-2.5 rounded-xl border text-center shrink-0 min-w-[76px] transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm ring-2 ring-sky-400/40 font-bold scale-[1.02]'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-[10px] font-bold block whitespace-nowrap">
                  {idx === 0
                    ? language === 'hi' ? 'आज' : 'Today'
                    : idx === 1
                    ? language === 'hi' ? 'कल' : 'Tmrw'
                    : language === 'hi' ? day.dayHi : day.day}
                </span>
                <span className="text-lg my-1">{day.icon}</span>
                <span className={`text-[11px] font-black ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {day.tempHigh}°
                </span>
                <span className={`text-[9px] block mt-0.5 ${isSelected ? 'text-sky-100' : 'text-sky-600 dark:text-sky-400 font-semibold'}`}>
                  {day.rainProb}% rain
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Detailed Selected Day Focus Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-indigo-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-4xl shrink-0">{activeDay.icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white">
                  {language === 'hi' ? activeDay.dayHi : activeDay.day} ({activeDay.date})
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/30 text-sky-200 border border-sky-400/30">
                  {selectedDayIdx === 0 ? 'Current Day' : `Day +${selectedDayIdx}`}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 truncate">
                {language === 'hi' ? activeDay.conditionHi : activeDay.condition}
              </p>
            </div>
          </div>

          <div className="flex items-baseline sm:flex-col sm:items-end gap-2 shrink-0">
            <span className="text-2xl font-black text-white">
              {activeDay.tempHigh}° / {activeDay.tempLow}°C
            </span>
            <span className="text-[11px] font-semibold text-sky-300 flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5" />
              {activeDay.rainProb}% {language === 'hi' ? 'वर्षा की संभावना' : 'Rain Probability'}
            </span>
          </div>
        </div>

        {/* Selected Day Diurnal Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-xs">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 min-w-0">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
              <Thermometer className="w-3 h-3 text-amber-400 shrink-0" />
              {language === 'hi' ? 'उच्चतम तापमान' : 'Day Max Temp'}
            </span>
            <span className="text-sm font-bold text-white block mt-1">
              {activeDay.tempHigh}°C
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 min-w-0">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
              <Thermometer className="w-3 h-3 text-sky-400 shrink-0" />
              {language === 'hi' ? 'न्यूनतम तापमान' : 'Night Min Temp'}
            </span>
            <span className="text-sm font-bold text-white block mt-1">
              {activeDay.tempLow}°C
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 min-w-0">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
              <Droplets className="w-3 h-3 text-blue-400 shrink-0" />
              {language === 'hi' ? 'वर्षा की संभावना' : 'Precipitation'}
            </span>
            <span className="text-sm font-bold text-white block mt-1">
              {activeDay.rainProb}%
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 min-w-0">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
              <Sun className="w-3 h-3 text-amber-400 shrink-0" />
              {language === 'hi' ? 'यूवी सूचकांक' : 'Estimated UV'}
            </span>
            <span className="text-sm font-bold text-white block mt-1">
              {selectedDayIdx % 2 === 0 ? '7 (High)' : '5 (Mod)'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Hourly Forecast Carousel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm w-full max-w-full overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-sky-600" />
            {t.hourlyForecast}
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {language === 'hi' ? 'प्रति घंटा अपडेट' : 'Hourly Synoptic'}
          </span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin w-full max-w-full">
          {safeHourly.map((h, idx) => {
            // Apply slight offset for non-today selected days
            const dayOffset = selectedDayIdx * 0.5;
            const adjustedTemp = Math.round(h.temp + (idx % 2 === 0 ? dayOffset : -dayOffset));
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-center shrink-0 w-20 flex flex-col items-center justify-between ${
                  idx === 2
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {h.time}
                </span>
                <span className="text-2xl my-1.5">{h.icon}</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {adjustedTemp}°C
                </span>
                <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-0.5 mt-1">
                  <CloudRain className="w-3 h-3" />
                  {h.rainProb}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. 7-Day Synoptic Outlook List (Clickable Day rows) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm w-full max-w-full overflow-hidden">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-600" />
            {t.dailyForecast}
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {language === 'hi' ? 'क्लिक करके दिन चुनें' : 'Tap any day to toggle'}
          </span>
        </div>

        <div className="space-y-2">
          {safeDaily.map((day, idx) => {
            const isSelected = selectedDayIdx === idx;
            return (
              <button
                key={idx}
                id={`daily-forecast-row-${idx}`}
                onClick={() => setSelectedDayIdx(idx)}
                type="button"
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 dark:border-sky-700 ring-1 ring-sky-400/30'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="w-20 sm:w-24 shrink-0 min-w-0">
                  <span className="font-bold text-slate-900 dark:text-white block truncate">
                    {language === 'hi' ? day.dayHi : day.day}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                    {day.date}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-1 px-2 min-w-0">
                  <span className="text-xl shrink-0">{day.icon}</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                    {language === 'hi' ? day.conditionHi : day.condition}
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span className="text-sky-600 dark:text-sky-400 font-bold flex items-center gap-1 text-[11px]">
                    <CloudRain className="w-3 h-3" />
                    {day.rainProb}%
                  </span>
                  <div className="w-14 sm:w-16 text-right font-bold text-slate-900 dark:text-white text-xs">
                    <span>{day.tempHigh}°</span>
                    <span className="text-slate-400 font-normal ml-1">
                      {day.tempLow}°
                    </span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-sky-600 dark:text-sky-400 rotate-90' : 'text-slate-400'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
