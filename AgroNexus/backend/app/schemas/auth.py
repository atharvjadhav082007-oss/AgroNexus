from pydantic import BaseModel

class LoginRequest(BaseModel):
    phone_number: str
    otp: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
