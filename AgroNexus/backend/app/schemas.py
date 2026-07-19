from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ─────────────────────────────────────────────
# Authentication
# ─────────────────────────────────────────────

class FarmerLogin(BaseModel):
    phone_number: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str


# ─────────────────────────────────────────────
# Onboarding Step 1: Identity & Location
# ─────────────────────────────────────────────

class OnboardingStep1(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    phone_number: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=4)
    pin_code: str = Field(..., min_length=6, max_length=6)
    latitude: Optional[float] = None
    longitude: Optional[float] = None


# ─────────────────────────────────────────────
# Onboarding Step 2: Farm & Agriculture Details
# ─────────────────────────────────────────────

class OnboardingStep2(BaseModel):
    land_size_acres: float = Field(..., gt=0.0)
    ownership_type: str = Field(..., description="owned / leased / sharecropper")
    crops: str = Field(..., min_length=2, description="Primary crop(s) grown")
    crop_season: Optional[str] = Field(None, description="Kharif / Rabi / Both")
    irrigation_source: str = Field(..., description="rainfed / canal / borewell / drip")
    soil_type: Optional[str] = Field(None, description="alluvial / black / red / laterite / sandy")
    experience_years: Optional[int] = Field(None, ge=0)


# ─────────────────────────────────────────────
# Onboarding Step 3: Financial Background
# ─────────────────────────────────────────────

class OnboardingStep3(BaseModel):
    loan_amount: float = Field(0.0, ge=0)
    loan_source: str = Field("none", description="bank / kcc / moneylender / none")
    has_insurance: bool = False
    insurance_scheme: Optional[str] = Field(None, description="PMFBY / private / other")
    income_band: str = Field(..., description="<1L / 1-3L / 3-5L / 5L+")
    past_crop_loss: bool = False
    dependents: int = Field(1, ge=0)


# ─────────────────────────────────────────────
# Response: Farmer
# ─────────────────────────────────────────────

class FarmerResponse(BaseModel):
    id: str
    full_name: str
    phone_number: str
    pin_code: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ─────────────────────────────────────────────
# Response: Farm Details
# ─────────────────────────────────────────────

class FarmDetailsResponse(BaseModel):
    id: str
    farmer_id: str
    land_size_acres: float
    ownership_type: str
    crops: str
    crop_season: Optional[str] = None
    irrigation_source: str
    soil_type: Optional[str] = None
    experience_years: Optional[int] = None

    class Config:
        from_attributes = True


# ─────────────────────────────────────────────
# Response: Financial Details
# ─────────────────────────────────────────────

class FinancialDetailsResponse(BaseModel):
    id: str
    farmer_id: str
    loan_amount: float
    loan_source: str
    has_insurance: bool
    insurance_scheme: Optional[str] = None
    income_band: str
    past_crop_loss: bool
    dependents: int

    class Config:
        from_attributes = True


# ─────────────────────────────────────────────
# Response: Risk Score
# ─────────────────────────────────────────────

class RiskScoreResponse(BaseModel):
    id: str
    farmer_id: str
    financial_risk: float
    disaster_risk: float
    compound_risk: float
    compound_label: str
    xai_explanation: Optional[str] = None
    financial_factors_json: Optional[str] = None
    disaster_factors_json: Optional[str] = None
    eligible_schemes_json: Optional[str] = None
    computed_at: datetime

    class Config:
        from_attributes = True


# ─────────────────────────────────────────────
# Response: Eligible Scheme
# ─────────────────────────────────────────────

class EligibleScheme(BaseModel):
    name: str
    benefit: str
    status: str           # Eligible now / Not eligible / Conditionally eligible
    reason: str           # why eligible or what's missing
    apply_url: Optional[str] = None


# ─────────────────────────────────────────────
# Response: Recommendation
# ─────────────────────────────────────────────

class RecommendationItem(BaseModel):
    text: str
    category: str         # financial / disaster / scheme / general
    priority: str         # urgent / recommended / informational


# ─────────────────────────────────────────────
# Dashboard Response (unified)
# ─────────────────────────────────────────────

class DashboardResponse(BaseModel):
    farmer: FarmerResponse
    farm_details: Optional[FarmDetailsResponse] = None
    financial_details: Optional[FinancialDetailsResponse] = None
    latest_risk: Optional[RiskScoreResponse] = None
    risk_history: List[RiskScoreResponse] = []
    recommendations: List[RecommendationItem] = []
    eligible_schemes: List[EligibleScheme] = []
    forecast_data: Optional[dict] = None     # 16-day precipitation/temp from Open-Meteo


# ─────────────────────────────────────────────
# Optimization (OR-Tools Agent)
# ─────────────────────────────────────────────

class OptimizationRequest(BaseModel):
    budget: float

class AllocationDetail(BaseModel):
    farmer_id: str
    farmer_name: str
    intervention: str
    cost: int
    risk_mitigated: float

class OptimizationResponse(BaseModel):
    total_budget: float
    total_spent: float
    total_mitigated_score: float
    allocations: List[AllocationDetail]
    thought_process: str


# ─────────────────────────────────────────────
# Government / Officer Dashboard
# ─────────────────────────────────────────────

class FarmerOverviewItem(BaseModel):
    id: str
    full_name: str
    pin_code: str
    compound_score: Optional[float] = None
    compound_label: Optional[str] = None
    financial_risk: Optional[float] = None
    disaster_risk: Optional[float] = None
    primary_crop: Optional[str] = None
    land_size_acres: Optional[float] = None

class GovernmentDashboardResponse(BaseModel):
    total_farmers: int
    critical_count: int
    high_count: int
    watch_count: int
    stable_count: int
    farmers: List[FarmerOverviewItem]
