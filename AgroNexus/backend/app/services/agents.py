import os
from typing import Dict, Any, List

from ortools.sat.python import cp_model

# ─────────────────────────────────────────────
# Gemini LLM Client Setup (google-genai v1 SDK)
# ─────────────────────────────────────────────

_GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
_AI_ENABLED = bool(_GEMINI_API_KEY and _GEMINI_API_KEY.strip() not in ["", "your_gemini_api_key_here"])

_gemini_client = None

def _get_gemini_client():
    """Lazily initialize the google-genai v1 client."""
    global _gemini_client
    if _gemini_client is not None:
        return _gemini_client
    if not _AI_ENABLED:
        return None
    try:
        from google import genai
        _gemini_client = genai.Client(api_key=_GEMINI_API_KEY)
        return _gemini_client
    except Exception as e:
        print(f"[AgroNexus] Gemini init failed: {e}. Falling back to rule-based reasoning.")
        return None


def _call_gemini(prompt: str, fallback: str) -> str:
    """
    Call Gemini 2.0 Flash with a prompt via google-genai v1 SDK.
    Returns fallback string if API is unavailable.
    """
    client = _get_gemini_client()
    if client is None:
        return fallback
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        return response.text.strip()
    except Exception as e:
        print(f"[AgroNexus] Gemini API call failed: {e}. Using fallback reasoning.")
        return fallback


def is_ai_powered() -> bool:
    """Returns True if Gemini API key is configured."""
    return _AI_ENABLED


# ─────────────────────────────────────────────
# 1. Financial Agent
# ─────────────────────────────────────────────
class FinancialAgent:
    """
    Evaluates farmer's debt, income, and crop market indicators.
    Uses Gemini Flash to generate natural language reasoning.
    Returns: Financial Risk Level, score, and AI-powered reasoning.
    """

    def __init__(self):
        # Official Indian MSP crop price index (2023-24)
        self.crop_price_index = {
            "Rice (Paddy)": {"msp": 2183, "market_trend": "stable", "risk_modifier": 0.0},
            "Wheat":        {"msp": 2275, "market_trend": "positive", "risk_modifier": -0.05},
            "Maize":        {"msp": 2090, "market_trend": "volatile", "risk_modifier": 0.1},
            "Sugarcane":    {"msp": 315,  "market_trend": "stable",   "risk_modifier": 0.0},
            "Cotton":       {"msp": 6620, "market_trend": "volatile", "risk_modifier": 0.15},
            "Pulses":       {"msp": 7000, "market_trend": "positive", "risk_modifier": -0.1},
            "Vegetables":   {"msp": 3200, "market_trend": "highly_volatile", "risk_modifier": 0.2},
            "Fruits":       {"msp": 4500, "market_trend": "volatile", "risk_modifier": 0.1},
        }

    def run(self, income: float, loan: float, has_default: bool, crop: str) -> Dict[str, Any]:
        income = max(income, 1.0)
        debt_ratio = loan / income

        # ── Rule Engine: Numeric Score Calculation ──
        crop_data = self.crop_price_index.get(
            crop, {"msp": 2000, "market_trend": "stable", "risk_modifier": 0.0}
        )
        crop_risk = crop_data["risk_modifier"]

        risk_score = debt_ratio * 40
        if has_default:
            risk_score += 35
        risk_score += crop_risk * 20
        risk_score = round(min(max(risk_score, 0), 100), 1)

        if risk_score > 65:
            risk_level = "High"
        elif risk_score > 35:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        # ── Rule-based fallback reasoning ──
        fallback_thoughts = "\n".join([
            f"Analyzing financial profile: annual income is ₹{income:,.2f} vs outstanding loan of ₹{loan:,.2f}.",
            f"Calculated debt-to-income ratio is {debt_ratio:.2f}.",
            f"Evaluated primary crop '{crop}' with MSP ₹{crop_data['msp']}/quintal. Market trend is currently {crop_data['market_trend']}.",
            (f"Flagged active credit alert: history of previous loan defaults increases risk vector by 35%." if has_default else "No prior default history detected — credit profile is stable."),
            (f"Crop volatility is {crop_data['market_trend']}: adding {crop_risk * 100:.0f}% market exposure risk." if crop_risk > 0 else ""),
            f"Combined risk score evaluated at {risk_score:.1f}%. Classifying financial risk as {risk_level}.",
        ])

        # ── Gemini LLM: Natural Language Reasoning ──
        ai_prompt = f"""You are an expert financial risk analyst AI specialized in Indian agricultural economics and rural farmer welfare.

Analyze the following farmer's financial situation and provide a clear, empathetic, expert assessment:

- Annual Income: ₹{income:,.0f}
- Outstanding Loan: ₹{loan:,.0f}  
- Debt-to-Income Ratio: {debt_ratio:.2f}x
- Primary Crop: {crop} (MSP: ₹{crop_data['msp']}/quintal, Market Trend: {crop_data['market_trend']})
- Previous Loan Default History: {'Yes — HIGH RISK SIGNAL' if has_default else 'No'}
- Computed Risk Score: {risk_score}% ({risk_level} Risk)

Write a 4-5 sentence expert analysis in simple, farmer-friendly English that:
1. Explains the key financial stress factors driving the risk score
2. Highlights the crop market impact on their income stability
3. Mentions what immediate financial relief options exist (like KCC restructuring, PM-Kisan)
4. Ends with a constructive, hopeful recommendation

Be empathetic, professional and specific. Do NOT use bullet points — write in flowing paragraphs."""

        thought_process = _call_gemini(ai_prompt, fallback_thoughts)

        return {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "thought_process": thought_process,
            "is_ai_powered": is_ai_powered(),
            "crop_details": {
                "msp": crop_data["msp"],
                "market_trend": crop_data["market_trend"],
            },
        }


# ─────────────────────────────────────────────
# 2. Disaster Agent
# ─────────────────────────────────────────────
class DisasterAgent:
    """
    Evaluates location weather forecast, rainfall deficit/excess, and pest outbreak probabilities.
    Uses Gemini Flash to generate natural language hazard assessment.
    Returns: Disaster Risk Level, score, and AI-powered reasoning.
    """

    def run(
        self,
        latitude: float,
        longitude: float,
        pin_code: str,
        rainfall_mm: float,
        zone_risk: str,
        crop: str,
    ) -> Dict[str, Any]:

        # ── Rule Engine: Numeric Score Calculation ──
        pest_prob = 10.0
        if crop in ["Cotton", "Rice (Paddy)"]:
            if rainfall_mm > 80.0:
                pest_prob = 75.0
            elif rainfall_mm > 40.0:
                pest_prob = 45.0
        elif crop in ["Vegetables", "Fruits"] and rainfall_mm > 60.0:
            pest_prob = 60.0

        disaster_score = 15.0
        if zone_risk == "High":
            disaster_score += 40.0
        elif zone_risk == "Medium":
            disaster_score += 20.0

        if rainfall_mm < 15.0:
            disaster_score += 25.0
            hazard_type = "Drought / Low Precipitation"
        elif rainfall_mm > 100.0:
            disaster_score += 35.0
            hazard_type = "Severe Precipitation / Flood Warning"
        else:
            hazard_type = "Stable Weather Cycle"

        if pest_prob > 50.0:
            disaster_score += 15.0

        disaster_score = round(min(disaster_score, 100), 1)

        if disaster_score > 60:
            risk_level = "High"
        elif disaster_score > 35:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        # ── Rule-based fallback reasoning ──
        fallback_thoughts = "\n".join([
            f"Locating geographic coordinates: lat={latitude:.4f}, lon={longitude:.4f} (PIN: {pin_code}).",
            f"Identified regional hazard baseline: {zone_risk} Historical Risk zone.",
            f"Precipitation index is {rainfall_mm:.2f} mm: warning state classified as '{hazard_type}'.",
            (f"Pest Outbreak Alert: High pest vulnerability detected for '{crop}' under current precipitation profile ({pest_prob}% hazard index)."
             if pest_prob > 50.0 else "Pest probability index evaluated as low/stable."),
            f"Calculated composite environmental vulnerability score: {disaster_score:.1f}%. Classifying disaster risk as {risk_level}.",
        ])

        # ── Gemini LLM: Natural Language Reasoning ──
        ai_prompt = f"""You are an expert agricultural disaster risk analyst and climate scientist focused on Indian farming regions.

Analyze the following environmental data for a farmer's location and provide a clear, actionable risk assessment:

- GPS Coordinates: ({latitude:.4f}°N, {longitude:.4f}°E), PIN Code: {pin_code}
- Historical Disaster Risk Zone: {zone_risk}
- Current Precipitation Level: {rainfall_mm:.1f} mm
- Hazard Classification: {hazard_type}
- Primary Crop: {crop}
- Pest Outbreak Probability: {pest_prob:.0f}%
- Computed Disaster Risk Score: {disaster_score}% ({risk_level} Risk)

Write a 4-5 sentence expert assessment in simple English that:
1. Describes the specific climate threats facing this farmer right now
2. Explains what the precipitation levels mean for their specific crop type
3. Addresses the pest outbreak risk and seasonal vulnerabilities
4. Recommends 1-2 immediate protective actions the farmer can take

Be specific to Indian agricultural conditions. Do NOT use bullet points — write in flowing paragraphs."""

        thought_process = _call_gemini(ai_prompt, fallback_thoughts)

        return {
            "risk_score": disaster_score,
            "risk_level": risk_level,
            "pest_probability": pest_prob,
            "hazard_type": hazard_type,
            "thought_process": thought_process,
            "is_ai_powered": is_ai_powered(),
        }


# ─────────────────────────────────────────────
# 3. Government Scheme Agent
# ─────────────────────────────────────────────
class GovSchemeAgent:
    """
    Evaluates farmer inputs and outputs matching eligible relief and subsidy programs.
    Uses Gemini Flash to generate a personalized scheme advisory summary.
    """

    def run(
        self,
        land_size: float,
        financial_risk: str,
        disaster_risk: str,
        has_default: bool,
        crop: str,
    ) -> Dict[str, Any]:

        eligible_schemes = []

        # ── Rule Engine: Eligibility Matching ──

        # 1. PM-Kisan (Income support for smallholders) — land_size <= 5.0 acres
        if land_size <= 5.0:
            eligible_schemes.append({
                "name": "PM-Kisan Samman Nidhi",
                "type": "Direct Cash Benefit",
                "value": "₹6,000 / year",
                "description": "Income support subsidy for small and marginal farmers with landholding up to 5 acres.",
            })

        # 2. PM Fasal Bima Yojana (Crop Insurance) — High or Medium disaster risk
        if disaster_risk in ["High", "Medium"]:
            eligible_schemes.append({
                "name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                "type": "Crop Insurance",
                "value": "Up to 90% Premium Subsidy",
                "description": "Insurance relief coverage against weather extremes, crop failures, or localized disaster events.",
            })

        # 3. KCC Loan Moratorium / Debt Relief — High financial risk or has default
        if financial_risk == "High" or has_default:
            eligible_schemes.append({
                "name": "Kisan Credit Card (KCC) Restructuring",
                "type": "Debt Relief & Moratorium",
                "value": "Interest Restructuring & Loan Extension",
                "description": "Grants interest deferral and loan repayment extension due to high agricultural risk profile.",
            })

        # 4. Drip Irrigation Subsidy — Water-intensive/drought-sensitive crops
        if crop in ["Cotton", "Sugarcane", "Fruits"] or disaster_risk == "High":
            eligible_schemes.append({
                "name": "PM Krishi Sinchayee Yojana (PMKSY)",
                "type": "Technology Subsidy",
                "value": "80% micro-irrigation subsidy",
                "description": "Subsidy program to install drip/sprinkler systems to counter water scarcity and improve yield.",
            })

        # 5. Soil Health Card Scheme — Always eligible
        eligible_schemes.append({
            "name": "Soil Health Card Scheme",
            "type": "Advisory & Input Subsidy",
            "value": "Free Soil Analysis + Fertilizer Advisory",
            "description": "Government provides free soil health cards and tailored fertilizer recommendations to improve crop yield.",
        })

        scheme_names = [s["name"] for s in eligible_schemes]
        scheme_types = [s["type"] for s in eligible_schemes]

        # ── Rule-based fallback reasoning ──
        fallback_thoughts = "\n".join([
            "Starting Government Scheme eligibility checks...",
            (f"PM-Kisan match verified: landholding size of {land_size} acres is within 5-acre smallholder margins." if land_size <= 5.0
             else f"PM-Kisan mismatch: landholding ({land_size} acres) exceeds smallholder thresholds."),
            (f"PMFBY Insurance matched: disaster vulnerability rating is {disaster_risk}." if disaster_risk in ["High", "Medium"] else ""),
            (f"KCC Loan Restructuring matched: financial risk evaluated as {financial_risk}." if financial_risk == "High" or has_default else ""),
            (f"Drip Irrigation Subsidy matched: crop '{crop}' or drought warning is active." if crop in ["Cotton", "Sugarcane", "Fruits"] or disaster_risk == "High" else ""),
            f"Eligibility verification complete. Identified {len(eligible_schemes)} eligible relief schemes.",
        ])

        # ── Gemini LLM: Personalized Scheme Advisory ──
        ai_prompt = f"""You are a senior government scheme advisor and rural development expert specializing in Indian agricultural welfare programs.

A farmer has been assessed with the following profile and matched to government relief schemes:

Farmer Profile:
- Land Size: {land_size} acres
- Primary Crop: {crop}
- Financial Risk Level: {financial_risk}
- Disaster Risk Level: {disaster_risk}
- Previous Loan Default: {'Yes' if has_default else 'No'}

Matched Government Schemes ({len(eligible_schemes)} total):
{chr(10).join(f"- {s['name']} ({s['type']}): {s['value']}" for s in eligible_schemes)}

Write a 4-5 sentence expert advisory in simple, encouraging English that:
1. Explains in simple terms WHY this farmer qualifies for these specific programs
2. Identifies the MOST URGENT scheme they should apply for first and why
3. Explains what documents/steps are typically needed to claim the top benefit
4. Ends with an encouraging note about the government support available

Be warm, specific, and practical. Do NOT use bullet points — write in flowing paragraphs."""

        thought_process = _call_gemini(ai_prompt, fallback_thoughts)

        return {
            "eligible_schemes": eligible_schemes,
            "thought_process": thought_process,
            "is_ai_powered": is_ai_powered(),
        }


# ─────────────────────────────────────────────
# 4. Optimization Agent (OR-Tools CP-SAT — unchanged)
# ─────────────────────────────────────────────
class OptimizationAgent:
    """
    Uses Google OR-Tools CP-SAT to solve resource allocation: distributes limited relief funds
    optimally among distressed farmers to maximize risk points mitigated.
    This agent uses deterministic optimization — NOT an LLM.
    """

    def run(self, farmers_data: List[Dict[str, Any]], total_budget: float) -> Dict[str, Any]:
        """
        farmers_data elements:
        {
          "id": str,
          "name": str,
          "compound_score": float,
          "eligible_schemes": list,
          "loan_amount": float
        }
        """
        if not farmers_data:
            return {
                "total_budget": total_budget,
                "total_spent": 0.0,
                "total_mitigated_score": 0.0,
                "allocations": [],
                "thought_process": "Optimization canceled: No farmer profiles found in the registry.",
                "is_ai_powered": False,
            }

        model = cp_model.CpModel()

        # Interventions:
        # j=0: Debt Relief (moratorium): Cost = min(loan, 50k), risk mitigated = 45
        # j=1: Drip Sinchayee Setup: Cost = 20k, risk mitigated = 25
        # j=2: PM-Kisan Cash Top-up: Cost = 10k, risk mitigated = 15

        x = {}
        for i, farmer in enumerate(farmers_data):
            for j in range(3):
                x[i, j] = model.NewBoolVar(f"x_{i}_{j}")

        # Budget constraint
        total_cost_expr = []
        for i, farmer in enumerate(farmers_data):
            debt_cost = int(min(farmer.get("loan_amount", 0.0), 50000.0))
            debt_cost = max(debt_cost, 5000)
            total_cost_expr.append(x[i, 0] * debt_cost)
            total_cost_expr.append(x[i, 1] * 20000)
            total_cost_expr.append(x[i, 2] * 10000)

        model.Add(sum(total_cost_expr) <= int(total_budget))

        # Each farmer gets at most one intervention
        for i in range(len(farmers_data)):
            model.Add(sum(x[i, j] for j in range(3)) <= 1)

        # Objective: Maximize total risk points mitigated (weighted by compound score)
        total_mitigated = []
        for i, farmer in enumerate(farmers_data):
            priority_weight = int(farmer.get("compound_score", 0.0))
            total_mitigated.append(x[i, 0] * (45 * priority_weight))
            total_mitigated.append(x[i, 1] * (25 * priority_weight))
            total_mitigated.append(x[i, 2] * (15 * priority_weight))

        model.Maximize(sum(total_mitigated))

        solver = cp_model.CpSolver()
        status = solver.Solve(model)

        allocations = []
        total_spent = 0
        total_points_mitigated = 0.0

        if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
            for i, farmer in enumerate(farmers_data):
                allocated_intervention = None
                cost = 0
                risk_mitigated = 0

                if solver.Value(x[i, 0]) == 1:
                    allocated_intervention = "KCC Debt Restructuring"
                    cost = int(min(farmer.get("loan_amount", 0.0), 50000.0))
                    cost = max(cost, 5000)
                    risk_mitigated = 45
                elif solver.Value(x[i, 1]) == 1:
                    allocated_intervention = "PMKSY Drip Irrigation Subsidy"
                    cost = 20000
                    risk_mitigated = 25
                elif solver.Value(x[i, 2]) == 1:
                    allocated_intervention = "PM-Kisan Direct Cash Support"
                    cost = 10000
                    risk_mitigated = 15

                if allocated_intervention:
                    total_spent += cost
                    actual_risk_reduced = (risk_mitigated * farmer.get("compound_score", 0.0)) / 100.0
                    total_points_mitigated += actual_risk_reduced
                    allocations.append({
                        "farmer_id": farmer["id"],
                        "farmer_name": farmer["name"],
                        "intervention": allocated_intervention,
                        "cost": cost,
                        "risk_mitigated": round(actual_risk_reduced, 1),
                    })

        thoughts = "\n".join([
            "Initiating Resource Allocation CP-SAT optimizer (Google OR-Tools)...",
            f"Loaded {len(farmers_data)} vulnerable farmer profile records.",
            f"Relief Budget constraint configured at: ₹{total_budget:,.2f}.",
            "Modeling 3 intervention types: Debt Relief (₹5k–50k), Drip Irrigation (₹20k), Cash Support (₹10k).",
            f"Solver status: {solver.StatusName(status)}.",
            f"Optimal allocation: ₹{total_spent:,.2f} deployed across {len(allocations)} farmers.",
            f"Aggregated risk point reduction index achieved: {total_points_mitigated:.2f}.",
        ])

        return {
            "total_budget": total_budget,
            "total_spent": total_spent,
            "total_mitigated_score": round(total_points_mitigated, 1),
            "allocations": allocations,
            "thought_process": thoughts,
            "is_ai_powered": False,  # OR-Tools is deterministic, not an LLM
        }
