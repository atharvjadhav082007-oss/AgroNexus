# pyrefly: ignore [missing-import]
import os
from pathlib import Path
# pyrefly: ignore [missing-import]
from sqlalchemy import create_engine
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import sessionmaker, declarative_base
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

# Load .env from the backend directory (two levels up from this file)
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Read DATABASE_URL from .env file
DATABASE_URL = os.getenv("DATABASE_URL")
fallback_url = "sqlite:///./khetseva.db"
engine = None

if DATABASE_URL:
    try:
        connect_args = {}
        if DATABASE_URL.startswith("sqlite"):
            connect_args["check_same_thread"] = False
        
        test_engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
        # Test connection
        with test_engine.connect() as conn:
            from sqlalchemy import text
            conn.execute(text("SELECT 1"))
        engine = test_engine
    except Exception as e:
        print(f"Warning: Failed to connect to primary database. Falling back to SQLite. Error: {e}")
        engine = None

if not engine:
    connect_args = {"check_same_thread": False}
    engine = create_engine(fallback_url, connect_args=connect_args, pool_pre_ping=True)

# Create a SessionLocal class for handling database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a Base class that our models will inherit from
Base = declarative_base()

# Dependency to get the DB session in API routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
