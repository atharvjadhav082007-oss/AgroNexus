from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import FarmerRiskAssessment
from app.schemas import (
    FarmerRiskInput, 
    FinancialRiskOutput, 
    DisasterRiskOutput, 
    CombinedRiskInput, 
    CombinedRiskOutput
)

from app.services.financial_risk import financial_risk_service
from app.services.disaster_risk import disaster_risk_service
from app.services.geocode import geocode_service

router = APIRouter(prefix="/api/risk", tags=["Risk"])

@router.post("/financial", response_model=FinancialRiskOutput)
def calculate_financial_risk(input_data: FarmerRiskInput):
    """Calculate the financial risk score based on farmer inputs."""
    result = financial_risk_service.calculate_risk(
        loan_amount=input_data.loan_amount,
        land_acres=input_data.land_acres,
        has_insurance=input_data.has_insurance,
        has_recent_loss=input_data.has_recent_loss,
        income_bracket=input_data.income_bracket
    )
    return result

@router.get("/disaster", response_model=DisasterRiskOutput)
def calculate_disaster_risk(
    pincode: str = Query(None, min_length=6, max_length=6),
    latitude: float = Query(None),
    longitude: float = Query(None),
    db: Session = Depends(get_db)
):
    """Calculate the weather-based disaster risk score using coordinates or pincode."""
    if not (pincode or (latitude and longitude)):
        raise HTTPException(status_code=422, detail="Must provide either pincode or latitude/longitude.")

    location_meta = None
    
    if pincode and not (latitude and longitude):
        try:
            loc = geocode_service.resolve_pincode(db, pincode)
            latitude = loc["latitude"]
            longitude = loc["longitude"]
            location_meta = loc
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Failed to geocode pincode: {str(e)}")

    try:
        result = disaster_risk_service.calculate_hazard_scores(latitude, longitude)
        result["resolved_location"] = location_meta
        return result
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch disaster forecast: {str(e)}")

@router.post("/combined", response_model=CombinedRiskOutput)
def calculate_combined_risk(input_data: CombinedRiskInput, db: Session = Depends(get_db)):
    """Calculate both scores, combine them, and persist to the database."""
    # 1. Financial
    fin_result = financial_risk_service.calculate_risk(
        loan_amount=input_data.loan_amount,
        land_acres=input_data.land_acres,
        has_insurance=input_data.has_insurance,
        has_recent_loss=input_data.has_recent_loss,
        income_bracket=input_data.income_bracket
    )
    
    # 2. Geocode & Disaster
    try:
        loc = geocode_service.resolve_pincode(db, input_data.pincode)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to geocode pincode: {str(e)}")
        
    try:
        dis_result = disaster_risk_service.calculate_hazard_scores(loc["latitude"], loc["longitude"])
        dis_result["resolved_location"] = loc
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch disaster forecast: {str(e)}")
        
    # 3. Combine
    fin_score = fin_result["financial_risk_score"]
    dis_score = dis_result["disaster_risk_score"]
    
    overall_score = 0.55 * fin_score + 0.45 * dis_score
    overall_score = round(overall_score, 2)
    
    if overall_score < 25:
        band = "Low Risk"
    elif overall_score < 50:
        band = "Moderate Risk"
    elif overall_score < 75:
        band = "High Risk"
    else:
        band = "Severe Risk"
        
    # 4. Persist Assessment
    assessment = FarmerRiskAssessment(
        loan_amount=input_data.loan_amount,
        land_acres=input_data.land_acres,
        has_insurance=input_data.has_insurance,
        has_recent_loss=input_data.has_recent_loss,
        income_bracket=input_data.income_bracket,
        pincode=input_data.pincode,
        latitude=loc["latitude"],
        longitude=loc["longitude"],
        financial_risk_score=fin_score,
        disaster_risk_score=dis_score,
        dominant_hazard=dis_result["dominant_hazard"],
        overall_risk_score=overall_score
    )
    db.add(assessment)
    db.commit()
    
    return {
        "overall_risk_score": overall_score,
        "risk_band": band,
        "financial_risk_score": fin_score,
        "disaster_risk": dis_result
    }
