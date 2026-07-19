# AgroNexus (KhetSeva) - System Architecture

## 1. High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              AGRONEXUS SYSTEM                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  ┌──────────────────┐          ┌──────────────────┐         ┌──────────────┐   │
│  │  Farmer Portal   │          │  Government      │         │  Admin       │   │
│  │  (React/TS)      │          │  Dashboard       │         │  Panel       │   │
│  │                  │          │  (React/TS)      │         │              │   │
│  │  • Registration  │          │  • Map view      │         │  • Config    │   │
│  │  • Risk profile  │          │  • Analytics     │         │  • Schemes   │   │
│  │  • Alerts        │          │  • Allocation    │         │  • Users     │   │
│  └────────┬─────────┘          └────────┬─────────┘         └──────┬───────┘   │
│           │                             │                          │            │
│           └─────────────────────────────┴──────────────────────────┘            │
│                                         │                                       │
│                          ┌──────────────▼──────────────┐                       │
│                          │    NGINX / Reverse Proxy    │                       │
│                          │ (TLS termination, routing)  │                       │
│                          └──────────────┬──────────────┘                       │
│                                         │                                       │
│  ┌──────────────────────────────────────▼──────────────────────────────────┐  │
│  │                           FastAPI Backend                                │  │
│  ├──────────────────────────────────────────────────────────────────────────┤  │
│  │ Routers:                                                                 │  │
│  │  • /auth (login, logout, token refresh)                                │  │
│  │  • /farmer (registration, profile, risk, recommendations)              │  │
│  │  • /government (dashboard, analytics, allocation)                      │  │
│  │  • /admin (scheme config, user management)                             │  │
│  │  • /api/v1 (external API for partner integrations)                     │  │
│  │                                                                          │  │
│  │ Services:                                                                │  │
│  │  • farmer_service (registration, profile CRUD)                         │  │
│  │  • risk_service (financial, disaster risk computation)                 │  │
│  │  • weather_service (fetch & cache weather data)                        │  │
│  │  • recommendation_service (scheme eligibility & personalized rec)      │  │
│  │  • allocation_service (CP-SAT optimization)                            │  │
│  │  • notification_service (SMS, email alerts)                            │  │
│  │                                                                          │  │
│  │ ML Models (Inference):                                                  │  │
│  │  • financial_risk_model (XGBoost)                                      │  │
│  │  • disaster_risk_model (Random Forest)                                 │  │
│  │  • SHAP explainer (for both models)                                    │  │
│  └────────────┬───────────────────────┬──────────────────┬─────────────────┘  │
│               │                       │                  │                      │
│  ┌────────────▼──────┐  ┌───────────▼───────┐  ┌───────▼──────┐             │
│  │   PostgreSQL DB   │  │  Redis Cache      │  │ ML Model     │             │
│  │                   │  │                   │  │ Storage      │             │
│  │  • Farmers        │  │ • Session store   │  │ (pickling)   │             │
│  │  • Profiles       │  │ • Weather cache   │  │              │             │
│  │  • Risk history   │  │ • Risk scores     │  │              │             │
│  │  • Schemes        │  │ • Recommendations │  │              │             │
│  │  • Allocations    │  │                   │  │              │             │
│  │  • Audit logs     │  │                   │  │              │             │
│  └───────────────────┘  └───────────────────┘  └──────────────┘             │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────┐            │
│  │              External APIs & Data Sources                    │            │
│  ├─────────────────────────────────────────────────────────────┤            │
│  │  • OpenWeather API (real-time weather)                       │            │
│  │  • NASA POWER API (historical weather)                       │            │
│  │  • ISRO Bhuvan API (satellite imagery, future)               │            │
│  │  • Government Scheme APIs (future; for auto-updates)        │            │
│  │  • SMS Gateway (Twilio / AWS SNS; for alerts)               │            │
│  │  • Email Service (SendGrid / AWS SES)                        │            │
│  └─────────────────────────────────────────────────────────────┘            │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### Frontend
| Layer | Technology | Justification |
|-------|-----------|--------------|
| **Framework** | React 18 | Component-based; large ecosystem; suitable for responsive design |
| **Language** | TypeScript | Type safety; fewer runtime errors; better IDE support |
| **Build Tool** | Vite | Faster than Create React App; modern bundler; ES module support |
| **Styling** | TailwindCSS | Utility-first; responsive; low file size after purging |
| **Routing** | React Router v6 | Standard; supports nested routes; code splitting |
| **HTTP Client** | Axios | Promise-based; interceptors for auth token handling |
| **Charts** | Plotly.js | Interactive; supports wide variety of chart types; mobile-friendly |
| **Maps** | Leaflet.js | Lightweight; supports custom tiles; good for disaster maps |
| **State Mgmt** | React Context + useReducer | Sufficient for this scale; no heavy dependency like Redux |
| **Testing** | Vitest + React Testing Library | Modern; fast; aligns with Jest API |
| **Deployment** | Vercel | Zero-config React deploys; edge caching; automatic SSL |

### Backend
| Layer | Technology | Justification |
|-------|-----------|--------------|
| **Framework** | FastAPI | Modern Python async framework; auto API docs (Swagger); Pydantic validation |
| **Language** | Python 3.10+ | Data science ecosystem; ML model integration; readable |
| **Server** | Uvicorn + Gunicorn | ASGI server; handles async/await; production-ready with Gunicorn wrapper |
| **Database ORM** | SQLAlchemy 2.0 | Type-safe; supports complex queries; migrations via Alembic |
| **Database** | PostgreSQL 13+ | ACID compliance; JSON support; PostGIS for geo queries (future); battle-tested |
| **Migrations** | Alembic | Version control for schema changes; reversible |
| **Caching** | Redis | In-memory; fast; session store + model caching |
| **Auth** | JWT (PyJWT) | Stateless; scalable; standard for APIs |
| **Validation** | Pydantic v2 | Strong type hints; auto-validation; serialization |
| **Testing** | Pytest + Pytest-cov | Standard Python testing; high coverage reports |
| **Logging** | Python logging + JSON | Structured logs; integrable with log aggregation |

### Machine Learning
| Component | Technology | Justification |
|-----------|-----------|--------------|
| **Financial Risk Model** | XGBoost | Gradient boosting; strong baseline; SHAP-compatible |
| **Disaster Risk Model** | Random Forest (scikit-learn) | Ensemble; handles mixed features; interpretable |
| **SHAP Explainer** | SHAP library | State-of-the-art; rigorous; per-farmer explanations |
| **Model Serving** | MLflow + FastAPI | Version tracking; A/B testing; <100ms inference |
| **Data Processing** | Pandas + NumPy | Standard; fast; integrates with scikit-learn |
| **Evaluation** | Scikit-learn metrics | Standard metrics (AUC-ROC, F1, precision-recall) |

### Optimization
| Component | Technology | Justification |
|-----------|-----------|--------------|
| **Solver** | Google OR-Tools (CP-SAT) | Scalable; constraint-based; open-source; no licensing |
| **Python Wrapper** | google-ortools | Direct Python API; well-maintained |

### Infrastructure & DevOps
| Component | Technology | Justification |
|-----------|-----------|--------------|
| **Containerization** | Docker | Reproducible; isolated environments; CI/CD integration |
| **Orchestration (future)** | Kubernetes / Docker Compose | Docker Compose for dev/small prod; K8s for scale |
| **CI/CD** | GitHub Actions | Native to GitHub; free for public/private repos; YAML-based |
| **Database Hosting** | Neon (PostgreSQL serverless) or Render | Fully managed; auto-scaling; free tier available |
| **Backend Hosting** | Render or Railway | Supports Docker; auto-deploy from GitHub; affordable |
| **Frontend Hosting** | Vercel | React-optimized; edge caching; automatic SSL |
| **Secrets Management** | Environment variables (.env) | Local dev; deploy platforms handle secrets in admin panel |
| **Monitoring** | Prometheus + Grafana (optional, Phase 12) | Open-source; good for SLO tracking |
| **Error Tracking** | Sentry (optional, Phase 12) | Real-time error alerts; source maps; session replay |

---

## 3. Database Schema (PostgreSQL)

### Tables (Core)

```
FARMERS
├─ id (UUID, PK)
├─ phone (VARCHAR, UNIQUE)
├─ name (VARCHAR)
├─ age (INT)
├─ gender (ENUM: M/F/Other)
├─ email (VARCHAR, NULLABLE)
├─ district (VARCHAR)
├─ village (VARCHAR)
├─ pin_code (VARCHAR)
├─ latitude (FLOAT)
├─ longitude (FLOAT)
├─ total_acres (FLOAT)
├─ crop_types (TEXT[]) [ARRAY for multiple crops]
├─ soil_type (ENUM: Clay/Loam/Sandy/Mixed)
├─ irrigation_status (ENUM: Irrigated/Rainfed)
├─ annual_income (INT, in ₹)
├─ outstanding_loans (INT, in ₹)
├─ monthly_installments (INT, in ₹)
├─ loan_type (ENUM: Formal/Informal, NULLABLE)
├─ insurance_status (BOOLEAN)
├─ registered_date (TIMESTAMP)
├─ last_profile_update (TIMESTAMP)
└─ INDEX: (district, village), (latitude, longitude)

FARMER_RISK_HISTORY
├─ id (UUID, PK)
├─ farmer_id (FK → FARMERS.id)
├─ financial_risk (INT, 0-100)
├─ disaster_risk (INT, 0-100)
├─ compound_risk (INT, 0-100)
├─ computed_date (TIMESTAMP)
├─ financial_risk_factors (JSONB) [e.g., {"loan_overdue": 22, "low_income": -10}]
├─ disaster_risk_factors (JSONB) [e.g., {"rainfall_deficit": 25}]
└─ INDEX: (farmer_id, computed_date)

RECOMMENDATIONS
├─ id (UUID, PK)
├─ farmer_id (FK → FARMERS.id)
├─ scheme_id (FK → SCHEMES.id)
├─ recommended_date (TIMESTAMP)
├─ benefit_amount (INT, in ₹)
├─ eligibility (ENUM: Eligible/Ineligible/Pending)
├─ priority (INT, 0-100)
├─ status (ENUM: Viewed/Applied/Declined/Allocated)
├─ explanation (TEXT) [SHAP explanation]
└─ INDEX: (farmer_id, recommended_date)

SCHEMES
├─ id (UUID, PK)
├─ name (VARCHAR) [e.g., "PMFBY"]
├─ description (TEXT)
├─ active (BOOLEAN)
├─ benefit_type (ENUM: Insurance/CashTransfer/Loan/Relief)
├─ total_budget (INT, in ₹)
├─ spent_budget (INT, in ₹)
├─ min_income (INT, NULLABLE)
├─ max_income (INT, NULLABLE)
├─ eligible_crops (TEXT[])
├─ eligible_districts (TEXT[])
├─ priority (INT) [higher = allocate first]
└─ created_date (TIMESTAMP)

ALLOCATIONS
├─ id (UUID, PK)
├─ run_id (UUID, FK → ALLOCATION_RUNS.id)
├─ farmer_id (FK → FARMERS.id)
├─ scheme_id (FK → SCHEMES.id)
├─ benefit_amount (INT, in ₹)
├─ allocated_date (TIMESTAMP)
├─ status (ENUM: Pending/Approved/Executed/Declined)
└─ INDEX: (farmer_id, allocated_date)

ALLOCATION_RUNS
├─ id (UUID, PK)
├─ run_date (TIMESTAMP)
├─ budget (INT, in ₹)
├─ solver_time (FLOAT, seconds)
├─ total_farmers_allocated (INT)
├─ total_budget_used (INT, in ₹)
├─ solver_status (ENUM: Optimal/Feasible/Unknown)
├─ admin_id (FK → USERS.id)
└─ INDEX: (run_date)

ALERTS
├─ id (UUID, PK)
├─ farmer_id (FK → FARMERS.id)
├─ alert_type (ENUM: WeatherAlert/LoanAlert/SchemeDeadline)
├─ severity (ENUM: Low/Medium/High)
├─ message (TEXT)
├─ generated_date (TIMESTAMP)
├─ sent_date (TIMESTAMP, NULLABLE)
├─ read (BOOLEAN)
└─ INDEX: (farmer_id, generated_date)

USERS (Government & Admin)
├─ id (UUID, PK)
├─ email (VARCHAR, UNIQUE)
├─ password_hash (VARCHAR, bcrypt)
├─ role (ENUM: Officer/Admin/OfficerInCharge)
├─ district_assigned (VARCHAR, NULLABLE)
├─ active (BOOLEAN)
├─ created_date (TIMESTAMP)
├─ last_login (TIMESTAMP)
└─ INDEX: (email)

AUDIT_LOG
├─ id (UUID, PK)
├─ user_id (FK → USERS.id, NULLABLE for system actions)
├─ action (VARCHAR) [e.g., "farmer_registered", "allocation_run"]
├─ resource_type (VARCHAR) [e.g., "FARMER", "ALLOCATION"]
├─ resource_id (UUID)
├─ changes (JSONB) [before/after state]
├─ timestamp (TIMESTAMP)
└─ INDEX: (user_id, timestamp)

WEATHER_CACHE
├─ id (UUID, PK)
├─ location_key (VARCHAR) [e.g., "lat=20.5,lng=75.3"]
├─ temperature (FLOAT, °C)
├─ humidity (INT, %)
├─ rainfall (FLOAT, mm)
├─ forecast_7d (JSONB) [array of 7-day forecast]
├─ fetched_date (TIMESTAMP)
├─ expires_at (TIMESTAMP)
└─ INDEX: (location_key, fetched_date)
```

---

## 4. API Endpoints (FastAPI Routes)

### Authentication
```
POST   /auth/register              (OTP-based farmer registration)
POST   /auth/login                 (Phone OTP or gov email/password)
POST   /auth/verify-otp            (OTP verification)
POST   /auth/logout                (Invalidate session)
POST   /auth/refresh-token         (Refresh JWT)
```

### Farmer Portal
```
GET    /farmer/profile             (Get farmer's profile)
PUT    /farmer/profile             (Update profile)
GET    /farmer/risk                (Get latest risk scores)
GET    /farmer/recommendations     (Get personalized recommendations)
GET    /farmer/alerts              (Get active alerts)
POST   /farmer/alerts/{id}/read    (Mark alert as read)
GET    /farmer/history             (Risk history for farmer)
```

### Government Dashboard
```
GET    /government/analytics/overview    (High-level stats)
GET    /government/analytics/map         (Risk map data [geoJSON])
GET    /government/analytics/charts      (Chart data for dashboard)
GET    /government/farmers               (List farmers with filters)
GET    /government/farmers/{id}          (Farmer detail view)
GET    /government/schemes               (List schemes & performance)
GET    /government/alerts                (Weather + disaster alerts in jurisdiction)
GET    /government/reports               (Generate reports)
```

### Optimization & Allocation
```
POST   /allocation/run              (Trigger allocation optimization)
GET    /allocation/runs             (List past allocation runs)
GET    /allocation/runs/{id}        (Get allocation run details)
POST   /allocation/manual           (Manually allocate farmer to scheme)
```

### Admin
```
POST   /admin/schemes               (Create/update scheme)
GET    /admin/schemes               (List schemes)
DELETE /admin/schemes/{id}          (Deactivate scheme)
POST   /admin/users                 (Create/manage users)
GET    /admin/audit-log             (View audit logs)
```

### External API (Partner Integration)
```
GET    /api/v1/farmer/{id}/risk     (Get farmer's risk for partner systems)
POST   /api/v1/webhook/allocation   (Receive allocation updates)
```

---

## 5. Deployment Architecture

### Local Development
```
Docker Compose (docker-compose.yml)
├─ postgres (PostgreSQL container)
├─ redis (Redis container)
├─ backend (FastAPI, auto-reload)
├─ frontend (Vite dev server, port 3000)
└─ pgAdmin (DB management UI, localhost:5050)

Development Flow:
1. Clone repo
2. docker-compose up -d
3. Backend: http://localhost:8000 (docs at /docs)
4. Frontend: http://localhost:3000
5. Make code changes (auto-reload on both)
6. Run tests locally: pytest, npm test
```

### Production Deployment (Single-Server, Scalable)
```
┌──────────────────────────────────────────────┐
│         Cloud Provider (Render/Railway)       │
├──────────────────────────────────────────────┤
│                                               │
│  ┌──────────────────────────────────────┐   │
│  │  NGINX (Reverse Proxy + TLS)         │   │
│  │  ├─ Port 80 → 443 (HTTPS only)       │   │
│  │  └─ Route /api → Backend             │   │
│  │     Route / → Frontend CDN           │   │
│  └──────────────┬───────────────────────┘   │
│                 │                             │
│  ┌──────────────▼────────────────────────┐  │
│  │  Backend (FastAPI + Gunicorn)         │  │
│  │  ├─ Gunicorn: 4 workers               │  │
│  │  │ (adjust based on 2GB RAM)          │  │
│  │  └─ Env vars: DB_URL, SECRET_KEY, etc│  │
│  └──────────────┬───────────────────────┘  │
│                 │                            │
│  ┌──────────────▼────────────────────────┐  │
│  │  PostgreSQL (Neon / Render DB)        │  │
│  │  ├─ Automated backups                 │  │
│  │  └─ Connection pooling (PgBouncer)    │  │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌──────────────────────────────────────┐   │
│  │  Redis (for caching & sessions)      │   │
│  │  ├─ Memory: 1GB                       │   │
│  │  └─ 30-day data retention             │   │
│  └──────────────────────────────────────┘   │
│                                               │
│  ┌──────────────────────────────────────┐   │
│  │  Frontend (Static, served by NGINX)  │   │
│  │  ├─ Built React bundle (dist/)       │   │
│  │  └─ Cached by Vercel CDN             │   │
│  └──────────────────────────────────────┘   │
│                                               │
└──────────────────────────────────────────────┘

CI/CD: GitHub Actions
├─ On push to main:
│  ├─ Run tests (backend + frontend)
│  ├─ Build Docker image
│  ├─ Push to container registry
│  └─ Deploy to Render/Railway (auto-rollback on failure)
└─ Manual approval required for production
```

### Scaling Path (Future, 10M+ farmers)
```
Kubernetes Cluster (on AWS/GCP/Azure)
├─ Frontend: Vercel CDN (no change)
├─ Backend Pods: Horizontal Pod Autoscaler (scale 1-20 pods)
├─ PostgreSQL: Managed RDS with read replicas
├─ Redis: Managed ElastiCache / Memorystore
├─ Load Balancer: Kubernetes Service (auto-balanced)
├─ Monitoring: Prometheus + Grafana
└─ Observability: Datadog / ELK Stack
```

---

## 6. Security Architecture

### Authentication Flow
```
Farmer:
1. Enter phone number
2. Backend sends OTP via SMS
3. Farmer enters OTP
4. Backend validates OTP (valid for 10 min)
5. Backend returns JWT token (30-day expiry)
6. Frontend stores in localStorage (secure HttpOnly cookie preferred in Phase 12)
7. All subsequent requests include Authorization: Bearer <JWT>

Government:
1. Login with email + password (bcrypt verified)
2. Optional TOTP 2FA
3. Backend returns JWT token (8-hour expiry)
4. Auto-logout on inactivity
```

### Data Protection
```
At Rest:
- PostgreSQL: Farmer PII (name, phone) encrypted with AES-256
- ML model predictions (risk scores) not encrypted (non-PII)
- Government decisions (allocations) not encrypted (audit trail > confidentiality)

In Transit:
- All APIs: TLS 1.3 (HTTPS only)
- Database: Encrypted connection (sslmode=require)
- Redis: No encryption (internal only; can add TLS in Phase 12)

Access Control:
- Farmers: Can only read their own data
- Government Officers: Can read farmer data with consent (audit logged)
- Admins: Can manage schemes and users
- API clients: Rate-limited + API key validation
```

### Privacy Safeguards
```
- Farmer PII anonymized for ML training
- Consent management: Explicit opt-in for data sharing
- Data retention: Delete personal data 2 years after last login
- Audit logs: All access tracked and immutable
- GDPR / DPDP Act compliance (Phase 12)
```

---

## 7. Monitoring & Observability

### Key Metrics
```
Application:
- Request latency (p50, p95, p99)
- Error rate (4xx, 5xx)
- Model inference latency
- API endpoint usage by type
- Allocation solver time

Infrastructure:
- CPU / Memory usage
- Database query performance
- Redis evictions
- Network I/O

Business:
- Number of farmers registered
- Risk distribution (% High, Medium, Low)
- Schemes allocated per farmer
- Recommendation acceptance rate (clicked / shown)
```

### Logging Strategy
```
Structured Logs (JSON):
{
  "timestamp": "2026-07-18T19:58:15Z",
  "level": "INFO",
  "service": "farmer_service",
  "action": "farmer_registered",
  "farmer_id": "uuid",
  "response_time_ms": 245,
  "status": "success"
}

Log Aggregation (Phase 12):
- Loki / ELK Stack
- Query: Failures, latency spikes, specific farmer issues
```

---

## 8. Integration Points (APIs)

### External Integrations
```
OpenWeather API
├─ Call: GET /data/2.5/weather (every 6 hours per farmer location)
├─ Cache: Redis (24-hour TTL)
├─ Error Handling: Fallback to historical data (NASA POWER)

NASA POWER API
├─ Call: GET /power/monthly (monthly historical for training)
├─ Cache: Long-term (no recompute needed)

SMS Gateway (Twilio / AWS SNS)
├─ Send: Alert notifications (SMS cost: ₹0.10-0.50 per message)
├─ Retry: 3 attempts with exponential backoff

Email Service (SendGrid / AWS SES)
├─ Send: Registration confirmation, scheme updates
├─ Template: HTML templates for branding

Government Scheme APIs (Future)
├─ Sync: Automated scheme budget updates
├─ Webhook: Allocation execution feedback
```

---

## 9. Data Flow Diagrams

### Farmer Registration & Risk Assessment
```
Farmer Registration:
Farmer Input → Validation (Pydantic) → DB Insert → Compute Risk

Risk Computation (Nightly + On-Demand):
Farmer Data + Weather API → Feature Engineering 
  → Financial Model (XGBoost) → Financial Risk
  → Disaster Model (RF) → Disaster Risk
  → Compound Risk Aggregation
  → SHAP Explanations
  → DB Insert (risk_history)
  → Alert if Risk ↑20%
```

### Government Allocation
```
Government configures: Budget, Schemes, Constraints

Allocation Engine:
Farmer + Risk + Scheme Eligibility 
  → CP-SAT Solver (Objective: Maximize Impact)
  → Solver outputs: Allocation[Farmer, Scheme, Benefit]
  → DB Insert (allocations)
  → Notification: SMS to farmer ("You allocated ₹5000 for insurance")
  → Government Dashboard: Show results + metrics
```

---

## 10. Performance Targets & Strategies

### Target Response Times
| Operation | Target | Strategy |
|-----------|--------|----------|
| Farmer login | <500ms | JWT caching |
| Risk computation | <500ms | Model in-memory; pre-computed scores |
| Dashboard load | <3s | Charts cached; async data loading |
| Allocation run (100k farmers) | <5min | CP-SAT solver timeout + heuristic fallback |
| Map render | <2s | GeoJSON simplification; clustering |

### Optimization Techniques
```
Caching Strategy:
- Redis: Session tokens, farmer profiles, weather data
- Database: Materialized views for aggregated analytics
- Browser: Static assets (CSS, JS) cached 30 days

Database Optimization:
- Indexes: On farmer_id, computed_date, risk levels
- Partitioning (Phase 12): Allocations by year
- Connection pooling: PgBouncer (10 clients → 50 workers)

Frontend Optimization:
- Code splitting: Route-based lazy loading
- Image optimization: WebP + responsive sizes
- Bundle size: Tree-shaking unused code

API Rate Limiting:
- Unauthenticated: 100 req/min per IP
- Authenticated: 1000 req/min per user
```

---

## Conclusion

This architecture balances **simplicity** (for Phase 1-2) with **scalability** (path to 10M+ farmers). Key principles:

1. **Decoupling**: Services independent; can scale/replace individual components
2. **Observability**: Structured logs, metrics, error tracking
3. **Security**: Encryption, RBAC, audit logging
4. **Explainability**: SHAP for model transparency
5. **Reliability**: Graceful degradation, redundancy, backups

Next: Move to Phase 1 (Project Setup) for repository initialization and environment configuration.
