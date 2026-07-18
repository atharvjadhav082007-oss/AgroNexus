# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from app.dp.database import engine, Base
from app.dp import models

# This command tells SQLAlchemy to create all tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="KhetSeva API")

@app.get("/")
def read_root():
    return {"message": "Welcome to the KhetSeva Backend!"}
