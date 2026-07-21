from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from .database import Base


def generate_uuid():
    """Generate a unique UUID string for primary keys."""
    return str(uuid.uuid4())


# ─────────────────────────────────────────────
# Table 1: Farmers (Identity & Location)
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

    # Relationships
    farm_details = relationship("FarmDetails", back_populates="farmer", uselist=False)
    financial_details = relationship("FinancialDetails", back_populates="farmer", uselist=False)
    risk_scores = relationship("RiskScore", back_populates="farmer", order_by="RiskScore.computed_at.desc()")
    recommendations = relationship("RecommendationLog", back_populates="farmer", order_by="RecommendationLog.created_at.desc()")


# ─────────────────────────────────────────────
# Table 2: Farm Details (Step 2 of Onboarding)
# ─────────────────────────────────────────────
class FarmDetails(Base):
    __tablename__ = "farm_details"

    id = Column(String, primary_key=True, default=generate_uuid)
    farmer_id = Column(String, ForeignKey("farmers.id"), unique=True, nullable=False)

    land_size_acres = Column(Float, nullable=False)                    # e.g. 2.5
    ownership_type = Column(String, nullable=False)                    # owned / leased / sharecropper
    crops = Column(String, nullable=False)                             # comma-separated or primary crop
    crop_season = Column(String, nullable=True)                        # Kharif / Rabi / Both
    irrigation_source = Column(String, nullable=False)                 # rainfed / canal / borewell / drip
    soil_type = Column(String, nullable=True)                          # alluvial / black / red / laterite / sandy
    experience_years = Column(Integer, nullable=True)                  # years farming

    farmer = relationship("Farmer", back_populates="farm_details")


# ─────────────────────────────────────────────
# Table 3: Financial Details (Step 3 of Onboarding)
# ─────────────────────────────────────────────
class FinancialDetails(Base):
    __tablename__ = "financial_details"

    id = Column(String, primary_key=True, default=generate_uuid)
    farmer_id = Column(String, ForeignKey("farmers.id"), unique=True, nullable=False)

    loan_amount = Column(Float, default=0.0)                           # in ₹
    loan_source = Column(String, default="none")                       # bank / kcc / moneylender / none
    has_insurance = Column(Boolean, default=False)
    insurance_scheme = Column(String, nullable=True)                   # PMFBY / private / other / null
    income_band = Column(String, nullable=False)                       # <1L / 1-3L / 3-5L / 5L+
    past_crop_loss = Column(Boolean, default=False)                    # crop loss in last 2 seasons
    dependents = Column(Integer, default=1)                            # number of dependents

    farmer = relationship("Farmer", back_populates="financial_details")


# ─────────────────────────────────────────────
# Table 4: Risk Scores (Historical — for trend charts)
# ─────────────────────────────────────────────
class RiskScore(Base):
    __tablename__ = "risk_scores"

    id = Column(String, primary_key=True, default=generate_uuid)
    farmer_id = Column(String, ForeignKey("farmers.id"), nullable=False)

    financial_risk = Column(Float, nullable=False)                     # 0-100
    disaster_risk = Column(Float, nullable=False)                      # 0-100
    compound_risk = Column(Float, nullable=False)                      # 0-100
    compound_label = Column(String, nullable=False)                    # Stable / Watch / High Risk / Critical
    xai_explanation = Column(Text, nullable=True)                      # why is the risk what it is

    # Snapshot of what drove the scores (for explainability)
    financial_factors_json = Column(Text, nullable=True)               # JSON: scorecard breakdown
    disaster_factors_json = Column(Text, nullable=True)                # JSON: drought/flood/heat signals
    eligible_schemes_json = Column(Text, nullable=True)                # JSON: matched schemes

    computed_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("Farmer", back_populates="risk_scores")


# ─────────────────────────────────────────────
# Table 5: Schemes (Static catalog)
# ─────────────────────────────────────────────
class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=False)
    benefit = Column(String, nullable=False)                           # what it gives
    eligibility_rules_json = Column(Text, nullable=True)               # JSON rules for matching
    apply_url = Column(String, nullable=True)


# ─────────────────────────────────────────────
# Table 6: Recommendations Log
# ─────────────────────────────────────────────
class RecommendationLog(Base):
    __tablename__ = "recommendations_log"

    id = Column(String, primary_key=True, default=generate_uuid)
    farmer_id = Column(String, ForeignKey("farmers.id"), nullable=False)
    recommendation_text = Column(Text, nullable=False)
    category = Column(String, nullable=True)                           # financial / disaster / scheme / general
    priority = Column(String, nullable=True)                           # urgent / recommended / informational
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("Farmer", back_populates="recommendations")
