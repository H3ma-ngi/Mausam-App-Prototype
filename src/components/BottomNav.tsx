import React from 'react';
import {
  Home,
  Calendar,
  ShieldAlert,
  Bookmark,
  Settings,
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export type NavTab = 'home' | 'forecast' | 'alerts' | 'saved' | 'settings';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  language: 'en' | 'hi';
  alertCount: number;
  isMobileFrame?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  language,
  alertCount,
  isMobileFrame = false,
}) => {
  const t = TRANSLATIONS[language];

  const NAV_ITEMS: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'forecast', label: t.forecast, icon: Calendar },
    { id: 'alerts', label: t.alerts, icon: ShieldAlert },
    { id: 'saved', label: t.saved, icon: Bookmark },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Main Navigation"
      className={`${
        isMobileFrame ? 'sticky bottom-0 left-0 right-0 w-full' : 'fixed bottom-0 left-0 right-0'
      } z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors`}
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = currentTab === item.id;
          const IconComp = item.icon;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              type="button"
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive
                  ? 'text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <div className="relative">
                <IconComp
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110' : ''
                  }`}
                />
                {item.id === 'alerts' && alertCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-orange-600 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                    {alertCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-sky-600 dark:bg-sky-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Native Home Indicator Bar for Mobile Emulator */}
      {isMobileFrame && (
        <div className="w-full flex justify-center pb-1 pt-0.5 select-none">
          <div className="w-32 h-1 bg-slate-400/70 dark:bg-slate-500/70 rounded-full" />
        </div>
      )}
    </nav>
  );
};
