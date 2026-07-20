"""
KhetSeva Auth Routes — signup (Step 1) + login.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import re

from app.db.database import get_db
from app.db import models
from app.services.auth import hash_password, verify_password, create_access_token, needs_rehash
from app import schemas
from app.errors import DuplicateRegistrationError, InvalidCredentialsError

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


def normalize_phone_number(phone: str) -> str:
    """Normalize phone numbers to consist of only digits.
    Strips leading +91, 91, or 0 if the remaining part is 10 digits (common for Indian mobile numbers).
    """
    cleaned = re.sub(r'[^\d]', '', phone)
    if len(cleaned) > 10:
        if cleaned.startswith("91") and len(cleaned) == 12:
            cleaned = cleaned[2:]
        elif cleaned.startswith("0") and len(cleaned) == 11:
            cleaned = cleaned[1:]
    return cleaned


@router.post("/register", response_model=schemas.Token)
def register_farmer(farmer_in: schemas.OnboardingStep1, db: Session = Depends(get_db)):
    """Onboarding Step 1: Register with identity & location."""
    normalized_phone = normalize_phone_number(farmer_in.phone_number)
    existing = db.query(models.Farmer).filter(
        models.Farmer.phone_number == normalized_phone
    ).first()
    if existing:
        raise DuplicateRegistrationError()

    hashed = hash_password(farmer_in.password)

    lat = farmer_in.latitude
    lon = farmer_in.longitude
    if lat is None or lon is None:
        try:
            pin_val = int(farmer_in.pin_code)
            lat = 20.0 + (pin_val % 100) * 0.1
            lon = 72.0 + (pin_val % 70) * 0.1
        except ValueError:
            lat = 28.61
            lon = 77.20

    db_farmer = models.Farmer(
        full_name=farmer_in.full_name,
        phone_number=normalized_phone,
        password_hash=hashed,
        pin_code=farmer_in.pin_code,
        latitude=lat,
        longitude=lon,
    )

    db.add(db_farmer)
    db.commit()
    db.refresh(db_farmer)

    token = create_access_token(data={"sub": db_farmer.id})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=schemas.Token)
def login_farmer(credentials: schemas.FarmerLogin, db: Session = Depends(get_db)):
    """Login with phone number and password. Auto-upgrades legacy SHA256 hashes to bcrypt."""
    normalized_phone = normalize_phone_number(credentials.phone_number)
    farmer = db.query(models.Farmer).filter(
        models.Farmer.phone_number == normalized_phone
    ).first()
    if not farmer or not verify_password(credentials.password, farmer.password_hash):
        raise InvalidCredentialsError()

    # Auto-upgrade legacy SHA256 hashes to bcrypt on successful login
    try:
        if needs_rehash(farmer.password_hash):
            farmer.password_hash = hash_password(credentials.password)
            db.commit()
    except Exception:
        # If the hash is legacy SHA256 (not bcrypt format), rehash it
        if not farmer.password_hash.startswith("$2"):
            farmer.password_hash = hash_password(credentials.password)
            db.commit()

    token = create_access_token(data={"sub": farmer.id})
    return {"access_token": token, "token_type": "bearer"}

