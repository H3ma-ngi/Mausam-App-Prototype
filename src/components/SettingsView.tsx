import React from 'react';
import {
  Settings,
  Globe2,
  Moon,
  Sun,
  Bell,
  Sparkles,
  RotateCcw,
  BookOpen,
  CheckCircle,
  Sliders,
  ShieldAlert,
} from 'lucide-react';
import { UserPreferences, PreferenceId, AlertPriority } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface SettingsViewProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  onResetOnboarding: () => void;
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigateHome?: () => void;
}

const ALL_PREFS: { id: PreferenceId; labelEn: string; labelHi: string }[] = [
  { id: 'health', labelEn: 'Health & Wellness', labelHi: 'स्वास्थ्य और कल्याण' },
  { id: 'fitness', labelEn: 'Fitness & Outdoors', labelHi: 'फिटनेस और आउटडोर' },
  { id: 'marine', labelEn: 'Beach & Marine', labelHi: 'समुद्री तट और नेविगेशन' },
  { id: 'travel', labelEn: 'Travel & Multi-City', labelHi: 'यात्रा और गंतव्य' },
  { id: 'family', labelEn: 'Family & Children', labelHi: 'परिवार और स्कूल' },
  { id: 'agriculture', labelEn: 'Agriculture & Farming', labelHi: 'कृषि और बागवानी' },
  { id: 'commute', labelEn: 'Smart Commute', labelHi: 'स्मार्ट आवागमन' },
  { id: 'events', labelEn: 'Events & Weddings', labelHi: 'इवेंट और शादियां' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  preferences,
  onUpdatePreferences,
  onResetOnboarding,
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
  onNavigateHome,
}) => {
  const t = TRANSLATIONS[language];

  const handleTogglePref = (id: PreferenceId) => {
    const current = preferences.preferences;
    const next = current.includes(id)
      ? current.filter((p) => p !== id)
      : [...current, id];
    onUpdatePreferences({ preferences: next });
  };

  return (
    <div id="settings-view" className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-sky-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
            Preferences & Architecture
          </span>
        </div>
        <h2 className="text-xl font-extrabold tracking-tight">
          {t.settings} & Customization
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          {language === 'hi'
            ? 'अपनी प्राथमिकताओं, भाषा एवं प्रदर्शन सेटिंग्स को अनुकूलित करें'
            : 'Configure personalization interests, alert sensitivity, and inspect SIH architecture.'}
        </p>
      </div>

      {/* General Settings: Language & Theme */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-sky-600" />
          {language === 'hi' ? 'सामान्य सेटिंग्स' : 'General Controls'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Language Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Globe2 className="w-4 h-4 text-sky-600" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {t.language}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {language === 'en' ? 'English (Current)' : 'हिंदी (सक्रिय)'}
                </p>
              </div>
            </div>
            <button
              onClick={onToggleLanguage}
              type="button"
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800"
            >
              {language === 'en' ? 'Switch to हिंदी' : 'Switch to English'}
            </button>
          </div>

          {/* Theme Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {t.darkMode}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {theme === 'dark' ? 'Dark theme active' : 'Light theme active'}
                </p>
              </div>
            </div>
            <button
              onClick={onToggleTheme}
              type="button"
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </div>

      {/* Selected Interests Multi-Selector */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {language === 'hi' ? 'होमपेज पर प्रदर्शित रुचियां' : 'Homepage Displayed Interests'}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'hi'
                ? 'होमपेज पर केवल वे कार्ड दिखाई देंगे जो यहां चयनित हैं। अपनी इच्छानुसार जोड़ें या हटाएं।'
                : 'Only cards selected below will appear on your homepage. Enable or disable cards anytime.'}
            </p>
          </div>
          <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full self-start sm:self-auto shrink-0 border border-sky-200 dark:border-sky-800">
            {preferences.preferences.length} {language === 'hi' ? 'सक्रिय' : 'active'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {ALL_PREFS.map((pref) => {
            const isSelected = preferences.preferences.includes(pref.id);
            return (
              <button
                key={pref.id}
                onClick={() => handleTogglePref(pref.id)}
                type="button"
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 ring-1 ring-sky-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <span className="block font-bold">
                  {language === 'hi' ? pref.labelHi : pref.labelEn}
                </span>
                <span className="text-[10px] block mt-0.5 opacity-75">
                  {isSelected ? '✓ Active on Home' : '+ Tap to Show'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons: Navigate Home & Reset Onboarding */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              type="button"
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{language === 'hi' ? 'होमपेज पर कार्ड देखें' : 'View Cards on Homepage'}</span>
              <span>→</span>
            </button>
          )}
          <button
            onClick={onResetOnboarding}
            type="button"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-sky-600 transition-colors ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {language === 'hi' ? 'प्राथमिकताएं विज़ार्ड फिर से शुरू करें' : 'Rerun Onboarding Wizard'}
            </span>
          </button>
        </div>
      </div>

      {/* SIH 2026 Problem Statement 26076 Technical Documentation Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 text-xs space-y-2.5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h4 className="font-bold text-indigo-950 dark:text-indigo-200">
            SIH 2026 Problem Statement 26076 Architecture Compliance
          </h4>
        </div>

        <p className="text-indigo-900 dark:text-indigo-300 leading-relaxed">
          This prototype addresses all core requirements of MoES / IMD:
        </p>

        <ul className="space-y-1.5 text-indigo-900 dark:text-indigo-300 pl-2">
          <li className="flex items-start gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Rule-based engine:</strong> Deterministic scoring (+100 severe alert, +90 rain, +80 AQI, +70 UV, +50 interest, +40 location, +30 time). Safety warnings are guaranteed to appear first.
            </span>
          </li>
          <li className="flex items-start gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Completely Offline Mock Data:</strong> Zero external API downtime. Standalone Python FastAPI backend reference also included in <code>backend/fastapi_server.py</code>.
            </span>
          </li>
          <li className="flex items-start gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Bilingual & Dark Mode:</strong> 100% English & Hindi support with instantaneous language toggles.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
