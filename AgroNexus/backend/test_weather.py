import os
from dotenv import load_dotenv

# Load env to get API keys
load_dotenv(dotenv_path="c:\\AB17\\AgroNexus\\backend\\.env")

import app.services.weather as weather
import json

if __name__ == "__main__":
    lat, lon = 28.6139, 77.2090 # Coordinates for New Delhi
    
    print("--- Testing Primary API (Open-Meteo) ---")
    open_meteo_result = weather.fetch_16day_forecast(lat, lon)
    if open_meteo_result:
        print("[SUCCESS] Open-Meteo is WORKING!")
    else:
        print("[ERROR] Open-Meteo FAILED!")

    print("\n--- Testing Secondary API (OpenWeatherMap) ---")
    owm_result = weather.fetch_openweathermap_forecast(lat, lon, baseline=5.0)
    if owm_result:
        print("[SUCCESS] OpenWeatherMap is WORKING!")
    else:
        print("[ERROR] OpenWeatherMap FAILED! (Check if API key is active)")
