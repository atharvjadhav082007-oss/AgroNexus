import uuid
from app.schemas.farmer import FarmerCreate, FarmerOut

class FarmerService:
    """Lightweight placeholder service for farmer operations.
    Replace with DB-backed logic when integrating.
    """

    def create_farmer(self, payload: FarmerCreate) -> FarmerOut:
        new_id = str(uuid.uuid4())
        return FarmerOut(
            id=new_id,
            full_name=payload.full_name,
            phone_number=payload.phone_number,
            pin_code=payload.pin_code,
        )

    def get_farmer(self, farmer_id: str) -> FarmerOut | None:
        # Placeholder: in-memory stub — return None to indicate not found
        return None
