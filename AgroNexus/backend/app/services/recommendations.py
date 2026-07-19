"""
KhetSeva Recommendations Engine — Rule table mapping risk factors to concrete actions.
"""

from typing import Dict, Any, List


def generate_recommendations(
    financial_risk: float,
    disaster_risk: float,
    compound_risk: float,
    compound_label: str,
    has_insurance: bool,
    loan_source: str,
    land_size_acres: float,
    income_band: str,
    past_crop_loss: bool,
    ownership_type: str,
    disaster_signals: Dict[str, Any],
    crop: str = "",
) -> List[Dict[str, str]]:
    """
    Generate actionable recommendations based on which specific risk factors are elevated.
    Returns a list of {text, category, priority} items.
    """
    recs = []
    drought = disaster_signals.get("drought_signal", 0)
    flood = disaster_signals.get("flood_signal", 0)
    heat = disaster_signals.get("heat_signal", 0)

    # ── Critical compound risk ──
    if compound_label == "Critical":
        recs.append({
            "text": "⚠️ URGENT: Your combined financial and disaster risk is critical. Contact your nearest Krishi Vigyan Kendra (KVK) or district agriculture office immediately for emergency relief assessment.",
            "category": "general",
            "priority": "urgent",
        })

    # ── High financial risk + no insurance ──
    if financial_risk >= 40 and not has_insurance:
        recs.append({
            "text": "Enroll in Pradhan Mantri Fasal Bima Yojana (PMFBY) immediately. Your premium is subsidized at just 1.5-2% of sum insured. This is the single most impactful step to protect against crop loss.",
            "category": "financial",
            "priority": "urgent",
        })

    # ── Moneylender debt ──
    if loan_source == "moneylender":
        recs.append({
            "text": "You're borrowing from an informal moneylender — this significantly increases your financial vulnerability. Apply for a Kisan Credit Card (KCC) to restructure debt at just 4% interest through a formal bank.",
            "category": "financial",
            "priority": "urgent",
        })

    # ── Marginal land + low income ──
    land_ha = land_size_acres * 0.4047
    if land_ha <= 2.0 and income_band in ["<1L", "1-3L"]:
        recs.append({
            "text": "Check your PM-KISAN enrollment status. As a small/marginal farmer, you're eligible for ₹6,000/year direct benefit transfer. Visit pmkisan.gov.in or your local CSC.",
            "category": "scheme",
            "priority": "recommended",
        })

    # ── High drought signal ──
    if drought >= 50:
        recs.append({
            "text": f"Drought warning: 15-day rainfall forecast is significantly below seasonal normal. Consider water conservation measures, mulching, and evaluate switching to drought-resistant seed varieties for next season.",
            "category": "disaster",
            "priority": "urgent" if drought >= 75 else "recommended",
        })

    # ── High flood signal ──
    if flood >= 50:
        recs.append({
            "text": "Flood alert: Heavy rainfall expected in the next 3 days. If crop is near harvest, consider early harvesting. Prepare flood-specific insurance claim documentation. Move stored produce to higher ground.",
            "category": "disaster",
            "priority": "urgent" if flood >= 75 else "recommended",
        })

    # ── Heat stress ──
    if heat >= 50:
        recs.append({
            "text": f"Heat stress warning: Multiple consecutive days above the critical temperature for your crop are forecast. Consider protective irrigation scheduling and evaluate heat-tolerant crop varieties.",
            "category": "disaster",
            "priority": "recommended",
        })

    # ── Past crop loss ──
    if past_crop_loss and not has_insurance:
        recs.append({
            "text": "You've experienced crop loss in the last 2 seasons and still lack insurance. This is a high-priority action: enroll in PMFBY before the next season cutoff date.",
            "category": "financial",
            "priority": "urgent",
        })

    # ── Sharecropper/leased land ──
    if ownership_type in ["leased", "sharecropper"]:
        recs.append({
            "text": "As a tenant farmer, ensure your lease agreement is documented. This is required for KCC, PMFBY, and other scheme applications. Contact your local Patwari office.",
            "category": "financial",
            "priority": "recommended",
        })

    # ── General soil health ──
    recs.append({
        "text": "Get a free Soil Health Card from your nearest agricultural office. It provides nutrient-specific fertilizer recommendations that can improve yield by 10-15% and reduce input costs.",
        "category": "scheme",
        "priority": "informational",
    })

    # ── Water-intensive crops ──
    if crop in ["Rice", "Rice (Paddy)", "Sugarcane", "Cotton"] and drought >= 30:
        recs.append({
            "text": f"Your crop '{crop}' is water-intensive and drought indicators are elevated. Explore PMKSY micro-irrigation subsidies (80% government-funded) to reduce water dependency.",
            "category": "disaster",
            "priority": "recommended",
        })

    return recs
