# 🌾 AgroNexus - Project Structure Explained

```
d:\Hackethon_01\
├── 📄 README.md                  ← Project description
├── 📄 khetseva_roadmap.md        ← Full 6-phase roadmap
├── 📄 phase1_details.md          ← Detailed Phase 1 guide
├── 📄 all_phases.md              ← Combined all phases document
│
└── AgroNexus/                    ← 🏠 MAIN PROJECT FOLDER
    ├── backend/                  ← 🐍 PYTHON BACKEND (FastAPI)
    └── frontend/                 ← ⚛️ REACT FRONTEND (Vite + TypeScript)
```

---

## 🐍 Backend (`AgroNexus/backend/`)

| File/Folder | What it does |
|---|---|
| `.env` | Stores **secret config** (database URL, API keys). Never committed to git. |
| `.gitignore` | Tells git to ignore `venv/`, `.env`, `__pycache__/`, etc. |
| `requirements.txt` | Lists all Python packages needed (fastapi, sqlalchemy, etc.). Run `pip install -r requirements.txt` to install them. |
| `venv/` | Your **Python virtual environment** — contains all installed packages isolated from your system Python. |
| `khetseva.db` | The **SQLite database file** — this is where all your farmer data is stored locally. |
| `test.db` | An old test database (can be deleted). |

### 📂 `backend/app/` — The Application Code

| File | What it does |
|---|---|
| `__init__.py` | Makes `app/` a Python package so you can do `from app.dp import ...` |
| `main.py` | **The entry point** — starts the FastAPI server, creates database tables, and defines the root `/` API endpoint. You run the server with `uvicorn app.main:app`. |

### 📂 `backend/app/dp/` — Database & Models

| File | What it does |
|---|---|
| `database.py` | **Database connection** — reads `DATABASE_URL` from `.env`, creates the SQLAlchemy engine, session, and the `Base` class. Also provides `get_db()` function for API routes to access the database. |
| `models.py` | **Database table definitions** — defines all 4 tables as Python classes: |
| | • `Farmer` — User accounts (name, phone, location, password) |
| | • `FinancialProfile` — Farmer's financial data (income, loans, land, crops) |
| | • `EnvironmentalData` — Weather/disaster data from external APIs |
| | • `CompoundRisk` — The final calculated risk score + explanation |

---

## ⚛️ Frontend (`AgroNexus/frontend/`)

| File/Folder | What it does |
|---|---|
| `index.html` | The **single HTML page** — React mounts into this. |
| `package.json` | Lists all JavaScript dependencies (react, axios, leaflet, etc.) and scripts (`npm run dev`). |
| `package-lock.json` | Locks exact versions of all dependencies. |
| `vite.config.ts` | **Vite configuration** — the build tool settings (dev server port, plugins, etc.). |
| `tsconfig.json` | TypeScript configuration. |
| `node_modules/` | All installed npm packages (auto-generated, never edit). |
| `public/` | Static files served as-is (favicon, images). |

### 📂 `frontend/src/` — The React App Code

| File | What it does |
|---|---|
| `main.tsx` | **Entry point** — renders the `<App />` component into the HTML page. |
| `App.tsx` | **Main app component** — the root React component (currently the default Vite template). |
| `App.css` | Styles specific to the `App` component. |
| `index.css` | **Global styles** — applies to the entire application. |
| `assets/` | Folder for images, fonts, and other static assets used by components. |

---

## 🔄 How They Connect

```
Farmer (Browser)
    │
    ▼
┌──────────────┐       API calls        ┌──────────────────┐
│   FRONTEND   │  ───────────────────►  │     BACKEND      │
│  React/Vite  │  (axios/fetch)         │     FastAPI      │
│  Port: 5173  │  ◄───────────────────  │    Port: 8000    │
└──────────────┘       JSON responses   └──────────────────┘
                                              │
                                              ▼
                                       ┌──────────────┐
                                       │   DATABASE   │
                                       │   SQLite /   │
                                       │  PostgreSQL  │
                                       └──────────────┘
```

## ▶️ How to Run

| What | Command | Where |
|---|---|---|
| Start Backend | `.\venv\Scripts\python.exe -m uvicorn app.main:app --reload` | `AgroNexus/backend/` |
| Start Frontend | `npm run dev` | `AgroNexus/frontend/` |
