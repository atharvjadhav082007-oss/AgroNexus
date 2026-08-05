from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.db.database import engine, Base, get_db
from app.db import models
from app.routes.auth import router as auth_router
from app.routes.farmer import router as farmer_router
from app.routes.risk import router as risk_router
from app.routes.recommendations import router as recommendations_router
from app.routes.government import router as government_router
from app.routes.chatbot import router as chatbot_router
from app.errors import KhetSevaError, khetseva_error_handler

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KhetSeva API",
    description="Compound Farmer Risk Platform — Financial fragility + Disaster exposure prediction, 15 days ahead."
)

# CORS Middleware — locked down to known frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:5174",
        "http://localhost:3000",   # Alt dev port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register global error handler
app.add_exception_handler(KhetSevaError, khetseva_error_handler)

# Include route modules
app.include_router(auth_router)
app.include_router(farmer_router)
app.include_router(risk_router)
app.include_router(recommendations_router)
app.include_router(government_router)
app.include_router(chatbot_router)


@app.get("/")
def read_root():
    return {
        "name": "KhetSeva",
        "tagline": "Compound Farmer Risk Platform",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/api/auth/register, /api/auth/login",
            "farmer": "/api/farmer/onboarding/{step}, /api/farmer/dashboard, /api/farmer/profile",
            "risk": "/api/risk/financial, /api/risk/disaster, /api/risk/compound, /api/risk/history",
            "recommendations": "/api/recommendations/",
            "government": "/api/government/dashboard, /api/government/optimize",
        },
    }

@app.get("/api/stats/landing")
def get_landing_stats(db: Session = Depends(get_db)):
    """Public endpoint to fetch aggregate stats for the landing page."""
    farmers_count = db.query(models.Farmer).count()
    critical_count = db.query(models.RiskScore).filter(models.RiskScore.compound_label == "Critical").count()
    
    # Simple logic for relief funds (₹50,000 per critical farmer)
    relief_funds = critical_count * 50000

    # Fetch up to 3 recent farmers to generate scenarios
    recent_farmers = db.query(models.Farmer).order_by(models.Farmer.created_at.desc()).limit(3).all()
    scenarios = []
    optimizations = []
    
    for f in recent_farmers:
        # Default mock values
        risk_score = 0
        risk_label = "Stable"
        crop = "Unknown"
        
        # Get latest risk score
        if f.risk_scores:
            latest_risk = f.risk_scores[0]
            risk_score = latest_risk.compound_risk
            risk_label = latest_risk.compound_label
            
        # Get crop
        if f.farm_details:
            crop = f.farm_details.crops
            
        # Map label to color
        risk_color = "green"
        if risk_label == "Critical":
            risk_color = "rose"
        elif risk_label == "High Risk" or risk_label == "Watch":
            risk_color = "amber"
            
        # Mock weather & crop compatibility for the scenario
        weather_alert = "Normal"
        weather_color = "blue"
        weather_desc = "Forecasted for next 7 days"
        weather = "5 mm Rainfall"
        
        if risk_label == "Critical":
            weather_alert = "Severe Drought"
            weather_color = "rose"
            weather = "0 mm Rainfall"
        elif risk_label == "High Risk":
            weather_alert = "Heavy Rain"
            weather_color = "blue"
            weather = "85 mm Rainfall"

        scenario = {
            "name": f.full_name,
            "location": f"PIN: {f.pin_code}",
            "riskScore": int(risk_score),
            "riskLabel": risk_label,
            "riskColor": risk_color,
            "crop": crop,
            "cropCompat": "80%",
            "cropColor": "emerald",
            "weather": weather,
            "weatherDesc": weather_desc,
            "weatherAlert": weather_alert,
            "weatherColor": weather_color,
            "insights": [
                { "text": "Platform generated AI insight based on actual risk factors.", "color": "green", "icon": "ShieldCheck" }
            ]
        }
        scenarios.append(scenario)

        # Build optimization row
        bg = f"{risk_color}-50"
        text_color = f"{risk_color}-600"
        intervention = "Emergency Relief" if risk_label == "Critical" else ("Seed Subsidy" if risk_label in ["High Risk", "Watch"] else "Advisory Services")
        allocation = 25000 if risk_label == "Critical" else (15000 if risk_label in ["High Risk", "Watch"] else 2000)

        optimizations.append({
            "farmer_name": f.full_name,
            "region": f"PIN: {f.pin_code}",
            "risk_score_str": f"{int(risk_score)}/100",
            "bg_class": bg,
            "text_class": text_color,
            "intervention": intervention,
            "allocation": f"₹{allocation:,}"
        })
    
    return {
        "total_farmers": farmers_count,
        "critical_alerts": critical_count,
        "relief_funds_disbursed": relief_funds,
        "scenarios": scenarios,
        "optimizations": optimizations
    }
