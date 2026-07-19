import os
import random
import hashlib
import requests
from typing import Dict, Any, Tuple

OPENWEATHERMAP_API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")

def get_deterministic_seed(pin_code: str, lat: float, lon: float) -> int:
    """Generate a deterministic seed based on PIN code and coordinates."""
    seed_str = f"{pin_code or ''}_{lat or 0:.2f}_{lon or 0:.2f}"
    return int(hashlib.md5(seed_str.encode()).hexdigest(), 16) % 1000000

def generate_mock_weather(latitude: float, longitude: float, pin_code: str) -> Dict[str, Any]:
    """Generates consistent mock weather data based on location for out-of-the-box demo."""
    seed = get_deterministic_seed(pin_code, latitude, longitude)
    rng = random.Random(seed)
    
    # Generate realistic values
    temp = rng.uniform(20.0, 38.0)
    humidity = rng.uniform(40.0, 95.0)
    
    # Deterministic risk tier
    risk_choice = seed % 3
    if risk_choice == 0:
        historical_disaster_risk = "Low"
        current_rainfall_mm = rng.uniform(0.0, 10.0)
    elif risk_choice == 1:
        historical_disaster_risk = "Medium"
        current_rainfall_mm = rng.uniform(10.0, 50.0)
    else:
        historical_disaster_risk = "High"
        current_rainfall_mm = rng.uniform(50.0, 150.0)
        
    return {
        "temperature": round(temp, 1),
        "humidity": round(humidity, 1),
        "current_rainfall_mm": round(current_rainfall_mm, 2),
        "historical_disaster_risk": historical_disaster_risk,
        "is_mock": True
    }

def fetch_weather_data(latitude: float, longitude: float, pin_code: str) -> Dict[str, Any]:
    """
    Fetches real-time weather from OpenWeatherMap if API Key is active,
    otherwise falls back to deterministic mock generator.
    """
    # Check if API key is unset or placeholder
    is_placeholder = not OPENWEATHERMAP_API_KEY or OPENWEATHERMAP_API_KEY.strip() in ["", "your_api_key_here"]
    
    if is_placeholder:
        return generate_mock_weather(latitude, longitude, pin_code)
        
    try:
        # Fetch current weather
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={OPENWEATHERMAP_API_KEY}&units=metric"
        response = requests.get(url, timeout=5)
        
        if response.status_code != 200:
            # Fall back if API key is invalid/unauthorized
            print(f"Weather API returned status {response.status_code}. Falling back to mock data.")
            return generate_mock_weather(latitude, longitude, pin_code)
            
        data = response.json()
        
        # Get rainfall (OpenWeatherMap supplies rain in 'rain.1h' or 'rain.3h' format if present)
        rain_1h = 0.0
        if "rain" in data:
            rain_1h = data["rain"].get("1h", data["rain"].get("3h", 0.0))
            
        # Classify historical risk based on coordinate ranges or precipitation index
        # Let's assess flood/drought risk based on location or precipitation levels
        temp = data.get("main", {}).get("temp", 25.0)
        humidity = data.get("main", {}).get("humidity", 60.0)
        
        # Determine risk tier based on rainfall & humidity
        if rain_1h > 15.0 or humidity > 85.0:
            historical_disaster_risk = "High"
        elif rain_1h > 5.0 or humidity > 70.0:
            historical_disaster_risk = "Medium"
        else:
            historical_disaster_risk = "Low"
            
        return {
            "temperature": round(temp, 1),
            "humidity": round(humidity, 1),
            "current_rainfall_mm": round(rain_1h, 2),
            "historical_disaster_risk": historical_disaster_risk,
            "is_mock": False
        }
        
    except Exception as e:
        print(f"Failed to fetch real weather data due to exception: {e}. Falling back to mock data.")
        return generate_mock_weather(latitude, longitude, pin_code)
