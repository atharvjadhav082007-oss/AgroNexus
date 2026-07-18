# 🌾 KhetSeva (AgroNexus) - Project Implementation Roadmap (Farmer-Input + Real Weather Data)

If farmers are directly inputting their own data, this completely solves the privacy/data-sourcing issue for financial records! Your platform now becomes a **two-sided system**: a Farmer-facing portal for data collection, and a Government-facing dashboard for analysis and resource allocation.

Here is the updated step-by-step detailed process for this architecture.

---

## Phase 1: Architecture & Two-Sided Data Schema (Days 1-2)

**Goal:** Establish the foundation to handle both user inputs and external weather APIs.

1.  **Define the Data Schema:**
    *   **Farmers Table:** ID, Name, Phone Number, Location (GPS Lat/Lon or PIN Code).
    *   **Farmer Input Data (Self-Reported):** Annual Income, Outstanding Loan Amount, Loan Defaults (Yes/No), Landholding Size (Acres), Crop Type.
    *   **Environmental Data (External Real Data):** Historical disaster occurrences, real-time rainfall index, soil moisture (mapped to the farmer's PIN code).
2.  **Initialize the Repositories:**
    *   Create a backend folder initialized with Python (FastAPI).
    *   Create a frontend folder initialized with React (Vite/Next.js).
3.  **Database Setup:**
    *   Set up PostgreSQL. This will now act as a live registry of farmers who have "opted-in" to the platform.

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
    *   Farmer submits form $\rightarrow$ Backend saves financial data $\rightarrow$ Backend fetches weather data for their location $\rightarrow$ Backend triggers ML Scoring.

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
