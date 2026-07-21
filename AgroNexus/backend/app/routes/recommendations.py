"""
KhetSeva Recommendations Route.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db import models
from app.deps import get_current_farmer
from app.services.weather import get_weather_and_disaster
from app.services.agents import FinancialAgent, DisasterAgent, compute_compound_risk
from app.services.recommendations import generate_recommendations
from app.errors import OnboardingIncompleteError

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])


@router.get("/")
def get_recommendations(
    current_user: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db),
):
    """Generate fresh recommendations based on current risk profile."""
    farm = db.query(models.FarmDetails).filter(
        models.FarmDetails.farmer_id == current_user.id
    ).first()
    fin = db.query(models.FinancialDetails).filter(
        models.FinancialDetails.farmer_id == current_user.id
    ).first()

    if not farm or not fin:
        raise OnboardingIncompleteError("onboarding")

    crop = farm.crops.split(",")[0].strip() if farm.crops else "Rice"

    # Run agents for current data
    fin_agent = FinancialAgent()
    fin_result = fin_agent.run(
        has_insurance=fin.has_insurance, loan_source=fin.loan_source,
        land_size_acres=farm.land_size_acres, ownership_type=farm.ownership_type,
        past_crop_loss=fin.past_crop_loss, dependents=fin.dependents,
        income_band=fin.income_band, crop=crop,
    )

    lat = current_user.latitude or 28.61
    lon = current_user.longitude or 77.20
    weather_data = get_weather_and_disaster(lat, lon, current_user.pin_code, crop)

    dis_agent = DisasterAgent()
    dis_result = dis_agent.run(weather_data["disaster"], crop)

    compound = compute_compound_risk(fin_result["risk_score"], dis_result["risk_score"])

    recs = generate_recommendations(
        financial_risk=fin_result["risk_score"],
        disaster_risk=dis_result["risk_score"],
        compound_risk=compound["compound_risk"],
        compound_label=compound["label"],
        has_insurance=fin.has_insurance,
        loan_source=fin.loan_source,
        land_size_acres=farm.land_size_acres,
        income_band=fin.income_band,
        past_crop_loss=fin.past_crop_loss,
        ownership_type=farm.ownership_type,
        disaster_signals=weather_data["disaster"],
        crop=crop,
    )

    return {
        "recommendations": recs,
        "compound_risk": compound,
    }
