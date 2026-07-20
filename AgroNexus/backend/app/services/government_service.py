from app.schemas.government import OverviewOut, FarmerFilter

class GovernmentService:
    """Placeholder government service returning sample data."""

    def get_overview(self) -> OverviewOut:
        return OverviewOut(total_farmers=1000, high_risk_count=120, budget_available=10000000)

    def list_farmers(self, filters: FarmerFilter):
        # Return a small sample list; in real impl this would query DB
        sample = [
            {"id": "f1", "full_name": "Ram Kumar", "risk_level": "High", "district": filters.district},
            {"id": "f2", "full_name": "Sita Devi", "risk_level": "Medium", "district": filters.district},
        ]
        return sample
