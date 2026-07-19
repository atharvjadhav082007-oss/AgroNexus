# 🌾 KhetSeva — Compound Farmer Risk Platform

**KhetSeva** is a proactive B2C decision-support system designed to prevent compound agricultural crises in India. Built around the core thesis that **a farmer rarely fails from a single disaster or loan default alone**, KhetSeva predicts compound crises — financial fragility combined with disaster exposure — **15 days before they hit**.

---

## 🚀 Key Features

### 👤 3-Step Guided Onboarding
- **Step 1: Identity & Location**: Captures basic profile details alongside precise GPS coordinates (browser `navigator.geolocation` API) and PIN code.
- **Step 2: Farm & Agriculture**: Gathers landholding size, crop details, soil type, crop season, and irrigation sources.
- **Step 3: Financial Details**: Gathers outstanding loans, loan sources (formal banks vs. informal moneylenders), crop insurance status, and historical crop loss.

### 📊 Transparent Scorecard Risk Engine (XAI)
- **Scorecard Financial Risk**: An audit-friendly, transparent scoring system (+25 for informal moneylenders, +20 for no insurance, +15 for marginal landholdings) instead of a black-box AI.
- **Open-Meteo Disaster Signals**: Integrates free 16-day daily forecasts to calculate Drought Index (vs. 3-year historical normals), Flood/Excess Rain rolling index, and Heat Stress consecutive days.
- **Probabilistic Compound Risk**: Uses a risk union formula:
  $$\text{Compound Risk} = 100 - \frac{(100 - F) \times (100 - D)}{100}$$
  Categorized into **Stable (0-39)**, **Watch (40-64)**, **High Risk (65-84)**, and **Critical (85-100)** with active dashboard warnings.

### 🏛️ Government Scheme Eligibility Matcher
Automatically evaluates eligibility for 7 central schemes:
1. **PM-KISAN** (Samman Nidhi)
2. **PMFBY** (Pradhan Mantri Fasal Bima Yojana)
3. **KCC** (Kisan Credit Card)
4. **PM Kisan Maandhan Yojana** (PM-KMY)
5. **e-NAM** (National Agriculture Market)
6. **Soil Health Card Scheme**
7. **PMKSY / PM-KUSUM** (Subsidized micro-irrigation)

### 💹 OR-Tools Resource Optimizer
Uses Google **OR-Tools CP-SAT** to optimally distribute limited relief budgets among distressed farmers, choosing between debt restructuring, micro-irrigation subsidies, or direct cash support to maximize total risk mitigated.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, Recharts, Framer Motion |
| **Backend** | FastAPI, Python, SQLite (via SQLAlchemy), Google OR-Tools |
| **APIs** | Open-Meteo Weather API, Gemini 2.0 Flash API (Optional) |

---

## 📁 Repository Structure

```
AgroNexus-main/
├── README.md                 ← Root documentation
├── DEVELOPMENT.md            ← Deployment & local setup details
├── AgroNexus/
│   ├── backend/
│   │   ├── app/
│   │   │   ├── main.py       ← FastAPI entry point & routers
│   │   │   ├── db/           ← Database models & SQLite config
│   │   │   ├── routes/       ← Modular API endpoints (Auth, Farmer, Risk, Government)
│   │   │   └── services/     ← Core logic (Weather, Scorecard Agents, Optimizer)
│   │   ├── requirements.txt
│   │   └── .env              ← Environment variables
│   │
│   └── frontend/
│       ├── src/
│       │   ├── components/   ← Shared elements & Wizard Form
│       │   ├── pages/        ← Dashboard, Schemes, Optimizer, Officer panel
│       │   ├── types.ts      ← Type definitions
│       │   └── main.tsx
│       ├── package.json
│       └── vite.config.ts
```

---

## 🚦 Quick Start Guide

### 1. Clone and Navigate
```bash
git clone https://github.com/atharvjadhav082007-oss/AgroNexus.git
cd AgroNexus
```

### 2. Backend Setup
```bash
cd AgroNexus/backend
python -m venv venv
venv\Scripts\activate      # On Windows
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:
```env
DATABASE_URL=sqlite:///./khetseva.db
SECRET_KEY=khetseva-secret-key-change-in-prod-hackathon-2026
GEMINI_API_KEY=your-gemini-api-key-here # Optional
```

Start the server:
```bash
python -m uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.
