from pydantic import BaseModel, Field
from typing import Optional

class FarmerCreate(BaseModel):
    full_name: str = Field(..., example="Ram Kumar")
    phone_number: str = Field(..., example="9876543210")
    pin_code: str = Field(..., example="400001")

class FarmerOut(BaseModel):
    id: str
    full_name: str
    phone_number: str
    pin_code: Optional[str]

    class Config:
        orm_mode = True
