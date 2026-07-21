"""
KhetSeva AI Chatbot Route — Context-aware agricultural advisory chatbot.
Uses the farmer's profile, risk data, and farm details to provide
personalized advice via Gemini 2.0 Flash.
"""

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.db import models
from app.deps import get_current_farmer
from app.services.agents import _call_gemini, is_ai_powered

router = APIRouter(prefix="/api/chatbot", tags=["Chatbot"])


class ChatRequest(BaseModel):
    message: str
    conversation_history: list = []
    language: str = "en"


class ChatResponse(BaseModel):
    reply: str
    ai_powered: bool


@router.post("/ask", response_model=ChatResponse)
def chatbot_ask(
    req: ChatRequest,
    current_user: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db),
):
    """
    AI-powered agricultural advisory chatbot.
    Sends the farmer's context (profile, risk scores, farm details)
    along with the user's question to Gemini for a personalized response.
    """
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # ── Gather ALL farmer data from every table ──
    farm = db.query(models.FarmDetails).filter(
        models.FarmDetails.farmer_id == current_user.id
    ).first()

    financial = db.query(models.FinancialDetails).filter(
        models.FinancialDetails.farmer_id == current_user.id
    ).first()

    latest_risk = db.query(models.RiskScore).filter(
        models.RiskScore.farmer_id == current_user.id
    ).order_by(models.RiskScore.computed_at.desc()).first()

    # Get recent recommendations
    recommendations = db.query(models.RecommendationLog).filter(
        models.RecommendationLog.farmer_id == current_user.id
    ).order_by(models.RecommendationLog.created_at.desc()).limit(5).all()

    # ── Build COMPREHENSIVE context with every available field ──
    context_parts = []

    # Section 1: Identity & Location (from Farmer table)
    context_parts.append("═══ IDENTITY & LOCATION ═══")
    context_parts.append(f"Full Name: {current_user.full_name}")
    context_parts.append(f"Phone Number: {current_user.phone_number}")
    context_parts.append(f"PIN Code: {current_user.pin_code}")
    context_parts.append(f"GPS Coordinates: {current_user.latitude}°N, {current_user.longitude}°E")
    context_parts.append(f"Registered On: {current_user.created_at.strftime('%d %B %Y') if current_user.created_at else 'N/A'}")

    # Section 2: Farm & Agriculture (from FarmDetails table)
    if farm:
        context_parts.append("\n═══ FARM & AGRICULTURE ═══")
        context_parts.append(f"Land Size: {farm.land_size_acres} acres ({round(farm.land_size_acres * 0.4047, 2)} hectares)")
        context_parts.append(f"Ownership Type: {farm.ownership_type}")
        context_parts.append(f"Crops Grown: {farm.crops}")
        context_parts.append(f"Crop Season: {farm.crop_season or 'Not specified'}")
        context_parts.append(f"Irrigation Source: {farm.irrigation_source}")
        context_parts.append(f"Soil Type: {farm.soil_type or 'Not specified'}")
        context_parts.append(f"Farming Experience: {farm.experience_years or 'Not specified'} years")
    else:
        context_parts.append("\n═══ FARM DETAILS: Not yet provided ═══")

    # Section 3: Financial Details (from FinancialDetails table)
    if financial:
        context_parts.append("\n═══ FINANCIAL DETAILS ═══")
        context_parts.append(f"Loan Amount: ₹{financial.loan_amount:,.0f}" if financial.loan_amount else "Loan Amount: None")
        context_parts.append(f"Loan Source: {financial.loan_source}")
        context_parts.append(f"Has Crop Insurance: {'Yes' if financial.has_insurance else 'No'}")
        context_parts.append(f"Insurance Scheme: {financial.insurance_scheme or 'None'}")
        context_parts.append(f"Annual Income Band: {financial.income_band}")
        context_parts.append(f"Past Crop Loss (last 2 seasons): {'Yes' if financial.past_crop_loss else 'No'}")
        context_parts.append(f"Number of Dependents: {financial.dependents}")
    else:
        context_parts.append("\n═══ FINANCIAL DETAILS: Not yet provided ═══")

    # Section 4: Risk Assessment (from RiskScore table)
    if latest_risk:
        context_parts.append("\n═══ RISK ASSESSMENT (Latest) ═══")
        context_parts.append(f"Financial Risk Score: {latest_risk.financial_risk}/100")
        context_parts.append(f"Disaster Risk Score: {latest_risk.disaster_risk}/100")
        context_parts.append(f"Compound Risk: {latest_risk.compound_risk}% — {latest_risk.compound_label}")
        context_parts.append(f"XAI Explanation: {latest_risk.xai_explanation or 'N/A'}")
        context_parts.append(f"Computed At: {latest_risk.computed_at.strftime('%d %B %Y, %I:%M %p') if latest_risk.computed_at else 'N/A'}")

        # Financial scorecard breakdown
        if latest_risk.financial_factors_json:
            try:
                factors = json.loads(latest_risk.financial_factors_json)
                if isinstance(factors, list):
                    context_parts.append("\nFinancial Scorecard Breakdown:")
                    for f in factors:
                        context_parts.append(f"  • {f.get('factor', 'Unknown')}: +{f.get('points', 0)} pts")
            except Exception:
                pass

        # Disaster signal breakdown
        if latest_risk.disaster_factors_json:
            try:
                signals = json.loads(latest_risk.disaster_factors_json)
                if isinstance(signals, dict):
                    context_parts.append("\nDisaster Signals:")
                    context_parts.append(f"  • Hazard Type: {signals.get('hazard_type', 'N/A')}")
                    context_parts.append(f"  • Drought Signal: {signals.get('drought_signal', 0)}%")
                    context_parts.append(f"  • Flood Signal: {signals.get('flood_signal', 0)}%")
                    context_parts.append(f"  • Heat Stress Signal: {signals.get('heat_signal', 0)}%")
                    context_parts.append(f"  • Forecast Rainfall (15-day): {signals.get('forecast_total_mm', 'N/A')} mm")
                    context_parts.append(f"  • Seasonal Normal Rainfall: {signals.get('seasonal_normal_mm', 'N/A')} mm")
            except Exception:
                pass

        # Eligible government schemes
        if latest_risk.eligible_schemes_json:
            try:
                schemes = json.loads(latest_risk.eligible_schemes_json)
                if isinstance(schemes, list) and schemes:
                    context_parts.append("\nEligible Government Schemes:")
                    for s in schemes:
                        status = s.get('status', '')
                        context_parts.append(f"  • {s.get('name', 'Unknown')}: {status} — {s.get('benefit', '')}")
            except Exception:
                pass
    else:
        context_parts.append("\n═══ RISK ASSESSMENT: Not yet computed ═══")

    # Section 5: Active Recommendations
    if recommendations:
        context_parts.append("\n═══ ACTIVE RECOMMENDATIONS ═══")
        for rec in recommendations:
            priority_tag = f"[{rec.priority.upper()}]" if rec.priority else ""
            context_parts.append(f"  {priority_tag} {rec.recommendation_text}")

    farmer_context = "\n".join(context_parts)

    # Build conversation history for multi-turn
    history_text = ""
    for msg in req.conversation_history[-6:]:
        role = msg.get("role", "user")
        content = msg.get("content", "")
        history_text += f"\n{role.upper()}: {content}"

    lang_instruction = (
        "CRITICAL LANGUAGE RULE: The user has chosen MARATHI (मराठी). You MUST write your entire response in clear, fluent, natural MARATHI (देवनागरी स्क्रिप्ट / मराठी भाषा)."
        if req.language == "mr"
        else "Language: Respond in English."
    )

    # Build the prompt with rich context
    system_prompt = f"""You are KhetSeva AI Assistant (कृषि सहायक), a smart and friendly AI assistant for Indian farmers.
You have COMPLETE access to this farmer's profile, farm data, financial details, risk scores, and recommendations.
USE THIS DATA in your responses — reference their name, crops, risk scores, location, loan details, etc. by name.

{lang_instruction}

You are a GENERAL-PURPOSE assistant who can answer ANY question — not just farming topics.
You can help with:
- Crop management, pest control, soil health
- Weather preparedness and disaster mitigation
- Government schemes (PM-KISAN, PMFBY, KCC, PM-KMY, e-NAM, Soil Health Card, PMKSY)
- Financial planning and loan guidance
- Market prices and selling strategies
- Risk reduction strategies
- The farmer's personal profile and data
- General knowledge questions (geography, science, math, history, etc.)
- Any other topic the farmer asks about

══════════════════════════════════════
COMPLETE FARMER DATA (from database):
══════════════════════════════════════
{farmer_context}
══════════════════════════════════════

CRITICAL GUIDELINES:
- Keep ALL answers SHORT, CRISP, AND CONCISE (maximum 2-3 short bullet points or 1-2 brief sentences).
- Give direct answers immediately without unnecessary intro or outro fluff.
- You can answer ANY question (farming, general knowledge, math, science, etc.).
- For farmer profile, risk, or scheme questions, use the exact values from the database context above.
- Whenever relevant, include a 1-line website navigation tip directing the user to the exact page in this web app (e.g., 📍 *Go to **Govt Schemes** or **Financials** from the top menu*).
- Format responses cleanly with bold key terms for instant readability.

CONVERSATION HISTORY:{history_text}

FARMER'S QUESTION: {req.message}

Provide a short, direct, and concise response:"""

    # Fallback response if Gemini is not available
    fallback = _generate_rule_based_response(req.message, farm, financial, latest_risk)

    reply = _call_gemini(system_prompt, fallback)

    return ChatResponse(
        reply=reply,
        ai_powered=is_ai_powered(),
    )


def _generate_rule_based_response(
    message: str,
    farm,
    financial,
    latest_risk,
) -> str:
    """Generate a basic rule-based response when Gemini is unavailable."""
    msg_lower = message.lower()

    if any(w in msg_lower for w in ["scheme", "yojana", "government", "pm-kisan", "pmfby", "subsidy"]):
        return (
            "Here are some key government schemes you may be eligible for:\n\n"
            "• **PM-KISAN**: ₹6,000/year for small & marginal farmers\n"
            "• **PMFBY**: Crop insurance at subsidized premium (1.5-5%)\n"
            "• **KCC**: Kisan Credit Card — crop loan up to ₹3L at ~4% interest\n"
            "• **PM-KUSUM**: Solar pump & micro-irrigation subsidy\n\n"
            "Visit your nearest CSC center or bank branch to apply. "
            "You can also check your eligibility on the Government Schemes page in this app."
        )

    if any(w in msg_lower for w in ["risk", "score", "danger", "crisis", "alert"]):
        if latest_risk:
            return (
                f"Your current risk assessment:\n\n"
                f"• **Financial Risk**: {latest_risk.financial_risk}/100\n"
                f"• **Disaster Risk**: {latest_risk.disaster_risk}/100\n"
                f"• **Compound Risk**: {latest_risk.compound_risk}% ({latest_risk.compound_label})\n\n"
                f"{'⚠️ Your risk is elevated. Please review the Recommendations page for urgent actions.' if latest_risk.compound_risk >= 65 else 'Your risk is manageable. Keep monitoring and follow the recommendations.'}"
            )
        return "Your risk scores haven't been computed yet. Please complete your profile and click 'Refresh Risk' on the dashboard."

    if any(w in msg_lower for w in ["weather", "rain", "drought", "flood", "temperature", "forecast"]):
        return (
            "For the latest weather forecast specific to your location, check the **Disaster Score** page.\n\n"
            "General tips:\n"
            "• Monitor IMD forecasts at mausam.imd.gov.in\n"
            "• For drought: consider drip irrigation and mulching\n"
            "• For flood: ensure proper drainage channels\n"
            "• For heat: use shade nets and increase irrigation frequency"
        )

    if any(w in msg_lower for w in ["crop", "sow", "plant", "harvest", "seed"]):
        crop_name = farm.crops if farm else "your crop"
        return (
            f"For **{crop_name}**, here are some general tips:\n\n"
            "• Follow recommended sowing dates for your agro-climatic zone\n"
            "• Use certified seeds from authorized dealers\n"
            "• Get your soil tested (free under Soil Health Card scheme)\n"
            "• Apply fertilizers based on soil test recommendations\n"
            "• Monitor for pests regularly and use IPM practices\n\n"
            "Visit your local Krishi Vigyan Kendra (KVK) for crop-specific guidance."
        )

    if any(w in msg_lower for w in ["loan", "credit", "debt", "money", "finance", "bank"]):
        return (
            "Financial tips for farmers:\n\n"
            "• **KCC (Kisan Credit Card)**: Get crop loans at ~4% interest — much cheaper than moneylenders\n"
            "• **Crop Insurance (PMFBY)**: Protect against losses at just 1.5-5% premium\n"
            "• **PM-KISAN**: ₹6,000/year direct benefit transfer\n"
            "• Avoid informal moneylenders — their high interest increases financial risk\n\n"
            "Check the **Financial Solutions** page for personalized optimization."
        )

    # Default response
    return (
        "Namaste! I'm KhetSeva AI Assistant 🌾\n\n"
        "I can help you with:\n"
        "• **Government Schemes** — PM-KISAN, PMFBY, KCC eligibility\n"
        "• **Risk Assessment** — Understanding your financial & disaster risk\n"
        "• **Crop Advice** — Sowing, pest control, harvest tips\n"
        "• **Weather** — Forecast and preparedness\n"
        "• **Financial Guidance** — Loans, insurance, savings\n\n"
        "Ask me anything about farming, and I'll do my best to help! 🙏"
    )
