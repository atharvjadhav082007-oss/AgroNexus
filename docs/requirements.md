# AgroNexus (KhetSeva) - Functional & Non-Functional Requirements

## 1. Functional Requirements

### 1.1 Farmer Portal - Registration & Profiling (FR-F.1)

#### Registration Flow
- **FR-F.1.1**: Farmers can register with phone number and basic identification
- **FR-F.1.2**: Multi-step form collects:
  - Personal: Name, age, gender, phone, email (optional)
  - Location: District, village, PIN code, GPS coordinates (map-based input)
  - Land: Total acres, crop types (multi-select), soil type, irrigation status
  - Financial: Annual income, outstanding loans, loan type, monthly installments, insurance status
  - Disaster: History of floods, droughts, cyclones, pests in last 3 years
- **FR-F.1.3**: Form validation and error messages in Hindi + English
- **FR-F.1.4**: Profile persistence; farmers can edit details anytime
- **FR-F.1.5**: OTP-based phone verification for farmer identity

#### Profile Dashboard
- **FR-F.2.1**: Display farmer's profile summary (editable fields)
- **FR-F.2.2**: Show data last updated timestamp
- **FR-F.2.3**: Simple, large-text interface for low-literacy users

### 1.2 Risk Assessment (FR-R.1 to FR-R.5)

#### Financial Risk Prediction
- **FR-R.1.1**: Backend computes financial risk score (0-100) based on:
  - Loan amount, income, loan-to-income ratio
  - Payment history (if available)
  - Crop type and seasonal income variability
- **FR-R.1.2**: Output: Risk Level (Low/Medium/High/Critical) + score
- **FR-R.1.3**: Update risk score monthly or on farmer data change
- **FR-R.1.4**: SHAP explanation: List top 3 factors contributing to risk (e.g., "Loan overdue +22", "Low income -10")

#### Disaster Risk Prediction
- **FR-R.2.1**: Backend integrates weather data (rainfall, temperature, soil moisture)
- **FR-R.2.2**: Computes disaster risk (0-100) based on:
  - Current weather anomalies (rainfall deficit/excess, temperature extremes)
  - Historical disaster frequency in farmer's district
  - Crop vulnerability to identified threats
  - Lead time for forecast (1-7 days out)
- **FR-R.2.2**: Output: Current Disaster Risk + 7-day rolling forecast
- **FR-R.2.3**: SHAP explanation: "Rainfall deficit -30mm vs avg: +25 risk; Temperature normal: -2"

#### Compound Risk Score
- **FR-R.3.1**: Backend computes compound risk = 0.4 * financial_risk + 0.4 * disaster_risk + interaction_term
- **FR-R.3.2**: Output: Overall Risk Level (Low/Medium/High/Critical)
- **FR-R.3.3**: Combined explanation: Union of financial + disaster factors

#### Risk Dashboard Display
- **FR-R.4.1**: Farmer portal shows:
  - Large, color-coded risk gauge (green/yellow/orange/red)
  - Compound risk score
  - Financial risk component
  - Disaster risk component
  - Top 3 risk drivers with explanation
  - Recommendation card (see FR-REC.1)
- **FR-R.4.2**: Mobile-responsive design; readable on 320px screens

#### Risk Alerts
- **FR-R.5.1**: Backend generates alerts when:
  - Compound risk increases by >20% (change alert)
  - Weather threshold breached (e.g., predicted rainfall >150mm in 48h)
  - Payment overdue (if loan data available)
- **FR-R.5.2**: Push alerts via SMS to farmer's phone
- **FR-R.5.3**: Email alerts (optional, for farmers with email)
- **FR-R.5.4**: In-app notification badge on portal

### 1.3 Recommendations (FR-REC.1 to FR-REC.3)

#### Scheme Discovery & Eligibility
- **FR-REC.1.1**: Backend evaluates farmer against all active schemes:
  - PM-KISAN (universal eligibility)
  - PMFBY (crop insurance; risk-weighted)
  - KCC (loan eligibility; income-based)
  - State-specific disaster relief schemes
  - Custom schemes (government-defined)
- **FR-REC.1.2**: For each scheme, determine:
  - Farmer eligibility (Yes/No/Pending)
  - Recommended benefit amount (₹)
  - Priority ranking (0-100)
  - Documents required

#### Personalized Recommendations
- **FR-REC.2.1**: Generate recommendation card based on compound risk:
  - **High Financial Risk**: Recommend KCC / Loan Restructuring / PM-KISAN
  - **High Disaster Risk**: Recommend PMFBY / Crop Insurance / Disaster Relief
  - **High Compound Risk**: Recommend combined scheme bundle
- **FR-REC.2.2**: Recommendation text in simple language:
  - "Your financial risk is HIGH due to loan overdue. Apply for KCC restructuring to reduce interest rates."
  - "Rainfall may be low in next 30 days. Crop insurance covers drought. Enroll now."
- **FR-REC.2.3**: Each recommendation includes:
  - Benefit amount (estimated in ₹)
  - Time to apply (e.g., "Apply by June 15 for monsoon coverage")
  - Application process (link to government portal or in-app form)
  - Success probability (e.g., "80% likely to be approved")

#### Recommendation History
- **FR-REC.3.1**: Store all recommendations with date, reason, and farmer action (Viewed / Applied / Declined)
- **FR-REC.3.2**: Display past 10 recommendations on portal
- **FR-REC.3.3**: Track which recommendations led to successful scheme access (for evaluation)

### 1.4 Alerts & Communication (FR-A.1 to FR-A.3)

#### Weather Alerts
- **FR-A.1.1**: Backend monitors weather forecast for farmer's location
- **FR-A.1.2**: Alert triggers:
  - Rainfall alert: If forecast >150mm in 48h (flood risk)
  - Drought alert: If forecast <10mm for 30+ days (drought risk)
  - Extreme temperature: If >45°C or <5°C forecast
  - Pest alert: If conditions favor pest outbreaks (temperature + humidity)
- **FR-A.1.3**: Alert includes:
  - Risk type (e.g., "High rainfall expected")
  - Lead time (e.g., "in next 48 hours")
  - Recommended action (e.g., "Protect irrigation channels")
  - Link to more info (weather station, agricultural advisory)

#### Payment & Loan Alerts
- **FR-A.2.1**: If farmer has loan data integrated:
  - Remind of upcoming due date (7 days before)
  - Alert if payment overdue (1 day, 7 days, 30 days after due)
  - Suggest options (payment plan, restructuring)

#### Scheme Deadline Alerts
- **FR-A.3.1**: Alert farmer 14 days before scheme application deadline
- **FR-A.3.2**: Alert if recommended scheme's benefit increases (seasonal variation)

### 1.5 Government Dashboard - Analytics (FR-G.1 to FR-G.5)

#### Farmer Registry
- **FR-G.1.1**: Government user can query all registered farmers with filters:
  - By district / block / village
  - By risk level (Low/Medium/High/Critical)
  - By crop type
  - By financial status (loan, income range)
- **FR-G.1.2**: Export farmer list as CSV with risk scores, recommendations
- **FR-G.1.3**: Display farmer details page:
  - Profile data (with farmer consent)
  - Risk scores and drivers
  - Recommended schemes
  - Past scheme allocations
  - Outcomes (if scheme executed)

#### Risk Analytics & Mapping
- **FR-G.2.1**: Dashboard displays:
  - **Risk Distribution Map**: Leaflet map of district/state with farmer markers
    - Green markers: Low risk farmers
    - Yellow: Medium risk
    - Orange: High risk
    - Red: Critical risk
  - Cluster view (zoom out shows aggregated counts per sub-region)
  - Click on marker to see farmer details
- **FR-G.2.2**: Charts:
  - **Pie Chart**: Risk level distribution (e.g., 30% High, 40% Medium)
  - **Line Chart**: Risk over time (monthly trend for all farmers)
  - **Heatmap**: Risk concentration by district
  - **Histogram**: Distribution of financial risk scores
- **FR-G.2.3**: Filters available on all charts:
  - Date range (last 30 days, quarter, year)
  - Crop type
  - Geographic region
  - Risk component (financial, disaster, compound)

#### Disaster & Weather Alerts
- **FR-G.3.1**: Dashboard shows:
  - Current weather alerts in jurisdiction (rainfall, drought, extreme temp)
  - Affected farmer count per alert
  - Recommended interventions (e.g., "Flood relief for 500 farmers in Sub-District A")
- **FR-G.3.2**: Predictive alerts: Forecast-based (next 7 days) expected disasters
- **FR-G.3.3**: Historical disaster impact analysis (past 3-5 years)

#### Scheme Performance Monitoring
- **FR-G.4.1**: Government can track for each active scheme:
  - Budget allocated vs. spent
  - Farmers allocated vs. benefited
  - Average benefit amount
  - Outcome metrics (e.g., "80% of insurance beneficiaries recovered from crop loss")
- **FR-G.4.2**: Comparison across schemes:
  - Which schemes have highest uptake?
  - Which reach highest-risk farmers most effectively?
  - Cost per beneficiary

#### Reports & Export
- **FR-G.5.1**: Pre-built reports:
  - **Weekly Alert Summary**: High-risk farmers, weather alerts, recommended interventions
  - **Monthly Dashboard Report**: Risk distribution, scheme performance, budget utilization
  - **Quarterly Impact Report**: Outcome metrics for all active schemes
- **FR-G.5.2**: Custom report builder: Filter, select metrics, export as PDF/CSV

### 1.6 Optimization & Allocation (FR-O.1 to FR-O.3)

#### Allocation Configuration
- **FR-O.1.1**: Government admin configures:
  - Active schemes (select from predefined or create custom)
  - Budget per scheme (₹ amount)
  - Allocation rules (risk-weighted, fairness constraints)
  - Benefit amount per farmer (fixed or risk-based)
  - Eligibility criteria for each scheme
- **FR-O.1.2**: Constraints:
  - Total budget cap (across all schemes)
  - Min/max farmers per scheme
  - Fairness targets (e.g., "reach 40% of small/marginal farmers")
  - Geographic coverage targets

#### Automatic Allocation
- **FR-O.2.1**: Trigger allocation run with:
  - Start date (e.g., "Allocate farmers as of June 1")
  - Budget and schemes as configured
  - Constraints as configured
- **FR-O.2.2**: Backend runs CP-SAT solver:
  - Solver timeout: 5 minutes (for 100k farmers)
  - Objective: Maximize impact (sum of risk_score * benefit_amount)
  - Output: Farmer → Scheme → Benefit mapping
- **FR-O.2.3**: Display results:
  - Total farmers allocated
  - Total budget used
  - Risk coverage (e.g., "allocated to 90% of High-risk farmers")
  - Fairness metrics (e.g., "35% small/marginal farmers reached")
- **FR-O.2.4**: Government can accept allocation or adjust constraints and re-run

#### Manual Allocation Override
- **FR-O.3.1**: Government can manually allocate farmers to schemes (for special cases)
- **FR-O.3.2**: Audit log records all allocations with timestamp, admin, reason

### 1.7 Authentication (FR-AU.1 to FR-AU.3)

#### Farmer Authentication
- **FR-AU.1.1**: Register farmer with phone number (primary identifier)
- **FR-AU.1.2**: OTP verification for login (SMS-based)
- **FR-AU.1.3**: Session duration: 30 days (remember me option)
- **FR-AU.1.4**: Farmer can only view their own profile and recommendations

#### Government Authentication
- **FR-AU.2.1**: Government users (officer, admin, officer-in-charge) login with:
  - Email address
  - Password (salted + hashed bcrypt)
  - TOTP 2FA (optional for high-security officers)
- **FR-AU.2.2**: Role-based access:
  - **Officer**: View dashboard, run allocation, view farmer details (with consent)
  - **Admin**: + Scheme configuration, budget management
  - **Officer-in-charge**: + User management, audit logs
- **FR-AU.2.3**: Session duration: 8 hours (auto-logout)

#### API Authentication
- **FR-AU.3.1**: External API access via JWT tokens
- **FR-AU.3.2**: Token scope (read, write, admin)
- **FR-AU.3.3**: Rate limiting: 1000 requests/minute per token

---

## 2. Non-Functional Requirements

### 2.1 Performance (NFR-P.1 to NFR-P.4)

#### Response Times
- **NFR-P.1.1**: Farmer portal pages load in <3 seconds (p95)
- **NFR-P.1.2**: Risk score computation completes in <500ms
- **NFR-P.1.3**: Government dashboard loads in <5 seconds
- **NFR-P.1.4**: Optimization solver completes allocation for 100k farmers in <5 minutes

#### Throughput
- **NFR-P.2.1**: Backend handles 1000 concurrent farmers (portal access)
- **NFR-P.2.2**: Database supports 10k QPS for reads, 1k QPS for writes
- **NFR-P.2.3**: Weather API polling: 10k location requests/hour without rate-limit issues

#### Resource Efficiency
- **NFR-P.3.1**: Backend memory: <4GB for production instance
- **NFR-P.3.2**: ML model inference: <100MB per model in memory
- **NFR-P.3.3**: Database storage: <50GB for 1M farmers (profile + historical)

#### Scalability
- **NFR-P.4.1**: Horizontal scaling: Backend stateless; add more instances as load increases
- **NFR-P.4.2**: Database: PostgreSQL with read replicas for analytics queries
- **NFR-P.4.3**: Support growth to 10M farmers without re-architecture

### 2.2 Availability (NFR-A.1 to NFR-A.2)

#### Uptime
- **NFR-A.1.1**: Portal uptime: 99.5% (target; 43 minutes downtime/month acceptable)
- **NFR-A.1.2**: Risk computation and alerts: 99.9% (5 minutes downtime/month)
- **NFR-A.1.3**: Graceful degradation: If optimization solver times out, fall back to heuristic allocation

#### Disaster Recovery
- **NFR-A.2.1**: Database backups: Daily, with 30-day retention
- **NFR-A.2.2**: Recovery Time Objective (RTO): <4 hours
- **NFR-A.2.3**: Recovery Point Objective (RPO): <1 hour

### 2.3 Security (NFR-S.1 to NFR-S.5)

#### Authentication & Authorization
- **NFR-S.1.1**: All APIs require authentication (JWT or session)
- **NFR-S.1.2**: OTP tokens valid for 10 minutes only
- **NFR-S.1.3**: Passwords: Min 12 characters, complexity requirements
- **NFR-S.1.4**: Role-based access control (RBAC) enforced at API level

#### Data Protection
- **NFR-S.2.1**: All data in transit encrypted (TLS 1.3)
- **NFR-S.2.2**: Farmer PII encrypted at rest (AES-256)
- **NFR-S.2.3**: Financial data (loan, income) encrypted at rest
- **NFR-S.2.4**: Audit logs: All data access logged with user, timestamp, action

#### Privacy Compliance
- **NFR-S.3.1**: Comply with DPDP Act 2023 (Indian privacy law)
- **NFR-S.3.2**: Farmer data anonymized for ML training (remove PII)
- **NFR-S.3.3**: Explicit consent required for data sharing with government
- **NFR-S.3.4**: Deletion policy: Personal data deleted 2 years after last login

#### API Security
- **NFR-S.4.1**: Rate limiting: 100 requests/minute per IP (unauthenticated), 1000/minute (authenticated)
- **NFR-S.4.2**: Input validation: Strict schema validation on all APIs
- **NFR-S.4.3**: CSRF protection on web forms
- **NFR-S.4.4**: SQL injection prevention: Prepared statements + ORM (SQLAlchemy)

#### Secrets Management
- **NFR-S.5.1**: API keys, DB passwords stored in environment variables (not in code)
- **NFR-S.5.2**: Rotation: API keys rotated quarterly; DB passwords every 6 months

### 2.4 Maintainability (NFR-M.1 to NFR-M.3)

#### Code Quality
- **NFR-M.1.1**: Code coverage: >80% for critical paths (risk computation, allocation)
- **NFR-M.1.2**: Type checking: TypeScript frontend, type hints on Python backend
- **NFR-M.1.3**: Linting: Pre-commit hooks enforce style (black, eslint)
- **NFR-M.1.4**: Documentation: API endpoints, DB schema, ML model cards

#### Logging & Monitoring
- **NFR-M.2.1**: Structured logging: JSON logs for all events (API calls, errors, model predictions)
- **NFR-M.2.2**: Error tracking: Sentry or similar for critical errors
- **NFR-M.2.3**: Metrics: Prometheus metrics for response times, error rates, DB queries
- **NFR-M.2.4**: Alerts: Slack/email alerts for 99.9% uptime SLO breaches

#### Deployment
- **NFR-M.3.1**: CI/CD: GitHub Actions for testing, linting, deployment
- **NFR-M.3.2**: Deployment frequency: Multiple times per day possible (safe)
- **NFR-M.3.3**: Rollback: Can revert to previous version in <5 minutes
- **NFR-M.3.4**: Infrastructure as Code: Docker + docker-compose for local dev, Kubernetes for prod (optional)

### 2.5 Usability (NFR-U.1 to NFR-U.3)

#### Accessibility
- **NFR-U.1.1**: WCAG 2.1 AA compliance (for government dashboard)
- **NFR-U.1.2**: Mobile-responsive design: Works on 320px (mobile) to 1920px (desktop)
- **NFR-U.1.3**: Farmer portal optimized for low-literacy users (large text, icons, colors)
- **NFR-U.1.4**: Multi-language: Hindi + English (extensible to regional languages)

#### User Experience
- **NFR-U.2.1**: Form validation: Clear, actionable error messages
- **NFR-U.2.2**: Help & Support: In-app tooltips, FAQ section, chat support (future)
- **NFR-U.2.3**: Accessibility testing: Manual + automated (accessibility checkers)

#### Data Visualization
- **NFR-U.3.1**: Charts rendered via Plotly (interactive, mobile-friendly)
- **NFR-U.3.2**: Maps rendered via Leaflet (responsive, fast)
- **NFR-U.3.3**: Data tables: Pagination, search, sort, export

### 2.6 Reliability (NFR-R.1 to NFR-R.2)

#### Data Integrity
- **NFR-R.1.1**: Database constraints: All farmer IDs unique, risk scores in [0, 100], etc.
- **NFR-R.1.2**: ACID transactions: Allocation writes atomic (all-or-nothing)
- **NFR-R.1.3**: Data consistency: Eventual consistency acceptable for analytics; strong consistency for transactional data

#### Error Handling
- **NFR-R.2.1**: Graceful degradation: If weather API down, use cached data (up to 7 days old)
- **NFR-R.2.2**: Retry logic: Exponential backoff for external API calls
- **NFR-R.2.3**: Circuit breaker: Fail-fast if external service down for >5 minutes

### 2.7 Compatibility (NFR-C.1)

#### Platform Support
- **NFR-C.1.1**: Frontend: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **NFR-C.1.2**: Mobile: iOS Safari 14+, Chrome Android 90+
- **NFR-C.1.3**: Backend: Linux (Ubuntu 20.04+)
- **NFR-C.1.4**: Database: PostgreSQL 12+

---

## Traceability Matrix (Sample)

| Requirement | User Story | Test Case | Status |
|-------------|-----------|-----------|--------|
| FR-F.1.1 | Register farmer | TC-R-001 | Pending |
| FR-R.1 | Financial risk prediction | TC-R-002 | Pending |
| FR-O.2 | Automatic allocation | TC-O-001 | Pending |
| NFR-P.1.1 | Page load <3s | TC-P-001 | Pending |
| NFR-S.1.1 | API auth required | TC-S-001 | Pending |

---

## Appendix: Glossary

- **Compound Risk Score**: Combined financial + disaster risk for a farmer
- **SHAP**: SHapley Additive exPlanations; method for explaining model predictions
- **CP-SAT Solver**: Constraint Programming - Satisfiability solver from Google OR-Tools
- **PMFBY**: Pradhan Mantri Fasal Bima Yojana (government crop insurance scheme)
- **KCC**: Kisan Credit Card (government agricultural credit scheme)
- **RBAC**: Role-Based Access Control
- **DPDP Act**: Digital Personal Data Protection Act 2023 (Indian privacy regulation)
