import sys
import os
import json

# Add the backend path so we can import the app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal, engine
from app.db import models
from app.services.geocode import geocode_service
from app.services.disaster_risk import disaster_risk_service

# Ensure tables are created (for PincodeCache if it doesn't exist)
models.Base.metadata.create_all(bind=engine)

def check_pincode_disaster(pincode: str):
    db = SessionLocal()
    try:
        print(f"--- Checking Pincode: {pincode} ---")
        loc = geocode_service.resolve_pincode(db, pincode)
        print(f"Location resolved: Lat {loc['latitude']:.4f}, Lon {loc['longitude']:.4f} (Source: {loc['source']})")
        
        result = disaster_risk_service.calculate_hazard_scores(loc['latitude'], loc['longitude'])
        print(f"Disaster Risk Score: {result['disaster_risk_score']} / 100")
        print(f"Dominant Hazard: {result['dominant_hazard']}")
        print("Breakdown:")
        for k, v in result['breakdown'].items():
            print(f"  - {k}: {v}")
        print("\n")
    except Exception as e:
        print(f"Error checking {pincode}: {e}\n")
    finally:
        db.close()

if __name__ == "__main__":
    check_pincode_disaster("422103")
