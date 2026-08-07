import requests
from typing import Dict, Any

class DisasterRiskService:
    def calculate_hazard_scores(self, latitude: float, longitude: float) -> Dict[str, Any]:
        url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={latitude}&longitude={longitude}"
            f"&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,rain,showers,"
            f"snowfall,weather_code,evapotranspiration,et0_fao_evapotranspiration,vapour_pressure_deficit,"
            f"wind_speed_10m,wind_gusts_10m,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm"
            f"&forecast_days=3&timezone=auto"
        )
        response = requests.get(url, timeout=10)
        
        if response.status_code != 200:
            raise Exception(f"Open-Meteo API failed with status {response.status_code}")
            
        data = response.json()
        hourly = data.get("hourly", {})
        
        # Extract features
        rain = hourly.get("rain", [])
        showers = hourly.get("showers", [])
        soil_3_9 = hourly.get("soil_moisture_3_to_9cm", [])
        soil_9_27 = hourly.get("soil_moisture_9_to_27cm", [])
        et0 = hourly.get("et0_fao_evapotranspiration", [])
        vpd = hourly.get("vapour_pressure_deficit", [])
        wind_gusts = hourly.get("wind_gusts_10m", [])
        weather_code = hourly.get("weather_code", [])
        temp_2m = hourly.get("temperature_2m", [])
        dew_point = hourly.get("dew_point_2m", [])
        app_temp = hourly.get("apparent_temperature", [])
        
        # Safe aggregations
        sum_rain_showers = sum(r + s for r, s in zip(rain, showers) if r is not None and s is not None)
        avg_soil = sum((s1 + s2)/2 for s1, s2 in zip(soil_3_9, soil_9_27) if s1 is not None and s2 is not None) / max(1, len(soil_3_9))
        sum_et0 = sum(e for e in et0 if e is not None)
        avg_vpd = sum(v for v in vpd if v is not None) / max(1, len(vpd))
        max_gust = max((g for g in wind_gusts if g is not None), default=0)
        
        # 1. Flood Score
        rain_component = min((sum_rain_showers / 100) * 100, 100)
        soil_component = min((avg_soil / 0.45) * 100, 100)
        flood_score = 0.6 * rain_component + 0.4 * soil_component
        
        # 2. Drought Score
        et0_component = min((sum_et0 / 20) * 100, 100)
        vpd_component = min((avg_vpd / 3.0) * 100, 100)
        dryness_component = max(min((1 - (avg_soil / 0.45)) * 100, 100), 0)
        drought_score = 0.35 * et0_component + 0.30 * vpd_component + 0.35 * dryness_component
        
        # 3. Storm Score
        gust_component = min((max_gust / 70) * 100, 100)
        storm_codes = {95, 96, 99, 82, 65, 67}
        storm_hours = sum(1 for c in weather_code if c in storm_codes)
        code_component = min((storm_hours / 6) * 100, 100)
        storm_score = 0.6 * gust_component + 0.4 * code_component
        
        # 4. Frost or Heat Score
        min_temp = min((t for t in temp_2m if t is not None), default=20)
        min_dewpoint = min((d for d in dew_point if d is not None), default=20)
        max_app_temp = max((a for a in app_temp if a is not None), default=30)
        
        frost = 0.0
        if min_temp < 5:
            closeness = max(0, 5 - abs(min_temp - min_dewpoint))
            frost = min(max(0, ((5 - min_temp)/5)*60 + (closeness/5)*40), 100)
            
        heat = min(max(max_app_temp - 35, 0) / 15 * 100, 100)
        frost_or_heat_score = max(frost, heat)
        
        # Combine
        scores = {
            "flood": flood_score,
            "drought": drought_score,
            "storm": storm_score,
            "frost_or_heat": frost_or_heat_score
        }
        
        max_score = max(scores.values())
        avg_score = sum(scores.values()) / 4
        overall_disaster_score = 0.65 * max_score + 0.35 * avg_score
        
        dominant_hazard = max(scores, key=scores.get)
        
        return {
            "disaster_risk_score": round(overall_disaster_score, 2),
            "dominant_hazard": dominant_hazard,
            "breakdown": {
                "flood": round(flood_score, 2),
                "drought": round(drought_score, 2),
                "storm": round(storm_score, 2),
                "frost_or_heat": round(frost_or_heat_score, 2),
            }
        }

disaster_risk_service = DisasterRiskService()
