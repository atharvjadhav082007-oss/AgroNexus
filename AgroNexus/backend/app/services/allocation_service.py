import uuid
from app.schemas.allocation import AllocationRequest, AllocationRunOut, AllocationItem

class AllocationService:
    """Placeholder allocation service using deterministic stub logic."""

    def run_allocation(self, req: AllocationRequest) -> AllocationRunOut:
        # Simple stub: allocate equal amounts to three fake farmers
        allocations = [
            AllocationItem(farmer_id=str(uuid.uuid4()), scheme_id=req.scheme_ids[0] if req.scheme_ids else "s1", benefit_amount=req.budget // 3),
            AllocationItem(farmer_id=str(uuid.uuid4()), scheme_id=req.scheme_ids[0] if req.scheme_ids else "s1", benefit_amount=req.budget // 3),
            AllocationItem(farmer_id=str(uuid.uuid4()), scheme_id=req.scheme_ids[0] if req.scheme_ids else "s1", benefit_amount=req.budget - 2*(req.budget // 3)),
        ]
        return AllocationRunOut(run_id=str(uuid.uuid4()), total_allocated=sum(a.benefit_amount for a in allocations), allocations=allocations)

    def list_runs(self):
        return []
