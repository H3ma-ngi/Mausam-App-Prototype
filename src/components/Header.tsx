import React from 'react';
import {
  MapPin,
  Globe2,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  ChevronDown,
  Sliders,
  Search,
} from 'lucide-react';
import { CurrentWeather } from '../types';
import { MOCK_LOCATIONS } from '../data/mockData';
import { findIndiaLocation } from '../data/indiaLocations';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentWeather: CurrentWeather;
  selectedLocation: string;
  onSelectLocation: (locId: string) => void;
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isOffline: boolean;
  onToggleOfflineMock?: () => void;
  onOpenPreferences?: () => void;
  onOpenLocationPicker?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentWeather,
  selectedLocation,
  onSelectLocation,
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
  isOffline,
  onToggleOfflineMock,
  onOpenPreferences,
  onOpenLocationPicker,
}) => {
  const t = TRANSLATIONS[language];
  const matchedLoc = findIndiaLocation(selectedLocation);
  const displayLocationName = matchedLoc
    ? language === 'hi'
      ? matchedLoc.nameHi
      : matchedLoc.name
    : currentWeather.location || selectedLocation;

  return (
    <header
      id="main-header"
      className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 transition-colors w-full"
    >
      {/* Official MoES National Portal Micro-Bar */}
      <div className="bg-slate-900 text-slate-300 text-[10px] px-3 py-0.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
          <span className="font-semibold text-slate-200 truncate">
            {language === 'hi'
              ? 'भारत सरकार • पृथ्वी विज्ञान मंत्रालय | भारत मौसम विज्ञान विभाग'
              : 'Govt. of India • Ministry of Earth Sciences | India Meteorological Department'}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-slate-400 shrink-0 font-mono text-[9px]">
          <span>INSAT-3DR Rapid Scan</span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">AWS 43063 Telemetry: Active</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
        {/* Top bar on mobile / Left group on desktop */}
        <div className="flex items-center justify-between sm:justify-start gap-2 min-w-0 w-full sm:w-auto">
          {/* Branding */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
              <span className="text-base sm:text-lg">☀️</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight truncate">
                  {t.appTitle}
                </h1>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 shrink-0">
                  IMD • MoES
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate hidden xs:block sm:block">
                {language === 'hi' ? 'भारत मौसम विज्ञान विभाग' : 'Govt. of India Weather Portal'}
              </p>
            </div>
          </div>

          {/* Quick toggles on mobile right side */}
          <div className="flex sm:hidden items-center gap-1.5 shrink-0">
            {/* Language Switch */}
            <button
              id="header-lang-btn-mobile"
              onClick={onToggleLanguage}
              type="button"
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 transition-colors"
              title="Switch Language / भाषा बदलें"
            >
              <Globe2 className="w-3 h-3" />
              <span>{language === 'en' ? 'हिं' : 'EN'}</span>
            </button>

            {/* Day / Night Theme Toggle */}
            <button
              id="header-theme-btn-mobile"
              onClick={onToggleTheme}
              type="button"
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
              title={theme === 'dark' ? 'Switch to Day (Light) Mode' : 'Switch to Night (Dark) Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          </div>
        </div>

        {/* Center: Location Quick Picker & Offline Status */}
        <div className="flex items-center justify-between sm:justify-center gap-2 min-w-0 w-full sm:w-auto">
          <div className="relative flex items-center min-w-0 flex-1 sm:flex-initial">
            {onOpenLocationPicker ? (
              <button
                id="header-location-picker-btn"
                onClick={onOpenLocationPicker}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 hover:border-sky-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all max-w-[220px] sm:max-w-xs truncate group"
                title="Search 160+ IMD AWS locations across all 28 Indian States & 8 UTs"
              >
                <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="font-bold truncate text-slate-900 dark:text-white">
                  {displayLocationName}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 shrink-0">
                  <Search className="w-2.5 h-2.5" />
                  <span>{language === 'hi' ? 'खोजें' : 'All India'}</span>
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 w-full sm:w-auto min-w-0">
                <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                <select
                  id="header-location-select"
                  value={selectedLocation}
                  onChange={(e) => onSelectLocation(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-4 appearance-none truncate w-full"
                >
                  {MOCK_LOCATIONS.map((loc) => (
                    <option
                      key={loc.id}
                      value={loc.id}
                      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    >
                      {language === 'hi' ? loc.nameHi : loc.name} ({loc.state})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none -ml-3 shrink-0" />
              </div>
            )}
          </div>

          {/* Offline Cache Status Badge */}
          <button
            id="offline-status-btn"
            onClick={onToggleOfflineMock}
            type="button"
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border transition-all shrink-0 ${
              isOffline
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
            }`}
            title={isOffline ? t.offlineMode : t.onlineMode}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">{t.offlineMode}</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">{t.onlineMode}</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Actions on Desktop (Preferences, Language, Day/Night Theme) */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          {/* Preferences Quick Re-configure */}
          {onOpenPreferences && (
            <button
              id="header-preferences-btn"
              onClick={onOpenPreferences}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/80 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors"
              title="Personalize Preferences & Location / रुचियां व स्थान"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'रुचियां' : 'Interests'}</span>
            </button>
          )}

          {/* Language Switch Button (English / Hindi) */}
          <button
            id="header-lang-btn"
            onClick={onToggleLanguage}
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/80 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors"
            title="Switch Language / भाषा बदलें"
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Day / Night Theme Toggle */}
          <button
            id="header-theme-btn"
            onClick={onToggleTheme}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
            title={theme === 'dark' ? 'Switch to Day (Light) Mode' : 'Switch to Night (Dark) Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] font-semibold">{language === 'hi' ? 'दिन' : 'Day'}</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-semibold">{language === 'hi' ? 'रात' : 'Night'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
