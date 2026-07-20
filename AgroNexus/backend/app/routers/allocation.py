from fastapi import APIRouter, HTTPException
from app.schemas.allocation import AllocationRequest, AllocationRunOut
from app.services.allocation_service import AllocationService

router = APIRouter()
service = AllocationService()

@router.post('/run', response_model=AllocationRunOut)
async def run_allocation(req: AllocationRequest):
    """Trigger allocation solver (placeholder)."""
    result = service.run_allocation(req)
    if not result:
        raise HTTPException(status_code=500, detail='Allocation failed')
    return result

@router.get('/runs')
async def list_runs():
    """List past allocation runs (placeholder)."""
    return service.list_runs()
