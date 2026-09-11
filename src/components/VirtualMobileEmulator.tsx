import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  RotateCcw,
  Volume2,
  VolumeX,
  Power,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Signal,
  Camera,
  Flame,
  Sun,
  Moon,
  Sliders,
  Radio,
  Lock,
  Unlock,
  Check,
  Bell,
  RefreshCw,
} from 'lucide-react';

export type DeviceModel = 'iphone-16-pro' | 'pixel-9-pro' | 'galaxy-s24';

interface VirtualMobileEmulatorProps {
  children: React.ReactNode;
  onboardingModal?: React.ReactNode;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  language: 'en' | 'hi';
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isOffline: boolean;
  onToggleOffline?: () => void;
  onRefresh?: () => void;
  onOpenPreferences?: () => void;
  currentLocationName?: string;
  activeAlertCount?: number;
}

export const VirtualMobileEmulator: React.FC<VirtualMobileEmulatorProps> = ({
  children,
  onboardingModal,
  isMobileFrame,
  onToggleMobileFrame,
  language,
  theme,
  onToggleTheme,
  isOffline,
  onToggleOffline,
  onRefresh,
  onOpenPreferences,
  currentLocationName = 'Pune',
  activeAlertCount = 1,
}) => {
  const [deviceModel, setDeviceModel] = useState<DeviceModel>('iphone-16-pro');
  const [scaleFactor, setScaleFactor] = useState<number>(1.0);
  const [isScreenLocked, setIsScreenLocked] = useState<boolean>(false);
  const [isSilentMode, setIsSilentMode] = useState<boolean>(false);
  const [volumeLevel, setVolumeLevel] = useState<number>(75);
  const [showVolumeHud, setShowVolumeHud] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [islandExpanded, setIslandExpanded] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('9:41');
  const [flashOn, setFlashOn] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update clock every 10 seconds
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      // Format as 12-hour or 24-hour cleanly
      setCurrentTime(`${hours % 12 || 12}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Show a quick transient HUD message
  const triggerToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setShowToast(msg);
    toastTimeoutRef.current = setTimeout(() => setShowToast(null), 2500);
  };

  // Hardware Volume controls
  const handleVolumeChange = (delta: number) => {
    setVolumeLevel((prev) => {
      const next = Math.max(0, Math.min(100, prev + delta));
      setShowVolumeHud(true);
      if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current);
      volumeTimeoutRef.current = setTimeout(() => setShowVolumeHud(false), 2000);
      return next;
    });
  };

  // Hardware Action button: toggle silent mode
  const handleToggleSilent = () => {
    setIsSilentMode((prev) => {
      const next = !prev;
      triggerToast(next ? 'Silent Mode: On' : 'Silent Mode: Off');
      return next;
    });
  };

  // Hardware Power button: lock or wake screen
  const handleTogglePower = () => {
    setIsScreenLocked((prev) => {
      const next = !prev;
      if (next) {
        setIsCameraActive(false);
      }
      return next;
    });
  };

  // Home gesture: scroll to top
  const handleHomeGesture = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Screenshot simulation
  const handleScreenshot = () => {
    triggerToast(language === 'hi' ? 'स्क्रीनशॉट सहेजा गया' : 'Screenshot captured');
  };

  // If emulator is disabled, render standard fluid layout
  if (!isMobileFrame) {
    return (
      <>
        {children}
        {onboardingModal}
      </>
    );
  }

  // Device dimension styling specs
  const getDeviceSpecs = () => {
    switch (deviceModel) {
      case 'pixel-9-pro':
        return {
          name: 'Google Pixel 9 Pro',
          width: 'max-w-[412px]',
          outerBorder: 'border-slate-800 dark:border-slate-900',
          borderRadius: 'rounded-[46px]',
          cameraStyle: 'punch-hole-center',
          aspect: 'h-[830px] max-h-[calc(100vh-160px)]',
        };
      case 'galaxy-s24':
        return {
          name: 'Samsung Galaxy S24',
          width: 'max-w-[410px]',
          outerBorder: 'border-neutral-800 dark:border-neutral-900',
          borderRadius: 'rounded-[38px]',
          cameraStyle: 'punch-hole-pin',
          aspect: 'h-[830px] max-h-[calc(100vh-160px)]',
        };
      case 'iphone-16-pro':
      default:
        return {
          name: 'Apple iPhone 16 Pro',
          width: 'max-w-[414px]',
          outerBorder: 'border-slate-950 dark:border-black',
          borderRadius: 'rounded-[50px]',
          cameraStyle: 'dynamic-island',
          aspect: 'h-[830px] max-h-[calc(100vh-160px)]',
        };
    }
  };

  const device = getDeviceSpecs();

  return (
    <div
      id="virtual-device-workspace"
      className="w-full flex-1 flex flex-col items-center justify-start py-4 px-2 sm:px-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 relative transition-all min-h-screen select-none"
    >
      {/* Studio Lighting Ambient Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-sky-500/10 dark:bg-sky-500/5 blur-[120px] pointer-events-none rounded-full" />

      {/* 1. Emulator Studio Control Dock */}
      <header
        id="emulator-controls-bar"
        aria-label="Device Emulator Controls"
        className="w-full max-w-4xl mx-auto mb-4 bg-slate-900/90 text-slate-200 border border-slate-800 backdrop-blur-xl rounded-2xl p-2 sm:px-4 sm:py-2.5 shadow-xl flex flex-wrap items-center justify-between gap-2.5 z-40 text-xs"
      >
        {/* Left: Emulator Badge & Device Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
            <Smartphone className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Virtual Mobile Emulator</span>
            <span className="sm:hidden">Emulator</span>
          </div>

          {/* Device Model Selector Dropdown/Pills */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700">
            {(['iphone-16-pro', 'pixel-9-pro', 'galaxy-s24'] as DeviceModel[]).map((modelId) => {
              const isActive = deviceModel === modelId;
              const labels: Record<DeviceModel, string> = {
                'iphone-16-pro': 'iPhone 16 Pro',
                'pixel-9-pro': 'Pixel 9 Pro',
                'galaxy-s24': 'Galaxy S24',
              };
              return (
                <button
                  key={modelId}
                  onClick={() => setDeviceModel(modelId)}
                  type="button"
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                    isActive
                      ? 'bg-sky-600 text-white font-bold shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                  title={`Switch to ${labels[modelId]}`}
                >
                  {labels[modelId]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Emulator Actions (Zoom, Power, Refresh, Screenshot, Exit to Fullscreen) */}
        <div className="flex items-center gap-1.5 flex-wrap ml-auto">
          {/* Zoom / Scale factor */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-[11px]">
            <span className="px-1.5 text-slate-400 font-medium hidden md:inline">Scale:</span>
            {[0.85, 0.92, 1.0].map((sc) => (
              <button
                key={sc}
                onClick={() => setScaleFactor(sc)}
                type="button"
                className={`px-1.5 py-0.5 rounded font-semibold transition-colors ${
                  scaleFactor === sc
                    ? 'bg-slate-700 text-sky-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {Math.round(sc * 100)}%
              </button>
            ))}
          </div>

          {/* Preferences & Location Button */}
          {onOpenPreferences && (
            <button
              id="emulator-preferences-btn"
              onClick={onOpenPreferences}
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 font-semibold transition-colors text-[11px]"
              title="Select User Preferences & Station Location"
            >
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Preferences & Location</span>
            </button>
          )}

          {/* Quick Screen Refresh & Re-prompt */}
          {onRefresh && (
            <button
              onClick={() => {
                onRefresh();
                if (onOpenPreferences) onOpenPreferences();
              }}
              type="button"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Reload Preview & Select Preferences/Location"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
            </button>
          )}

          {/* Lock / Wake button */}
          <button
            onClick={handleTogglePower}
            type="button"
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-colors ${
              isScreenLocked
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title={isScreenLocked ? 'Wake / Unlock Screen' : 'Lock Screen (Simulate Power Button)'}
          >
            {isScreenLocked ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden lg:inline">Unlock</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden lg:inline">Lock</span>
              </>
            )}
          </button>

          {/* Screenshot snapshot */}
          <button
            onClick={handleScreenshot}
            type="button"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Simulate Screenshot"
          >
            <Camera className="w-3.5 h-3.5 text-slate-300" />
          </button>

          {/* Switch to Fluid Desktop View */}
          <button
            id="exit-emulator-btn"
            onClick={onToggleMobileFrame}
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-colors"
            title="Expand to Fluid Full-Width Responsive View"
          >
            <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Full Responsive</span>
          </button>
        </div>
      </header>

      {/* 2. Virtual Smartphone Hardware Chassis */}
      <div
        id="phone-emulator-wrapper"
        style={{
          transform: `scale(${scaleFactor})`,
          transformOrigin: 'top center',
        }}
        className="relative transition-transform duration-200"
      >
        {/* Hardware Side Buttons (Left Side: Action Button, Volume Up, Volume Down) */}
        <div className="absolute -left-[14px] top-[110px] flex flex-col gap-3.5 z-20">
          {/* Action / Mute Button */}
          <button
            onClick={handleToggleSilent}
            type="button"
            className={`w-[4px] h-[26px] rounded-l-md transition-all active:w-[2px] ${
              isSilentMode
                ? 'bg-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                : 'bg-slate-600 hover:bg-slate-400'
            }`}
            title={`Action Button: ${isSilentMode ? 'Silent ON' : 'Ring ON'}`}
          />
          {/* Volume Up */}
          <button
            onClick={() => handleVolumeChange(10)}
            type="button"
            className="w-[4px] h-[48px] bg-slate-600 hover:bg-slate-400 rounded-l-md active:w-[2px] transition-all"
            title="Volume Up"
          />
          {/* Volume Down */}
          <button
            onClick={() => handleVolumeChange(-10)}
            type="button"
            className="w-[4px] h-[48px] bg-slate-600 hover:bg-slate-400 rounded-l-md active:w-[2px] transition-all"
            title="Volume Down"
          />
        </div>

        {/* Hardware Side Buttons (Right Side: Power Button) */}
        <div className="absolute -right-[14px] top-[140px] z-20">
          <button
            onClick={handleTogglePower}
            type="button"
            className="w-[4px] h-[65px] bg-slate-600 hover:bg-slate-400 rounded-r-md active:w-[2px] transition-all"
            title="Power / Sleep Button"
          />
        </div>

        {/* Outer Phone Case & Metallic Bezel */}
        <div
          className={`${device.width} w-[395px] sm:w-[414px] ${device.borderRadius} p-[11px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-[0_30px_90px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] ring-1 ring-white/20 relative transition-all`}
        >
          {/* Subtle Outer Metal Edge Trim */}
          <div className={`w-full ${device.borderRadius} p-[2px] bg-slate-950 dark:bg-black shadow-inner`}>
            {/* Screen Glass Display Viewport */}
            <div
              className={`w-full ${device.aspect} ${device.borderRadius} bg-white dark:bg-slate-950 overflow-hidden relative flex flex-col shadow-2xl border border-black/40`}
            >
              {/* Transient Hardware Toast (Silent mode, volume, screenshot) */}
              {showToast && (
                <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 bg-slate-900/90 text-white border border-white/10 rounded-full shadow-2xl text-[11px] font-bold backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{showToast}</span>
                </div>
              )}

              {/* Volume HUD Slider on left screen edge */}
              {showVolumeHud && (
                <div className="absolute left-2.5 top-32 z-50 w-1.5 h-28 bg-black/40 backdrop-blur-md rounded-full overflow-hidden p-0.5 border border-white/20 animate-in fade-in duration-150">
                  <div
                    className="w-full bg-white rounded-full transition-all duration-100"
                    style={{ height: `${volumeLevel}%`, marginTop: `${100 - volumeLevel}%` }}
                  />
                </div>
              )}

              {/* A. Phone Status Bar & Dynamic Island / Punch Hole */}
              <div
                id="phone-status-bar"
                className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md pt-2.5 pb-1 px-5 flex items-center justify-between z-40 border-b border-black/5 dark:border-white/5 shrink-0 select-none text-slate-800 dark:text-slate-200"
              >
                {/* Left: Clock */}
                <div className="w-16 flex items-center">
                  <span className="text-[12px] font-black tracking-tight">{currentTime}</span>
                </div>

                {/* Center: Dynamic Island or Punch Hole */}
                <div className="flex-1 flex items-center justify-center">
                  {deviceModel === 'iphone-16-pro' ? (
                    <div
                      onClick={() => setIslandExpanded((prev) => !prev)}
                      className={`cursor-pointer transition-all duration-300 rounded-full bg-black text-white flex items-center justify-between px-2.5 py-1 shadow-lg ${
                        islandExpanded ? 'w-44 h-7' : 'w-24 h-6'
                      }`}
                      title="Dynamic Island (Click to expand)"
                    >
                      {/* Left element in island */}
                      <div className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-indigo-950 flex items-center justify-center">
                          <div className="w-1 h-1 rounded-full bg-sky-400/80" />
                        </div>
                        {islandExpanded && (
                          <span className="text-[9px] font-extrabold text-sky-400 truncate">
                            IMD AWS Live
                          </span>
                        )}
                      </div>

                      {/* Right element in island */}
                      <div className="flex items-center gap-1">
                        {islandExpanded ? (
                          <span className="text-[9px] font-semibold text-emerald-400">
                            Radar OK
                          </span>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                      </div>
                    </div>
                  ) : (
                    /* Android Centered Punch Hole Camera */
                    <div className="w-4 h-4 rounded-full bg-black border border-slate-800 flex items-center justify-center shadow-inner">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-950 border border-sky-400/60" />
                    </div>
                  )}
                </div>

                {/* Right: Cellular, Wi-Fi, Battery */}
                <div className="w-20 flex items-center justify-end gap-1.5 text-[11px] font-bold">
                  {/* Cellular 5G */}
                  <span className="text-[9px] font-extrabold tracking-tighter text-slate-500 dark:text-slate-400">
                    5G
                  </span>
                  <Signal className="w-3 h-3 text-slate-800 dark:text-slate-200" />

                  {/* Wi-Fi */}
                  {isOffline ? (
                    <WifiOff className="w-3 h-3 text-rose-500" />
                  ) : (
                    <Wifi className="w-3 h-3 text-slate-800 dark:text-slate-200" />
                  )}

                  {/* Battery */}
                  <div className="flex items-center gap-0.5">
                    <span className="text-[9px] font-bold">96%</span>
                    <div className="w-4 h-2.5 rounded-sm border border-slate-700 dark:border-slate-300 p-0.5 flex items-center">
                      <div className="w-full h-full bg-emerald-500 rounded-[1px]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* B. Screen Content Area (or Lock Screen if locked) */}
              {isScreenLocked ? (
                /* Interactive Lock Screen */
                <div
                  onClick={() => setIsScreenLocked(false)}
                  className="flex-1 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-sky-900/90 via-indigo-950 to-slate-950 text-white cursor-pointer relative overflow-hidden animate-in fade-in duration-200 select-none"
                >
                  {/* Top Lock status */}
                  <div className="flex flex-col items-center gap-2 pt-8">
                    <Lock className="w-4 h-4 text-white/80" />
                    <span className="text-[12px] font-semibold text-white/70">
                      {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <h1 className="text-6xl font-extralight tracking-tight text-white mt-1">
                      {currentTime}
                    </h1>
                  </div>

                  {/* Live IMD Alert Lock Screen Notification Card */}
                  <div className="w-full bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/15 rounded-2xl p-3.5 shadow-2xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-lg bg-sky-600 flex items-center justify-center text-xs">
                          ☀️
                        </div>
                        <span className="text-xs font-bold text-white">Mausam IMD</span>
                      </div>
                      <span className="text-[10px] text-white/70">Just now</span>
                    </div>
                    <p className="text-xs font-bold text-amber-300">
                      {activeAlertCount > 0
                        ? `Weather Advisory Active • ${currentLocationName}`
                        : `Normal Synoptic Conditions • ${currentLocationName}`}
                    </p>
                    <p className="text-[11px] text-white/85 leading-snug">
                      {language === 'hi'
                        ? 'आईएमडी एडब्ल्यूएस स्टेशन से ताजा प्रेक्षण उपलब्ध हैं। पूर्ण विवरण के लिए अनलॉक करें।'
                        : 'Live AWS Doppler observations updated. Tap or swipe up to view personalized weather.'}
                    </p>
                  </div>

                  {/* Bottom Shortcuts: Flashlight & Camera & Swipe up hint */}
                  <div className="w-full flex flex-col items-center gap-4 pb-4">
                    <div className="w-full flex items-center justify-between px-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFlashOn((prev) => !prev);
                          triggerToast(flashOn ? 'Flashlight: Off' : 'Flashlight: On');
                        }}
                        type="button"
                        className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                          flashOn
                            ? 'bg-white text-slate-900 border-white shadow-[0_0_15px_rgba(255,255,255,0.8)]'
                            : 'bg-black/40 text-white border-white/20 hover:bg-black/60'
                        }`}
                        title="Toggle Flashlight"
                      >
                        <Flame className="w-5 h-5" />
                      </button>

                      <span className="text-[11px] font-medium text-white/60 animate-pulse">
                        {language === 'hi' ? 'अनलॉक करने के लिए टैप करें' : 'Tap to unlock'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsCameraActive((prev) => !prev);
                          triggerToast('Camera shortcut');
                        }}
                        type="button"
                        className="w-11 h-11 rounded-full bg-black/40 text-white border border-white/20 hover:bg-black/60 flex items-center justify-center backdrop-blur-md"
                        title="Camera Shortcut"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Bottom Home Pill */}
                    <div className="w-32 h-1 bg-white/60 rounded-full" />
                  </div>
                </div>
              ) : (
                /* Unlocked: Native Application View */
                <div
                  ref={scrollContainerRef}
                  id="phone-scroll-container"
                  className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative scroll-smooth overscroll-contain select-text"
                >
                  {/* Embedded App Children */}
                  <div className="flex-1 flex flex-col w-full">{children}</div>
                </div>
              )}

              {/* Onboarding & User Preferences Modal Overlay inside the Phone Screen */}
              {onboardingModal}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
