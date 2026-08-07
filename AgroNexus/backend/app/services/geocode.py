import requests
import time
from sqlalchemy.orm import Session
from app.db.models import PincodeCache

class GeocodeService:
    def __init__(self):
        self.last_request_time = 0

    def resolve_pincode(self, db: Session, pincode: str):
        # 1. Check DB Cache
        cached = db.query(PincodeCache).filter(PincodeCache.pincode == pincode).first()
        if cached:
            return {"latitude": cached.latitude, "longitude": cached.longitude, "source": "cache"}

        # 2. Rate limit Nominatim (1 request per second)
        current_time = time.time()
        elapsed = current_time - self.last_request_time
        if elapsed < 1.0:
            time.sleep(1.0 - elapsed)
        self.last_request_time = time.time()

        # 3. Call Nominatim API
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            "postalcode": pincode,
            "country": "India",
            "format": "json"
        }
        headers = {
            "User-Agent": "KhetSeva-Risk-Scorer/1.0"
        }
        
        response = requests.get(url, params=params, headers=headers, timeout=10)
        
        if response.status_code != 200:
            raise Exception(f"Nominatim API failed with status {response.status_code}")
            
        data = response.json()
        
        if not data:
            raise Exception("Pincode could not be resolved.")
            
        # Get best match
        best_match = data[0]
        lat = float(best_match["lat"])
        lon = float(best_match["lon"])
        
        # 4. Save to Cache
        new_cache = PincodeCache(
            pincode=pincode,
            latitude=lat,
            longitude=lon
        )
        db.add(new_cache)
        db.commit()
        
        return {"latitude": lat, "longitude": lon, "source": "nominatim"}

geocode_service = GeocodeService()
