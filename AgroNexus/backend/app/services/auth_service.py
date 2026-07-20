from app.schemas.auth import LoginRequest
import uuid

class AuthService:
    """Placeholder auth service. Replace with real OTP/JWT logic later."""

    def login(self, payload: LoginRequest) -> str:
        # In a real system, validate OTP and issue JWT
        # Here return a dummy token (uuid)
        return str(uuid.uuid4())

    def verify_otp(self, payload: LoginRequest) -> bool:
        # Placeholder: accept any OTP
        return True
