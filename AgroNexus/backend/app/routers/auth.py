from fastapi import APIRouter
from app.schemas.auth import LoginRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter()
service = AuthService()

@router.post('/login', response_model=TokenResponse)
async def login(payload: LoginRequest):
    """Placeholder login endpoint. Accepts phone+otp and returns a dummy token."""
    token = service.login(payload)
    return TokenResponse(access_token=token, token_type="bearer")

@router.post('/verify-otp')
async def verify_otp(payload: LoginRequest):
    ok = service.verify_otp(payload)
    return {"ok": ok}
