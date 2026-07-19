import json
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime

from app.dp.database import engine, Base, get_db
from app.dp import models
from app.services.auth import hash_password, verify_password, create_access_token, decode_access_token
from app.services.weather import fetch_weather_data
from app.services.agents import FinancialAgent, DisasterAgent, GovSchemeAgent, OptimizationAgent, is_ai_powered
from app import schemas

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AgroNexus API",
    description="Multi-Agent Farmer Portal & Government Risk Management API — Powered by Gemini AI + OR-Tools"
)

# Add CORS Middleware to connect with React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()


def get_current_farmer(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> models.Farmer:
    """Dependency to retrieve the logged-in farmer using credentials token."""
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    farmer_id = payload["sub"]
    farmer = db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Farmer not found",
        )
    return farmer


@app.get("/")
def read_root():
    return {
        "message": "Welcome to the AgroNexus Multi-Agent API!",
        "ai_mode": is_ai_powered(),
        "agents": ["FinancialAgent", "DisasterAgent", "GovSchemeAgent", "OptimizationAgent (OR-Tools)"]
    }


# ─────────────────────────────────────────────
# Authentication Endpoints
# ─────────────────────────────────────────────

@app.post("/api/auth/register", response_model=schemas.Token)
def register_farmer(farmer_in: schemas.FarmerCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Farmer).filter(models.Farmer.phone_number == farmer_in.phone_number).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A farmer with this phone number is already registered.",
        )

    hashed = hash_password(farmer_in.password)

    lat = farmer_in.latitude
    lon = farmer_in.longitude
    if lat is None or lon is None:
        try:
            pin_val = int(farmer_in.pin_code)
            lat = 20.0 + (pin_val % 100) * 0.1
            lon = 72.0 + (pin_val % 70) * 0.1
        except ValueError:
            lat = 28.61
            lon = 77.20

    db_farmer = models.Farmer(
        full_name=farmer_in.full_name,
        phone_number=farmer_in.phone_number,
        password_hash=hashed,
        pin_code=farmer_in.pin_code,
        latitude=lat,
        longitude=lon,
    )

    db.add(db_farmer)
    db.commit()
    db.refresh(db_farmer)

    token = create_access_token(data={"sub": db_farmer.id})
    return {"access_token": token, "token_type": "bearer"}


@app.post("/api/auth/login", response_model=schemas.Token)
def login_farmer(credentials: schemas.FarmerLogin, db: Session = Depends(get_db)):
    farmer = db.query(models.Farmer).filter(models.Farmer.phone_number == credentials.phone_number).first()
    if not farmer or not verify_password(credentials.password, farmer.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect phone number or password",
        )

    token = create_access_token(data={"sub": farmer.id})
    return {"access_token": token, "token_type": "bearer"}


# ─────────────────────────────────────────────
# Agent Integration Profile Pipeline
# ─────────────────────────────────────────────

@app.post("/api/farmer/profile", response_model=schemas.DashboardResponse)
def update_financial_profile(
    profile_in: schemas.FinancialProfileCreate,
    current_user: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db),
):
    # 1. Update/Create Financial Profile record
    db_profile = db.query(models.FinancialProfile).filter(
        models.FinancialProfile.farmer_id == current_user.id
    ).first()
    if not db_profile:
        db_profile = models.FinancialProfile(farmer_id=current_user.id)
        db.add(db_profile)

    db_profile.annual_income = profile_in.annual_income
    db_profile.total_outstanding_loan = profile_in.total_outstanding_loan
    db_profile.has_previous_default = profile_in.has_previous_default
    db_profile.land_size_acres = profile_in.land_size_acres
    db_profile.primary_crop = profile_in.primary_crop

    # ─── RUN AGENT 1: Financial Risk Agent ───
    fin_agent = FinancialAgent()
    fin_res = fin_agent.run(
        income=profile_in.annual_income,
        loan=profile_in.total_outstanding_loan,
        has_default=profile_in.has_previous_default,
        crop=profile_in.primary_crop,
    )
    db_profile.financial_risk_score = fin_res["risk_score"]
    db_profile.financial_risk_level = fin_res["risk_level"]
    db_profile.financial_thoughts = fin_res["thought_process"]

    # 2. Fetch Live Weather Data for location
    weather = fetch_weather_data(current_user.latitude, current_user.longitude, current_user.pin_code)

    db_env = db.query(models.EnvironmentalData).filter(
        models.EnvironmentalData.farmer_id == current_user.id
    ).first()
    if not db_env:
        db_env = models.EnvironmentalData(farmer_id=current_user.id)
        db.add(db_env)

    db_env.current_rainfall_mm = weather["current_rainfall_mm"]
    db_env.historical_disaster_risk = weather["historical_disaster_risk"]
    db_env.last_api_update = datetime.utcnow()

    # ─── RUN AGENT 2: Disaster Agent ───
    dis_agent = DisasterAgent()
    dis_res = dis_agent.run(
        latitude=current_user.latitude,
        longitude=current_user.longitude,
        pin_code=current_user.pin_code,
        rainfall_mm=weather["current_rainfall_mm"] or 0.0,
        zone_risk=weather["historical_disaster_risk"],
        crop=profile_in.primary_crop,
    )
    db_env.disaster_risk_score = dis_res["risk_score"]
    db_env.disaster_risk_level = dis_res["risk_level"]
    db_env.disaster_thoughts = dis_res["thought_process"]

    # ─── RUN AGENT 3: Government Scheme Agent ───
    scheme_agent = GovSchemeAgent()
    scheme_res = scheme_agent.run(
        land_size=profile_in.land_size_acres,
        financial_risk=fin_res["risk_level"],
        disaster_risk=dis_res["risk_level"],
        has_default=profile_in.has_previous_default,
        crop=profile_in.primary_crop,
    )

    # 3. Calculate Compound Risk & XAI Explanation
    db_compound = db.query(models.CompoundRisk).filter(
        models.CompoundRisk.farmer_id == current_user.id
    ).first()
    if not db_compound:
        db_compound = models.CompoundRisk(farmer_id=current_user.id)
        db.add(db_compound)

    f_score = fin_res["risk_score"]
    d_score = dis_res["risk_score"]
    base_avg = (f_score + d_score) / 2.0

    # Synergistic compounding: if both exposures are high, vulnerability spikes
    if fin_res["risk_level"] == "High" and dis_res["risk_level"] == "High":
        base_avg += (100.0 - base_avg) * 0.35

    db_compound.compound_score = round(base_avg, 1)

    if db_compound.compound_score > 70.0:
        db_compound.status = "Critical"
    elif db_compound.compound_score > 40.0:
        db_compound.status = "Warning"
    else:
        db_compound.status = "Safe"

    db_compound.scheme_thoughts = scheme_res["thought_process"]
    db_compound.eligible_schemes_json = json.dumps(scheme_res["eligible_schemes"])

    # Build XAI explanation
    annual_income = profile_in.annual_income
    reasons = []
    if profile_in.has_previous_default:
        reasons.append("credit risk default histories")
    if annual_income > 0 and (profile_in.total_outstanding_loan / annual_income) > 0.6:
        reasons.append("high outstanding loans relative to earnings")
    if weather["historical_disaster_risk"] == "High":
        reasons.append("regional location within disaster-susceptible tracts")
    if dis_res["pest_probability"] > 50.0:
        reasons.append("extreme pest attack warning parameters")

    if not reasons:
        db_compound.xai_explanation = (
            f"Composite vulnerability rating is {db_compound.compound_score}% ({db_compound.status}). "
            f"Your environmental indicators and household financial buffers are operating within stable parameters."
        )
    else:
        db_compound.xai_explanation = (
            f"Vulnerability is evaluated at {db_compound.compound_score}% ({db_compound.status}) driven by: "
            f"{', and '.join(reasons)}."
        )

    db.commit()
    db.refresh(current_user)
    db.refresh(db_profile)
    db.refresh(db_env)
    db.refresh(db_compound)

    return {
        "farmer": current_user,
        "financial_profile": db_profile,
        "environmental_data": db_env,
        "compound_risk": db_compound,
        "is_ai_powered": is_ai_powered(),
    }


@app.get("/api/farmer/dashboard", response_model=schemas.DashboardResponse)
def get_farmer_dashboard(
    current_user: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db),
):
    profile = db.query(models.FinancialProfile).filter(
        models.FinancialProfile.farmer_id == current_user.id
    ).first()
    env = db.query(models.EnvironmentalData).filter(
        models.EnvironmentalData.farmer_id == current_user.id
    ).first()
    risk = db.query(models.CompoundRisk).filter(
        models.CompoundRisk.farmer_id == current_user.id
    ).first()

    return {
        "farmer": current_user,
        "financial_profile": profile,
        "environmental_data": env,
        "compound_risk": risk,
        "is_ai_powered": is_ai_powered(),
    }


# ─────────────────────────────────────────────
# Government Panel Endpoints (Agent 4)
# ─────────────────────────────────────────────

@app.get("/api/government/dashboard", response_model=schemas.GovernmentDashboardResponse)
def get_government_dashboard(db: Session = Depends(get_db)):
    """Returns all registered farmers with their risk profiles for the government panel."""
    farmers = db.query(models.Farmer).all()
    overview = []
    critical_count = 0
    warning_count = 0
    safe_count = 0

    for farmer in farmers:
        status_val = farmer.compound_risk.status if farmer.compound_risk else "Unknown"
        if status_val == "Critical":
            critical_count += 1
        elif status_val == "Warning":
            warning_count += 1
        elif status_val == "Safe":
            safe_count += 1

        overview.append(schemas.FarmerOverviewItem(
            id=farmer.id,
            full_name=farmer.full_name,
            pin_code=farmer.pin_code,
            compound_score=farmer.compound_risk.compound_score if farmer.compound_risk else None,
            status=status_val,
            financial_risk_level=farmer.financial_profile.financial_risk_level if farmer.financial_profile else None,
            disaster_risk_level=farmer.environmental_data.disaster_risk_level if farmer.environmental_data else None,
            primary_crop=farmer.financial_profile.primary_crop if farmer.financial_profile else None,
            land_size_acres=farmer.financial_profile.land_size_acres if farmer.financial_profile else None,
        ))

    return schemas.GovernmentDashboardResponse(
        total_farmers=len(overview),
        critical_count=critical_count,
        warning_count=warning_count,
        safe_count=safe_count,
        farmers=overview,
    )


@app.post("/api/government/optimize", response_model=schemas.OptimizationResponse)
def run_budget_optimization(req: schemas.OptimizationRequest, db: Session = Depends(get_db)):
    """Invokes Agent 4 (OptimizationAgent) using OR-Tools CP-SAT solver."""
    farmers = db.query(models.Farmer).all()
    farmers_list = []

    for farmer in farmers:
        if farmer.financial_profile and farmer.compound_risk:
            schemes = []
            if farmer.compound_risk.eligible_schemes_json:
                try:
                    schemes = json.loads(farmer.compound_risk.eligible_schemes_json)
                except Exception:
                    pass

            farmers_list.append({
                "id": farmer.id,
                "name": farmer.full_name,
                "compound_score": farmer.compound_risk.compound_score or 0.0,
                "loan_amount": farmer.financial_profile.total_outstanding_loan or 0.0,
                "eligible_schemes": schemes,
            })

    opt_agent = OptimizationAgent()
    opt_res = opt_agent.run(farmers_list, req.budget)
    return opt_res
