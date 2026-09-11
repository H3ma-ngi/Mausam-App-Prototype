/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Sliders, Settings } from 'lucide-react';
import {
  UserPreferences,
  TimeOfDay,
  DemoPersona,
  CardScoreResult,
  PreferenceId,
} from './types';
import {
  MOCK_CURRENT_WEATHER,
  MOCK_ALERTS,
  MOCK_HEALTH_DATA,
  MOCK_FITNESS_DATA,
  MOCK_MARINE_DATA,
  MOCK_TRAVEL_DATA,
  MOCK_FAMILY_DATA,
  MOCK_AGRICULTURE_DATA,
  MOCK_COMMUTE_DATA,
  MOCK_EVENTS_DATA,
  MOCK_HOURLY_FORECAST,
  MOCK_DAILY_FORECAST,
  DEMO_PERSONAS,
} from './data/mockData';
import {
  generateHourlyForecastForLocation,
  generateDailyForecastForLocation,
} from './data/indiaLocations';
import { calculatePersonalizedCardOrder } from './engine/personalization';
import { TRANSLATIONS } from './data/translations';

// Components
import { Header } from './components/Header';
import { DemoModeBar } from './components/DemoModeBar';
import { OnboardingModal } from './components/OnboardingModal';
import { LocationPickerModal } from './components/LocationPickerModal';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { AlertsBanner } from './components/AlertsBanner';
import { BottomNav, NavTab } from './components/BottomNav';
import { ForecastView } from './components/ForecastView';
import { AlertsView } from './components/AlertsView';
import { SavedView } from './components/SavedView';
import { SettingsView } from './components/SettingsView';
import { PullToRefreshContainer } from './components/PullToRefreshContainer';
import { VirtualMobileEmulator } from './components/VirtualMobileEmulator';

// Cards
import { FitnessCard } from './components/PersonalizedCards/FitnessCard';
import { HealthCard } from './components/PersonalizedCards/HealthCard';
import { MarineCard } from './components/PersonalizedCards/MarineCard';
import { TravelCard } from './components/PersonalizedCards/TravelCard';
import { FamilyCard } from './components/PersonalizedCards/FamilyCard';
import { AgricultureCard } from './components/PersonalizedCards/AgricultureCard';
import { CommuteCard } from './components/PersonalizedCards/CommuteCard';
import { EventCard } from './components/PersonalizedCards/EventCard';
import { MausamAiInsightCard } from './components/PersonalizedCards/MausamAiInsightCard';

const STORAGE_KEY = 'mausam_user_preferences_sih2026';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Language state: 'en' | 'hi'
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Active Bottom Nav Tab
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Selected Location (default Pune, Maharashtra)
  const [selectedLocation, setSelectedLocation] = useState<string>('pune');

  // Active Demo Persona
  const [currentPersonaId, setCurrentPersonaId] = useState<string>('persona-fitness');

  // Simulated Time of Day ('auto' | 'morning' | 'afternoon' | 'evening')
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');

  // Severe Alert Active Simulation Toggle
  const [isSevereAlertActive, setIsSevereAlertActive] = useState<boolean>(true);

  // All-India Location Picker Modal Open state
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState<boolean>(false);

  // Mobile Frame toggle (Virtual Mobile Emulator vs Wide Responsive View)
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Offline indicator toggle
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Pull-to-refresh state and telemetry simulation counter
  const [isPullRefreshing, setIsPullRefreshing] = useState<boolean>(false);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('Live (AWS Station 43063)');

  // Pull-to-refresh handler: simulates re-fetching IMD AWS Doppler radar observations and triggers scoring engine re-calculation
  const handlePullRefresh = async () => {
    setIsPullRefreshing(true);
    // Simulate real network fetch to IMD AWS Doppler radar telemetry server
    await new Promise((resolve) => setTimeout(resolve, 650));
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastRefreshedTime(`Just now (${timeStr})`);
    
    // Increment counter to inject realistic telemetry micro-variations and re-evaluate rule-based card scoring
    setRefreshCounter((prev) => prev + 1);
    setIsPullRefreshing(false);
  };

  // User preferences state
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch {
      // ignore
    }
    return {
      userId: 'fitness',
      name: 'Outdoor Fitness Enthusiast',
      preferences: ['fitness', 'health'],
      preferredLocation: 'pune',
      savedLocations: ['mumbai', 'delhi', 'goa', 'bengaluru'],
      alertPriority: 'all',
      hasCompletedOnboarding: false,
      language: 'en',
      theme: 'light',
    };
  });

  // Onboarding & Preferences modal - opens on every preview reload as requested
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(true);

  // Persist preferences
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // ignore
    }
  }, [preferences]);

  // Synchronize HTML dark mode class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Handle persona change from SIH Demo Bar
  const handleSelectPersona = (persona: DemoPersona) => {
    setCurrentPersonaId(persona.id);
    setSelectedLocation(persona.location);
    setPreferences((prev) => ({
      ...prev,
      userId: persona.id,
      name: persona.name,
      preferences: persona.primaryPreferences,
      preferredLocation: persona.location,
      alertPriority: persona.alertPriority,
    }));
  };

  // Weather data for active location with diurnal adjustments and live refresh jitter
  const currentWeather = useMemo(() => {
    const base = MOCK_CURRENT_WEATHER[selectedLocation] || MOCK_CURRENT_WEATHER.pune;
    
    // Apply realistic micro-fluctuations on pull-to-refresh
    const jitterTemp = refreshCounter > 0 ? ((refreshCounter % 3 === 0) ? 0.3 : (refreshCounter % 3 === 1) ? -0.4 : 0.2) : 0;
    const jitterHumidity = refreshCounter > 0 ? ((refreshCounter % 2 === 0) ? 1 : -1) : 0;
    const jitterWind = refreshCounter > 0 ? ((refreshCounter % 2 === 0) ? 1 : -1) : 0;
    const jitterPressure = refreshCounter > 0 ? ((refreshCounter % 2 === 0) ? 0.4 : -0.3) : 0;

    const baseWithJitter = {
      ...base,
      temperature: Math.round((base.temperature + jitterTemp) * 10) / 10,
      humidity: Math.max(30, Math.min(98, base.humidity + jitterHumidity)),
      windSpeed: Math.max(2, base.windSpeed + jitterWind),
      airPressure: Math.round((base.airPressure + jitterPressure) * 10) / 10,
      lastUpdated: lastRefreshedTime || base.lastUpdated,
    };

    if (timeOfDay === 'morning') {
      return {
        ...baseWithJitter,
        temperature: Math.round(baseWithJitter.temperature - 3),
        condition: 'Clear Morning Sky',
        conditionHi: 'स्वच्छ प्रातःकालीन आकाश',
        feelsLike: Math.round(baseWithJitter.feelsLike - 3),
        uvIndex: 3,
      };
    }
    if (timeOfDay === 'afternoon') {
      return {
        ...baseWithJitter,
        temperature: baseWithJitter.tempHigh || baseWithJitter.temperature + 2,
        condition: 'Warm Afternoon Sun',
        conditionHi: 'उष्ण दोपहर की धूप',
        feelsLike: (baseWithJitter.tempHigh || baseWithJitter.temperature) + 2,
        uvIndex: 8,
      };
    }
    if (timeOfDay === 'evening') {
      return {
        ...baseWithJitter,
        temperature: Math.round(baseWithJitter.temperature - 2),
        condition: 'Pleasant Evening Breeze',
        conditionHi: 'सुहावनी शाम की हवा',
        feelsLike: Math.round(baseWithJitter.feelsLike - 2),
        uvIndex: 0,
      };
    }
    return baseWithJitter;
  }, [selectedLocation, timeOfDay, refreshCounter, lastRefreshedTime]);

  // Filter alerts based on severe alert toggle
  const activeAlerts = useMemo(() => {
    if (!isSevereAlertActive) {
      return MOCK_ALERTS.filter((a) => a.severity !== 'red');
    }
    return MOCK_ALERTS;
  }, [isSevereAlertActive]);

  // Personalization Engine Calculation - Automatically recalculates on weather changes, timeOfDay, and refresh
  const cardScores = useMemo(() => {
    return calculatePersonalizedCardOrder(
      preferences,
      currentWeather,
      activeAlerts,
      MOCK_HEALTH_DATA,
      MOCK_FITNESS_DATA,
      timeOfDay
    );
  }, [preferences, currentWeather, activeAlerts, timeOfDay, refreshCounter]);

  // STRICT REQUIREMENT: Only show cards corresponding to user's selected preferences on homepage
  const displayedCards = useMemo(() => {
    return cardScores.filter((c) => preferences.preferences.includes(c.cardId));
  }, [cardScores, preferences.preferences]);

  // Hourly and Daily Forecasts dynamically generated for the selected Indian location
  const hourlyForecast = useMemo(() => {
    return generateHourlyForecastForLocation(selectedLocation);
  }, [selectedLocation]);

  const dailyForecast = useMemo(() => {
    return generateDailyForecastForLocation(selectedLocation);
  }, [selectedLocation]);

  // Toggle saving / bookmarking an Indian location
  const handleToggleSaveLocation = (locId: string) => {
    setPreferences((prev) => {
      const current = prev.savedLocations || [];
      const exists = current.includes(locId);
      const updated = exists
        ? current.filter((id) => id !== locId)
        : [...current, locId];
      return {
        ...prev,
        savedLocations: updated,
      };
    });
  };

  // Onboarding completion handler
  const handleOnboardingComplete = (
    updated: Partial<UserPreferences>,
    persona?: DemoPersona
  ) => {
    const full: UserPreferences = {
      ...preferences,
      ...updated,
      hasCompletedOnboarding: true,
      language,
    };
    setPreferences(full);
    if (updated.preferredLocation) {
      setSelectedLocation(updated.preferredLocation);
    }
    if (persona) {
      setCurrentPersonaId(persona.id);
    }
    setIsOnboardingOpen(false);
  };

  // Render individual personalized card based on id
  const renderCard = (cardResult: CardScoreResult) => {
    const { cardId } = cardResult;
    const props = { language };

    switch (cardId) {
      case 'fitness':
        return <FitnessCard key="fitness" data={MOCK_FITNESS_DATA} {...props} />;
      case 'health':
        return <HealthCard key="health" data={MOCK_HEALTH_DATA} {...props} />;
      case 'marine':
        return <MarineCard key="marine" data={MOCK_MARINE_DATA} {...props} />;
      case 'travel':
        return <TravelCard key="travel" data={MOCK_TRAVEL_DATA} {...props} />;
      case 'family':
        return <FamilyCard key="family" data={MOCK_FAMILY_DATA} {...props} />;
      case 'agriculture':
        return <AgricultureCard key="agriculture" data={MOCK_AGRICULTURE_DATA} {...props} />;
      case 'commute':
        return <CommuteCard key="commute" data={MOCK_COMMUTE_DATA} {...props} />;
      case 'events':
        return <EventCard key="events" data={MOCK_EVENTS_DATA} {...props} />;
      default:
        return null;
    }
  };

  const t = TRANSLATIONS[language];

  return (
    <div
      id="mausam-root-app"
      className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors antialiased selection:bg-sky-500 selection:text-white"
    >
      {/* 1. SIH 2026 Demo Mode & Judging Bar */}
      <DemoModeBar
        currentPersonaId={currentPersonaId}
        onSelectPersona={handleSelectPersona}
        timeOfDay={timeOfDay}
        onTimeOfDayChange={setTimeOfDay}
        isSevereAlertActive={isSevereAlertActive}
        onToggleSevereAlert={() => setIsSevereAlertActive((prev) => !prev)}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame((prev) => !prev)}
        language={language}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* Virtual Mobile Device Emulator Container */}
      <VirtualMobileEmulator
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame((prev) => !prev)}
        language={language}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline((prev) => !prev)}
        onRefresh={handlePullRefresh}
        onOpenPreferences={() => setIsOnboardingOpen(true)}
        currentLocationName={currentWeather.location}
        activeAlertCount={activeAlerts.length}
        onboardingModal={
          <OnboardingModal
            isOpen={isOnboardingOpen}
            canClose={true}
            onClose={() => setIsOnboardingOpen(false)}
            language={language}
            onLanguageChange={setLanguage}
            onComplete={handleOnboardingComplete}
            initialPreferences={preferences}
            isMobileFrame={isMobileFrame}
          />
        }
      >
        {/* 2. Top Header with IMD Branding, Language, Theme, Location selector */}
        <Header
          currentWeather={currentWeather}
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
          language={language}
          onToggleLanguage={() => setLanguage((l) => (l === 'en' ? 'hi' : 'en'))}
          theme={theme}
          onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          isOffline={isOffline}
          onToggleOfflineMock={() => setIsOffline((prev) => !prev)}
          onOpenPreferences={() => setIsOnboardingOpen(true)}
          onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
        />

        {/* 3. Main View Area */}
        <main
          id="mausam-main-content"
          className={`flex-1 w-full mx-auto pb-24 space-y-4 ${
            isMobileFrame ? 'p-2.5 sm:p-3.5 max-w-full' : 'p-3 sm:p-5 max-w-4xl'
          }`}
        >
          {activeTab === 'home' && (
            <PullToRefreshContainer
              onRefresh={handlePullRefresh}
              isRefreshing={isPullRefreshing}
              language={language}
              lastUpdated={currentWeather.lastUpdated}
            >
              {/* Active Safety Weather Alerts (Mandate: Appears before personalized content) */}
              <AlertsBanner alerts={activeAlerts} language={language} />

              {/* Compact Current Weather Section */}
              <CurrentWeatherCard
                weather={currentWeather}
                language={language}
                onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
              />

              {/* Mausam AI / Rule-Engine Synoptic Brief Card */}
              <MausamAiInsightCard
                weather={currentWeather}
                preferences={preferences.preferences}
                language={language}
              />

              {/* Dynamic Reordering Header with Live Sorting Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 pt-1">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    {language === 'hi'
                      ? 'चयनित प्राथमिकताओं के अनुसार कार्ड'
                      : 'Your Selected Weather Interests'}
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'hi'
                      ? `दिखाए जा रहे हैं: ${displayedCards.length} चयनित कार्ड • प्राथमिकताओं के आधार पर क्रमित`
                      : `Showing ${displayedCards.length} selected interest card${displayedCards.length === 1 ? '' : 's'} • Ranked by live score`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('settings')}
                    type="button"
                    className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded-lg border border-sky-200 dark:border-sky-800 transition-colors"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>{language === 'hi' ? 'सेटिंग्स में बदलें' : 'Change in Settings'}</span>
                  </button>
                </div>
              </div>

              {/* Dynamically Ordered Personalized Cards List (Only selected preferences shown) */}
              <div id="personalized-cards-container" className="space-y-4">
                {displayedCards.length > 0 ? (
                  displayedCards.map((c) => renderCard(c))
                ) : (
                  <div className="p-6 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {language === 'hi'
                        ? 'कोई मौसम रुचि चयनित नहीं है।'
                        : 'No weather interests currently selected.'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      {language === 'hi'
                        ? 'होमपेज पर कार्ड देखने के लिए सेटिंग्स में जाएं और अपनी रुचियां (दौड़, कृषि, स्वास्थ्य, यात्रा आदि) चुनें।'
                        : 'To customize your homepage cards, visit Settings to toggle your weather interests (Fitness, Farming, Health, Commute, Marine, etc.).'}
                    </p>
                    <button
                      onClick={() => setActiveTab('settings')}
                      type="button"
                      className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold shadow hover:bg-sky-500 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'सेटिंग्स खोलें' : 'Configure in Settings'}</span>
                    </button>
                  </div>
                )}
              </div>
            </PullToRefreshContainer>
          )}

          {activeTab === 'forecast' && (
            <ForecastView
              hourly={hourlyForecast}
              daily={dailyForecast}
              weather={currentWeather}
              language={language}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsView alerts={MOCK_ALERTS} language={language} />
          )}

          {activeTab === 'saved' && (
            <SavedView
              selectedLocation={selectedLocation}
              onSelectLocation={(locId) => {
                setSelectedLocation(locId);
                setActiveTab('home');
              }}
              language={language}
              savedLocations={preferences.savedLocations}
              onToggleSaveLocation={handleToggleSaveLocation}
              onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              preferences={preferences}
              onUpdatePreferences={(updated) =>
                setPreferences((prev) => ({ ...prev, ...updated }))
              }
              onResetOnboarding={() => setIsOnboardingOpen(true)}
              language={language}
              onToggleLanguage={() =>
                setLanguage((l) => (l === 'en' ? 'hi' : 'en'))
              }
              theme={theme}
              onToggleTheme={() =>
                setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
              }
              onNavigateHome={() => setActiveTab('home')}
            />
          )}
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNav
          currentTab={activeTab}
          onSelectTab={setActiveTab}
          language={language}
          alertCount={activeAlerts.length}
          isMobileFrame={isMobileFrame}
        />
      </VirtualMobileEmulator>

      {/* All-India IMD Station Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        selectedLocationId={selectedLocation}
        onSelectLocation={(locId) => {
          setSelectedLocation(locId);
          setIsLocationPickerOpen(false);
        }}
        language={language}
        savedLocations={preferences.savedLocations}
        onToggleSaveLocation={handleToggleSaveLocation}
      />
    </div>
  );
}
