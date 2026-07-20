from fastapi import APIRouter
from typing import List, Optional
from app.schemas.government import OverviewOut, FarmerFilter
from app.services.government_service import GovernmentService

router = APIRouter()
service = GovernmentService()

@router.get('/overview', response_model=OverviewOut)
async def get_overview():
    """Return high-level dashboard overview (placeholder)."""
    return service.get_overview()

@router.get('/farmers')
async def list_farmers(district: Optional[str] = None, risk_level: Optional[str] = None):
    """Return filtered list of farmers (placeholder)."""
    filters = FarmerFilter(district=district, risk_level=risk_level)
    return service.list_farmers(filters)
