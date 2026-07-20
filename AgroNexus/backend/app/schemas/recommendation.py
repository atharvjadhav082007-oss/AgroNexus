from pydantic import BaseModel

class RecommendationOut(BaseModel):
    scheme_name: str
    priority: int
    benefit_amount: int
    reason: str

    class Config:
        orm_mode = True
