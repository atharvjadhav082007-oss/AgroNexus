# Implementation Plan - Phase 2: Farmer Onboarding, Weather Integrations & Data Pipeline

We will implement the Farmer Onboarding Flow (Frontend Form), connect the Backend to real Weather APIs, and build the data pipeline that links registration to weather fetching and database population.

---

## Proposed Changes

### Backend Components

#### [NEW] [weather.py](file:///d:/Hackethon_01/AgroNexus/backend/app/services/weather.py)
Create a service that interacts with OpenWeatherMap (using the API key in `.env`) to retrieve weather data (temperature, humidity, pressure, and rainfall/precipitation forecast).
- Parse the current weather and 5-day forecast.
- Map the weather condition and coordinates to a standard disaster/hazard risk tier (High, Medium, Low) based on historical zones in India (or custom geolocation mapping) to populate the `historical_disaster_risk` field.

#### [NEW] [schemas.py](file:///d:/Hackethon_01/AgroNexus/backend/app/schemas.py)
Define Pydantic schema validation models for:
- Farmer registration (`FarmerCreate`, `FarmerResponse`)
- Farmer login (`FarmerLogin`)
- Financial Profile (`FinancialProfileCreate`, `FinancialProfileResponse`)
- Unified Status (`FarmerStatusResponse` linking farmer, financial, environmental, and compound risk details)

#### [NEW] [auth.py](file:///d:/Hackethon_01/AgroNexus/backend/app/services/auth.py)
Implement simple password hashing (e.g., using `passlib` or simple fallback hash logic if we avoid heavy system dependencies during the hackathon) and JWT generation to protect the farmer portal endpoints.

#### [MODIFY] [main.py](file:///d:/Hackethon_01/AgroNexus/backend/app/main.py)
Incorporate endpoints:
- `POST /api/auth/register` (handles onboarding step 1: account creation, PIN/coordinates)
- `POST /api/auth/login` (logs in the farmer)
- `POST /api/farmer/profile` (onboarding step 2: saves crop details and financial details, automatically kicks off the weather fetching pipeline and creates the placeholder `CompoundRisk` record)
- `GET /api/farmer/dashboard` (returns the farmer's current environmental data, risk score, and XAI explanations)

---

### Frontend Components

#### [NEW] [types.ts](file:///d:/Hackethon_01/AgroNexus/frontend/src/types.ts)
Define TypeScript interfaces for onboarding form fields, registration payload, and user authentication state.

#### [NEW] [OnboardingForm.tsx](file:///d:/Hackethon_01/AgroNexus/frontend/src/components/OnboardingForm.tsx)
Build a multi-step onboarding wizard with transitions:
- **Step 1: Account Setup** (Full Name, Phone Number, Password, PIN Code)
  - Automatically queries browser Geolocation API if PIN is entered or when a button "Use Current Location" is clicked.
- **Step 2: Farm & Crop Details** (Land Size in acres, Primary Crop type)
- **Step 3: Financial Background** (Annual Income, Total Outstanding Loans, Debt Default history)
- **Design details**: Use Tailwind with a modern premium design system (earthy warm tones, glassmorphism, responsive forms with micro-interactions, dark/light mode adaptable styles).

#### [MODIFY] [App.tsx](file:///d:/Hackethon_01/AgroNexus/frontend/src/App.tsx)
Integrate state management:
- Keep track of logged-in status.
- If not logged in, show the Onboarding (Register/Login) views.
- If logged in, show a beautiful, clean Dashboard containing weather widgets, financial status overview, and preliminary risk reports.

---

## Verification Plan

### Automated Tests
We will write a python integration test script to verify:
1. Registration API creates a SQLite record.
2. The endpoint successfully fetches weather from OpenWeatherMap (or returns fallback mocked weather if API key is invalid/unavailable).
3. Financial profile API creates financial record and triggers the environment sync.

### Manual Verification
- Deploy backend and frontend locally.
- Run `npm run dev` and navigate through the onboarding flow.
- Grant Geolocation permission and verify coordinate values.
- Submit form and verify dashboard updates with database-backed risk data.
