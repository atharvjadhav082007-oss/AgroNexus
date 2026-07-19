from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# ─────────────────────────────────────────────
# Farmer Authentication Schemas
# ─────────────────────────────────────────────

class FarmerCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    phone_number: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=6)
    pin_code: str = Field(..., min_length=6, max_length=6)
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class FarmerLogin(BaseModel):
    phone_number: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

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
# Financial Profile Schemas
# ─────────────────────────────────────────────

class FinancialProfileCreate(BaseModel):
    annual_income: int = Field(..., ge=0)
    total_outstanding_loan: int = Field(..., ge=0)
    has_previous_default: bool = False
    land_size_acres: float = Field(..., gt=0.0)
    primary_crop: str = Field(..., min_length=2)

class FinancialProfileResponse(BaseModel):
    id: str
    farmer_id: str
    annual_income: int
    total_outstanding_loan: int
    has_previous_default: bool
    land_size_acres: float
    primary_crop: str
    financial_risk_score: Optional[float] = None
    financial_risk_level: Optional[str] = None
    financial_thoughts: Optional[str] = None

    class Config:
        from_attributes = True

# ─────────────────────────────────────────────
# Environmental Data Schemas
# ─────────────────────────────────────────────

class EnvironmentalDataResponse(BaseModel):
    id: str
    farmer_id: str
    current_rainfall_mm: Optional[float] = None
    historical_disaster_risk: str
    last_api_update: datetime
    disaster_risk_score: Optional[float] = None
    disaster_risk_level: Optional[str] = None
    disaster_thoughts: Optional[str] = None

    class Config:
        from_attributes = True

# ─────────────────────────────────────────────
# Compound Risk & Scheme Schemas
# ─────────────────────────────────────────────

class EligibleScheme(BaseModel):
    name: str
    type: str
    value: str
    description: str

class CompoundRiskResponse(BaseModel):
    id: str
    farmer_id: str
    compound_score: Optional[float] = None
    xai_explanation: Optional[str] = None
    status: str
    scheme_thoughts: Optional[str] = None
    eligible_schemes_json: Optional[str] = None  # raw JSON string; frontend parses

    class Config:
        from_attributes = True

# ─────────────────────────────────────────────
# Unified Dashboard Schema
# ─────────────────────────────────────────────

class DashboardResponse(BaseModel):
    farmer: FarmerResponse
    financial_profile: Optional[FinancialProfileResponse] = None
    environmental_data: Optional[EnvironmentalDataResponse] = None
    compound_risk: Optional[CompoundRiskResponse] = None
    is_ai_powered: bool = False

# ─────────────────────────────────────────────
# Optimization (Agent 4) Schemas
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
    is_ai_powered: bool = False

# ─────────────────────────────────────────────
# Government Dashboard Overview Schema
# ─────────────────────────────────────────────

class FarmerOverviewItem(BaseModel):
    id: str
    full_name: str
    pin_code: str
    compound_score: Optional[float] = None
    status: Optional[str] = None
    financial_risk_level: Optional[str] = None
    disaster_risk_level: Optional[str] = None
    primary_crop: Optional[str] = None
    land_size_acres: Optional[float] = None

class GovernmentDashboardResponse(BaseModel):
    total_farmers: int
    critical_count: int
    warning_count: int
    safe_count: int
    farmers: List[FarmerOverviewItem]
