"""
SIH 2026 Problem Statement 26076: Development of Personalized Homepage for 'Mausam'
Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)
Python FastAPI Backend Reference Implementation

This file provides the complete, standalone Python FastAPI backend service
matching the exact REST endpoints specified in PS 26076:
- GET /api/weather/{location}
- GET /api/homepage/{user_id}
- GET /api/health/{location}
- GET /api/fitness/{location}
- GET /api/marine/{location}
- GET /api/travel/{user_id}
- GET /api/family/{location}
- GET /api/agriculture/{location}
- GET /api/commute/{location}
- GET /api/events/{location}
- GET /api/alerts/{location}
- POST /api/preferences

To run locally with Python:
    pip install fastapi uvicorn pydantic
    uvicorn backend.fastapi_server:app --reload --port 8000
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import datetime

app = FastAPI(
    title="Mausam Personalized Weather API",
    description="IMD / MoES Rule-Based Weather Personalization Service for SIH 2026",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class UserPreferencesModel(BaseModel):
    userId: str
    name: str = "Mausam Explorer"
    preferences: List[str] = ["fitness", "health"]
    preferredLocation: str = "pune"
    savedLocations: List[str] = ["mumbai", "delhi"]
    alertPriority: str = "all"
    hasCompletedOnboarding: bool = True
    language: str = "en"
    theme: str = "light"

# In-memory mock database (PostgreSQL-ready schema)
mock_users_db: Dict[str, UserPreferencesModel] = {
    "default_user": UserPreferencesModel(userId="default_user")
}

MOCK_WEATHER = {
    "location": "Pune, Maharashtra",
    "state": "Maharashtra",
    "temperature": 29,
    "feelsLike": 31,
    "condition": "Partly Cloudy",
    "humidity": 72,
    "windSpeed": 14,
    "visibility": 7.2,
    "cloudCover": 55,
    "tempHigh": 32,
    "tempLow": 22,
    "rainProbability": 65,
    "airPressure": 1008,
    "uvIndex": 7,
    "aqi": 86,
}

MOCK_ALERTS = [
    {
        "id": "alert-rain-1",
        "type": "Heavy Rain / Thunderstorm",
        "severity": "orange",
        "title": "Orange Alert: Squally Thunderstorms Expected",
        "message": "Localized downpours with lightning gusts (40-50 km/h) over Pune between 1:30 PM and 5:00 PM.",
        "startTime": "13:30 Today",
        "endTime": "17:30 Today",
        "location": "Pune District",
        "priorityScore": 92,
    }
]

def calculate_personalization_scores(preferences: List[str], time_of_day: str = "afternoon") -> List[Dict[str, Any]]:
    """
    Python Rule-Based Personalization Engine:
    - Severe Weather Alert = +100
    - Rain Alert = +90
    - AQI/Health Alert = +80
    - UV Alert = +70
    - User's primary interest = +50
    - Location relevance = +40
    - Time relevance = +30
    """
    cards = ["fitness", "health", "travel", "marine", "family", "agriculture", "commute", "events"]
    scored = []
    for card in cards:
        base = 20
        pref_bonus = 50 if card in preferences else 0
        alert_bonus = 0
        time_bonus = 0

        if card == "commute":
            alert_bonus += 90  # Rain / Traffic Alert
        elif card == "health":
            alert_bonus += 70  # UV Alert
        elif card == "fitness":
            alert_bonus += 70  # Heat Alert
        
        if time_of_day == "morning" and card in ["fitness", "family"]:
            time_bonus += 30
        elif time_of_day == "afternoon" and card in ["health", "commute"]:
            time_bonus += 30
        elif time_of_day == "evening" and card in ["events", "commute"]:
            time_bonus += 30

        total = base + pref_bonus + alert_bonus + time_bonus
        scored.append({
            "cardId": card,
            "score": total,
            "breakdown": {
                "base": base,
                "preferenceBonus": pref_bonus,
                "alertBonus": alert_bonus,
                "timeBonus": time_bonus,
            }
        })
    return sorted(scored, key=lambda x: x["score"], reverse=True)

@app.get("/api/weather/{location}")
def get_weather(location: str):
    return {"success": True, "location": location, "data": MOCK_WEATHER}

@app.get("/api/health/{location}")
def get_health(location: str):
    return {
        "success": True,
        "data": {
            "aqi": 86,
            "aqiCategory": "Moderate",
            "primaryPollutant": "PM2.5",
            "pollenCount": 46,
            "pollenLevel": "Moderate",
            "uvIndex": 7,
            "humidity": 72,
            "healthAdvisory": "Sensitive users should limit prolonged outdoor exposure during peak UV hours.",
        }
    }

@app.get("/api/fitness/{location}")
def get_fitness(location: str):
    return {
        "success": True,
        "data": {
            "bestRunningHours": "6:00 AM – 7:30 AM",
            "runningReason": "Lower temperature and moderate UV.",
            "sunrise": "6:04 AM",
            "sunset": "6:42 PM",
            "heatAlertActive": True,
            "outdoorScore": 78,
        }
    }

@app.get("/api/marine/{location}")
def get_marine(location: str):
    return {
        "success": True,
        "data": {
            "seaCondition": "Moderate",
            "nextHighTide": "2:25 PM",
            "highTideHeight": "3.4 m",
            "waveHeight": 1.2,
            "waterTemperature": 27,
            "marineAdvisory": "Fishermen advised not to venture deep into coastal areas.",
        }
    }

@app.get("/api/travel/{user_id}")
def get_travel(user_id: str):
    return {
        "success": True,
        "data": {
            "savedDestinations": [
                {"city": "Mumbai", "temp": 28, "condition": "Rain", "rainProb": 85},
                {"city": "London", "temp": 16, "condition": "Rain", "rainProb": 80},
            ],
            "packingSuggestions": ["Carry an umbrella or compact raincoat"],
        }
    }

@app.get("/api/family/{location}")
def get_family(location: str):
    return {
        "success": True,
        "data": {
            "commuteAdvisory": "Rain expected during the afternoon school commute.",
            "morningCommute": {"weather": "Pleasant", "rainProbability": 20, "status": "Clear"},
            "afternoonCommute": {"weather": "Heavy Thunderstorms", "rainProbability": 75, "status": "Rain Expected"}
        }
    }

@app.get("/api/agriculture/{location}")
def get_agriculture(location: str):
    return {
        "success": True,
        "data": {
            "soilMoisture": 42,
            "status": "Moderate",
            "rainfall24h": 12,
            "season": "Kharif",
            "recommendedCrops": ["Soybean", "Maize", "Groundnut"],
        }
    }

@app.get("/api/commute/{location}")
def get_commute(location: str):
    return {
        "success": True,
        "data": {
            "currentRoute": {"distanceKm": 18.4, "durationMin": 67, "delayMin": 29},
            "betterRoute": {"distanceKm": 21.1, "durationMin": 48, "savingsMin": 19},
            "roadCondition": "Wet pavement, caution on expressway underpasses.",
        }
    }

@app.get("/api/events/{location}")
def get_events(location: str):
    return {
        "success": True,
        "data": {
            "comfortIndex": 68,
            "rainProbability": 65,
            "advisory": "Consider covered seating or an indoor backup."
        }
    }

@app.get("/api/alerts/{location}")
def get_alerts(location: str):
    return {"success": True, "alerts": MOCK_ALERTS}

@app.post("/api/preferences")
def save_preferences(prefs: UserPreferencesModel):
    mock_users_db[prefs.userId] = prefs
    return {"success": True, "saved": prefs}

@app.get("/api/homepage/{user_id}")
def get_homepage(user_id: str, time: str = Query(default="afternoon")):
    user = mock_users_db.get(user_id, UserPreferencesModel(userId=user_id))
    card_order = calculate_personalization_scores(user.preferences, time)
    return {
        "success": True,
        "userPreferences": user,
        "currentWeather": MOCK_WEATHER,
        "alerts": MOCK_ALERTS,
        "cardOrder": card_order,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
