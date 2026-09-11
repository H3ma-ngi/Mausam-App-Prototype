import React from 'react';
import {
  Sparkles,
  Clock,
  AlertTriangle,
  Smartphone,
  Maximize2,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { TimeOfDay, DemoPersona } from '../types';
import { DEMO_PERSONAS } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';

interface DemoModeBarProps {
  currentPersonaId: string;
  onSelectPersona: (persona: DemoPersona) => void;
  timeOfDay: TimeOfDay;
  onTimeOfDayChange: (time: TimeOfDay) => void;
  isSevereAlertActive: boolean;
  onToggleSevereAlert: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  language: 'en' | 'hi';
  onOpenOnboarding?: () => void;
}

export const DemoModeBar: React.FC<DemoModeBarProps> = ({
  currentPersonaId,
  onSelectPersona,
  timeOfDay,
  onTimeOfDayChange,
  isSevereAlertActive,
  onToggleSevereAlert,
  isMobileFrame,
  onToggleMobileFrame,
  language,
  onOpenOnboarding,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <aside
      id="demo-mode-bar"
      aria-label="SIH 2026 Evaluation Controls"
      className="bg-slate-900 text-white border-b border-slate-800 px-3 py-2.5 shadow-md relative z-30"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        {/* Title & Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.sihBadge}</span>
          </div>
          <span className="text-xs font-medium text-slate-300 hidden sm:inline">
            {t.demoModeTitle}
          </span>
        </div>

        {/* Persona quick buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            {t.switchPersona}:
          </span>
          {DEMO_PERSONAS.map((p) => {
            const isActive = p.id === currentPersonaId;
            return (
              <button
                key={p.id}
                id={`demo-persona-${p.id}`}
                onClick={() => onSelectPersona(p)}
                type="button"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm ring-2 ring-sky-400/40 font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={language === 'hi' ? p.descriptionHi : p.description}
              >
                <span>{p.avatar}</span>
                <span>{language === 'hi' ? (p.shortTitleHi || p.nameHi) : (p.shortTitle || p.name)}</span>
                {isActive && <CheckCircle2 className="w-3 h-3 ml-0.5 text-sky-100" />}
              </button>
            );
          })}
        </div>

        {/* Controls: Day/Time simulation, Severe Alert toggle, Math explanation, Mobile frame, Preferences Prompt */}
        <div className="flex items-center gap-1.5 shrink-0 text-xs flex-wrap w-full lg:w-auto justify-between lg:justify-end">
          {/* Day / Time of Day Direct Toggle Pills */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <span className="text-[10px] font-bold text-slate-400 px-1.5 hidden sm:inline flex items-center gap-1">
              <Clock className="w-3 h-3 text-sky-400" />
              <span>Day:</span>
            </span>
            {(['morning', 'afternoon', 'evening', 'auto'] as TimeOfDay[]).map((tVal) => {
              const isActive = timeOfDay === tVal;
              const labels: Record<TimeOfDay, { en: string; hi: string; icon: string }> = {
                morning: { en: 'Morn', hi: 'सुबह', icon: '☀️' },
                afternoon: { en: 'Noon', hi: 'दोपहर', icon: '🌤️' },
                evening: { en: 'Eve', hi: 'शाम', icon: '🌙' },
                auto: { en: 'Auto', hi: 'ऑटो', icon: '⚡' },
              };
              const item = labels[tVal];
              return (
                <button
                  key={tVal}
                  id={`demo-time-${tVal}`}
                  onClick={() => onTimeOfDayChange(tVal)}
                  type="button"
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-sm font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                  title={`Simulate ${tVal} weather`}
                >
                  <span className="text-xs">{item.icon}</span>
                  <span>{language === 'hi' ? item.hi : item.en}</span>
                </button>
              );
            })}
          </div>

          {/* Preferences & Location Setup Button */}
          {onOpenOnboarding && (
            <button
              id="demo-onboarding-prompt-btn"
              onClick={onOpenOnboarding}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition-colors"
              title="Prompt Preferences & Location Setup"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {language === 'hi' ? 'प्राथमिकताएं' : 'Prompt'}
              </span>
            </button>
          )}

          {/* Severe Alert Toggle */}
          <button
            id="demo-toggle-severe-btn"
            onClick={onToggleSevereAlert}
            type="button"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium transition-colors ${
              isSevereAlertActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title={t.toggleSevereAlert}
          >
            <AlertTriangle
              className={`w-3.5 h-3.5 ${
                isSevereAlertActive ? 'text-amber-400 fill-amber-400/20' : 'text-slate-400'
              }`}
            />
            <span className="hidden sm:inline">
              {isSevereAlertActive
                ? language === 'hi' ? 'अलर्ट सक्रिय' : 'Alert ON'
                : language === 'hi' ? 'अलर्ट सिमुलेट' : 'Alert'}
            </span>
          </button>

          {/* Mobile frame toggle */}
          <button
            id="demo-mobile-frame-btn"
            onClick={onToggleMobileFrame}
            type="button"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium transition-colors ${
              isMobileFrame
                ? 'bg-sky-600 text-white border-sky-500 shadow-sm'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title={isMobileFrame ? 'Switch to Full-Width Responsive View' : 'Display inside Virtual Mobile Device Emulator'}
          >
            {isMobileFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Full View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden md:inline">Mobile Emulator</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
