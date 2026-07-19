"""
KhetSeva Risk Routes — per-farmer risk endpoints.
"""

import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db import models
from app.services.auth import decode_access_token
from app.services.weather import get_weather_and_disaster
from app.services.agents import FinancialAgent, DisasterAgent, compute_compound_risk
from app import schemas

router = APIRouter(prefix="/api/risk", tags=["Risk"])

security = HTTPBearer()


def get_current_farmer(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> models.Farmer:
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    farmer = db.query(models.Farmer).filter(models.Farmer.id == payload["sub"]).first()
    if not farmer:
        raise HTTPException(status_code=401, detail="Farmer not found")
    return farmer


@router.get("/financial")
def get_financial_risk(
    current_user: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db),
):
    """Return financial risk scorecard breakdown for the logged-in farmer."""
    farm = db.query(models.FarmDetails).filter(
        models.FarmDetails.farmer_id == current_user.id
    ).first()
    fin = db.query(models.FinancialDetails).filter(
        models.FinancialDetails.farmer_id == current_user.id
    ).first()

    if not farm or not fin:
        raise HTTPException(status_code=400, detail="Complete onboarding first.")

    crop = farm.crops.split(",")[0].strip() if farm.crops else "Rice"

    agent = FinancialAgent()
    result = agent.run(
        has_insurance=fin.has_insurance,
        loan_source=fin.loan_source,
        land_size_acres=farm.land_size_acres,
        ownership_type=farm.ownership_type,
        past_crop_loss=fin.past_crop_loss,
        dependents=fin.dependents,
        income_band=fin.income_band,
        crop=crop,
    )

    return result


@router.get("/disaster")
def get_disaster_risk(
    current_user: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db),
):
    """Return disaster risk analysis with 16-day forecast for the logged-in farmer."""
    farm = db.query(models.FarmDetails).filter(
        models.FarmDetails.farmer_id == current_user.id
    ).first()

    crop = farm.crops.split(",")[0].strip() if farm and farm.crops else "Rice"

    lat = current_user.latitude or 28.61
    lon = current_user.longitude or 77.20

    weather_data = get_weather_and_disaster(lat, lon, current_user.pin_code, crop)

    agent = DisasterAgent()
    result = agent.run(weather_data["disaster"], crop)

    return {
        **result,
        "forecast": weather_data["forecast"],
        "seasonal_baseline_daily_mm": weather_data["seasonal_baseline_daily_mm"],
        "is_mock": weather_data["is_mock"],
    }


@router.get("/compound")
def get_compound_risk(
    current_user: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db),
):
    """Return compound risk with XAI explanation."""
    # Get the latest stored risk score
    latest = db.query(models.RiskScore).filter(
        models.RiskScore.farmer_id == current_user.id
    ).order_by(models.RiskScore.computed_at.desc()).first()

    if not latest:
        raise HTTPException(status_code=400, detail="No risk score computed yet. Complete onboarding first.")

    # Parse factor breakdowns
    financial_factors = []
    disaster_factors = {}
    if latest.financial_factors_json:
        try:
            financial_factors = json.loads(latest.financial_factors_json)
        except Exception:
            pass
    if latest.disaster_factors_json:
        try:
            disaster_factors = json.loads(latest.disaster_factors_json)
        except Exception:
            pass

    return {
        "compound_risk": latest.compound_risk,
        "compound_label": latest.compound_label,
        "financial_risk": latest.financial_risk,
        "disaster_risk": latest.disaster_risk,
        "xai_explanation": latest.xai_explanation,
        "financial_factors": financial_factors,
        "disaster_factors": disaster_factors,
        "computed_at": latest.computed_at.isoformat(),
    }


@router.get("/history")
def get_risk_history(
    current_user: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db),
):
    """Return historical risk scores for trend charts."""
    history = db.query(models.RiskScore).filter(
        models.RiskScore.farmer_id == current_user.id
    ).order_by(models.RiskScore.computed_at.desc()).limit(30).all()

    return [
        {
            "id": r.id,
            "financial_risk": r.financial_risk,
            "disaster_risk": r.disaster_risk,
            "compound_risk": r.compound_risk,
            "compound_label": r.compound_label,
            "computed_at": r.computed_at.isoformat(),
        }
        for r in history
    ]
