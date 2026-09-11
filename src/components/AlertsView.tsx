import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  MapPin,
  Flame,
  CloudLightning,
  Sun,
  Waves,
  Filter,
} from 'lucide-react';
import { WeatherAlert } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface AlertsViewProps {
  alerts: WeatherAlert[];
  language: 'en' | 'hi';
}

export const AlertsView: React.FC<AlertsViewProps> = ({ alerts = [], language }) => {
  const [filter, setFilter] = useState<'all' | 'red' | 'orange' | 'yellow'>('all');
  const t = TRANSLATIONS[language];

  const safeAlerts = alerts || [];
  const filteredAlerts = safeAlerts.filter((a) =>
    filter === 'all' ? true : a.severity === filter
  );

  return (
    <div id="alerts-full-view" className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20">
            IMD Synoptic Warning Center
          </span>
        </div>
        <h2 className="text-xl font-extrabold tracking-tight">
          {language === 'hi'
            ? 'भारत मौसम विज्ञान विभाग (IMD) मौसम चेतावनियां'
            : 'Official IMD Severe Weather Warning Bulletins'}
        </h2>
        <p className="text-xs text-amber-100 mt-1">
          {language === 'hi'
            ? 'सार्वजनिक सुरक्षा हेतु आधिकारिक मौसम अलर्ट व परामर्श'
            : 'Color-coded synoptic safety bulletins issued under Disaster Management Framework.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          {language === 'hi' ? 'फ़िल्टर' : 'Filter'}:
        </span>
        {(['all', 'red', 'orange', 'yellow'] as const).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilter(lvl)}
            type="button"
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors shrink-0 ${
              filter === lvl
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {lvl === 'all'
              ? language === 'hi'
                ? 'सभी अलर्ट'
                : 'All Alerts'
              : `${lvl.toUpperCase()} ${language === 'hi' ? 'अलर्ट' : 'Alert'}`}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
            <ShieldAlert className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {language === 'hi'
                ? 'इस श्रेणी में कोई सक्रिय चेतावनी नहीं है।'
                : 'No active warnings in this category.'}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isRed = alert.severity === 'red';
            const isOrange = alert.severity === 'orange';
            const title =
              language === 'hi' && alert.titleHi ? alert.titleHi : alert.title;
            const message =
              language === 'hi' && alert.messageHi ? alert.messageHi : alert.message;

            return (
              <div
                key={alert.id}
                className={`p-4 sm:p-5 rounded-2xl border ${
                  isRed
                    ? 'border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20'
                    : isOrange
                    ? 'border-orange-300 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20'
                    : 'border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20'
                } space-y-2`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded text-white ${
                        isRed
                          ? 'bg-red-600'
                          : isOrange
                          ? 'bg-orange-600'
                          : 'bg-amber-500 text-slate-900'
                      }`}
                    >
                      {alert.severity.toUpperCase()} ALERT
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {alert.location}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {alert.startTime} – {alert.endTime}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {title}
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {message}
                </p>

                <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    {language === 'hi' ? 'आज के लिए सक्रिय' : 'Active Advisory'}
                  </span>
                  <span className="font-semibold text-sky-600 dark:text-sky-400">
                    IMD National Weather Forecasting Centre
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* IMD Warning Color Code Guide for SIH Jury */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
        <h4 className="font-bold text-slate-900 dark:text-white mb-2">
          {language === 'hi'
            ? 'मौसम चेतावनी रंग कोड मार्गदर्शिका (IMD Standards)'
            : 'IMD Color-Coded Warning Standards'}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
            <strong>Green:</strong> No warning (मौसम साफ)
          </div>
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
            <strong>Yellow:</strong> Be Updated (अपडेट रहें)
          </div>
          <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-200">
            <strong>Orange:</strong> Be Prepared (तैयार रहें)
          </div>
          <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200">
            <strong>Red:</strong> Take Action (कार्रवाई करें)
          </div>
        </div>
      </div>
    </div>
  );
};
