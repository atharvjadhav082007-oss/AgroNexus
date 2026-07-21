# 🌾 AgroNexus (KhetSeva) — Compound Farmer Risk Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

**AgroNexus (KhetSeva)** is a proactive B2C decision-support system and administrative relief management platform designed to predict and mitigate compound agricultural crises across India. Built around the core thesis that **a farmer rarely fails from a single disaster or loan default alone**, AgroNexus predicts compound crises — combining financial vulnerability with 16-day disaster exposure — **up to 15 days before severe impact**.

---

## 🚀 Key Features

### 👤 1. 3-Step Guided Farmer Onboarding Wizard
- **Step 1: Identity & Location**: Captures basic profile details with browser `navigator.geolocation` GPS coordinates & PIN code.
- **Step 2: Farm & Agriculture**: Tracks landholding size, crop varieties, soil composition, cropping seasons, and irrigation infrastructure.
- **Step 3: Financial Fragility Profile**: Gathers debt details, credit sources (formal banks vs. informal moneylenders), crop insurance coverage, and historical crop loss records.

### 🤖 2. Multi-Lingual AI Agricultural Chatbot (KhetSeva Assistant)
- **Google Gemini AI Integration**: Powered by Google GenAI models for real-time agricultural advisory, crop disease diagnosis, scheme guidance, and risk explanations.
- **Interactive Floating UI**: Seamless widget accessible across all pages with quick prompt suggestions, voice-like responsiveness, and multi-lingual output.

### 🌐 3. Multi-Language Support
- Full UI internationalization supporting **English**, **Hindi (हिंदी)**, **Marathi (मराठी)**, and other regional Indian languages for accessibility by local farming communities.

### 📊 4. Transparent Scorecard Risk Engine (XAI)
- **Explainable Financial Risk Scorecard**: Audit-friendly scoring model (+25 for informal moneylender debt, +20 for uninsured crops, +15 for marginal landholdings) avoiding black-box ambiguity.
- **Open-Meteo Disaster Forecasting**: Real-time integration with Open-Meteo 16-day daily forecasts to calculate:
  - **Drought Index** (versus 3-year historical rainfall norms)
  - **Flood / Excess Rainfall Rolling Index**
  - **Heat Stress Index** (consecutive high-temperature days)
- **Probabilistic Compound Risk Union**: Calculates overall risk via the union formula:
  $$\text{Compound Risk} = 100 - \frac{(100 - \text{Financial Risk}) \times (100 - \text{Disaster Risk})}{100}$$
  Categorized into **Stable (0-39)**, **Watch (40-64)**, **High Risk (65-84)**, and **Critical (85-100)** with real-time dashboard warnings.

### 🏛️ 5. Automated Government Scheme Eligibility Matcher
Evaluates eligibility in real-time for 7 major Indian national agricultural schemes:
1. **PM-KISAN** (Pradhan Mantri Kisan Samman Nidhi)
2. **PMFBY** (Pradhan Mantri Fasal Bima Yojana)
3. **KCC** (Kisan Credit Card)
4. **PM-KMY** (Pradhan Mantri Kisan Maandhan Yojana)
5. **e-NAM** (National Agriculture Market)
6. **Soil Health Card Scheme**
7. **PM-KUSUM / PMKSY** (Solar Pumps & Micro-Irrigation Subsidies)

### 💹 6. Google OR-Tools Relief & Budget Optimizer
- Employs **Google OR-Tools CP-SAT Solver** for government agricultural officers to optimally allocate constrained relief budgets across distressed farmers.
- Recommends tailored interventions (debt restructuring, micro-irrigation subsidies, or direct cash transfers) to maximize overall risk reduction.

---

## 🛠️ Technology Stack

| Layer | Technologies & Frameworks |
|-------|--------------------------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Framer Motion, Recharts, Leaflet / React-Leaflet |
| **Backend** | Python 3.10+, FastAPI, SQLite / PostgreSQL (via SQLAlchemy), Pydantic v2, Uvicorn |
| **Optimization & AI** | Google OR-Tools (CP-SAT), Google GenAI (`google-genai` / Gemini API) |
| **External APIs** | Open-Meteo Weather API (No API key needed) |

---

## 📁 Repository Structure

```
AgroNexus/
├── README.md                 ← Root project documentation
├── DEVELOPMENT.md            ← Deployment & technical architecture details
└── AgroNexus/
    ├── backend/
    │   ├── app/
    │   │   ├── main.py       ← FastAPI entry point & CORS configuration
    │   │   ├── db/           ← SQLAlchemy models & database sessions
    │   │   ├── routes/       ← Modular API endpoints (Auth, Farmer, Risk, Government, Chatbot)
    │   │   ├── services/     ← Weather forecasts, Scorecards, AI Agents, OR-Tools Optimizer
    │   │   ├── schemas.py    ← Pydantic schemas & data validation
    │   │   └── errors.py     ← Centralized error handling
    │   ├── requirements.txt  ← Python dependencies
    │   └── .env              ← Environment configuration
    │
    └── frontend/
        ├── src/
        │   ├── components/   ← UI components (Navbar, AIChatbot, Wizard Form, Cards)
        │   ├── pages/        ← Dashboard, DisasterScore, FinancialSolutions, GovernmentSchemes, Landing
        │   ├── context/      ← LanguageContext (Multi-language state management)
        │   ├── services/     ← Axios API clients
        │   ├── App.tsx       ← Main application routes & setup
        │   └── main.tsx      ← React root renderer
        ├── package.json      ← Node dependencies
        └── vite.config.ts    ← Vite bundler configuration
```

---

## 💻 Quick Start & Local Setup

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**
- **Git**

---

### 1. Clone the Repository
```bash
git clone https://github.com/atharvjadhav082007-oss/AgroNexus.git
cd AgroNexus
```

---

### 2. Backend Setup (FastAPI)

Navigate to the backend directory:
```bash
cd AgroNexus/backend
```

Create and activate a virtual environment:
- **Windows**:
  ```powershell
  python -m venv venv
  .\venv\Scripts\activate
  ```
- **macOS / Linux**:
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

Install backend dependencies:
```bash
pip install -r requirements.txt
```

Create a `.env` file in `AgroNexus/backend/`:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
DATABASE_URL=sqlite:///./khetseva.db
SECRET_KEY=your_jwt_secret_key_here
```

Start the FastAPI backend server:
```bash
python -m uvicorn app.main:app --reload --port 8000
```
> 📍 Backend will run at: `http://localhost:8000`  
> 📚 Interactive API Docs (Swagger UI): `http://localhost:8000/docs`

---

### 3. Frontend Setup (React + Vite)

Open a new terminal and navigate to the frontend directory:
```bash
cd AgroNexus/frontend
```

Install frontend dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
> 📍 Frontend will run at: `http://localhost:5173`

---

## 🛣️ API Endpoint Quick Reference

| Router | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| **Auth** | `POST` | `/api/auth/register` | Register a new farmer account |
| **Auth** | `POST` | `/api/auth/login` | Authenticate user & issue JWT token |
| **Farmer** | `POST` | `/api/farmer/onboarding/{step}` | Save onboarding wizard steps (1, 2, 3) |
| **Farmer** | `GET` | `/api/farmer/dashboard` | Fetch comprehensive farmer risk profile |
| **Risk** | `GET` | `/api/risk/financial` | Fetch financial scorecard metrics |
| **Risk** | `GET` | `/api/risk/disaster` | Fetch Open-Meteo disaster forecast signals |
| **Risk** | `GET` | `/api/risk/compound` | Fetch combined compound risk calculation & XAI |
| **Government** | `GET` | `/api/government/dashboard` | Fetch state/district-wide farmer risk dashboard |
| **Government** | `POST` | `/api/government/optimize` | Run OR-Tools optimizer for relief allocation |
| **Chatbot** | `POST` | `/api/chatbot/query` | Query Gemini AI agricultural assistant |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
