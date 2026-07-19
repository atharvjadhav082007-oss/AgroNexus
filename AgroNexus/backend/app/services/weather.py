"""
KhetSeva Weather Service — Open-Meteo Integration
Free, no API key required, 16-day forecast + historical archive for baselines.
"""

import requests
import hashlib
import random
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional


# ─────────────────────────────────────────────
# Open-Meteo 16-Day Forecast
# ─────────────────────────────────────────────

def fetch_16day_forecast(latitude: float, longitude: float) -> Optional[Dict[str, Any]]:
    """
    Fetch 16-day daily forecast from Open-Meteo (free, no key).
    Returns daily precipitation, max/min temperature arrays.
    """
    try:
        url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={latitude}&longitude={longitude}"
            f"&daily=precipitation_sum,temperature_2m_max,temperature_2m_min"
            f"&forecast_days=16&timezone=auto"
        )
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            print(f"[KhetSeva] Open-Meteo forecast returned {response.status_code}")
            return None

        data = response.json()
        daily = data.get("daily", {})
        return {
            "dates": daily.get("time", []),
            "precipitation_mm": daily.get("precipitation_sum", []),
            "temp_max": daily.get("temperature_2m_max", []),
            "temp_min": daily.get("temperature_2m_min", []),
        }
    except Exception as e:
        print(f"[KhetSeva] Open-Meteo forecast failed: {e}")
        return None


# ─────────────────────────────────────────────
# Open-Meteo Historical Archive (seasonal baseline)
# ─────────────────────────────────────────────

def fetch_seasonal_baseline(latitude: float, longitude: float) -> float:
    """
    Fetch the average daily precipitation for the same 16-day window
    from the previous 3 years to establish a 'normal' baseline.
    Returns: average daily precipitation (mm) as the seasonal normal.
    """
    try:
        now = datetime.utcnow()
        total_precip_days = []

        for years_back in [1, 2, 3]:
            start = (now - timedelta(days=365 * years_back)).strftime("%Y-%m-%d")
            end = (now - timedelta(days=365 * years_back - 16)).strftime("%Y-%m-%d")

            url = (
                f"https://archive-api.open-meteo.com/v1/archive"
                f"?latitude={latitude}&longitude={longitude}"
                f"&daily=precipitation_sum"
                f"&start_date={start}&end_date={end}&timezone=auto"
            )
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                daily = response.json().get("daily", {})
                precip = daily.get("precipitation_sum", [])
                total_precip_days.extend([p for p in precip if p is not None])

        if total_precip_days:
            return sum(total_precip_days) / len(total_precip_days)
        return 5.0  # fallback: assume 5mm/day average if archive fails

    except Exception as e:
        print(f"[KhetSeva] Open-Meteo archive failed: {e}")
        return 5.0


# ─────────────────────────────────────────────
# Mock Forecast (fallback if API unreachable)
# ─────────────────────────────────────────────

def generate_mock_forecast(latitude: float, longitude: float, pin_code: str) -> Dict[str, Any]:
    """Deterministic mock forecast for offline/demo use."""
    seed_str = f"{pin_code or ''}_{latitude or 0:.2f}_{longitude or 0:.2f}"
    seed = int(hashlib.md5(seed_str.encode()).hexdigest(), 16) % 1000000
    rng = random.Random(seed)

    dates = [(datetime.utcnow() + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(16)]
    precipitation = [round(rng.uniform(0.0, 25.0), 1) for _ in range(16)]
    temp_max = [round(rng.uniform(28.0, 42.0), 1) for _ in range(16)]
    temp_min = [round(rng.uniform(18.0, 28.0), 1) for _ in range(16)]

    return {
        "dates": dates,
        "precipitation_mm": precipitation,
        "temp_max": temp_max,
        "temp_min": temp_min,
        "is_mock": True,
    }


# ─────────────────────────────────────────────
# Disaster Risk Signals (from forecast data)
# ─────────────────────────────────────────────

def compute_disaster_signals(
    forecast: Dict[str, Any],
    seasonal_baseline_daily: float,
    crop: str = "Rice",
) -> Dict[str, Any]:
    """
    From 16-day forecast data, compute:
    - drought_signal (0-100): forecast rainfall vs seasonal normal
    - flood_signal (0-100): rolling 3-day sum above threshold
    - heat_signal (0-100): consecutive days above crop-critical temp
    - overall disaster_risk (0-100): weighted max of signals
    """
    precip = forecast.get("precipitation_mm", [])
    temp_max = forecast.get("temp_max", [])

    # --- Drought Signal ---
    # Compare 15-day forecast sum to expected seasonal total
    forecast_total = sum(p for p in precip[:15] if p is not None)
    expected_total = seasonal_baseline_daily * 15.0
    if expected_total > 0:
        ratio = forecast_total / expected_total
    else:
        ratio = 1.0  # no baseline = assume normal

    if ratio < 0.2:
        drought_signal = 95.0
    elif ratio < 0.4:
        drought_signal = 75.0
    elif ratio < 0.6:
        drought_signal = 50.0
    elif ratio < 0.8:
        drought_signal = 25.0
    else:
        drought_signal = 5.0

    # --- Flood Signal ---
    # Check any rolling 3-day sum exceeding 150mm
    flood_signal = 0.0
    for i in range(len(precip) - 2):
        three_day = sum(p for p in precip[i:i+3] if p is not None)
        if three_day > 150:
            flood_signal = max(flood_signal, 90.0)
        elif three_day > 100:
            flood_signal = max(flood_signal, 70.0)
        elif three_day > 75:
            flood_signal = max(flood_signal, 45.0)

    # --- Heat Stress Signal ---
    # Crop-critical temperature thresholds
    crop_heat_thresholds = {
        "Rice": 35, "Rice (Paddy)": 35, "Wheat": 32, "Maize": 38,
        "Cotton": 40, "Sugarcane": 38, "Pulses": 35,
        "Vegetables": 33, "Fruits": 36,
    }
    threshold = crop_heat_thresholds.get(crop, 36)

    consecutive_hot = 0
    max_consecutive = 0
    for t in temp_max:
        if t is not None and t > threshold:
            consecutive_hot += 1
            max_consecutive = max(max_consecutive, consecutive_hot)
        else:
            consecutive_hot = 0

    if max_consecutive >= 5:
        heat_signal = 85.0
    elif max_consecutive >= 3:
        heat_signal = 55.0
    elif max_consecutive >= 1:
        heat_signal = 20.0
    else:
        heat_signal = 0.0

    # --- Overall Disaster Risk ---
    # Use the maximum of the three signals, with slight boost if multiple are elevated
    signals = [drought_signal, flood_signal, heat_signal]
    primary = max(signals)
    secondary = sorted(signals, reverse=True)[1] if len(signals) > 1 else 0

    disaster_risk = primary + (secondary * 0.15)  # small boost for compound threats
    disaster_risk = round(min(disaster_risk, 100.0), 1)

    # Determine dominant hazard type
    if flood_signal >= drought_signal and flood_signal >= heat_signal:
        hazard_type = "Flood / Excess Rainfall"
    elif drought_signal >= heat_signal:
        hazard_type = "Drought / Low Precipitation"
    else:
        hazard_type = "Heat Stress / Crop Damage"

    return {
        "disaster_risk": disaster_risk,
        "drought_signal": round(drought_signal, 1),
        "flood_signal": round(flood_signal, 1),
        "heat_signal": round(heat_signal, 1),
        "hazard_type": hazard_type,
        "forecast_total_mm": round(forecast_total, 1),
        "seasonal_normal_mm": round(expected_total, 1),
        "rainfall_ratio": round(ratio, 2),
        "max_consecutive_hot_days": max_consecutive,
        "crop_heat_threshold": threshold,
    }


# ─────────────────────────────────────────────
# Main Entry Point
# ─────────────────────────────────────────────

def get_weather_and_disaster(
    latitude: float, longitude: float, pin_code: str, crop: str = "Rice"
) -> Dict[str, Any]:
    """
    Full weather pipeline:
    1. Fetch 16-day forecast from Open-Meteo
    2. Fetch seasonal baseline from historical archive
    3. Compute disaster signals (drought / flood / heat)
    Returns forecast data + disaster analysis in one response.
    """
    # Try real API first
    forecast = fetch_16day_forecast(latitude, longitude)
    is_mock = False

    if forecast is None:
        forecast = generate_mock_forecast(latitude, longitude, pin_code)
        is_mock = True

    # Get seasonal baseline
    if not is_mock:
        baseline = fetch_seasonal_baseline(latitude, longitude)
    else:
        # For mock data, use a reasonable Indian monsoon baseline
        baseline = 8.0  # ~8mm/day average during monsoon season

    # Compute disaster signals
    signals = compute_disaster_signals(forecast, baseline, crop)

    return {
        "forecast": forecast,
        "disaster": signals,
        "seasonal_baseline_daily_mm": round(baseline, 2),
        "is_mock": is_mock,
    }
