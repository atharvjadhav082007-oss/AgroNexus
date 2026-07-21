"""
KhetSeva Agents — Rule-based intelligence modules.

Agent 1: FinancialAgent — transparent weighted scorecard (0-100)
Agent 2: DisasterAgent — uses Open-Meteo forecast signals
Agent 3: GovSchemeAgent — static eligibility matching for 7 central schemes
Agent 4: OptimizationAgent — OR-Tools CP-SAT for relief fund allocation
Compound Risk Engine — probabilistic union formula
"""

import os
import json
from typing import Dict, Any, List

from ortools.sat.python import cp_model


# ─────────────────────────────────────────────
# Gemini LLM Client (dynamic env loading)
# ─────────────────────────────────────────────

from pathlib import Path
from dotenv import load_dotenv

# Ensure .env is loaded from backend root directory
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

_gemini_client = None
_cached_key = None

def _get_gemini_api_key() -> str:
    # Ensure fresh load from .env
    load_dotenv(dotenv_path=env_path, override=True)
    return os.getenv("GEMINI_API_KEY", "").strip()

def _get_gemini_client():
    global _gemini_client, _cached_key
    api_key = _get_gemini_api_key()
    if not api_key or api_key in ["", "your_gemini_api_key_here"]:
        return None
    if _gemini_client is not None and _cached_key == api_key:
        return _gemini_client
    try:
        from google import genai
        _gemini_client = genai.Client(api_key=api_key)
        _cached_key = api_key
        print(f"[KhetSeva] Gemini Client initialized successfully.")
        return _gemini_client
    except Exception as e:
        print(f"[KhetSeva] Gemini init failed: {e}. Using rule-based reasoning.")
        return None

def _call_gemini(prompt: str, fallback: str) -> str:
    client = _get_gemini_client()
    if client is None:
        print("[KhetSeva] No Gemini client available. Returning fallback.")
        return fallback

    # Try different models in case one model tier has hit rate limits
    models_to_try = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b"]
    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
            )
            print(f"[KhetSeva] Gemini call succeeded using {model_name}.")
            return response.text.strip()
        except Exception as e:
            error_str = str(e)
            print(f"[KhetSeva] Model '{model_name}' failed: {error_str[:120]}...")

    return "⚠️ **All Gemini API models are currently rate-limited (429).** Please wait 30–60 seconds for the free-tier quota to reset and ask your question again!"

def is_ai_powered() -> bool:
    api_key = _get_gemini_api_key()
    return bool(api_key and api_key not in ["", "your_gemini_api_key_here"])


# ─────────────────────────────────────────────
# 1. Financial Risk Agent — Transparent Scorecard
# ─────────────────────────────────────────────

class FinancialAgent:
    """
    KhetSeva Financial Risk Scorecard (0-100).
    Transparent weighted scoring — no ML, no black box.
    Every point is explainable to a judge or a farmer.
    """

    def run(
        self,
        has_insurance: bool,
        loan_source: str,        # bank / kcc / moneylender / none
        land_size_acres: float,
        ownership_type: str,     # owned / leased / sharecropper
        past_crop_loss: bool,
        dependents: int,
        income_band: str,        # <1L / 1-3L / 3-5L / 5L+
        crop: str = "",
    ) -> Dict[str, Any]:

        score = 0
        factors = []

        # +20 No crop insurance
        if not has_insurance:
            score += 20
            factors.append({"factor": "No crop insurance", "points": 20})

        # Loan source scoring
        if loan_source == "moneylender":
            score += 25
            factors.append({"factor": "Loan from informal moneylender", "points": 25})
        elif loan_source in ["bank", "kcc"]:
            score += 10
            factors.append({"factor": f"Loan from {loan_source.upper()}", "points": 10})
        # none = +0

        # Land size scoring (1 acre ≈ 0.4 hectares)
        land_ha = land_size_acres * 0.4047
        if land_ha < 1.0:
            score += 15
            factors.append({"factor": f"Marginal landholding ({land_size_acres} acres / {land_ha:.1f} ha)", "points": 15})
        elif land_ha < 2.0:
            score += 10
            factors.append({"factor": f"Small landholding ({land_size_acres} acres / {land_ha:.1f} ha)", "points": 10})
        else:
            score += 5
            factors.append({"factor": f"Semi-medium+ landholding ({land_size_acres} acres)", "points": 5})

        # Sharecropper / leased land
        if ownership_type in ["leased", "sharecropper"]:
            score += 15
            factors.append({"factor": f"Land is {ownership_type} (not owned)", "points": 15})

        # Crop loss in last 2 seasons
        if past_crop_loss:
            score += 15
            factors.append({"factor": "Crop loss reported in last 2 seasons", "points": 15})

        # 4+ dependents
        if dependents >= 4:
            score += 10
            factors.append({"factor": f"{dependents} dependents (4+)", "points": 10})

        # Cap at 100
        score = min(score, 100)

        # Risk level
        if score >= 65:
            risk_level = "High"
        elif score >= 40:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        # Readable explanation
        factor_lines = [f"  • {f['factor']}: +{f['points']} pts" for f in factors]
        fallback = (
            f"Financial Risk Score: {score}/100 ({risk_level})\n"
            f"Scorecard breakdown:\n" + "\n".join(factor_lines) + "\n"
            f"Total: {score} points. {'This farmer is financially vulnerable and needs immediate support.' if score >= 65 else 'Financial situation is manageable but should be monitored.'}"
        )

        # Optional Gemini reasoning
        ai_prompt = f"""You are a financial risk analyst for Indian farmers. Analyze this scorecard and write a 3-4 sentence summary in simple farmer-friendly English:

Score: {score}/100 ({risk_level} risk)
Factors:
{chr(10).join(f"- {f['factor']}: +{f['points']} points" for f in factors)}

Income band: {income_band}, Crop: {crop}

Explain the key stress factors and suggest one practical step they can take. Be empathetic and constructive."""

        thought_process = fallback

        return {
            "risk_score": score,
            "risk_level": risk_level,
            "factors": factors,
            "thought_process": thought_process,
        }


# ─────────────────────────────────────────────
# 2. Disaster Risk Agent
# ─────────────────────────────────────────────

class DisasterAgent:
    """
    Uses pre-computed disaster signals from the weather service.
    This agent interprets the signals and generates risk assessment.
    """

    def run(self, disaster_signals: Dict[str, Any], crop: str = "") -> Dict[str, Any]:
        """
        disaster_signals comes from weather.compute_disaster_signals():
        - disaster_risk, drought_signal, flood_signal, heat_signal
        - hazard_type, forecast_total_mm, seasonal_normal_mm, etc.
        """
        score = disaster_signals.get("disaster_risk", 0.0)
        hazard = disaster_signals.get("hazard_type", "Unknown")
        drought = disaster_signals.get("drought_signal", 0)
        flood = disaster_signals.get("flood_signal", 0)
        heat = disaster_signals.get("heat_signal", 0)

        if score >= 65:
            risk_level = "High"
        elif score >= 40:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        fallback = (
            f"Disaster Risk Score: {score}/100 ({risk_level})\n"
            f"Primary hazard: {hazard}\n"
            f"Drought signal: {drought}% | Flood signal: {flood}% | Heat stress: {heat}%\n"
            f"15-day forecast rainfall: {disaster_signals.get('forecast_total_mm', 'N/A')}mm "
            f"vs seasonal normal: {disaster_signals.get('seasonal_normal_mm', 'N/A')}mm\n"
            f"{'⚠️ HIGH RISK — immediate protective action recommended.' if score >= 65 else 'Continue monitoring weather conditions.'}"
        )

        thought_process = fallback

        return {
            "risk_score": score,
            "risk_level": risk_level,
            "hazard_type": hazard,
            "thought_process": thought_process,
            "signals": disaster_signals,
        }


# ─────────────────────────────────────────────
# Compound Risk Engine
# ─────────────────────────────────────────────

def compute_compound_risk(financial_risk: float, disaster_risk: float) -> Dict[str, Any]:
    """
    Probabilistic union formula:
    Compound = 100 - ((100 - F) × (100 - D) / 100)

    This models the probability of being hit through EITHER channel —
    financial trouble OR disaster — which is the core KhetSeva thesis.

    Risk bands:
    0-39: Stable    | "Low risk — monitor normally"
    40-64: Watch    | "Elevated risk — review recommendations"
    65-84: High     | "High risk — action recommended"
    85-100: Critical | "Possible crisis within 15 days — act now"
    """
    F = min(max(financial_risk, 0), 100)
    D = min(max(disaster_risk, 0), 100)

    compound = 100.0 - ((100.0 - F) * (100.0 - D) / 100.0)
    compound = round(compound, 1)

    if compound >= 85:
        label = "Critical"
        message = "Possible crisis within 15 days — act now"
    elif compound >= 65:
        label = "High Risk"
        message = "High risk — action recommended"
    elif compound >= 40:
        label = "Watch"
        message = "Elevated risk — review recommendations"
    else:
        label = "Stable"
        message = "Low risk — monitor normally"

    # XAI explanation
    explanation = (
        f"Compound vulnerability is {compound}% ({label}). "
        f"Financial exposure contributes {F}% and disaster exposure contributes {D}%. "
        f"Using probabilistic risk union: the chance of crisis through either channel "
        f"(financial fragility OR environmental hazard) is {compound}%. {message}."
    )

    return {
        "compound_risk": compound,
        "label": label,
        "message": message,
        "xai_explanation": explanation,
    }


# ─────────────────────────────────────────────
# 3. Government Scheme Agent — 7 Central Schemes
# ─────────────────────────────────────────────

class GovSchemeAgent:
    """
    Matches farmer profile against eligibility rules for 7 real, current
    central government schemes. Returns Eligible / Not Eligible / Conditional.
    """

    def run(
        self,
        land_size_acres: float,
        ownership_type: str,
        has_insurance: bool,
        loan_source: str,
        income_band: str,
        past_crop_loss: bool,
        financial_risk_level: str,
        disaster_risk_level: str,
        crop: str = "",
    ) -> List[Dict[str, Any]]:

        schemes = []
        land_ha = land_size_acres * 0.4047

        # 1. PM-KISAN — ₹6,000/yr
        if land_ha <= 2.0:
            schemes.append({
                "name": "PM-KISAN Samman Nidhi",
                "benefit": "₹6,000/yr via DBT (3 installments of ₹2,000)",
                "status": "Eligible now",
                "reason": f"Landholding {land_size_acres} acres ({land_ha:.1f} ha) qualifies as small/marginal farmer.",
                "apply_url": "https://pmkisan.gov.in",
            })
        else:
            schemes.append({
                "name": "PM-KISAN Samman Nidhi",
                "benefit": "₹6,000/yr via DBT",
                "status": "Conditionally eligible",
                "reason": f"Landholding exceeds 2 ha ({land_ha:.1f} ha). Eligible if not a government employee or large taxpayer.",
                "apply_url": "https://pmkisan.gov.in",
            })

        # 2. PMFBY — Crop Insurance
        if not has_insurance and (disaster_risk_level in ["High", "Medium"] or past_crop_loss):
            schemes.append({
                "name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                "benefit": "Crop insurance at 1.5% (Rabi) / 2% (Kharif) / 5% (commercial) premium",
                "status": "Eligible now",
                "reason": "No current insurance + elevated disaster risk. Premium heavily subsidized by government.",
                "apply_url": "https://pmfby.gov.in",
            })
        elif has_insurance:
            schemes.append({
                "name": "PMFBY",
                "benefit": "Crop insurance",
                "status": "Not eligible",
                "reason": "Already has crop insurance. Verify coverage adequacy.",
                "apply_url": "https://pmfby.gov.in",
            })
        else:
            schemes.append({
                "name": "PMFBY",
                "benefit": "Crop insurance at subsidized premium",
                "status": "Eligible now",
                "reason": "All farmers can enroll. Loanee farmers via KCC are auto-enrolled.",
                "apply_url": "https://pmfby.gov.in",
            })

        # 3. KCC — Kisan Credit Card
        if loan_source in ["moneylender", "none"]:
            schemes.append({
                "name": "Kisan Credit Card (KCC)",
                "benefit": "Crop loan up to ₹3L at ~4% effective interest",
                "status": "Eligible now",
                "reason": f"Currently {'borrowing from moneylender at high interest' if loan_source == 'moneylender' else 'without formal credit'}. KCC provides affordable institutional credit.",
                "apply_url": "https://www.pmkisan.gov.in/KCC",
            })
        elif loan_source == "kcc":
            schemes.append({
                "name": "KCC",
                "benefit": "Crop loan up to ₹3L",
                "status": "Not eligible",
                "reason": "Already has KCC. Check for loan restructuring options if in distress.",
                "apply_url": None,
            })
        else:
            schemes.append({
                "name": "KCC",
                "benefit": "Crop loan up to ₹3L at ~4%",
                "status": "Eligible now",
                "reason": "Can apply for KCC in addition to existing bank loan for crop-specific credit.",
                "apply_url": "https://www.pmkisan.gov.in/KCC",
            })

        # 4. PM-KMY — Pension
        if land_ha <= 2.0 and income_band in ["<1L", "1-3L"]:
            schemes.append({
                "name": "PM Kisan Maandhan Yojana (PM-KMY)",
                "benefit": "₹3,000/month pension after age 60",
                "status": "Eligible now",
                "reason": "Small/marginal farmer with low income band qualifies for voluntary pension scheme.",
                "apply_url": "https://maandhan.in",
            })
        else:
            schemes.append({
                "name": "PM-KMY",
                "benefit": "₹3,000/month pension after 60",
                "status": "Conditionally eligible",
                "reason": "Must be small/marginal farmer (≤2 ha) with voluntary contribution.",
                "apply_url": "https://maandhan.in",
            })

        # 5. e-NAM
        schemes.append({
            "name": "e-NAM (National Agriculture Market)",
            "benefit": "Unified online mandi access for better crop prices",
            "status": "Eligible now",
            "reason": "Any farmer can register via local mandi. Get competitive prices across markets.",
            "apply_url": "https://enam.gov.in",
        })

        # 6. Soil Health Card
        schemes.append({
            "name": "Soil Health Card Scheme",
            "benefit": "Free soil testing every 2 years + fertilizer advisory",
            "status": "Eligible now",
            "reason": "All farmers eligible. Provides nutrient-specific recommendations to improve yield.",
            "apply_url": "https://soilhealth.dac.gov.in",
        })

        # 7. PMKSY / PM-KUSUM
        if crop in ["Cotton", "Sugarcane", "Fruits", "Rice", "Rice (Paddy)"] or disaster_risk_level == "High":
            schemes.append({
                "name": "PM Krishi Sinchayee Yojana (PMKSY) / PM-KUSUM",
                "benefit": "80% micro-irrigation subsidy + solar pump subsidy",
                "status": "Eligible now",
                "reason": f"Water-intensive crop '{crop}' or high disaster risk. Drip/sprinkler systems reduce water dependency.",
                "apply_url": None,
            })
        else:
            schemes.append({
                "name": "PMKSY / PM-KUSUM",
                "benefit": "Irrigation & solar pump subsidy",
                "status": "Conditionally eligible",
                "reason": "State-specific application. Check with local agriculture office.",
                "apply_url": None,
            })

        return schemes


# ─────────────────────────────────────────────
# 4. Optimization Agent (OR-Tools CP-SAT)
# ─────────────────────────────────────────────

class OptimizationAgent:
    """
    Uses Google OR-Tools CP-SAT to solve resource allocation:
    distributes limited relief funds optimally among distressed farmers.
    """

    def run(self, farmers_data: List[Dict[str, Any]], total_budget: float) -> Dict[str, Any]:
        if not farmers_data:
            return {
                "total_budget": total_budget,
                "total_spent": 0.0,
                "total_mitigated_score": 0.0,
                "allocations": [],
                "thought_process": "No farmer profiles found for optimization.",
            }

        model = cp_model.CpModel()

        # 3 intervention types per farmer
        x = {}
        for i, farmer in enumerate(farmers_data):
            for j in range(3):
                x[i, j] = model.NewBoolVar(f"x_{i}_{j}")

        # Budget constraint
        total_cost_expr = []
        for i, farmer in enumerate(farmers_data):
            debt_cost = int(min(farmer.get("loan_amount", 0.0), 50000.0))
            debt_cost = max(debt_cost, 5000)
            total_cost_expr.append(x[i, 0] * debt_cost)    # Debt relief
            total_cost_expr.append(x[i, 1] * 20000)        # Drip irrigation
            total_cost_expr.append(x[i, 2] * 10000)        # Cash support

        model.Add(sum(total_cost_expr) <= int(total_budget))

        # Each farmer gets at most one intervention
        for i in range(len(farmers_data)):
            model.Add(sum(x[i, j] for j in range(3)) <= 1)

        # Maximize risk points mitigated (weighted by compound score)
        total_mitigated = []
        for i, farmer in enumerate(farmers_data):
            weight = int(farmer.get("compound_score", 0.0))
            total_mitigated.append(x[i, 0] * (45 * weight))
            total_mitigated.append(x[i, 1] * (25 * weight))
            total_mitigated.append(x[i, 2] * (15 * weight))

        model.Maximize(sum(total_mitigated))

        solver = cp_model.CpSolver()
        status = solver.Solve(model)

        allocations = []
        total_spent = 0
        total_points = 0.0

        if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
            for i, farmer in enumerate(farmers_data):
                intervention = None
                cost = 0
                risk_pts = 0

                if solver.Value(x[i, 0]) == 1:
                    intervention = "KCC Debt Restructuring"
                    cost = max(int(min(farmer.get("loan_amount", 0), 50000)), 5000)
                    risk_pts = 45
                elif solver.Value(x[i, 1]) == 1:
                    intervention = "PMKSY Drip Irrigation Subsidy"
                    cost = 20000
                    risk_pts = 25
                elif solver.Value(x[i, 2]) == 1:
                    intervention = "PM-Kisan Direct Cash Support"
                    cost = 10000
                    risk_pts = 15

                if intervention:
                    total_spent += cost
                    reduced = (risk_pts * farmer.get("compound_score", 0)) / 100.0
                    total_points += reduced
                    allocations.append({
                        "farmer_id": farmer["id"],
                        "farmer_name": farmer["name"],
                        "intervention": intervention,
                        "cost": cost,
                        "risk_mitigated": round(reduced, 1),
                    })

        thoughts = (
            f"OR-Tools CP-SAT Optimization Complete.\n"
            f"Processed {len(farmers_data)} farmers. Budget: ₹{total_budget:,.0f}.\n"
            f"Allocated ₹{total_spent:,.0f} across {len(allocations)} farmers.\n"
            f"Total risk reduction: {total_points:.1f} points."
        )

        return {
            "total_budget": total_budget,
            "total_spent": total_spent,
            "total_mitigated_score": round(total_points, 1),
            "allocations": allocations,
            "thought_process": thoughts,
        }
