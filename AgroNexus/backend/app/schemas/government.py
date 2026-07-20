from pydantic import BaseModel
from typing import Optional, List

class OverviewOut(BaseModel):
    total_farmers: int
    high_risk_count: int
    budget_available: int

class FarmerFilter(BaseModel):
    district: Optional[str]
    risk_level: Optional[str]

    class Config:
        orm_mode = True
