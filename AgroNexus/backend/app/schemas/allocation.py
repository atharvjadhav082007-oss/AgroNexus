from pydantic import BaseModel
from typing import List

class AllocationItem(BaseModel):
    farmer_id: str
    scheme_id: str
    benefit_amount: int

class AllocationRequest(BaseModel):
    budget: int
    scheme_ids: List[str]

class AllocationRunOut(BaseModel):
    run_id: str
    total_allocated: int
    allocations: List[AllocationItem]

    class Config:
        orm_mode = True
