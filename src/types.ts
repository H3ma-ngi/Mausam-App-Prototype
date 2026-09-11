export type PreferenceId =
  | 'health'
  | 'fitness'
  | 'marine'
  | 'travel'
  | 'family'
  | 'agriculture'
  | 'commute'
  | 'events';

export type AlertPriority =
  | 'severe'
  | 'health'
  | 'travel'
  | 'daily'
  | 'all';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'auto';

export interface UserPreferences {
  userId: string;
  name: string;
  preferences: PreferenceId[];
  preferredLocation: string;
  savedLocations: string[];
  alertPriority: AlertPriority;
  hasCompletedOnboarding: boolean;
  language: 'en' | 'hi';
  theme: 'light' | 'dark';
}

export type AlertSeverity = 'red' | 'orange' | 'yellow' | 'green';

export interface WeatherAlert {
  id: string;
  type: string;
  severity: AlertSeverity;
  title: string;
  titleHi?: string;
  message: string;
  messageHi?: string;
  startTime: string;
  endTime: string;
  location: string;
  priorityScore: number;
}

export interface CurrentWeather {
  location: string;
  state: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  conditionHi: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: number; // in km
  cloudCover: number; // percentage
  tempHigh: number;
  tempLow: number;
  rainProbability: number;
  airPressure: number; // hPa
  uvIndex: number;
  aqi: number;
  lastUpdated: string;
}

export interface HourlyForecastItem {
  time: string;
  temp: number;
  condition: string;
  rainProb: number;
  uv: number;
  icon: string;
}

export interface DailyForecastItem {
  day: string;
  dayHi: string;
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  conditionHi: string;
  rainProb: number;
  humidity: number;
  windSpeed: number;
}

export interface HealthData {
  aqi: number;
  aqiCategory: 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
  aqiCategoryHi: string;
  primaryPollutant: string;
  pollenCount: number; // grains/m3
  pollenLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  pollenLevelHi: string;
  dominantPollenType: string;
  dominantPollenTypeHi: string;
  uvIndex: number;
  humidity: number;
  healthAdvisory: string;
  healthAdvisoryHi: string;
}

export interface FitnessData {
  sunrise: string;
  sunset: string;
  bestRunningHours: string;
  bestRunningHoursHi: string;
  runningReason: string;
  runningReasonHi: string;
  windSpeed: number;
  heatAlert: {
    active: boolean;
    level: 'Moderate' | 'High' | 'Severe';
    message: string;
    messageHi: string;
  };
  outdoorActivityScore: number; // 0 - 100
  activityScoreCategory: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  uvConditions: string;
  uvConditionsHi: string;
}

export interface MarineData {
  seaCondition: 'Calm' | 'Moderate' | 'Rough' | 'Very Rough';
  seaConditionHi: string;
  nextHighTide: string;
  highTideHeight: string;
  nextLowTide: string;
  lowTideHeight: string;
  waveHeight: number; // in meters
  waterTemperature: number; // °C
  marineAdvisory: string;
  marineAdvisoryHi: string;
  windKnots: number;
}

export interface DestinationWeather {
  id: string;
  city: string;
  cityHi: string;
  country: string;
  temp: number;
  condition: string;
  conditionHi: string;
  rainProb: number;
  flightStatus: 'Normal' | 'Delay Likely' | 'Major Delays' | 'Ground Stop';
  flightStatusHi: string;
  flightAlertMessage?: string;
  flightAlertMessageHi?: string;
}

export interface TravelData {
  savedDestinations: DestinationWeather[];
  packingSuggestions: string[];
  packingSuggestionsHi: string[];
  travelTip: string;
  travelTipHi: string;
  severeTravelAlert?: string;
}

export interface FamilyCommuteSlot {
  period: 'Morning' | 'Afternoon';
  periodHi: string;
  timeRange: string;
  weather: string;
  weatherHi: string;
  temp: number;
  rainProbability: number;
  visibility: string;
  visibilityHi: string;
  status: 'Clear' | 'Rain Expected' | 'Caution Needed';
  statusHi: string;
}

export interface FamilyData {
  morningCommute: FamilyCommuteSlot;
  afternoonCommute: FamilyCommuteSlot;
  commuteAdvisory: string;
  commuteAdvisoryHi: string;
  uvSunProtectionNeeded: boolean;
}

export interface AgricultureData {
  soilMoisture: number; // percentage
  soilMoistureStatus: 'Low' | 'Moderate' | 'Optimal' | 'Excess';
  soilMoistureStatusHi: string;
  rainfall24h: number; // mm
  rainfall7d: number; // mm
  rainfallProbability: number; // %
  frostAlert: {
    active: boolean;
    level: string;
    message: string;
    messageHi: string;
  };
  season: 'Kharif' | 'Rabi' | 'Zaid';
  seasonHi: string;
  recommendedCrops: string[];
  recommendedCropsHi: string[];
  agriAdvisory: string;
  agriAdvisoryHi: string;
}

export interface RouteOption {
  id: string;
  name: string;
  nameHi: string;
  distanceKm: number;
  durationMin: number;
  trafficLevel: 'Light' | 'Moderate' | 'Heavy' | 'Severe';
  trafficLevelHi: string;
  delayMin: number;
  isAlternative?: boolean;
  savingsMin?: number;
  riskScore: number; // 1-100 (100 = highest risk)
  riskCategory: 'Low' | 'Moderate' | 'High';
}

export interface RouteRisk {
  score: number;
  level: 'Low' | 'Moderate' | 'High';
  levelHi: string;
}

export interface CommuteData {
  routeRisk?: RouteRisk;
  currentRoute: RouteOption;
  betterRoute?: RouteOption;
  roadCondition: string;
  roadConditionHi: string;
  visibilityKm: number;
  fogAlertActive: boolean;
  stormAlertActive: boolean;
  rainImpact: 'Minimal' | 'Moderate Slowdowns' | 'Severe Flooding / Jams';
  rainImpactHi: string;
}

export interface EventExtendedDay {
  day: string;
  dayHi: string;
  icon: string;
  tempHigh: number;
  tempLow: number;
  rainProb: number;
  comfortCategory: 'Good' | 'Moderate' | 'Poor';
}

export interface EventPlanningData {
  extendedRainProb: number;
  comfortIndex: number; // 0 - 100
  comfortCategory: 'Very Uncomfortable' | 'Moderate' | 'Pleasant' | 'Ideal';
  comfortCategoryHi: string;
  temperatureComfort: string;
  temperatureComfortHi?: string;
  humidityComfort: string;
  humidityComfortHi?: string;
  windComfort: string;
  windComfortHi?: string;
  eventAdvisory: string;
  eventAdvisoryHi: string;
  advisory?: string;
  advisoryHi?: string;
  tempComfort?: string;
  tempComfortHi?: string;
  bestTimeSlot: string;
  bestTimeSlotHi?: string;
  extendedForecast?: EventExtendedDay[];
}

export interface MausamHomepageData {
  userPreferences: UserPreferences;
  currentWeather: CurrentWeather;
  alerts: WeatherAlert[];
  hourlyForecast: HourlyForecastItem[];
  dailyForecast: DailyForecastItem[];
  health: HealthData;
  fitness: FitnessData;
  marine: MarineData;
  travel: TravelData;
  family: FamilyData;
  agriculture: AgricultureData;
  commute: CommuteData;
  events: EventPlanningData;
  aiInsight?: {
    summary: string;
    recommendation: string;
    source: 'gemini' | 'rule-engine';
  };
  cardOrder: {
    cardId: PreferenceId | 'weather' | 'alerts' | 'forecast' | 'ai';
    score: number;
    scoreBreakdown: {
      alertBonus: number;
      preferenceBonus: number;
      timeBonus: number;
      base: number;
    };
    explanation: string;
  }[];
}

export interface DemoPersona {
  id: string;
  name: string;
  nameHi: string;
  shortTitle?: string;
  shortTitleHi?: string;
  role: string;
  roleHi: string;
  avatar: string;
  primaryPreferences: PreferenceId[];
  location: string;
  alertPriority: AlertPriority;
  description: string;
  descriptionHi: string;
}

export type HourlyForecast = HourlyForecastItem;
export type DailyForecast = DailyForecastItem;
export type EventsData = EventPlanningData;

export interface CardScoreResult {
  cardId: PreferenceId;
  score: number;
  breakdown: {
    baseScore: number;
    userInterestBonus: number;
    alertBonus: number;
    severeAlertBonus: number;
    timeBonus: number;
    locationBonus: number;
  };
  scoreBreakdown: {
    base: number;
    preferenceBonus: number;
    alertBonus: number;
    timeBonus: number;
  };
  explanation: string;
  explanationHi: string;
}

