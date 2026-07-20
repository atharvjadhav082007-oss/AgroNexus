"""
KhetSeva Auth Service — Password hashing (bcrypt) + JWT tokens (python-jose).
"""

import os
from datetime import datetime, timedelta
from typing import Optional

from jose import jwt, JWTError

SECRET_KEY = os.getenv("SECRET_KEY", "khetseva-secret-key-change-in-prod-hackathon-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 2

import bcrypt

def hash_password(password: str) -> str:
    """Hash a password using native bcrypt."""
    pw_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pw_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a bcrypt hash.
    Also handles legacy SHA256 hashes for backward compatibility.
    """
    # Try bcrypt first
    try:
        pw_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        if bcrypt.checkpw(pw_bytes, hashed_bytes):
            return True
    except Exception:
        pass

    # Fallback: check legacy SHA256 hash (for existing users before migration)
    import hashlib
    legacy_salt = "khetseva-salt-static-secure-1092"
    legacy_hash = hashlib.sha256((plain_password + legacy_salt).encode("utf-8")).hexdigest()
    if legacy_hash == hashed_password:
        return True

    return False


def needs_rehash(hashed_password: str) -> bool:
    """Check if a password hash needs to be upgraded to bcrypt."""
    return not (hashed_password.startswith("$2a$") or hashed_password.startswith("$2b$"))



# ─────────────────────────────────────────────
# JWT Tokens (python-jose)
# ─────────────────────────────────────────────

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and verify a JWT token. Returns payload dict or None."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
