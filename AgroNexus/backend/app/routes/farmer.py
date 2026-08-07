"""
KhetSeva Farmer Routes — 3-step onboarding + dashboard + profile update.
"""

import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db import models
from app.deps import get_current_farmer
from app.services.weather import get_weather_and_disaster
from app.services.agents import GovSchemeAgent
from app.services.financial_risk import financial_risk_service
from app.services.disaster_risk import disaster_risk_service
from app.services.geocode import geocode_service
from app.services.recommendations import generate_recommendations
from app import schemas
from app.errors import OnboardingIncompleteError


def _income_band_to_bracket(band: str) -> int:
    """Convert income band string to integer bracket for ML model."""
    mapping = {"<1L": 0, "1-3L": 1, "3-5L": 2, "5L+": 3}
    return mapping.get(band, 0)


def _compute_compound_risk(financial_score: float, disaster_score: float):
    """New compound risk: 55% financial + 45% disaster."""
    compound = round(0.55 * financial_score + 0.45 * disaster_score, 1)
    if compound < 25:
        label = "Stable"
    elif compound < 50:
        label = "Watch"
    elif compound < 75:
        label = "High Risk"
    else:
        label = "Critical"
    xai = (
        f"Your compound risk is {compound}%. "
        f"Financial vulnerability contributes {round(0.55 * financial_score, 1)}% "
        f"and disaster exposure contributes {round(0.45 * disaster_score, 1)}%. "
    )
    if compound >= 75:
        xai += "Both financial fragility and environmental threats are critically elevated. Immediate action is recommended."
    elif compound >= 50:
        xai += "There is significant overlap between financial stress and weather-related hazards. Review your insurance and loan situation."
    elif compound >= 25:
        xai += "Moderate risk detected. Monitor weather forecasts closely and ensure your insurance coverage is active."
    else:
        xai += "Your current risk profile is manageable. Continue good practices."
    return {"compound_risk": compound, "label": label, "xai_explanation": xai}

router = APIRouter(prefix="/api/farmer", tags=["Farmer"])


# ─────────────────────────────────────────────
# Onboarding Step 2: Farm Details
# ─────────────────────────────────────────────

@router.post("/onboarding/2")
def onboarding_step2(
    data: schemas.OnboardingStep2,
    current_user: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db),
):
    """Save farm & agriculture details (Step 2 of signup wizard)."""
    farm = db.query(models.FarmDetails).filter(
        models.FarmDetails.farmer_id == current_user.id
    ).first()

    if not farm:
        farm = models.FarmDetails(farmer_id=current_user.id)
        db.add(farm)

    farm.land_size_acres = data.land_size_acres
    farm.ownership_type = data.ownership_type
    farm.crops = data.crops
    farm.crop_season = data.crop_season
    farm.irrigation_source = data.irrigation_source
    farm.soil_type = data.soil_type
    farm.experience_years = data.experience_years

    db.commit()
    return {"message": "Farm details saved", "step": 2}


# ─────────────────────────────────────────────
# Onboarding Step 3: Financial Details + Run All Agents
# ─────────────────────────────────────────────

@router.post("/onboarding/3")
def onboarding_step3(
    data: schemas.OnboardingStep3,
    current_user: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db),
):
    """
    Save financial background (Step 3), then trigger the full risk pipeline:
    1. Financial Agent (scorecard)
    2. Weather + Disaster Agent (Open-Meteo)
    3. Compound Risk Engine
    4. Government Scheme matching
    5. Recommendations
    All results stored in risk_scores for historical tracking.
    """
    # Save financial details
    fin = db.query(models.FinancialDetails).filter(
        models.FinancialDetails.farmer_id == current_user.id
    ).first()

    if not fin:
        fin = models.FinancialDetails(farmer_id=current_user.id)
        db.add(fin)

    fin.loan_amount = data.loan_amount
    fin.loan_source = data.loan_source
    fin.has_insurance = data.has_insurance
    fin.insurance_scheme = data.insurance_scheme
    fin.income_band = data.income_band
    fin.past_crop_loss = data.past_crop_loss
    fin.dependents = data.dependents

    db.flush()  # Ensure fin is saved before we read it

    # Get farm details for crop info
    farm = db.query(models.FarmDetails).filter(
        models.FarmDetails.farmer_id == current_user.id
    ).first()

    if not farm:
        raise OnboardingIncompleteError("Step 2 (farm details)")

    crop = farm.crops.split(",")[0].strip() if farm.crops else "Rice"

    # ── New ML Financial Risk ──
    income_bracket = _income_band_to_bracket(fin.income_band)
    fin_result = financial_risk_service.calculate_risk(
        loan_amount=fin.loan_amount or 0,
        land_acres=farm.land_size_acres,
        has_insurance=fin.has_insurance,
        has_recent_loss=fin.past_crop_loss,
        income_bracket=income_bracket,
    )
    fin_score = fin_result["financial_risk_score"]
    fin_band = fin_result["risk_band"]

    # ── New Weather-Based Disaster Risk ──
    lat = current_user.latitude or 28.61
    lon = current_user.longitude or 77.20

    # Try geocoding from pincode if no coords
    if not current_user.latitude or not current_user.longitude:
        try:
            loc = geocode_service.resolve_pincode(db, current_user.pin_code)
            lat = loc["latitude"]
            lon = loc["longitude"]
            current_user.latitude = lat
            current_user.longitude = lon
        except Exception:
            pass  # Fall back to default Delhi coords

    try:
        dis_result = disaster_risk_service.calculate_hazard_scores(lat, lon)
    except Exception:
        dis_result = {"disaster_risk_score": 0, "dominant_hazard": "unknown", "breakdown": {"flood": 0, "drought": 0, "storm": 0, "frost_or_heat": 0}}
    dis_score = dis_result["disaster_risk_score"]

    # ── Compound Risk ──
    compound = _compute_compound_risk(fin_score, dis_score)

    # Build factors for backward-compatible JSON storage
    fin_factors = [
        {"factor": f"Loan Amount: Rs.{fin.loan_amount or 0:,.0f}", "points": round(fin_score * 0.3, 1)},
        {"factor": f"Land: {farm.land_size_acres} acres", "points": round(-1.2 * farm.land_size_acres, 1)},
        {"factor": f"Insurance: {'Yes' if fin.has_insurance else 'No'}", "points": -13 if fin.has_insurance else 13},
        {"factor": f"Recent Loss: {'Yes' if fin.past_crop_loss else 'No'}", "points": 18 if fin.past_crop_loss else 0},
        {"factor": f"Income Band: {fin.income_band}", "points": round(-6.7 * income_bracket, 1)},
    ]
    dis_signals = dis_result["breakdown"]
    dis_signals["dominant_hazard"] = dis_result["dominant_hazard"]

    # Map to risk levels for scheme matching
    fin_risk_level = "High" if fin_score >= 50 else ("Medium" if fin_score >= 25 else "Low")
    dis_risk_level = "High" if dis_score >= 50 else ("Medium" if dis_score >= 25 else "Low")

    # ── Government Schemes ──
    scheme_agent = GovSchemeAgent()
    schemes = scheme_agent.run(
        land_size_acres=farm.land_size_acres,
        ownership_type=farm.ownership_type,
        has_insurance=fin.has_insurance,
        loan_source=fin.loan_source,
        income_band=fin.income_band,
        past_crop_loss=fin.past_crop_loss,
        financial_risk_level=fin_risk_level,
        disaster_risk_level=dis_risk_level,
        crop=crop,
    )

    # ── Recommendations ──
    # Build a disaster_signals dict compatible with old recommendation format
    compat_disaster_signals = {
        "disaster_risk": dis_score,
        "drought_signal": dis_result["breakdown"].get("drought", 0),
        "flood_signal": dis_result["breakdown"].get("flood", 0),
        "heat_signal": dis_result["breakdown"].get("frost_or_heat", 0),
        "hazard_type": dis_result["dominant_hazard"],
        "forecast_total_mm": 0,
        "seasonal_normal_mm": 0,
        "rainfall_ratio": 1.0,
        "max_consecutive_hot_days": 0,
        "crop_heat_threshold": 36,
    }
    recs = generate_recommendations(
        financial_risk=fin_score,
        disaster_risk=dis_score,
        compound_risk=compound["compound_risk"],
        compound_label=compound["label"],
        has_insurance=fin.has_insurance,
        loan_source=fin.loan_source,
        land_size_acres=farm.land_size_acres,
        income_band=fin.income_band,
        past_crop_loss=fin.past_crop_loss,
        ownership_type=farm.ownership_type,
        disaster_signals=compat_disaster_signals,
        crop=crop,
    )

    # ── Store Risk Score (historical) ──
    risk_record = models.RiskScore(
        farmer_id=current_user.id,
        financial_risk=fin_score,
        disaster_risk=dis_score,
        compound_risk=compound["compound_risk"],
        compound_label=compound["label"],
        xai_explanation=compound["xai_explanation"],
        financial_factors_json=json.dumps(fin_factors),
        disaster_factors_json=json.dumps(dis_signals),
        eligible_schemes_json=json.dumps(schemes),
    )
    db.add(risk_record)

    # ── Store Recommendations ──
    for rec in recs:
        db.add(models.RecommendationLog(
            farmer_id=current_user.id,
            recommendation_text=rec["text"],
            category=rec["category"],
            priority=rec["priority"],
        ))

    db.commit()
    db.refresh(risk_record)

    return {
        "message": "Profile complete — risk analysis computed (ML + Weather model)",
        "step": 3,
        "risk_score_id": risk_record.id,
        "compound_risk": compound,
        "financial_risk": {"risk_score": fin_score, "risk_band": fin_band, "factors": fin_factors},
        "disaster_risk": {"risk_score": dis_score, "breakdown": dis_result["breakdown"], "dominant_hazard": dis_result["dominant_hazard"]},
    }


# ─────────────────────────────────────────────
# Dashboard
# ─────────────────────────────────────────────

@router.get("/dashboard", response_model=schemas.DashboardResponse)
def get_dashboard(
    current_user: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db),
):
    """Full dashboard data for the logged-in farmer."""
    farm = db.query(models.FarmDetails).filter(
        models.FarmDetails.farmer_id == current_user.id
    ).first()

    fin = db.query(models.FinancialDetails).filter(
        models.FinancialDetails.farmer_id == current_user.id
    ).first()

    # Get risk history (most recent first)
    risk_history = db.query(models.RiskScore).filter(
        models.RiskScore.farmer_id == current_user.id
    ).order_by(models.RiskScore.computed_at.desc()).limit(20).all()

    latest_risk = risk_history[0] if risk_history else None

    # Parse recommendations from latest risk computation
    recommendations = []
    eligible_schemes = []
    if latest_risk:
        # Get recent recommendations
        recent_recs = db.query(models.RecommendationLog).filter(
            models.RecommendationLog.farmer_id == current_user.id
        ).order_by(models.RecommendationLog.created_at.desc()).limit(15).all()

        for rec in recent_recs:
            recommendations.append(schemas.RecommendationItem(
                text=rec.recommendation_text,
                category=rec.category or "general",
                priority=rec.priority or "informational",
            ))

        # Parse eligible schemes from JSON
        if latest_risk.eligible_schemes_json:
            try:
                raw_schemes = json.loads(latest_risk.eligible_schemes_json)
                for s in raw_schemes:
                    eligible_schemes.append(schemas.EligibleScheme(
                        name=s.get("name", ""),
                        benefit=s.get("benefit", ""),
                        status=s.get("status", ""),
                        reason=s.get("reason", ""),
                        apply_url=s.get("apply_url"),
                    ))
            except Exception:
                pass

    # Fetch live weather forecast for the chart
    forecast_data = None
    if current_user.latitude and current_user.longitude:
        crop = farm.crops.split(",")[0].strip() if farm and farm.crops else "Rice"
        weather = get_weather_and_disaster(
            current_user.latitude, current_user.longitude,
            current_user.pin_code, crop
        )
        forecast_data = weather.get("forecast")

    return schemas.DashboardResponse(
        farmer=current_user,
        farm_details=farm,
        financial_details=fin,
        latest_risk=latest_risk,
        risk_history=risk_history,
        recommendations=recommendations,
        eligible_schemes=eligible_schemes,
        forecast_data=forecast_data,
    )


# ─────────────────────────────────────────────
# Profile (read)
# ─────────────────────────────────────────────

@router.get("/profile")
def get_profile(
    current_user: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db),
):
    """Return farmer's full profile for viewing."""
    farm = db.query(models.FarmDetails).filter(
        models.FarmDetails.farmer_id == current_user.id
    ).first()

    fin = db.query(models.FinancialDetails).filter(
        models.FinancialDetails.farmer_id == current_user.id
    ).first()

    return {
        "farmer": schemas.FarmerResponse.model_validate(current_user),
        "farm_details": schemas.FarmDetailsResponse.model_validate(farm) if farm else None,
        "financial_details": schemas.FinancialDetailsResponse.model_validate(fin) if fin else None,
    }


# ─────────────────────────────────────────────
# Profile Update (edit)
# ─────────────────────────────────────────────

@router.put("/profile")
def update_profile(
    data: schemas.ProfileUpdate,
    current_user: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db),
):
    """Update farmer's profile. Accepts partial updates for identity, farm, and financial data."""
    updated_sections = []

    # ── Update identity & location ──
    if data.identity:
        d = data.identity
        if d.full_name is not None:
            current_user.full_name = d.full_name
        if d.pin_code is not None:
            current_user.pin_code = d.pin_code
        if d.latitude is not None:
            current_user.latitude = d.latitude
        if d.longitude is not None:
            current_user.longitude = d.longitude
        updated_sections.append("identity")

    # ── Update farm details ──
    if data.farm:
        farm = db.query(models.FarmDetails).filter(
            models.FarmDetails.farmer_id == current_user.id
        ).first()
        if not farm:
            farm = models.FarmDetails(farmer_id=current_user.id)
            db.add(farm)

        d = data.farm
        if d.land_size_acres is not None:
            farm.land_size_acres = d.land_size_acres
        if d.ownership_type is not None:
            farm.ownership_type = d.ownership_type
        if d.crops is not None:
            farm.crops = d.crops
        if d.crop_season is not None:
            farm.crop_season = d.crop_season
        if d.irrigation_source is not None:
            farm.irrigation_source = d.irrigation_source
        if d.soil_type is not None:
            farm.soil_type = d.soil_type
        if d.experience_years is not None:
            farm.experience_years = d.experience_years
        updated_sections.append("farm")

    # ── Update financial details ──
    if data.financial:
        fin = db.query(models.FinancialDetails).filter(
            models.FinancialDetails.farmer_id == current_user.id
        ).first()
        if not fin:
            fin = models.FinancialDetails(farmer_id=current_user.id)
            db.add(fin)

        d = data.financial
        if d.loan_amount is not None:
            fin.loan_amount = d.loan_amount
        if d.loan_source is not None:
            fin.loan_source = d.loan_source
        if d.has_insurance is not None:
            fin.has_insurance = d.has_insurance
        if d.insurance_scheme is not None:
            fin.insurance_scheme = d.insurance_scheme
        if d.income_band is not None:
            fin.income_band = d.income_band
        if d.past_crop_loss is not None:
            fin.past_crop_loss = d.past_crop_loss
        if d.dependents is not None:
            fin.dependents = d.dependents
        updated_sections.append("financial")

    if not updated_sections:
        raise HTTPException(status_code=400, detail="No update data provided.")

    db.commit()

    return {
        "message": f"Profile updated: {', '.join(updated_sections)}",
        "updated_sections": updated_sections,
    }


# ─────────────────────────────────────────────
# Recompute Risk (re-run all agents)
# ─────────────────────────────────────────────

@router.post("/recompute")
def recompute_risk(
    current_user: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db),
):
    """Re-run all agents and store a new risk_scores entry. Used for trend tracking."""
    farm = db.query(models.FarmDetails).filter(
        models.FarmDetails.farmer_id == current_user.id
    ).first()
    fin = db.query(models.FinancialDetails).filter(
        models.FinancialDetails.farmer_id == current_user.id
    ).first()

    if not farm or not fin:
        raise HTTPException(status_code=400, detail="Complete onboarding first.")

    crop = farm.crops.split(",")[0].strip() if farm.crops else "Rice"

    # ── New ML Financial Risk ──
    income_bracket = _income_band_to_bracket(fin.income_band)
    fin_result = financial_risk_service.calculate_risk(
        loan_amount=fin.loan_amount or 0,
        land_acres=farm.land_size_acres,
        has_insurance=fin.has_insurance,
        has_recent_loss=fin.past_crop_loss,
        income_bracket=income_bracket,
    )
    fin_score = fin_result["financial_risk_score"]

    # ── New Weather-Based Disaster Risk ──
    lat = current_user.latitude or 28.61
    lon = current_user.longitude or 77.20
    if not current_user.latitude or not current_user.longitude:
        try:
            loc = geocode_service.resolve_pincode(db, current_user.pin_code)
            lat = loc["latitude"]
            lon = loc["longitude"]
            current_user.latitude = lat
            current_user.longitude = lon
        except Exception:
            pass

    try:
        dis_result = disaster_risk_service.calculate_hazard_scores(lat, lon)
    except Exception:
        dis_result = {"disaster_risk_score": 0, "dominant_hazard": "unknown", "breakdown": {"flood": 0, "drought": 0, "storm": 0, "frost_or_heat": 0}}
    dis_score = dis_result["disaster_risk_score"]

    compound = _compute_compound_risk(fin_score, dis_score)

    fin_factors = [
        {"factor": f"Loan Amount: Rs.{fin.loan_amount or 0:,.0f}", "points": round(fin_score * 0.3, 1)},
        {"factor": f"Land: {farm.land_size_acres} acres", "points": round(-1.2 * farm.land_size_acres, 1)},
        {"factor": f"Insurance: {'Yes' if fin.has_insurance else 'No'}", "points": -13 if fin.has_insurance else 13},
        {"factor": f"Recent Loss: {'Yes' if fin.past_crop_loss else 'No'}", "points": 18 if fin.past_crop_loss else 0},
        {"factor": f"Income Band: {fin.income_band}", "points": round(-6.7 * income_bracket, 1)},
    ]
    dis_signals = dis_result["breakdown"]
    dis_signals["dominant_hazard"] = dis_result["dominant_hazard"]

    fin_risk_level = "High" if fin_score >= 50 else ("Medium" if fin_score >= 25 else "Low")
    dis_risk_level = "High" if dis_score >= 50 else ("Medium" if dis_score >= 25 else "Low")

    scheme_agent = GovSchemeAgent()
    schemes = scheme_agent.run(
        land_size_acres=farm.land_size_acres, ownership_type=farm.ownership_type,
        has_insurance=fin.has_insurance, loan_source=fin.loan_source,
        income_band=fin.income_band, past_crop_loss=fin.past_crop_loss,
        financial_risk_level=fin_risk_level,
        disaster_risk_level=dis_risk_level, crop=crop,
    )

    risk_record = models.RiskScore(
        farmer_id=current_user.id,
        financial_risk=fin_score,
        disaster_risk=dis_score,
        compound_risk=compound["compound_risk"],
        compound_label=compound["label"],
        xai_explanation=compound["xai_explanation"],
        financial_factors_json=json.dumps(fin_factors),
        disaster_factors_json=json.dumps(dis_signals),
        eligible_schemes_json=json.dumps(schemes),
    )
    db.add(risk_record)
    db.commit()
    db.refresh(risk_record)

    return {
        "message": "Risk recomputed (ML + Weather model)",
        "compound_risk": compound,
        "financial_risk": {"risk_score": fin_score, "risk_band": fin_result["risk_band"]},
        "disaster_risk": {"risk_score": dis_score, "breakdown": dis_result["breakdown"], "dominant_hazard": dis_result["dominant_hazard"]},
    }
