import os
import hashlib
import hmac
import json
import base64
from datetime import datetime, timedelta
from typing import Optional

SECRET_KEY = os.getenv("SECRET_KEY", "khetseva-secret-key-change-in-prod-hackathon-2026")

def hash_password(password: str) -> str:
    """Hash password using a salt and SHA256."""
    salt = "khetseva-salt-static-secure-1092"
    hashed = hashlib.sha256((password + salt).encode("utf-8")).hexdigest()
    return hashed

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password by comparing hashes."""
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a lightweight signed JWT-like token (no external dependencies)."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=2)
        
    to_encode.update({"exp": expire.isoformat()})
    
    payload_bytes = json.dumps(to_encode).encode("utf-8")
    payload_b64 = base64.urlsafe_b64encode(payload_bytes).decode("utf-8")
    
    # Calculate HMAC SHA256 signature
    sig = hmac.new(
        SECRET_KEY.encode("utf-8"),
        payload_b64.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()
    
    return f"{payload_b64}.{sig}"

def decode_access_token(token: str) -> Optional[dict]:
    """Decode and verify a signed token."""
    try:
        parts = token.split(".")
        if len(parts) != 2:
            return None
            
        payload_b64, signature = parts
        
        # Verify HMAC signature
        expected_sig = hmac.new(
            SECRET_KEY.encode("utf-8"),
            payload_b64.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(expected_sig, signature):
            return None
            
        # Decode and parse JSON payload
        payload_bytes = base64.urlsafe_b64decode(payload_b64.encode("utf-8"))
        payload = json.loads(payload_bytes.decode("utf-8"))
        
        # Verify expiration
        exp_str = payload.get("exp")
        if not exp_str:
            return None
            
        expire_time = datetime.fromisoformat(exp_str)
        if datetime.utcnow() > expire_time:
            return None
            
        return payload
    except Exception:
        return None
