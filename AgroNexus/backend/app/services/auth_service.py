from app.schemas.auth import LoginRequest
from app.utils.security import create_access_token
from datetime import timedelta

class AuthService:
    """Auth service that issues JWT tokens. OTP verification is still a stub.

    This is a skeleton implementation intended to be replaced by real
    OTP verification and user persistence. It provides create_access_token
    integration so frontend can receive a JWT in /auth/login.
    """

    def login(self, payload: LoginRequest) -> str:
        # TODO: validate OTP and user identity against DB
        # For now, accept any OTP and create a token with farmer phone_number as subject
        access_token_expires = timedelta(minutes=60)
        token = create_access_token(subject=payload.phone_number, expires_delta=access_token_expires)
        return token

    def verify_otp(self, payload: LoginRequest) -> bool:
        # Placeholder: accept any OTP
        return True
