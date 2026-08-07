import os
import numpy as np
import joblib
from sklearn.linear_model import LinearRegression

def generate_synthetic_data(n_samples=5000):
    np.random.seed(42)

    # loan_amount ~ lognormal, clipped to [5000, 3000000]
    loan_amount = np.clip(np.random.lognormal(mean=11.5, sigma=1.5, size=n_samples), 5000, 3000000)
    
    # land_acres ~ gamma distribution, clipped to [0.25, 40]
    land_acres = np.clip(np.random.gamma(shape=2.0, scale=2.0, size=n_samples), 0.25, 40.0)
    
    # has_insurance ~ Bernoulli(p=0.42)
    has_insurance = np.random.choice([0, 1], size=n_samples, p=[1 - 0.42, 0.42])
    
    # has_recent_loss ~ Bernoulli(p=0.30)
    has_recent_loss = np.random.choice([0, 1], size=n_samples, p=[1 - 0.30, 0.30])
    
    # income_bracket ~ choice([0,1,2,3], p=[0.35,0.35,0.20,0.10])
    income_bracket = np.random.choice([0, 1, 2, 3], size=n_samples, p=[0.35, 0.35, 0.20, 0.10])
    
    # Derived feature
    loan_to_land = loan_amount / (land_acres + 1)
    
    # True Risk Formula
    noise = np.random.normal(loc=0, scale=5, size=n_samples)
    risk = (
        30 
        + (0.00008 * loan_to_land)
        - (1.5 * land_acres)
        - (15 * has_insurance)
        + (20 * has_recent_loss)
        - (8 * income_bracket)
        + noise
    )
    risk = np.clip(risk, 0, 100)
    
    # Features matrix
    X = np.column_stack((loan_to_land, land_acres, has_insurance, has_recent_loss, income_bracket))
    y = risk
    
    return X, y

def train_and_save():
    print("Generating synthetic dataset (5000 rows)...")
    X, y = generate_synthetic_data(5000)
    
    print("Training OLS Linear Regression model...")
    model = LinearRegression()
    model.fit(X, y)
    
    print("Model trained. Learned Coefficients:")
    print(f"Intercept: {model.intercept_:.2f}")
    feature_names = ["loan_to_land", "land_acres", "has_insurance", "has_recent_loss", "income_bracket"]
    for name, coef in zip(feature_names, model.coef_):
        print(f"  {name}: {coef:.5f}")
        
    # Save the model
    # Define path relative to this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    app_services_dir = os.path.join(script_dir, "..", "app", "services")
    os.makedirs(app_services_dir, exist_ok=True)
    
    model_path = os.path.join(app_services_dir, "financial_risk_model.pkl")
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_and_save()
