# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from app.dp.database import engine, Base
from app.dp import models

# This command tells SQLAlchemy to create all tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="KhetSeva API")

# Include routers
from app.routers import farmer as farmer_router
from app.routers import auth as auth_router

app.include_router(auth_router.router, prefix="/auth", tags=["auth"])
app.include_router(farmer_router.router, prefix="/farmer", tags=["farmer"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the KhetSeva Backend!"}
