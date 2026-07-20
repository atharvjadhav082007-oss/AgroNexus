"""
KhetSeva Custom Errors — Structured exception classes + global handler.
"""

from fastapi import Request
from fastapi.responses import JSONResponse


class KhetSevaError(Exception):
    """Base exception for all KhetSeva application errors."""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class OnboardingIncompleteError(KhetSevaError):
    """Raised when a farmer hasn't completed all onboarding steps."""
    def __init__(self, missing_step: str = "onboarding"):
        super().__init__(
            f"Please complete {missing_step} first.",
            status_code=400,
        )


class FarmerNotFoundError(KhetSevaError):
    """Raised when a farmer ID doesn't match any record."""
    def __init__(self):
        super().__init__("Farmer not found.", status_code=404)


class InvalidCredentialsError(KhetSevaError):
    """Raised on failed authentication."""
    def __init__(self):
        super().__init__("Invalid credentials.", status_code=401)


class DuplicateRegistrationError(KhetSevaError):
    """Raised when a phone number is already registered."""
    def __init__(self):
        super().__init__(
            "A farmer with this phone number is already registered.",
            status_code=400,
        )


class WeatherServiceError(KhetSevaError):
    """Raised when weather API calls fail."""
    def __init__(self):
        super().__init__(
            "Weather service temporarily unavailable. Using cached data.",
            status_code=503,
        )


class OfficerAccessDeniedError(KhetSevaError):
    """Raised when officer API key is invalid."""
    def __init__(self):
        super().__init__(
            "Invalid or missing officer access key.",
            status_code=403,
        )


# ─────────────────────────────────────────────
# Global Exception Handler (register in main.py)
# ─────────────────────────────────────────────

async def khetseva_error_handler(request: Request, exc: KhetSevaError):
    """Global handler for KhetSevaError exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.message,
            "detail": exc.message,
            "status_code": exc.status_code,
        },
    )
