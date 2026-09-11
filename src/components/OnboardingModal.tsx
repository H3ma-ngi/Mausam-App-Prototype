import React, { useState, useMemo } from 'react';
import {
  Heart,
  Activity,
  Waves,
  Plane,
  Users,
  Sprout,
  Car,
  PartyPopper,
  Check,
  MapPin,
  Bell,
  ArrowRight,
  ShieldAlert,
  Navigation,
  Sparkles,
  Search,
  X,
} from 'lucide-react';
import { PreferenceId, AlertPriority, UserPreferences, DemoPersona } from '../types';
import { MOCK_LOCATIONS, DEMO_PERSONAS, MOCK_CURRENT_WEATHER } from '../data/mockData';
import { ALL_INDIA_LOCATIONS } from '../data/indiaLocations';
import { TRANSLATIONS } from '../data/translations';

interface OnboardingModalProps {
  isOpen: boolean;
  canClose?: boolean;
  onClose?: () => void;
  language: 'en' | 'hi';
  onLanguageChange: (lang: 'en' | 'hi') => void;
  onComplete: (prefs: Partial<UserPreferences>, persona?: DemoPersona) => void;
  initialPreferences?: UserPreferences;
  isMobileFrame?: boolean;
}

const PREFERENCE_OPTIONS: {
  id: PreferenceId;
  icon: React.ElementType;
  titleKey: keyof typeof TRANSLATIONS['en'];
  descKey: keyof typeof TRANSLATIONS['en'];
  color: string;
}[] = [
  {
    id: 'fitness',
    icon: Activity,
    titleKey: 'prefFitness',
    descKey: 'prefFitnessDesc',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'health',
    icon: Heart,
    titleKey: 'prefHealth',
    descKey: 'prefHealthDesc',
    color: 'from-rose-500 to-pink-600',
  },
  {
    id: 'agriculture',
    icon: Sprout,
    titleKey: 'prefAgriculture',
    descKey: 'prefAgricultureDesc',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'commute',
    icon: Car,
    titleKey: 'prefCommute',
    descKey: 'prefCommuteDesc',
    color: 'from-blue-600 to-sky-600',
  },
  {
    id: 'travel',
    icon: Plane,
    titleKey: 'prefTravel',
    descKey: 'prefTravelDesc',
    color: 'from-indigo-500 to-violet-600',
  },
  {
    id: 'family',
    icon: Users,
    titleKey: 'prefFamily',
    descKey: 'prefFamilyDesc',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'events',
    icon: PartyPopper,
    titleKey: 'prefEvents',
    descKey: 'prefEventsDesc',
    color: 'from-fuchsia-500 to-rose-500',
  },
  {
    id: 'marine',
    icon: Waves,
    titleKey: 'prefMarine',
    descKey: 'prefMarineDesc',
    color: 'from-cyan-500 to-blue-600',
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  canClose = false,
  onClose,
  language,
  onLanguageChange,
  onComplete,
  initialPreferences,
  isMobileFrame = false,
}) => {
  const [selectedPrefs, setSelectedPrefs] = useState<PreferenceId[]>(
    initialPreferences?.preferences || ['fitness', 'health']
  );
  const [selectedLocation, setSelectedLocation] = useState<string>(
    initialPreferences?.preferredLocation || 'pune'
  );
  const [alertPriority, setAlertPriority] = useState<AlertPriority>(
    initialPreferences?.alertPriority || 'all'
  );
  const [activePersonaId, setActivePersonaId] = useState<string | null>(
    initialPreferences?.userId || 'fitness'
  );
  const [gpsDetecting, setGpsDetecting] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');

  // Popular quick-pick locations
  const POPULAR_QUICK_CITIES = useMemo(
    () => [
      { id: 'pune', name: 'Pune', nameHi: 'पुणे', state: 'Maharashtra', temp: 28 },
      { id: 'mumbai', name: 'Mumbai', nameHi: 'मुंबई', state: 'Maharashtra', temp: 31 },
      { id: 'delhi', name: 'Delhi', nameHi: 'दिल्ली', state: 'Delhi NCR', temp: 33 },
      { id: 'bengaluru', name: 'Bengaluru', nameHi: 'बेंगलुरु', state: 'Karnataka', temp: 26 },
      { id: 'srinagar', name: 'Srinagar', nameHi: 'श्रीनगर', state: 'J&K', temp: 18 },
      { id: 'shimla', name: 'Shimla', nameHi: 'शिमला', state: 'Himachal', temp: 17 },
      { id: 'chennai', name: 'Chennai', nameHi: 'चेन्नई', state: 'Tamil Nadu', temp: 32 },
      { id: 'kolkata', name: 'Kolkata', nameHi: 'कोलकाता', state: 'West Bengal', temp: 31 },
      { id: 'jaipur', name: 'Jaipur', nameHi: 'जयपुर', state: 'Rajasthan', temp: 34 },
      { id: 'goa', name: 'Goa (Panaji)', nameHi: 'गोवा', state: 'Goa', temp: 29 },
    ],
    []
  );

  // Search filter for all India locations
  const searchResults = useMemo(() => {
    if (!locationSearch.trim()) return [];
    const q = locationSearch.trim().toLowerCase();
    return ALL_INDIA_LOCATIONS.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nameHi.toLowerCase().includes(q) ||
        l.state.toLowerCase().includes(q) ||
        l.stationCode.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [locationSearch]);

  if (!isOpen) return null;

  const t = TRANSLATIONS[language];

  const togglePref = (id: PreferenceId) => {
    setActivePersonaId(null); // Custom selection
    setSelectedPrefs((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((p) => p !== id)
          : prev
        : [...prev, id]
    );
  };

  const handleSelectPresetPersona = (persona: DemoPersona) => {
    setActivePersonaId(persona.id);
    setSelectedPrefs(persona.primaryPreferences);
    setSelectedLocation(persona.location);
    setAlertPriority(persona.alertPriority);
  };

  const handleGpsDetect = () => {
    setGpsDetecting(true);
    setTimeout(() => {
      setSelectedLocation('pune');
      setGpsDetecting(false);
    }, 450);
  };

  const handleProceed = () => {
    const matchedPersona = DEMO_PERSONAS.find((p) => p.id === activePersonaId);
    onComplete(
      {
        preferences: selectedPrefs,
        preferredLocation: selectedLocation,
        alertPriority,
        hasCompletedOnboarding: true,
        name: matchedPersona ? matchedPersona.name : 'Personalized User',
        userId: matchedPersona ? matchedPersona.id : 'custom-user',
      },
      matchedPersona
    );
  };

  // Find label for current selection
  const selectedLocationObj =
    POPULAR_QUICK_CITIES.find((c) => c.id === selectedLocation) ||
    ALL_INDIA_LOCATIONS.find((l) => l.id === selectedLocation);
  const selectedLocationLabel = selectedLocationObj
    ? language === 'hi'
      ? selectedLocationObj.nameHi
      : selectedLocationObj.name
    : selectedLocation;

  return (
    <div
      id="onboarding-overlay"
      className={
        isMobileFrame
          ? 'absolute inset-0 z-50 flex flex-col bg-slate-950/85 backdrop-blur-md overflow-y-auto p-2.5 sm:p-3 animate-in fade-in duration-200'
          : 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200'
      }
    >
      <div
        id="onboarding-container"
        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white relative my-auto ${
          isMobileFrame
            ? 'w-full rounded-2xl p-3.5 sm:p-4.5 overflow-y-auto'
            : 'max-w-2xl w-full rounded-3xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto'
        }`}
      >
        {canClose && onClose && (
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
            title="Continue to Homepage"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Top IMD Emblem & Language Selector */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/20 text-xl">
              ☀️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-none">
                  {t.appTitle}
                </h2>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  IMD • MoES
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {language === 'hi'
                  ? 'भारत मौसम विज्ञान विभाग — व्यक्तिगत मौसम पोर्टल'
                  : 'India Meteorological Department — Weather Personalization'}
              </p>
            </div>
          </div>

          <button
            id="onboarding-lang-btn"
            onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
            type="button"
            className="px-2.5 py-1 text-xs font-bold rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors shrink-0 mr-6 sm:mr-0"
          >
            {language === 'en' ? 'हिंदी (हिं)' : 'English (EN)'}
          </button>
        </div>

        {/* Hero Title with Reload Indicator Note */}
        <div className="mb-4">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wider bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200">
              <Sparkles className="w-3 h-3 text-sky-600" />
              {language === 'hi' ? 'पूर्वावलोकन विकल्प' : 'Preview Reload Setup'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              SIH 26076
            </span>
          </div>
          <h1
            id="onboarding-heading"
            className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight"
          >
            {language === 'hi'
              ? 'अपना स्थान एवं मौसम प्राथमिकताएं चुनें'
              : 'Select User Preferences & Location'}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
            {language === 'hi'
              ? 'प्रत्येक पूर्वावलोकन पुनः लोड पर आप विभिन्न प्रोफाइल और 160+ भारतीय शहरों का परीक्षण कर सकते हैं।'
              : 'Presented on every preview reload so you can seamlessly test different locations, personas, and safety prioritizations.'}
          </p>
        </div>

        {/* STEP 1: Location Selection */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              <span>Step 1: {language === 'hi' ? 'स्थान चुनें' : 'Select Location'}</span>
              <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 lowercase">
                ({selectedLocationLabel})
              </span>
            </label>
            <button
              onClick={handleGpsDetect}
              type="button"
              disabled={gpsDetecting}
              className="flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
            >
              <Navigation className={`w-3 h-3 ${gpsDetecting ? 'animate-spin' : ''}`} />
              <span>{gpsDetecting ? (language === 'hi' ? 'खोज रहे हैं...' : 'Detecting...') : (language === 'hi' ? 'GPS पता लगाएं' : 'Auto-Detect (GPS)')}</span>
            </button>
          </div>

          {/* Quick search input */}
          <div className="relative mb-2.5">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              placeholder={language === 'hi' ? '160+ भारतीय शहर खोजें (उदा. पुणे, दिल्ली, लेह...)' : 'Search 160+ Indian stations (e.g., Pune, Leh, Shimla, Kochi)...'}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            {locationSearch && (
              <button
                onClick={() => setLocationSearch('')}
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search suggestions dropdown list if user is typing */}
          {searchResults.length > 0 && (
            <div className="mb-2.5 max-h-36 overflow-y-auto bg-white dark:bg-slate-900 rounded-xl border border-sky-400/40 divide-y divide-slate-100 dark:divide-slate-800 shadow-sm">
              {searchResults.map((loc) => {
                const isSel = selectedLocation === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setSelectedLocation(loc.id);
                      setLocationSearch('');
                    }}
                    type="button"
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-xs hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors ${
                      isSel ? 'bg-sky-50 dark:bg-sky-950/60 font-bold text-sky-600' : ''
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {language === 'hi' ? loc.nameHi : loc.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {loc.state} • {loc.region}
                      </span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                      {loc.stationCode}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Popular Cities Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mb-2.5">
            {POPULAR_QUICK_CITIES.map((loc) => {
              const isSelected = selectedLocation === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  type="button"
                  className={`p-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm ring-2 ring-sky-500/30'
                      : 'bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-sky-400'
                  }`}
                >
                  <span className="text-[11px] font-extrabold block truncate">
                    {language === 'hi' ? loc.nameHi : loc.name}
                  </span>
                  <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-sky-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {loc.temp}°C
                  </span>
                </button>
              );
            })}
          </div>

          {/* All 160+ Locations Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
              {language === 'hi' ? 'सभी 160+ स्टेशन:' : 'All 160+ Stations:'}
            </span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="flex-1 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-sky-500"
            >
              {ALL_INDIA_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {language === 'hi' ? loc.nameHi : loc.name} ({loc.state}) — {loc.stationCode}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* STEP 2A: Quick-Pick Official PS Persona Profiles */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Step 2: {language === 'hi' ? 'समस्या विवरण (PS) प्रोफाइल चुनें' : 'Quick-Select Problem Statement Profile'}</span>
            </p>
            <span className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold">
              {language === 'hi' ? '1-क्लिक चयन' : '1-Click Preset'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
            {language === 'hi'
              ? 'एसआईएच 26076 समस्या विवरण में उल्लिखित आधिकारिक उपयोगकर्ता प्रोफाइल:'
              : 'Official target profiles defined directly in SIH Problem Statement 26076:'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DEMO_PERSONAS.map((p) => {
              const isSelected = activePersonaId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPresetPersona(p)}
                  type="button"
                  className={`p-2.5 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-500 text-sky-950 dark:text-white ring-2 ring-sky-500/20 shadow-sm'
                      : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-lg">{p.avatar}</span>
                    <span className="text-xs font-bold leading-tight line-clamp-1">
                      {language === 'hi' ? (p.shortTitleHi || p.nameHi) : (p.shortTitle || p.name)}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                    {language === 'hi' ? p.roleHi : p.role}
                  </p>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-sky-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2B: Custom Interests Multi-Select */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {language === 'hi' ? 'या व्यक्तिगत रुचियां चुनें (मल्टी-सेलेक्ट)' : 'Or Customize Specific Weather Interests'}:
            </p>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {selectedPrefs.length} {language === 'hi' ? 'चयनित' : 'selected'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PREFERENCE_OPTIONS.map((item) => {
              const isSelected = selectedPrefs.includes(item.id);
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  id={`pref-opt-${item.id}`}
                  onClick={() => togglePref(item.id)}
                  type="button"
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/30 ring-1 ring-sky-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white bg-gradient-to-br ${item.color} shadow-sm`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {t[item.titleKey] as string}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {t[item.descKey] as string}
                    </p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] shrink-0 ${
                      isSelected
                        ? 'bg-sky-600 border-sky-600 text-white'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 3: Alert Notification Priority */}
        <div className="mb-6">
          <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span>Step 3: {t.alertPriority}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'all', label: t.priorityAll, desc: 'Show all alerts' },
              { id: 'severe', label: t.prioritySevere, desc: 'Only Red/Orange' },
              { id: 'health', label: t.priorityHealth, desc: 'AQI & Pollen' },
              { id: 'daily', label: t.priorityDaily, desc: 'Daily synoptic' },
            ].map((p) => {
              const isSelected = alertPriority === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setAlertPriority(p.id as AlertPriority)}
                  type="button"
                  className={`p-2 rounded-xl border text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/20 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="block truncate">{p.label}</span>
                  <span className="text-[10px] text-slate-400 block font-normal">{p.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Safety override policy notice */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 mb-5 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong className="font-semibold">
              {language === 'en' ? 'IMD MoES Safety Mandate' : 'आईएमडी सुरक्षा नीति'}:
            </strong>{' '}
            {t.safetyNotice}
          </p>
        </div>

        {/* Action Buttons: Apply & Proceed OR Continue with Current Profile */}
        <div className="space-y-2">
          <button
            id="onboarding-continue-btn"
            onClick={handleProceed}
            type="button"
            className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 hover:from-sky-700 hover:to-indigo-800 text-white font-extrabold text-sm shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
          >
            <span>
              {language === 'hi'
                ? 'प्राथमिकताएं सहेजें व होमपेज पर जाएं'
                : 'Apply & Proceed to Mausam Homepage'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {canClose && onClose && (
            <button
              onClick={onClose}
              type="button"
              className="w-full py-2 px-4 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors text-center"
            >
              {language === 'hi'
                ? `वर्तमान सेटिंग्स के साथ जारी रखें (${selectedLocationLabel})`
                : `Continue with current profile & location (${selectedLocationLabel})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
