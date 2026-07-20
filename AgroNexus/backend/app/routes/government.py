"""
KhetSeva Government / Officer Routes — aggregate dashboard + optimization.
Protected by officer API key.
"""

import os
import json
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db import models
from app.services.agents import OptimizationAgent
from app import schemas
from app.errors import OfficerAccessDeniedError

router = APIRouter(prefix="/api/government", tags=["Government"])

OFFICER_API_KEY = os.getenv("OFFICER_API_KEY", "khetseva-officer-2026")


def verify_officer(x_officer_key: str = Header(..., description="Officer access key")):
    """Dependency to verify officer API key from request header."""
    if x_officer_key != OFFICER_API_KEY:
        raise OfficerAccessDeniedError()


@router.get("/dashboard", response_model=schemas.GovernmentDashboardResponse)
def get_government_dashboard(
    db: Session = Depends(get_db),
    _officer: None = Depends(verify_officer),
):
    """Returns all registered farmers with their risk profiles for the officer/NGO panel."""
    farmers = db.query(models.Farmer).all()
    overview = []
    critical_count = 0
    high_count = 0
    watch_count = 0
    stable_count = 0

    for farmer in farmers:
        # Get latest risk score
        latest_risk = db.query(models.RiskScore).filter(
            models.RiskScore.farmer_id == farmer.id
        ).order_by(models.RiskScore.computed_at.desc()).first()

        label = latest_risk.compound_label if latest_risk else "Unknown"
        if label == "Critical":
            critical_count += 1
        elif label == "High Risk":
            high_count += 1
        elif label == "Watch":
            watch_count += 1
        elif label == "Stable":
            stable_count += 1

        farm = farmer.farm_details

        overview.append(schemas.FarmerOverviewItem(
            id=farmer.id,
            full_name=farmer.full_name,
            pin_code=farmer.pin_code,
            compound_score=latest_risk.compound_risk if latest_risk else None,
            compound_label=label,
            financial_risk=latest_risk.financial_risk if latest_risk else None,
            disaster_risk=latest_risk.disaster_risk if latest_risk else None,
            primary_crop=farm.crops.split(",")[0].strip() if farm and farm.crops else None,
            land_size_acres=farm.land_size_acres if farm else None,
        ))

    return schemas.GovernmentDashboardResponse(
        total_farmers=len(overview),
        critical_count=critical_count,
        high_count=high_count,
        watch_count=watch_count,
        stable_count=stable_count,
        farmers=overview,
    )


@router.post("/optimize", response_model=schemas.OptimizationResponse)
def run_budget_optimization(
    req: schemas.OptimizationRequest,
    db: Session = Depends(get_db),
    _officer: None = Depends(verify_officer),
):
    """Invokes OptimizationAgent (OR-Tools CP-SAT) for relief fund allocation."""
    farmers = db.query(models.Farmer).all()
    farmers_list = []

    for farmer in farmers:
        latest_risk = db.query(models.RiskScore).filter(
            models.RiskScore.farmer_id == farmer.id
        ).order_by(models.RiskScore.computed_at.desc()).first()

        fin = farmer.financial_details

        if latest_risk and fin:
            farmers_list.append({
                "id": farmer.id,
                "name": farmer.full_name,
                "compound_score": latest_risk.compound_risk or 0.0,
                "loan_amount": fin.loan_amount or 0.0,
            })

    opt_agent = OptimizationAgent()
    result = opt_agent.run(farmers_list, req.budget)
    return result
