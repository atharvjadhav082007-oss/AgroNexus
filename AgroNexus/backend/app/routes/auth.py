"""
KhetSeva Auth Routes — signup (Step 1) + login.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db import models
from app.services.auth import hash_password, verify_password, create_access_token
from app import schemas

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=schemas.Token)
def register_farmer(farmer_in: schemas.OnboardingStep1, db: Session = Depends(get_db)):
    """Onboarding Step 1: Register with identity & location."""
    existing = db.query(models.Farmer).filter(
        models.Farmer.phone_number == farmer_in.phone_number
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A farmer with this phone number is already registered.",
        )

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
        phone_number=farmer_in.phone_number,
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
    farmer = db.query(models.Farmer).filter(
        models.Farmer.phone_number == credentials.phone_number
    ).first()
    if not farmer or not verify_password(credentials.password, farmer.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect phone number or password",
        )

    token = create_access_token(data={"sub": farmer.id})
    return {"access_token": token, "token_type": "bearer"}
