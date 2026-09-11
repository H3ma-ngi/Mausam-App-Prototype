import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  Radio,
  Sparkles,
  ArrowDown,
  Satellite,
} from 'lucide-react';

interface PullToRefreshContainerProps {
  onRefresh: () => Promise<void> | void;
  isRefreshing: boolean;
  language: 'en' | 'hi';
  children: React.ReactNode;
  lastUpdated?: string;
}

const PULL_THRESHOLD = 65; // pixels before release triggers refresh
const MAX_PULL = 90;

export const PullToRefreshContainer: React.FC<PullToRefreshContainerProps> = ({
  onRefresh,
  isRefreshing,
  language,
  children,
  lastUpdated,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);

  // Check if at the top of scrollable area
  const isAtTop = () => {
    return window.scrollY <= 5;
  };

  const handleStart = (clientY: number) => {
    if (isRefreshing) return;
    if (isAtTop()) {
      startYRef.current = clientY;
      isDraggingRef.current = true;
    }
  };

  const handleMove = (clientY: number) => {
    if (!isDraggingRef.current || isRefreshing) return;
    const diff = clientY - startYRef.current;
    if (diff > 0) {
      setIsPulling(true);
      // Logarithmic resistance damping
      const damped = Math.min(MAX_PULL, Math.pow(diff, 0.82) * 1.5);
      setPullDistance(damped);
    } else {
      setPullDistance(0);
      setIsPulling(false);
    }
  };

  const handleEnd = async () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsPulling(false);

    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      // Trigger refresh
      setPullDistance(52); // hold position during refresh
      try {
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate?.([15, 25, 15]);
        }
        await onRefresh();
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } finally {
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  };

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isDraggingRef.current && pullDistance > 5 && e.cancelable) {
      // Prevent default browser rubber-banding only while dragging our pull indicator
      // e.preventDefault();
    }
    handleMove(e.touches[0].clientY);
  };

  const onTouchEnd = () => {
    handleEnd();
  };

  // Mouse drag handlers for desktop inspection / testing
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      handleStart(e.clientY);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      handleMove(e.clientY);
    }
  };

  const onMouseUp = () => {
    handleEnd();
  };

  const onMouseLeave = () => {
    if (isDraggingRef.current) {
      handleEnd();
    }
  };

  const progressPercent = Math.min(100, Math.round((pullDistance / PULL_THRESHOLD) * 100));
  const isPastThreshold = pullDistance >= PULL_THRESHOLD;

  const triggerManualRefresh = async () => {
    if (isRefreshing) return;
    setPullDistance(52);
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.([15, 25, 15]);
      }
      await onRefresh();
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } finally {
      setPullDistance(0);
    }
  };

  return (
    <div
      id="homepage-container"
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      className="relative select-none sm:select-auto space-y-4"
    >
      {/* 1. Pull-to-Refresh Interactive Indicator Area */}
      <div
        className="overflow-hidden transition-all duration-200 ease-out flex items-center justify-center pointer-events-none"
        style={{
          height: isRefreshing ? '56px' : `${pullDistance}px`,
          opacity: pullDistance > 8 || isRefreshing ? 1 : 0,
        }}
        aria-live="polite"
      >
        <div className="w-full max-w-md mx-auto px-4 py-2 flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-sky-50 via-indigo-50 to-sky-50 dark:from-sky-950/80 dark:via-indigo-950/80 dark:to-sky-950/80 border border-sky-200/80 dark:border-sky-800/80 text-xs shadow-sm">
          {isRefreshing ? (
            <>
              <div className="relative w-5 h-5 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-sky-500 animate-ping" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-sky-950 dark:text-sky-200 block truncate">
                  {language === 'hi'
                    ? 'नवीनतम मौसम प्रेक्षण सिंक हो रहे हैं...'
                    : 'Fetching latest weather observations...'}
                </span>
                <span className="text-[10px] text-sky-600 dark:text-sky-400 block truncate">
                  {language === 'hi'
                    ? 'आईएमडी पूर्वानुमान अपडेट हो रहा है'
                    : 'Updating forecasts & advisories'}
                </span>
              </div>
            </>
          ) : (
            <>
              <div
                className="w-5 h-5 rounded-full border-2 border-sky-600 dark:border-sky-400 flex items-center justify-center text-sky-600 dark:text-sky-400 transition-transform duration-150 shrink-0"
                style={{
                  transform: `rotate(${Math.min(180, (pullDistance / PULL_THRESHOLD) * 180)}deg)`,
                }}
              >
                <ArrowDown className="w-3 h-3" />
              </div>
              <div className="min-w-0">
                <span
                  className={`font-bold block truncate ${
                    isPastThreshold
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isPastThreshold
                    ? language === 'hi'
                      ? 'छोड़ें: मौसम डेटा तुरंत ताज़ा करें'
                      : 'Release to refresh weather data'
                    : language === 'hi'
                    ? `ताज़ा करने के लिए खींचें (${progressPercent}%)`
                    : `Pull down to refresh observations (${progressPercent}%)`}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                  {language === 'hi'
                    ? 'आईएमडी एडब्ल्यूएस स्टेशन सिंक'
                    : 'IMD Automatic Weather Station sync'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Synoptic Station Radar Telemetry Bar & Manual Desktop Refresh Trigger */}
      <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative flex items-center justify-center shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="absolute w-3.5 h-3.5 rounded-full bg-emerald-500/40 animate-ping pointer-events-none" />
          </div>
          <div className="flex items-center gap-1.5 min-w-0 truncate text-[11px] text-slate-700 dark:text-slate-300">
            <Radio className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="font-bold text-slate-900 dark:text-white">
              IMD Synoptic AWS
            </span>
            <span className="text-slate-400 dark:text-slate-500 hidden xs:inline">•</span>
            <span className="text-slate-500 dark:text-slate-400 truncate hidden xs:inline">
              {lastUpdated || 'Live Telemetry Active'}
            </span>
          </div>
        </div>

        <button
          onClick={triggerManualRefresh}
          disabled={isRefreshing}
          type="button"
          title="Pull down to refresh or click here to sync IMD data"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs text-[11px] font-bold transition-all active:scale-95 disabled:opacity-60 cursor-pointer shrink-0"
        >
          <RotateCcw
            className={`w-3 h-3 text-sky-600 dark:text-sky-400 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          />
          <span>{isRefreshing ? (language === 'hi' ? 'अपडेट...' : 'Syncing...') : (language === 'hi' ? 'ताज़ा करें' : 'Pull / Refresh')}</span>
        </button>
      </div>

      {/* 3. Success Toast Banner when Recalculation completes */}
      {showSuccessToast && (
        <div
          role="status"
          className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 text-xs flex items-center justify-between gap-2 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="font-extrabold block truncate">
                {language === 'hi'
                  ? '✓ मौसम प्रेक्षण अपडेट हो गए!'
                  : '✓ Weather observations updated!'}
              </span>
              <span className="text-[11px] text-emerald-800 dark:text-emerald-300 block truncate">
                {language === 'hi'
                  ? 'आपकी रुचियों के अनुसार कार्ड व्यवस्थित किए गए'
                  : 'Tailored weather interests organized for your day'}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 shrink-0">
            {language === 'hi' ? 'ताज़ा' : 'Live'}
          </span>
        </div>
      )}

      {/* 4. Child Elements: Weather, Alerts, Cards */}
      <div
        className="space-y-4 transition-transform duration-150 ease-out"
        style={{
          transform: isPulling ? `translateY(${Math.min(15, pullDistance * 0.2)}px)` : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
};
