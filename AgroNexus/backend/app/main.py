from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine, Base
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
        "http://localhost:3000",   # Alt dev port
        "http://127.0.0.1:5173",
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
