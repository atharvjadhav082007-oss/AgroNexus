from fastapi import APIRouter, HTTPException
from app.services.recommendation_service import RecommendationService
from app.schemas.recommendation import RecommendationOut

router = APIRouter()
service = RecommendationService()

@router.get('/farmer/{farmer_id}', response_model=list[RecommendationOut])
async def get_recommendations(farmer_id: str):
    """Return personalized recommendations for a farmer (placeholder)."""
    recs = service.get_recommendations(farmer_id)
    if recs is None:
        raise HTTPException(status_code=404, detail='Farmer not found')
    return recs
