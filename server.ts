import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
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
} from './src/data/mockData.ts';
import {
  ALL_INDIA_LOCATIONS,
  searchIndiaLocations,
  generateWeatherForLocation,
  generateHourlyForecastForLocation,
  generateDailyForecastForLocation,
  findIndiaLocation,
} from './src/data/indiaLocations.ts';
import { calculatePersonalizedCardOrder } from './src/engine/personalization.ts';
import { UserPreferences, TimeOfDay } from './src/types.ts';

// In-memory cache for AI insights to prevent rate-limit / 503 pressure
const aiInsightCache = new Map<
  string,
  { summary: string; recommendation: string; source: string; timestamp: number }
>();

// In-memory user preferences store (PostgreSQL-ready structure)
const userPreferencesStore: Record<string, UserPreferences> = {
  default_user: {
    userId: 'default_user',
    name: 'Mausam Explorer',
    preferences: ['fitness', 'health'],
    preferredLocation: 'pune',
    savedLocations: ['mumbai', 'delhi', 'goa'],
    alertPriority: 'all',
    hasCompletedOnboarding: true,
    language: 'en',
    theme: 'light',
  },
};

// Populate initial demo personas into store
for (const p of DEMO_PERSONAS) {
  userPreferencesStore[p.id] = {
    userId: p.id,
    name: p.name,
    preferences: p.primaryPreferences,
    preferredLocation: p.location,
    savedLocations: ['mumbai', 'delhi', 'goa'],
    alertPriority: p.alertPriority,
    hasCompletedOnboarding: true,
    language: 'en',
    theme: 'light',
  };
}

// Lazy initialization for Gemini API client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/healthcheck', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Mausam MoES / IMD Personalization Engine',
      version: '1.0.0-sih2026',
      offlineMockReady: true,
    });
  });

  // GET /api/locations
  // Returns all available IMD stations or filtered results
  app.get('/api/locations', (req: Request, res: Response) => {
    const q = (req.query.q as string) || '';
    const region = (req.query.region as any) || 'All';
    const locations = searchIndiaLocations(q, region);
    res.json({
      success: true,
      count: locations.length,
      data: locations,
    });
  });

  // GET /api/weather/{location}
  app.get('/api/weather/:location', (req: Request, res: Response) => {
    const locKey = (req.params.location || 'pune').toLowerCase();
    const weather = generateWeatherForLocation(locKey, 'auto');
    const hourly = generateHourlyForecastForLocation(locKey);
    const daily = generateDailyForecastForLocation(locKey);
    res.json({
      success: true,
      data: weather,
      hourly,
      daily,
    });
  });

  // GET /api/health/{location}
  app.get('/api/health/:location', (_req: Request, res: Response) => {
    res.json({ success: true, data: MOCK_HEALTH_DATA });
  });

  // GET /api/fitness/{location}
  app.get('/api/fitness/:location', (_req: Request, res: Response) => {
    res.json({ success: true, data: MOCK_FITNESS_DATA });
  });

  // GET /api/marine/{location}
  app.get('/api/marine/:location', (_req: Request, res: Response) => {
    res.json({ success: true, data: MOCK_MARINE_DATA });
  });

  // GET /api/travel/{user_id}
  app.get('/api/travel/:user_id', (_req: Request, res: Response) => {
    res.json({ success: true, data: MOCK_TRAVEL_DATA });
  });

  // GET /api/family/{location}
  app.get('/api/family/:location', (_req: Request, res: Response) => {
    res.json({ success: true, data: MOCK_FAMILY_DATA });
  });

  // GET /api/agriculture/{location}
  app.get('/api/agriculture/:location', (_req: Request, res: Response) => {
    res.json({ success: true, data: MOCK_AGRICULTURE_DATA });
  });

  // GET /api/commute/{location}
  app.get('/api/commute/:location', (_req: Request, res: Response) => {
    res.json({ success: true, data: MOCK_COMMUTE_DATA });
  });

  // GET /api/events/{location}
  app.get('/api/events/:location', (_req: Request, res: Response) => {
    res.json({ success: true, data: MOCK_EVENTS_DATA });
  });

  // GET /api/alerts/{location}
  app.get('/api/alerts/:location', (_req: Request, res: Response) => {
    res.json({ success: true, data: MOCK_ALERTS });
  });

  // POST /api/preferences
  app.post('/api/preferences', (req: Request, res: Response) => {
    const pref = req.body as Partial<UserPreferences>;
    const userId = pref.userId || 'default_user';

    const existing = userPreferencesStore[userId] || {
      userId,
      name: 'Mausam Explorer',
      preferences: ['fitness', 'health'],
      preferredLocation: 'pune',
      savedLocations: ['mumbai', 'delhi'],
      alertPriority: 'all',
      hasCompletedOnboarding: true,
      language: 'en',
      theme: 'light',
    };

    const updated: UserPreferences = {
      ...existing,
      ...pref,
      userId,
    };

    userPreferencesStore[userId] = updated;
    res.json({ success: true, data: updated });
  });

  // GET /api/homepage/{user_id}
  // The primary endpoint returning the personalized content required by the application
  app.get('/api/homepage/:user_id', (req: Request, res: Response) => {
    const userId = req.params.user_id || 'default_user';
    const simulatedTime = (req.query.time as TimeOfDay) || 'auto';
    const locationKey = (req.query.location as string) || 'pune';

    const userPref = userPreferencesStore[userId] || {
      userId,
      name: 'Mausam Explorer',
      preferences: ['fitness', 'health'],
      preferredLocation: locationKey,
      savedLocations: ['mumbai', 'delhi', 'srinagar'],
      alertPriority: 'all',
      hasCompletedOnboarding: true,
      language: 'en',
      theme: 'light',
    };

    const currentWeather = generateWeatherForLocation(
      locationKey || userPref.preferredLocation,
      simulatedTime
    );
    const hourlyForecast = generateHourlyForecastForLocation(
      locationKey || userPref.preferredLocation
    );
    const dailyForecast = generateDailyForecastForLocation(
      locationKey || userPref.preferredLocation
    );

    // Run the rule-based Personalization Engine
    const cardOrder = calculatePersonalizedCardOrder(
      userPref,
      currentWeather,
      MOCK_ALERTS,
      MOCK_HEALTH_DATA,
      MOCK_FITNESS_DATA,
      simulatedTime
    );

    res.json({
      success: true,
      userPreferences: userPref,
      currentWeather,
      alerts: MOCK_ALERTS,
      hourlyForecast,
      dailyForecast,
      health: MOCK_HEALTH_DATA,
      fitness: MOCK_FITNESS_DATA,
      marine: MOCK_MARINE_DATA,
      travel: MOCK_TRAVEL_DATA,
      family: MOCK_FAMILY_DATA,
      agriculture: MOCK_AGRICULTURE_DATA,
      commute: MOCK_COMMUTE_DATA,
      events: MOCK_EVENTS_DATA,
      cardOrder,
    });
  });

  // POST /api/ai/insight
  // Mausam AI Insight with Gemini API + Deterministic Fallback & In-Memory Caching
  app.post('/api/ai/insight', async (req: Request, res: Response) => {
    const { weather, preferences, timeOfDay, language } = req.body;

    const locName = weather?.location ? weather.location.split(',')[0] : 'Your region';
    const cacheKey = `${locName}-${(preferences || []).join('_')}-${language || 'en'}-${timeOfDay || 'auto'}`;
    const cached = aiInsightCache.get(cacheKey);

    // Serve from cache if generated within 10 minutes
    if (cached && Date.now() - cached.timestamp < 600000) {
      return res.json({
        success: true,
        data: {
          summary: cached.summary,
          recommendation: cached.recommendation,
          source: cached.source,
        },
      });
    }

    // Deterministic rule-based fallback generator customized to any Indian city
    const generateRuleBasedInsight = () => {
      const isHi = language === 'hi';
      const temp = weather?.temperature ?? 29;
      const humidity = weather?.humidity ?? 72;
      const uv = weather?.uvIndex ?? 7;
      const rainProb = weather?.rainProbability ?? 65;
      const prefList = Array.isArray(preferences) ? preferences : ['fitness'];

      let summary = `${locName} is reporting ${temp}°C with ${humidity}% humidity, UV index ${uv}, and ${rainProb}% rain probability.`;
      let recommendation = `Stay well-hydrated in ${locName}, monitor local IMD radar rain alerts, and plan outdoor sessions during cooler hours.`;

      if (isHi) {
        summary = `${locName} में वर्तमान तापमान ${temp}°C और नमी ${humidity}% है, जिसमें यूवी स्तर ${uv} व ${rainProb}% वर्षा अनुमान है।`;
        recommendation = `${locName} में पर्याप्त पानी पिएं, स्थानीय आईएमडी रडार अपडेट पर नजर रखें और सुबह-शाम काम निपटाएं।`;
      }

      if (prefList.includes('fitness')) {
        summary = isHi
          ? `${locName} में तापमान ${temp}°C, नमी ${humidity}% और दोपहर में तेज गर्मी का प्रभाव है।`
          : `${locName} conditions: ${temp}°C, ${humidity}% humidity with moderate-to-high UV exposure.`;
        recommendation = isHi
          ? `सुबह 6:00 से 7:30 बजे के बीच दौड़ें। दोपहर 12 से 3 बजे के बीच ${locName} में भारी कसरत से बचें।`
          : `Optimal running hours before 7:45 AM in ${locName}. Avoid intense outdoor cardio under peak sun; replenish electrolytes.`;
      } else if (prefList.includes('agriculture')) {
        summary = isHi
          ? `${locName} क्षेत्र में मृदा नमी अनुकूल है और अगले 24 घंटों में वर्षा की संभावना है।`
          : `Favorable soil moisture in ${locName} with periodic monsoonal rainfall expected over the next 24 hours.`;
        recommendation = isHi
          ? `फसलों में खाद व पोषक तत्व देने के लिए अनुकूल समय। भारी बारिश तक कीटनाशक छिड़काव स्थगित रखें।`
          : `Good window for nutrient top-dressing in crops around ${locName}. Hold off on foliar sprays until rain bands clear.`;
      } else if (prefList.includes('commute')) {
        summary = isHi
          ? `${locName} में वर्षा के कारण प्रमुख मार्गों पर यातायात धीमा रहने का अनुमान है।`
          : `Showers expected in ${locName} with potential traffic congestion on major transit corridors.`;
        recommendation = isHi
          ? `वैकल्पिक संपर्क मार्गों का उपयोग करें और गीली सड़कों पर वाहन चलाते समय सावधानी बरतें।`
          : `Plan for additional travel time across ${locName}. Drive cautiously on wet asphalt and flyovers.`;
      }

      return { summary, recommendation, source: 'rule-engine' };
    };

    try {
      const client = getAiClient();
      if (!client) {
        const fallback = generateRuleBasedInsight();
        aiInsightCache.set(cacheKey, { ...fallback, timestamp: Date.now() });
        return res.json({
          success: true,
          data: fallback,
        });
      }

      const prompt = `You are the official Mausam AI weather assistant for the India Meteorological Department (IMD), Ministry of Earth Sciences.
Provide a concise, 2-part personalized weather insight based ONLY on this structured data:
- Location: ${weather?.location}
- Temperature: ${weather?.temperature}°C
- Humidity: ${weather?.humidity}%
- UV Index: ${weather?.uvIndex}
- Rain Probability: ${weather?.rainProbability}%
- Condition: ${weather?.condition}
- User Selected Primary Preferences: ${JSON.stringify(preferences)}
- Time of Day: ${timeOfDay || 'Current'}
- Language requested: ${language === 'hi' ? 'Hindi (हिंदी)' : 'English'}

Strict Rules:
1. Do NOT invent weather data.
2. Do NOT issue official warnings (those are handled by IMD synoptic alerts).
3. Provide exactly two short fields: "summary" (1 sentence) and "recommendation" (1-2 practical sentences tailored to the user's preference and location).
Respond in valid JSON format:
{
  "summary": "...",
  "recommendation": "..."
}`;

      let resultText = '';
      try {
        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });
        resultText = response.text || '';
      } catch (_firstErr) {
        // Fallback to lightweight model if primary is experiencing high demand (503)
        try {
          const fallbackResponse = await client.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          });
          resultText = fallbackResponse.text || '';
        } catch {
          // If both models are rate-limited or unavailable, fall through to deterministic rule engine
        }
      }

      if (resultText) {
        const parsed = JSON.parse(resultText);
        const data = {
          summary: parsed.summary,
          recommendation: parsed.recommendation,
          source: 'gemini',
        };
        aiInsightCache.set(cacheKey, { ...data, timestamp: Date.now() });
        return res.json({
          success: true,
          data,
        });
      }

      // Graceful fallback to rule engine
      const fallback = generateRuleBasedInsight();
      aiInsightCache.set(cacheKey, { ...fallback, timestamp: Date.now() });
      return res.json({
        success: true,
        data: fallback,
      });
    } catch (_err) {
      // Gracefully handle any parse or network exception without polluting stderr with raw API errors
      const fallback = generateRuleBasedInsight();
      aiInsightCache.set(cacheKey, { ...fallback, timestamp: Date.now() });
      return res.json({
        success: true,
        data: fallback,
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mausam SIH 2026 server running on http://localhost:${PORT}`);
  });
}

startServer();
