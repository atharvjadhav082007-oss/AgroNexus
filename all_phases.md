# 🌾 KhetSeva (AgroNexus) - All Phases Implementation Guide

This document combines the detailed setup from Phase 1 with the complete roadmap for all subsequent phases.

---

## Phase 1: Architecture & Setup (Detailed Guide)

**Goal:** Establish the foundation to handle both user inputs and external weather APIs.

### Step 1: Define the Database Schema
Since we have a two-sided system (Farmers inputting data + Government viewing it), we need a relational database. PostgreSQL is highly recommended for this. 

You need to design (and eventually create) these core tables:

**Table 1: `Farmers` (User Accounts)**
*   `id` (Primary Key, UUID)
*   `full_name` (String)
*   `phone_number` (String, Unique)
*   `password_hash` (String)
*   `pin_code` (String)
*   `latitude` (Float) - *Crucial for the map and weather API*
*   `longitude` (Float) - *Crucial for the map and weather API*
*   `created_at` (Timestamp)

**Table 2: `Financial_Profiles` (The Farmer's Input)**
*   `id` (Primary Key, UUID)
*   `farmer_id` (Foreign Key -> Farmers.id)
*   `annual_income` (Integer)
*   `total_outstanding_loan` (Integer)
*   `has_previous_default` (Boolean)
*   `land_size_acres` (Float)
*   `primary_crop` (String)
*   `financial_risk_score` (Float, 0-100) - *Calculated by ML later*

**Table 3: `Environmental_Data` (From External APIs)**
*   `id` (Primary Key, UUID)
*   `farmer_id` (Foreign Key -> Farmers.id)
*   `current_rainfall_mm` (Float)
*   `historical_disaster_risk` (String: 'High', 'Medium', 'Low')
*   `last_api_update` (Timestamp)
*   `disaster_risk_score` (Float, 0-100) - *Calculated by ML later*

**Table 4: `Compound_Risk` (The Final Result)**
*   `id` (Primary Key, UUID)
*   `farmer_id` (Foreign Key -> Farmers.id)
*   `compound_score` (Float, 0-100)
*   `xai_explanation` (Text)
*   `status` (String: 'Safe', 'Warning', 'Critical')

### Step 2: Initialize Your Repositories
*   **Backend (Python/FastAPI):** Set up virtual environment, install (`fastapi`, `uvicorn`, `sqlalchemy`, `psycopg2-binary`, `pydantic`, `scikit-learn`, `ortools`, `requests`).
*   **Frontend (React/Vite):** Initialize with TypeScript, install (`react-router-dom`, `axios`, `leaflet`, `react-leaflet`, `tailwindcss`).

### Step 3: Setup the Database (PostgreSQL)
Configure local or cloud (Supabase/Neon) PostgreSQL and connect using SQLAlchemy via `.env` file.

---

## Phase 2: Building the Farmer Portal & API Integrations (Days 3-5)

**Goal:** Build the interface for farmers to input data and connect to real weather APIs.

1.  **Farmer Onboarding Flow (Frontend):**
    *   Build a simple, mobile-friendly web form (possibly multi-lingual).
    *   Collect: Demographics, Land Details, Financial/Debt Status.
    *   *Crucial:* Capture their exact Location (using browser Geolocation API or PIN Code).
2.  **External Weather/Disaster Integrations (Backend):**
    *   Integrate **IMD (Indian Meteorological Department)** APIs or **OpenWeatherMap** APIs to fetch the current and forecasted weather for the farmer's specific coordinates.
    *   Integrate historical disaster maps (from **ISRO Bhuvan** or NDMA) to tag if their location is a known flood/drought zone.
3.  **The Pipeline:**
    *   Farmer submits form -> Backend saves financial data -> Backend fetches weather data for their location -> Backend triggers ML Scoring.

---

## Phase 3: Machine Learning & Risk Scoring (Days 6-8)

**Goal:** Calculate personalized risk scores for every farmer who registers.

1.  **Financial Risk Scoring (0-100):**
    *   Based entirely on the data the farmer submitted. High debt-to-income ratio + small land size = High Financial Risk.
2.  **Disaster Probability Scoring (0-100):**
    *   Calculated by crossing historical disaster maps with the real-time rainfall forecast for their specific PIN code.
3.  **Compound Risk Score (CRS):**
    *   Develop the multiplier algorithm. If a farmer reports heavy debt AND the API says a drought is imminent in their PIN code, the CRS spikes into the red zone.
4.  **Explainable AI (XAI) Generation:**
    *   *Example Output:* "Your Compound Risk is 88/100 because you reported an outstanding loan of ₹1,00,000, and IMD forecasts a 40% rainfall deficit for your PIN code over the next 3 weeks."

---

## Phase 4: The Optimization Engine (Days 9-10)

**Goal:** Use Google OR-Tools on the aggregated farmer data to solve the "Resource Allocation Problem" for the government.

1.  **The Scenario:** 5,000 farmers have registered and inputted their data. 800 of them have a critical Compound Risk Score. The government has a relief budget of ₹1 Crore.
2.  **Implement CP-SAT Solver:**
    *   Write a Python script using `ortools.sat.python.cp_model`.
    *   The model looks at all registered farmers, their specific CRS, and the cost of different interventions (e.g., Debt Forgiveness vs. Seed Subsidy).
    *   It outputs the exact list of which farmers should receive which intervention to maximize the total risk mitigated within the ₹1 Crore budget.

---

## Phase 5: Backend API Development (Days 11-12)

**Goal:** Finalize the FastAPI endpoints.

1.  **Farmer Endpoints:**
    *   `POST /api/farmer/register` - Accepts farmer form data.
    *   `GET /api/farmer/{id}/status` - Returns the farmer's calculated risk score and recommended interventions.
2.  **Government Endpoints:**
    *   `GET /api/dashboard/map-data` - Returns aggregated geospatial data of all registered farmers for the map.
    *   `POST /api/optimize-allocation` - Accepts a budget, runs OR-Tools on the registered farmer database, and returns the allocation plan.

---

## Phase 6: Government Dashboard Development (Days 13-15)

**Goal:** Build the premium, interactive UI for policymakers to view the aggregated data.

1.  **Map Integration (Leaflet/Mapbox):**
    *   Display a map showing pins for all registered farmers, color-coded by their Compound Risk Score (Red = Critical, Yellow = Warning, Green = Safe).
2.  **Analytics & Charts (Plotly/Recharts):**
    *   Display real-time statistics: Total registered farmers, % in financial distress, impending crisis alerts based on weather APIs.
3.  **Resource Optimizer UI:**
    *   The government official inputs their budget, clicks "Run Optimization", and sees a table of exactly which registered farmers should receive aid based on the OR-Tools calculation.

---

## Summary of the Data Flow:
1. **Farmer Input** -> Farmer submits financial/land data and location via a mobile-friendly web app.
2. **Backend API Fetch** -> System automatically fetches real weather/disaster data for that location from IMD/ISRO.
3. **Scoring Engine** -> Calculates the Compound Risk Score using both the farmer's data and the real weather data.
4. **Database** -> Stores the farmer profile and scores.
5. **Government Dashboard** -> Displays all vulnerable farmers on a live map.
6. **OR-Tools Optimizer** -> Government clicks "Optimize", and the system calculates how to distribute limited relief funds among the registered farmers.
