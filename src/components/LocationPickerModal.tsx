import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  X,
  Navigation,
  Sparkles,
  Compass,
  Star,
  Check,
  Building2,
  Mountain,
  Waves,
  Sun,
  CloudRain,
  Radio,
} from 'lucide-react';
import {
  ALL_INDIA_LOCATIONS,
  INDIA_REGIONS,
  IndiaLocation,
  IndiaRegion,
  searchIndiaLocations,
  generateWeatherForLocation,
} from '../data/indiaLocations';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocationId: string;
  onSelectLocation: (locId: string) => void;
  language: 'en' | 'hi';
  savedLocations?: string[];
  onToggleSaveLocation?: (locId: string) => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  selectedLocationId,
  onSelectLocation,
  language,
  savedLocations = [],
  onToggleSaveLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState<IndiaRegion | 'All'>('All');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsNotice, setGpsNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
      setActiveRegion('All');
      setGpsNotice(null);
    }
  }, [isOpen]);

  // Filtered locations
  const filteredLocations = useMemo(() => {
    return searchIndiaLocations(searchQuery, activeRegion);
  }, [searchQuery, activeRegion]);

  // Popular metros for quick access
  const popularLocations = useMemo(() => {
    return ALL_INDIA_LOCATIONS.filter((l) => l.popular);
  }, []);

  // Check if query is custom and not already listed
  const isCustomCandidate = useMemo(() => {
    if (!searchQuery.trim()) return false;
    const lower = searchQuery.trim().toLowerCase();
    return !filteredLocations.some(
      (l) => l.name.toLowerCase().includes(lower) || l.id.toLowerCase() === lower
    );
  }, [searchQuery, filteredLocations]);

  // GPS Auto-detect handler
  const handleDetectLocation = () => {
    setIsDetectingGps(true);
    setGpsNotice(language === 'hi' ? 'निकटतम आईएमडी एडब्ल्यूएस स्टेशन खोज रहे हैं...' : 'Querying nearest IMD AWS radar station...');

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsDetectingGps(false);
          const { latitude, longitude } = pos.coords;
          // Rough bounding box matching to prominent Indian hubs
          let matched = 'delhi';
          if (latitude < 14) {
            matched = longitude < 77 ? 'kochi' : 'chennai';
          } else if (latitude < 18) {
            matched = longitude < 76 ? 'bengaluru' : 'hyderabad';
          } else if (latitude < 21) {
            matched = longitude < 74 ? 'mumbai' : 'pune';
          } else if (latitude < 25) {
            matched = longitude < 80 ? 'ahmedabad' : longitude < 86 ? 'bhopal' : 'kolkata';
          } else if (latitude < 30) {
            matched = longitude < 76 ? 'jaipur' : longitude < 82 ? 'delhi' : 'patna';
          } else {
            matched = longitude < 76 ? 'srinagar' : 'shimla';
          }

          const target = ALL_INDIA_LOCATIONS.find((l) => l.id === matched) || ALL_INDIA_LOCATIONS[0];
          setGpsNotice(
            language === 'hi'
              ? `निकटतम स्टेशन: ${target.nameHi} (अक्षांश ${latitude.toFixed(2)}°)`
              : `Nearest IMD Station: ${target.name} (Lat ${latitude.toFixed(2)}°)`
          );
          setTimeout(() => {
            onSelectLocation(target.id);
            onClose();
          }, 800);
        },
        () => {
          setIsDetectingGps(false);
          // Fallback to Pune or current selection
          setGpsNotice(
            language === 'hi'
              ? 'स्थान अनुमति अनुपलब्ध। डिफ़ॉल्ट स्टेशन सक्रिय किया गया।'
              : 'GPS unavailable. Defaulting to synoptic network station.'
          );
        },
        { timeout: 5000 }
      );
    } else {
      setIsDetectingGps(false);
      setGpsNotice('Geolocation not supported by device.');
    }
  };

  const handleSelect = (locId: string) => {
    onSelectLocation(locId);
    onClose();
  };

  const handleCustomSelect = () => {
    if (!searchQuery.trim()) return;
    const cleanId = searchQuery.trim().toLowerCase().replace(/\s+/g, '_');
    onSelectLocation(cleanId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="location-picker-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-picker-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-sky-50 via-slate-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h2
                  id="location-picker-title"
                  className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight truncate"
                >
                  {language === 'hi'
                    ? 'स्थान चुनें • संपूर्ण भारत मौसम नेटवर्क'
                    : 'Select Location • All-India Weather Network'}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {language === 'hi'
                    ? 'सभी 28 राज्य और 8 केंद्र शासित प्रदेशों के 160+ आईएमडी सिनॉप्टिक स्टेशन'
                    : '160+ IMD AWS Synoptic Stations across 28 States & 8 Union Territories'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Close location selector"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box & GPS Trigger */}
          <div className="flex items-center gap-2 mt-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'शहर, जिला या राज्य खोजें (उदा. शिमला, जयपुर, कोच्चि)...'
                    : 'Search any city, district or state (e.g. Shimla, Kochi, Varanasi)...'
                }
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={handleDetectLocation}
              disabled={isDetectingGps}
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white text-xs font-bold transition-all shrink-0 shadow-sm disabled:opacity-60"
              title="Detect nearest Indian IMD station via GPS"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isDetectingGps
                  ? language === 'hi'
                    ? 'खोज रहे हैं...'
                    : 'Detecting...'
                  : language === 'hi'
                  ? 'जीपीएस'
                  : 'Use GPS'}
              </span>
            </button>
          </div>

          {/* GPS notice notification banner */}
          {gpsNotice && (
            <div className="mt-2 text-[11px] px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 border border-sky-200 dark:border-sky-800 flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-sky-600 animate-pulse shrink-0" />
              <span>{gpsNotice}</span>
            </div>
          )}

          {/* Popular Metro Quick-Chips */}
          <div className="mt-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
              {language === 'hi' ? 'प्रमुख भारतीय महानगर:' : 'Key Metros & Hubs:'}
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
              {popularLocations.map((pop) => {
                const isSelected = selectedLocationId === pop.id;
                return (
                  <button
                    key={pop.id}
                    onClick={() => handleSelect(pop.id)}
                    type="button"
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {language === 'hi' ? pop.nameHi.split(',')[0] : pop.name.split(',')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Region Filter Tabs */}
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {INDIA_REGIONS.map((r) => {
            const isActive = activeRegion === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setActiveRegion(r.id)}
                type="button"
                className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                {language === 'hi' ? r.labelHi : r.labelEn}
              </button>
            );
          })}
        </div>

        {/* Locations List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800/60">
          {/* Custom Candidate Banner if typed something unique */}
          {isCustomCandidate && (
            <div className="p-3 mb-2 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">
                  {language === 'hi' ? 'कस्टम स्थान खोजा गया' : 'Custom Indian Location'}
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  "{searchQuery}"
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {language === 'hi'
                    ? 'आईएमडी क्षेत्रीय सिनॉप्टिक सिमुलेटर के साथ तत्काल सक्रिय करें'
                    : 'Instant telemetry generation for this Indian town/district'}
                </p>
              </div>
              <button
                onClick={handleCustomSelect}
                type="button"
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shrink-0 shadow-xs transition-colors"
              >
                {language === 'hi' ? 'स्थान सक्रिय करें' : 'Activate Location'}
              </button>
            </div>
          )}

          {filteredLocations.length === 0 && !isCustomCandidate ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <MapPin className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm font-semibold">
                {language === 'hi' ? 'कोई मेल खाता स्थान नहीं मिला' : 'No matching locations found'}
              </p>
              <p className="text-xs mt-1 text-slate-400">
                {language === 'hi'
                  ? 'कृपया वर्तनी जांचें या किसी अन्य भारतीय शहर का नाम टाइप करें'
                  : 'Try searching by state name or clear search filter'}
              </p>
            </div>
          ) : (
            filteredLocations.map((loc) => {
              const isSelected = selectedLocationId === loc.id;
              const isSaved = savedLocations.includes(loc.id);
              const previewWeather = generateWeatherForLocation(loc.id);

              return (
                <div
                  key={loc.id}
                  className={`pt-1.5 first:pt-0 flex items-center justify-between gap-2 p-2 rounded-xl transition-colors ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <button
                    onClick={() => handleSelect(loc.id)}
                    type="button"
                    className="flex items-center gap-3 text-left min-w-0 flex-1 cursor-pointer"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-4 h-4" />
                      ) : loc.climateZone === 'Himalayan' ? (
                        <Mountain className="w-3.5 h-3.5" />
                      ) : loc.climateZone === 'Coastal' || loc.climateZone === 'Island' ? (
                        <Waves className="w-3.5 h-3.5" />
                      ) : loc.climateZone === 'Arid' ? (
                        <Sun className="w-3.5 h-3.5" />
                      ) : (
                        <Building2 className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {language === 'hi' ? loc.nameHi : loc.name}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {loc.stationCode}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span>{loc.state}</span>
                        <span>•</span>
                        <span>Elev {loc.elevationMeters}m</span>
                        <span>•</span>
                        <span className="truncate">{previewWeather.condition}</span>
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Temperature Pill */}
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {previewWeather.temperature}°C
                    </span>

                    {/* Bookmark Toggle */}
                    {onToggleSaveLocation && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSaveLocation(loc.id);
                        }}
                        type="button"
                        className={`p-1.5 rounded-lg transition-colors ${
                          isSaved
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                        title={isSaved ? 'Saved in offline bookmarks' : 'Save to offline bookmarks'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info strip */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            <span>
              {language === 'hi'
                ? 'आईएमडी सिनॉप्टिक एडब्ल्यूएस रडार नेटवर्क'
                : 'IMD Synoptic AWS Doppler Radar Network'}
            </span>
          </div>
          <span className="font-mono text-[10px]">
            {filteredLocations.length} Stations Available
          </span>
        </div>
      </div>
    </div>
  );
};
