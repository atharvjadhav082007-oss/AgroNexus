import os
import joblib
import numpy as np
from pydantic import BaseModel

class FinancialRiskService:
    def __init__(self):
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(script_dir, "financial_risk_model.pkl")
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}. Please run train_financial_model.py first.")
        self.model = joblib.load(model_path)

    def calculate_risk(self, loan_amount: float, land_acres: float, has_insurance: bool, has_recent_loss: bool, income_bracket: int):
        # Derive feature
        loan_to_land = loan_amount / (land_acres + 1)
        
        # Prepare features matrix
        X = np.array([[
            loan_to_land, 
            land_acres, 
            int(has_insurance), 
            int(has_recent_loss), 
            income_bracket
        ]])
        
        # Predict
        predicted_risk = self.model.predict(X)[0]
        score = np.clip(predicted_risk, 0, 100)
        
        # Determine risk band
        if score < 25:
            band = "Low Risk"
        elif score < 50:
            band = "Moderate Risk"
        elif score < 75:
            band = "High Risk"
        else:
            band = "Severe Risk"
            
        return {
            "financial_risk_score": round(float(score), 2),
            "risk_band": band
        }

# Singleton instance
financial_risk_service = FinancialRiskService()
