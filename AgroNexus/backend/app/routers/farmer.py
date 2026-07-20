from fastapi import APIRouter, HTTPException
from app.schemas.farmer import FarmerCreate, FarmerOut
from app.services.farmer_service import FarmerService

router = APIRouter()
service = FarmerService()

@router.post("/register", response_model=FarmerOut)
async def register_farmer(payload: FarmerCreate):
    """Register a new farmer (placeholder).
    This is a lightweight placeholder that returns a created farmer object.
    """
    farmer = service.create_farmer(payload)
    return farmer

@router.get("/{farmer_id}", response_model=FarmerOut)
async def get_farmer(farmer_id: str):
    farmer = service.get_farmer(farmer_id)
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return farmer
