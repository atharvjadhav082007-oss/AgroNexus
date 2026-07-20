from app.schemas.recommendation import RecommendationOut

class RecommendationService:
    """Placeholder recommendation service that returns sample recommendations."""

    def get_recommendations(self, farmer_id: str):
        # In real impl, check farmer exists; here always return two recs
        return [
            RecommendationOut(scheme_name="PMFBY", priority=90, benefit_amount=5000, reason="High disaster exposure"),
            RecommendationOut(scheme_name="KCC Restructure", priority=75, benefit_amount=20000, reason="High financial risk"),
        ]
