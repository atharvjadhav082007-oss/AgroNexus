from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from .database import Base

# Generate UUIDs automatically
def generate_uuid():
    return str(uuid.uuid4())

# ─────────────────────────────────────────────
# Table 1: Farmers (User Accounts)
# ─────────────────────────────────────────────
class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(String, primary_key=True, default=generate_uuid)
    full_name = Column(String, nullable=False)
    phone_number = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    pin_code = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships to link to other tables
    financial_profile = relationship("FinancialProfile", back_populates="farmer", uselist=False)
    environmental_data = relationship("EnvironmentalData", back_populates="farmer", uselist=False)
    compound_risk = relationship("CompoundRisk", back_populates="farmer", uselist=False)

# ─────────────────────────────────────────────
# Table 2: Financial_Profiles (Farmer's Input)
# ─────────────────────────────────────────────
class FinancialProfile(Base):
    __tablename__ = "financial_profiles"

    id = Column(String, primary_key=True, default=generate_uuid)
    farmer_id = Column(String, ForeignKey("farmers.id"), unique=True)
    annual_income = Column(Integer)
    total_outstanding_loan = Column(Integer)
    has_previous_default = Column(Boolean, default=False)
    land_size_acres = Column(Float)
    primary_crop = Column(String)
    financial_risk_score = Column(Float, nullable=True)  # Calculated by ML

    farmer = relationship("Farmer", back_populates="financial_profile")

# ─────────────────────────────────────────────
# Table 3: Environmental_Data (From External APIs)
# ─────────────────────────────────────────────
class EnvironmentalData(Base):
    __tablename__ = "environmental_data"

    id = Column(String, primary_key=True, default=generate_uuid)
    farmer_id = Column(String, ForeignKey("farmers.id"), unique=True)
    current_rainfall_mm = Column(Float, nullable=True)
    historical_disaster_risk = Column(String)  # 'High', 'Medium', 'Low'
    last_api_update = Column(DateTime, default=datetime.utcnow)
    disaster_risk_score = Column(Float, nullable=True)  # Calculated by ML

    farmer = relationship("Farmer", back_populates="environmental_data")

# ─────────────────────────────────────────────
# Table 4: Compound_Risk (The Final Result)
# ─────────────────────────────────────────────
class CompoundRisk(Base):
    __tablename__ = "compound_risk"

    id = Column(String, primary_key=True, default=generate_uuid)
    farmer_id = Column(String, ForeignKey("farmers.id"), unique=True)
    compound_score = Column(Float, nullable=True)
    xai_explanation = Column(Text, nullable=True)
    status = Column(String)  # 'Safe', 'Warning', 'Critical'

    farmer = relationship("Farmer", back_populates="compound_risk")
