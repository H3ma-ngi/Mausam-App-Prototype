import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  MapPin,
  Database,
  CloudRain,
  CheckCircle,
  HardDrive,
  RefreshCw,
  ExternalLink,
  Plus,
  Search,
  Star,
  Trash2,
} from 'lucide-react';
import { MOCK_LOCATIONS, MOCK_CURRENT_WEATHER } from '../data/mockData';
import {
  ALL_INDIA_LOCATIONS,
  findIndiaLocation,
  generateWeatherForLocation,
  searchIndiaLocations,
} from '../data/indiaLocations';
import { TRANSLATIONS } from '../data/translations';

interface SavedViewProps {
  selectedLocation: string;
  onSelectLocation: (locId: string) => void;
  language: 'en' | 'hi';
  savedLocations?: string[];
  onToggleSaveLocation?: (locId: string) => void;
  onOpenLocationPicker?: () => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  selectedLocation,
  onSelectLocation,
  language,
  savedLocations = ['pune', 'mumbai', 'delhi', 'bengaluru', 'srinagar', 'kolkata'],
  onToggleSaveLocation,
  onOpenLocationPicker,
}) => {
  const t = TRANSLATIONS[language];
  const [filterQuery, setFilterQuery] = useState('');

  // Combine user-saved locations + current active location
  const displayList = useMemo(() => {
    const ids = Array.from(new Set([selectedLocation, ...savedLocations]));
    const locs = ids
      .map((id) => findIndiaLocation(id))
      .filter((l): l is NonNullable<typeof l> => Boolean(l));

    if (!filterQuery.trim()) return locs;
    const q = filterQuery.toLowerCase();
    return locs.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.state.toLowerCase().includes(q) ||
        l.nameHi.includes(q)
    );
  }, [selectedLocation, savedLocations, filterQuery]);

  return (
    <div id="saved-view" className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-5 h-5 text-sky-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Offline Cache & Locations
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            {t.savedLocations} & Offline Data
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {language === 'hi'
              ? 'संपूर्ण भारत के 160+ मौसम केंद्रों में से अपने पसंदीदा शहर सहेजें'
              : 'Pre-cached synoptic weather models across 160+ IMD stations throughout India.'}
          </p>
        </div>

        {onOpenLocationPicker && (
          <button
            onClick={onOpenLocationPicker}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'hi' ? 'नया स्थान जोड़ें' : 'Browse All India (160+)'}</span>
          </button>
        )}
      </div>

      {/* Offline Storage Status Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'ऑफ़लाइन कैशे स्थिति' : 'Offline Cache Status'}
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Synced & Ready
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
              Locations Available
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              160+ All-India AWS
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
              DB Schema Readiness
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              PostgreSQL-Ready
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
              Cache Architecture
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              Indexed LocalStorage
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
              Network Dependency
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              Zero External APIs
            </span>
          </div>
        </div>
      </div>

      {/* Saved Locations List & Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span>{language === 'hi' ? 'सहेजे गए केंद्र' : 'Saved IMD Weather Observatories'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              {displayList.length}
            </span>
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder={language === 'hi' ? 'सहेजे गए शहरों में खोजें...' : 'Filter saved cities...'}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayList.map((loc) => {
            const isCurrent = loc.id === selectedLocation;
            const weather = generateWeatherForLocation(loc.id);

            return (
              <div
                key={loc.id}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  isCurrent
                    ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <button
                    onClick={() => onSelectLocation(loc.id)}
                    type="button"
                    className="text-left cursor-pointer flex-1 min-w-0 pr-2"
                  >
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate block">
                        {language === 'hi' ? loc.nameHi : loc.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      {loc.state} • Elev {loc.elevationMeters}m • {loc.climateZone}
                    </span>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {weather.temperature}°C
                    </span>

                    {onToggleSaveLocation && (
                      <button
                        onClick={() => onToggleSaveLocation(loc.id)}
                        type="button"
                        className="p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        title="Remove from saved bookmarks"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                  <span className="truncate">
                    {language === 'hi' ? weather.conditionHi : weather.condition}
                  </span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sky-600 dark:text-sky-400 font-bold flex items-center gap-1">
                      <CloudRain className="w-3.5 h-3.5" />
                      {weather.rainProbability}%
                    </span>
                    <button
                      onClick={() => onSelectLocation(loc.id)}
                      type="button"
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                        isCurrent
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {isCurrent ? (language === 'hi' ? 'सक्रिय' : 'Active') : (language === 'hi' ? 'देखें' : 'Switch')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
