# ⚙️ KhetSeva Backend — FastAPI API

This is the FastAPI backend supporting the **KhetSeva** compound risk platform.

---

## 🛠️ Main Features

1. **Robust Authentication**: JWT-based signed bearer token flow.
2. **Scorecard Engine**: Deterministic weighted evaluation of financial vulnerability.
3. **Open-Meteo Integration**: Calculates 16-day rainfall forecasts, drought conditions, flood events, and consecutive heat stress days without requiring API keys.
4. **Matched Schemes**: Matches farmers to 7 active Indian government schemes.
5. **Optimization Module**: Powered by Google **OR-Tools CP-SAT** to maximize relief output within budget constraints.

---

## 🛣️ API Endpoints

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new farmer account (Step 1).
* `POST /api/auth/login` — Authenticate and receive a JWT.

### 🌾 Farmer Services (`/api/farmer`)
* `POST /api/farmer/onboarding/2` — Save farm characteristics (Step 2).
* `POST /api/farmer/onboarding/3` — Save financial profile, trigger scorecard + weather services, save first risk assessment (Step 3).
* `GET /api/farmer/dashboard` — Fetch complete profile, risk scores, matches, forecast details, and recommendations.
* `POST /api/farmer/recompute` — Force-refresh risk scores to update history trends.

### 📉 Risk Reports (`/api/risk`)
* `GET /api/risk/financial` — Fetch financial scorecard factors.
* `GET /api/risk/disaster` — Fetch weather forecast and drought/flood/heat signals.
* `GET /api/risk/compound` — Fetch compound risk and XAI logic.
* `GET /api/risk/history` — Fetch historical risk logs for trends.

### 👮 Government Panel (`/api/government`)
* `GET /api/government/dashboard` — Fetch list of all farmers sorted by compound risk with color-coded risk bands.
* `POST /api/government/optimize` — Run OR-Tools optimizer given a budget.

---

## 🏃 Run Locally

```bash
# Setup virtual environment
python -m venv venv
source venv/bin/activate # On macOS/Linux
venv\Scripts\activate   # On Windows

# Install packages
pip install -r requirements.txt

# Run the FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```
The interactive API documentation is available at `http://localhost:8000/docs`.
