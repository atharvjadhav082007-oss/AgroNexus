import sys
import os

# Add the backend path so we can import the app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.financial_risk import financial_risk_service

scenarios = [
    {
        "name": "Scenario A: Ideal Farmer (Low Risk)",
        "inputs": {"loan_amount": 10000, "land_acres": 15, "has_insurance": True, "has_recent_loss": False, "income_bracket": 3}
    },
    {
        "name": "Scenario B: Average Farmer (Moderate Risk)",
        "inputs": {"loan_amount": 50000, "land_acres": 5, "has_insurance": True, "has_recent_loss": True, "income_bracket": 1}
    },
    {
        "name": "Scenario C: Vulnerable Farmer (High Risk)",
        "inputs": {"loan_amount": 150000, "land_acres": 1.5, "has_insurance": False, "has_recent_loss": False, "income_bracket": 0}
    },
    {
        "name": "Scenario D: Distressed Farmer (Severe Risk)",
        "inputs": {"loan_amount": 500000, "land_acres": 1.0, "has_insurance": False, "has_recent_loss": True, "income_bracket": 0}
    },
]

for s in scenarios:
    print(f"--- {s['name']} ---")
    inputs = s["inputs"]
    print(f"Inputs: Loan: Rs.{inputs['loan_amount']}, Land: {inputs['land_acres']} acres, Insurance: {inputs['has_insurance']}, Recent Loss: {inputs['has_recent_loss']}, Income Band: {inputs['income_bracket']}")
    
    result = financial_risk_service.calculate_risk(
        loan_amount=inputs["loan_amount"],
        land_acres=inputs["land_acres"],
        has_insurance=inputs["has_insurance"],
        has_recent_loss=inputs["has_recent_loss"],
        income_bracket=inputs["income_bracket"]
    )
    
    print(f"Score: {result['financial_risk_score']} | Band: {result['risk_band']}\n")
