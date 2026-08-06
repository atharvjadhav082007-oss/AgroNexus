"""
KhetSeva Shared Dependencies — Common FastAPI dependencies used across routes.
"""

# pyrefly: ignore [missing-import]
from fastapi import Depends, HTTPException, status
# pyrefly: ignore [missing-import]
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db import models
from app.services.auth import decode_access_token
from app.errors import InvalidCredentialsError, FarmerNotFoundError

security = HTTPBearer()


def get_current_farmer(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> models.Farmer:
    """Dependency to retrieve the logged-in farmer from JWT token."""
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise InvalidCredentialsError()
    farmer_id = payload["sub"]
    farmer = db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()
    if not farmer:
        raise FarmerNotFoundError()
    return farmer
