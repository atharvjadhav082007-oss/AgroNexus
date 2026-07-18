# 🌾 KhetSeva - Phase 1: Architecture & Setup (Detailed Guide)

Phase 1 is about laying the concrete foundation for the project. Before writing any ML algorithms or building the map, you need to set up your folders, install the core libraries, and design the database exactly right. 

Here is exactly what you need to do, step-by-step.

---

## Step 1: Define the Database Schema

Since we have a two-sided system (Farmers inputting data + Government viewing it), we need a relational database. PostgreSQL is highly recommended for this. 

You need to design (and eventually create) these core tables:

### Table 1: `Farmers` (User Accounts)
*   `id` (Primary Key, UUID)
*   `full_name` (String)
*   `phone_number` (String, Unique)
*   `password_hash` (String)
*   `pin_code` (String)
*   `latitude` (Float) - *Crucial for the map and weather API*
*   `longitude` (Float) - *Crucial for the map and weather API*
*   `created_at` (Timestamp)

### Table 2: `Financial_Profiles` (The Farmer's Input)
*   `id` (Primary Key, UUID)
*   `farmer_id` (Foreign Key -> Farmers.id)
*   `annual_income` (Integer)
*   `total_outstanding_loan` (Integer)
*   `has_previous_default` (Boolean)
*   `land_size_acres` (Float)
*   `primary_crop` (String)
*   `financial_risk_score` (Float, 0-100) - *Calculated by ML later*

### Table 3: `Environmental_Data` (From External APIs)
*   `id` (Primary Key, UUID)
*   `farmer_id` (Foreign Key -> Farmers.id)
*   `current_rainfall_mm` (Float)
*   `historical_disaster_risk` (String: 'High', 'Medium', 'Low') - *e.g., Is this a flood zone?*
*   `last_api_update` (Timestamp)
*   `disaster_risk_score` (Float, 0-100) - *Calculated by ML later*

### Table 4: `Compound_Risk` (The Final Result)
*   `id` (Primary Key, UUID)
*   `farmer_id` (Foreign Key -> Farmers.id)
*   `compound_score` (Float, 0-100)
*   `xai_explanation` (Text) - *The plain English reason for the score*
*   `status` (String: 'Safe', 'Warning', 'Critical')

---

## Step 2: Initialize Your Repositories

You need two separate projects: the Backend (Python) and the Frontend (React). Open your terminal and create a master folder called `AgroNexus`, then create the two sub-projects inside it.

### The Backend (FastAPI + Python)
1. Open terminal and run:
   ```bash
   mkdir AgroNexus
   cd AgroNexus
   mkdir backend
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   # Activate it:
   # On Windows: venv\Scripts\activate
   # On Mac/Linux: source venv/bin/activate
   ```
3. Install the essential libraries:
   ```bash
   pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic scikit-learn ortools requests
   ```
4. Create a `main.py` file to test the server.

### The Frontend (React/Next.js + TypeScript)
1. Open a new terminal tab and go back to the `AgroNexus` folder.
2. Initialize the React app (Using Vite is highly recommended for speed):
   ```bash
   npx create-vite@latest frontend --template react-ts
   cd frontend
   npm install
   ```
3. Install your core frontend libraries:
   ```bash
   npm install react-router-dom axios leaflet react-leaflet tailwindcss postcss autoprefixer
   ```
4. Setup Tailwind CSS for styling:
   ```bash
   npx tailwindcss init -p
   ```

---

## Step 3: Setup the Database (PostgreSQL)

You have two choices here depending on your comfort level:

**Option A (Local):**
1. Download and install PostgreSQL on your computer (pgAdmin is a good UI tool).
2. Create a new database named `khetseva_db`.
3. In your Python Backend, you will use SQLAlchemy to connect to `postgresql://username:password@localhost:5432/khetseva_db`.

**Option B (Cloud - Recommended for Hackathons):**
1. Go to **Supabase** (supabase.com) or **Neon** (neon.tech) and create a free account.
2. Create a new project/database. They will give you a connection string.
3. You can use their web interface to literally type in the tables and columns defined in Step 1 above without writing raw SQL.
4. Put the connection string into a `.env` file in your Python backend folder.

## End of Phase 1 Checklist:
- [ ] Database tables are designed or created.
- [ ] Python backend folder is created, virtual environment active, and libraries installed.
- [ ] React frontend folder is created and starts successfully (`npm run dev`).
- [ ] Backend is connected to the database.
