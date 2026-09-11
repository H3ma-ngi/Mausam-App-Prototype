import React from 'react';
import {
  Droplets,
  Wind,
  Eye,
  Cloud,
  CloudRain,
  Sun,
  Thermometer,
  Gauge,
  Compass,
  MapPin,
} from 'lucide-react';
import { CurrentWeather } from '../types';
import { findIndiaLocation } from '../data/indiaLocations';
import { TRANSLATIONS } from '../data/translations';

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  language: 'en' | 'hi';
  onOpenLocationPicker?: () => void;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  language,
  onOpenLocationPicker,
}) => {
  const t = TRANSLATIONS[language];
  const stationMeta = findIndiaLocation(weather.location);
  const stationCode = stationMeta?.stationCode || 'AWS-43063';
  const elevation = stationMeta?.elevationMeters ? `${stationMeta.elevationMeters}m ASL` : '560m ASL';
  const climate = stationMeta?.climateZone || 'Synoptic';

  return (
    <section
      id="current-weather-section"
      aria-label="Current Weather Conditions"
      className="bg-gradient-to-br from-sky-700 via-blue-800 to-indigo-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden"
    >
      {/* Subtle atmospheric background accent */}
      <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-sky-400/15 blur-2xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

      {/* IMD Synoptic Station Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2.5 mb-2.5 border-b border-white/15 text-[11px] text-sky-200/90 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] tracking-wider uppercase bg-white/10 px-1.5 py-0.5 rounded border border-white/15 text-sky-100">
            {stationCode}
          </span>
          <span className="hidden sm:inline text-sky-200">
            IMD {climate} Station • Elev {elevation}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-sky-200 font-mono">
          <span>QNH: {weather.airPressure || 1012} hPa</span>
          <span>•</span>
          <span>Dew: {Math.round(weather.temperature - ((100 - weather.humidity) / 5))}°C</span>
        </div>
      </div>

      {/* Location & Last Updated */}
      <div className="flex items-start justify-between relative z-10 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2
              id="current-weather-location"
              className="text-lg sm:text-xl font-bold tracking-tight text-white"
            >
              {weather.location}
            </h2>
            {onOpenLocationPicker && (
              <button
                onClick={onOpenLocationPicker}
                type="button"
                className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-sky-100 transition-all cursor-pointer border border-white/20"
                title="Change location across India"
              >
                <MapPin className="w-3 h-3 text-sky-300" />
                <span>{language === 'hi' ? 'स्थान बदलें' : 'Change City'}</span>
              </button>
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-400/20 text-sky-100 border border-sky-300/30">
              {language === 'hi' ? 'सिनॉप्टिक रिपोर्ट' : 'IMD Doppler AWS'}
            </span>
          </div>
          <p className="text-[11px] text-sky-200/90 mt-0.5">
            {t.lastUpdated}: {weather.lastUpdated}
          </p>
        </div>

        {/* Rain Probability Pill */}
        <div
          id="rain-prob-pill"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-400/20 border border-sky-300/30 text-sky-100 text-xs font-bold shrink-0 shadow-xs"
        >
          <CloudRain className="w-3.5 h-3.5 text-sky-300" />
          <span>{weather.rainProbability}% {language === 'hi' ? 'वर्षा' : 'Rain'}</span>
        </div>
      </div>

      {/* Main Temperature & Condition Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 relative z-10 my-3">
        <div className="flex items-baseline gap-3">
          <span
            id="current-temp-value"
            className="text-5xl sm:text-6xl font-extrabold tracking-tighter text-white"
          >
            {weather.temperature}°C
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sky-100">
              {language === 'hi' ? weather.conditionHi : weather.condition}
            </span>
            <span className="text-xs text-sky-200">
              {t.feelsLike} {weather.feelsLike}°C
            </span>
          </div>
        </div>

        {/* High / Low & Quick Stats */}
        <div className="flex flex-wrap items-center sm:justify-end gap-2 text-xs text-sky-100">
          <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-amber-300" />
            <div>
              <span className="text-[10px] text-sky-200 block">{t.todayHighLow}</span>
              <span className="font-bold">
                {weather.tempHigh}° / {weather.tempLow}°C
              </span>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-300" />
            <div>
              <span className="text-[10px] text-sky-200 block">{t.uvIndex}</span>
              <span className="font-bold">{weather.uvIndex} ({weather.uvIndex >= 7 ? 'High' : 'Moderate'})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Compact Metrics Grid (Humidity, Wind, Visibility, Cloud Cover, Pressure, AQI) */}
      <div
        id="current-weather-metrics"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-3 border-t border-white/15 relative z-10 mt-3"
      >
        <div className="flex items-center gap-2 p-2 rounded-lg bg-black/15">
          <Droplets className="w-4 h-4 text-sky-300 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-sky-200 truncate">{t.humidity}</p>
            <p className="text-xs font-bold text-white">{weather.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-black/15">
          <Wind className="w-4 h-4 text-sky-300 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-sky-200 truncate">{t.wind}</p>
            <p className="text-xs font-bold text-white truncate">
              {weather.windSpeed} km/h {weather.windDirection}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-black/15">
          <Eye className="w-4 h-4 text-sky-300 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-sky-200 truncate">{t.visibility}</p>
            <p className="text-xs font-bold text-white">{weather.visibility} km</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-black/15">
          <Cloud className="w-4 h-4 text-sky-300 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-sky-200 truncate">{t.cloudCover}</p>
            <p className="text-xs font-bold text-white">{weather.cloudCover}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-black/15">
          <Gauge className="w-4 h-4 text-sky-300 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-sky-200 truncate">{language === 'hi' ? 'वायुदाब (QNH)' : 'Pressure'}</p>
            <p className="text-xs font-bold text-white">{weather.airPressure || 1012} hPa</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-black/15">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-sky-200 truncate">{language === 'hi' ? 'वायु गुणवत्ता' : 'CPCB AQI'}</p>
            <p className="text-xs font-bold text-emerald-300">{weather.aqi || 86} Good</p>
          </div>
        </div>
      </div>
    </section>
  );
};
