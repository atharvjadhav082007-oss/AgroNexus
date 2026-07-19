# AgroNexus (KhetSeva) - Dataset Planning & Technology Selection

## 1. Dataset Overview & Sourcing Strategy

### 1.1 Required Data Categories

#### Farmer Profile Data (Primary)
- **Source**: Self-registration via farmer portal
- **Collection Method**: Multi-step form + voluntary survey
- **Fields**:
  - Personal: name, age, gender, phone, email, village, district
  - Land: total acres, crop types, soil type, irrigation status
  - Financial: annual income, loans, insurance, monthly installments
  - Disaster history: past 3 years (floods, droughts, cyclones, pests)
- **Volume Target**: 1M farmers (Phase 1-2) → 10M farmers (Phase 3-4)
- **Update Frequency**: Registration once; profile updates 2-4x per year

#### Weather & Climate Data (External)
- **Source**: OpenWeather API + NASA POWER API
- **Granularity**: Daily (OpenWeather), monthly (NASA POWER)
- **Fields**:
  - Temperature (min, max, avg)
  - Humidity (%)
  - Rainfall (mm)
  - Wind speed (km/h)
  - Soil moisture (proxy from rainfall)
- **Coverage**: All of India; real-time + historical
- **Cost**: Free tier (OpenWeather: 50k calls/month; NASA: unlimited)

#### Financial Data (Government + Bank Integration, Future)
- **Source**: Government agencies (after Phase 1-2)
  - RBI (Kisan Credit Card data)
  - Insurance companies (PMFBY claims)
  - State agriculture departments (loan default records)
- **Fields**:
  - Loan amount, interest rate, payment history
  - Insurance claims (crop loss documented)
  - Loan defaults (dates, recovery status)
- **Sensitivity**: Highly sensitive; requires consent & data sharing agreements
- **Availability**: Phase 3-4 (government partnerships)

#### Disaster & Damage Data (Government)
- **Source**: National Disaster Management Authority (NDMA), State governments
- **Fields**:
  - Disaster type (flood, drought, cyclone, pest)
  - Date, location (district/block)
  - Affected farmers count
  - Damage amount (₹)
  - Relief disbursed
- **Sensitivity**: Public records (mostly); some delayed access
- **Availability**: Phase 2 onwards

#### Land Records (Cadastral Data)
- **Source**: State land revenue departments (ULPIN, IGRS)
- **Fields**:
  - Land ownership (farmer name, ID)
  - Plot location (GPS)
  - Land area, soil classification
  - Irrigation facility available
- **Sensitivity**: Public but requires formal data agreements
- **Availability**: Phase 3+ (government partnership)

---

## 2. Data Collection Strategy

### Phase 0-1: MVP Dataset Construction

#### Synthetic Farmer Data (for testing)
```
Approach:
1. Generate 1,000 synthetic farmers covering:
   - 5 districts (representative of different agro-climatic zones)
   - 3 crop types (rice, wheat, cotton)
   - Income range: ₹20k-₹3L annually
   - Loan status: 30% no-loan, 50% KCC, 20% informal
   - Risk distribution: 20% High, 40% Medium, 40% Low

2. Tools:
   - Python: Faker (names), NumPy (random sampling), Pandas (dataset creation)
   - Ensure realistic correlations (high income ↔ less risk)

3. Output:
   - CSV: farmer_synthetic.csv (1000 rows)
   - Use for:
     - Backend testing
     - Frontend UI development
     - Model training baseline
```

#### Real Weather Data (from APIs)
```
Approach:
1. Fetch historical data for 5 representative locations (2020-2026)
   - Location 1: Northern India (wheat, flood-prone)
   - Location 2: Western India (cotton, drought-prone)
   - Location 3: Southern India (rice, cyclone-prone)
   - Location 4: Eastern India (rice, mixed)
   - Location 5: Central India (mixed crops)

2. APIs:
   - NASA POWER: GET /power/monthly for 2020-2026 (6 years historical)
   - OpenWeather: Current data (real-time testing)

3. Processing:
   - Normalize rainfall, temperature to 0-100 scale
   - Calculate anomalies (vs. 30-year normal)
   - Identify disaster triggers (e.g., rainfall >150mm in 48h = flood)

4. Output:
   - CSV: weather_historical.csv
   - Use for: Model training, disaster risk baseline
```

#### Financial Data (Mock)
```
Approach:
1. Create synthetic financial data correlated with farmer profiles:
   - Loan amount: avg 1.5 lakhs (range: 50k-5L)
   - Interest rate: 6-12% (formal) or 24-36% (informal)
   - Payment history: 80% on-time, 15% delayed, 5% default
   - Insurance: 30% have PMFBY, 70% uninsured

2. Tools:
   - Pandas: Generate correlated random variables
   - Faker: Generate transaction dates, payment amounts

3. Output:
   - CSV: farmer_financial_mock.csv
   - Use for: Financial risk model training
```

### Phase 2-3: Real Data Integration

#### Government Data Access
```
Process:
1. Data Sharing Agreement (DSA) with government agencies
2. Anonymization: Remove PII before analysis
3. Incremental upload: Monthly updates via secure API
4. Consent management: Track farmer consent for data sharing
5. Privacy: Audit logs for all access
```

#### Crowdsourced Farmer Registration
```
Process:
1. Launch farmer portal (Phase 4)
2. Incentivize registration: SMS alerts, scheme eligibility info (value-add)
3. Expected registration rate: 10k/month (by month 6)
4. Data quality checks: Validation rules in frontend + backend
```

---

## 3. Data Preprocessing & Feature Engineering

### 3.1 Farmer Profile Processing

```python
# Pseudocode
def preprocess_farmer_data(farmer_raw):
    farmer = {}
    
    # Demographics (categorical encoding)
    farmer['age_group'] = categorize_age(farmer_raw.age)  # '18-30', '30-50', '50+'
    farmer['gender'] = one_hot_encode(farmer_raw.gender)  # Male, Female, Other
    
    # Land features (numerical + categorical)
    farmer['land_acres_log'] = log(farmer_raw.land_acres)  # Log scale (1-1000)
    farmer['crop_type'] = one_hot_encode(farmer_raw.crop_types)  # Rice, Wheat, Cotton, ...
    farmer['irrigation'] = farmer_raw.irrigation_status == 'Irrigated'
    
    # Financial features (log scale + ratios)
    farmer['income_log'] = log(farmer_raw.income)  # ₹20k-₹3L
    farmer['loan_to_income'] = farmer_raw.loans / farmer_raw.income
    farmer['loan_amount_log'] = log(farmer_raw.loans) if farmer_raw.loans > 0 else 0
    farmer['has_insurance'] = farmer_raw.insurance
    
    # Disaster history (binary flags)
    farmer['past_flood'] = farmer_raw.flood_history > 0
    farmer['past_drought'] = farmer_raw.drought_history > 0
    farmer['past_cyclone'] = farmer_raw.cyclone_history > 0
    farmer['past_pest'] = farmer_raw.pest_history > 0
    
    # Geospatial (convert to region codes)
    farmer['district_code'] = encode_district(farmer_raw.district)
    farmer['agro_climatic_zone'] = infer_zone(farmer_raw.latitude, farmer_raw.longitude)
    
    return farmer
```

### 3.2 Weather Data Processing

```python
def process_weather_data(weather_raw, farmer_location):
    features = {}
    
    # Anomaly detection (vs. 30-year normal)
    features['rainfall_anomaly'] = (weather_raw.rainfall - NORMAL[month].rainfall) / NORMAL[month].rainfall
    features['temp_anomaly'] = weather_raw.temp - NORMAL[month].temp
    
    # Disaster risk indicators
    features['drought_flag'] = weather_raw.rainfall < (NORMAL[month].rainfall * 0.7)  # <70% normal
    features['flood_flag'] = weather_raw.rainfall > 150  # >150mm in 48h
    features['extreme_temp'] = (weather_raw.temp > 45) or (weather_raw.temp < 5)
    
    # 7-day rolling features (for forecasting)
    features['rainfall_7d_total'] = sum(forecast_7d.rainfall)
    features['avg_temp_7d'] = mean(forecast_7d.temp)
    
    # Seasonality (month indicator)
    features['month'] = encode_month(weather_raw.date.month)
    features['crop_growth_stage'] = infer_stage(farmer_location.crop_type, weather_raw.date)
    
    return features
```

### 3.3 Feature Engineering Pipeline

```
Farmer Profile Data
  → Preprocessing (encoding, scaling)
  → Feature Selection (correlation analysis)
  → Feature Importance (for interpretability)
  → Merged Dataset

+ Weather Data
  → Normalization (0-100 scale)
  → Lag features (rainfall_t-1, _t-7, _t-30)
  → Rolling statistics (7-day, 30-day averages)

+ Financial Data (when available)
  → Payment history encoding (% on-time, # defaults)
  → Debt ratio, loan-to-income ratio
  → Trend analysis (improving vs. deteriorating)

= Training Dataset (farmer_id, features_vector, target_label)
  → Split: 60% train, 20% validation, 20% test
  → Temporal split (by date) to avoid leakage
```

---

## 4. Model Training Data Strategy

### 4.1 Financial Risk Model

#### Target Variable
```
Risk_Financial = Binary {Low (0), High (1)}
  or Continuous [0, 100]

Thresholds (for binary):
  - Low: Loan-to-income < 30%, on-time payments, has insurance
  - High: Loan-to-income > 50%, missed payments, no insurance
  
Data Requirements:
  - Minimum 10k samples (synthetic + real farmers)
  - Class balance: Adjust weights if High:Low ratio > 3:1
  - Time series: 1-2 years history per farmer (for payment patterns)
```

#### Features (Input)
```
Numerical:
  - income (log scale)
  - loan_amount (log scale)
  - loan_to_income_ratio
  - monthly_installments
  - debt_duration (months)
  - age
  - land_acres (log scale)

Categorical (one-hot encoded):
  - gender
  - crop_type
  - district
  - irrigation_status
  - has_insurance
  - loan_type (formal/informal)

Engineered:
  - payment_regularity (% on-time in past 12 months)
  - income_volatility (std dev of monthly income)
  - loan_to_asset_ratio (loans / land_value)
```

#### Data Imbalance Strategy
```
Expected distribution: 20-30% High risk (typically)
If imbalanced:
  - Stratified sampling (train/test split preserves ratio)
  - Class weight adjustment (XGBoost: scale_pos_weight)
  - SMOTE oversampling (if <5k samples)
  - Threshold adjustment (optimize for high recall on High-risk class)
```

### 4.2 Disaster Risk Model

#### Target Variable
```
Risk_Disaster = Binary {Low (0), High (1)}
  or Continuous [0, 100]

Thresholds:
  - Low: No disaster forecast in next 30 days, historical frequency < 1 per 5 years
  - High: Disaster forecast present, OR high historical frequency in region
  
Data Requirements:
  - Minimum 5k samples
  - Temporal: 3-5 years historical disaster data
  - Spatial: Disaster records by district/block
```

#### Features (Input)
```
Weather Variables:
  - rainfall (current + 7-day forecast)
  - rainfall_anomaly (vs. 30-year normal)
  - temperature (min, max)
  - humidity
  - soil_moisture (proxy)
  - wind_speed
  - drought_index (SPI, NDVI from satellite)

Geospatial:
  - district, agro-climatic_zone
  - elevation, latitude (affects weather patterns)
  - distance_to_river (flood proxy)

Historical (Region-Level):
  - flood_frequency (events per 10 years)
  - drought_frequency
  - cyclone_frequency
  - pest_outbreaks_frequency
  - avg_seasonal_rainfall (long-term normal)

Temporal:
  - month (seasonality: monsoon, winter, summer)
  - crop_growth_stage (vulnerability changes by stage)
  - days_since_last_disaster (lag feature)
```

#### Data Collection
```
Disaster History:
  - Source: NDMA, State DMAs, District records
  - Coverage: 2015-2026 (10 years)
  - Granularity: Incident date, location (GPS), type, damage
  - Processing:
    a) Aggregate to farmer's sub-district
    b) Calculate rolling frequency (events per year in region)
    c) Flag farmer location as "flood-prone", "drought-prone", etc.
    d) Merge with farmer profile (farmer in flood-prone + forecast rain → High risk)
```

### 4.3 Training Data Timeline

```
Phase 1-2 (Months 0-6):
  - Use 100% synthetic farmer data
  - Use real weather data (2020-2026)
  - Target: Baseline models (Financial AUC-ROC: 75%, Disaster: 70%)
  - Data: ~1000 synthetic farmers, 5 weather stations

Phase 3 (Months 7-12):
  - Integrate 10-20% real farmer data (government partnerships)
  - Retrain models with mixed data
  - Target: Improved performance (Financial 80%, Disaster 75%)
  - Data: ~10k-50k real farmers

Phase 4+ (Months 13+):
  - Continuous integration of new farmer registrations
  - Monthly retraining (online learning or batch)
  - A/B test new models on subset of farmers
  - Target: Production-ready (Financial 85%, Disaster 80%)
  - Data: 1M+ farmers
```

---

## 5. Evaluation & Validation Strategy

### 5.1 Model Evaluation Metrics

#### Financial Risk Model
```
Metrics:
  - Accuracy: Overall correctness (watch for class imbalance bias)
  - Precision: Of farmers predicted as High-risk, how many actually defaulted
  - Recall: Of actual defaulters, how many did model catch (critical!)
  - F1-Score: Harmonic mean (balance precision & recall)
  - AUC-ROC: Area under ROC curve (0.5=random, 1.0=perfect)
  - Feature Importance: SHAP values for explainability

Target Performance:
  - AUC-ROC: ≥0.85 (acceptable), ≥0.90 (excellent)
  - Recall (High-risk): ≥0.80 (catch 80% of true high-risk)
  - Precision (High-risk): ≥0.70 (avoid too many false positives)
  - Model stability: Retrain monthly; monitor performance drift
```

#### Disaster Risk Model
```
Metrics:
  - AUC-ROC: ≥0.80
  - Recall (High-risk): ≥0.75
  - Lead time: Model should predict 3-7 days in advance (measure from test set)
  - False positive rate: <20% (avoid "cry wolf" syndrome)
  
Test Scenarios:
  - Predict known disasters in test set (e.g., 2021 floods in Maharashtra)
  - Measure: Did model flag farmers in affected region as High-risk 5 days prior?
  - Success: 70%+ of affected farmers should have been flagged
```

### 5.2 Fairness & Bias Evaluation

```
Checks:
  - Demographic Parity: Model performance same across gender, caste (proxy: district), income?
  - Equal Opportunity: Recall for High-risk same across demographics?
  - Calibration: For farmers predicted 70% High-risk, do ~70% actually default?

Mitigation:
  - Stratified evaluation by demographics
  - Threshold adjustment per group (if acceptable by policy)
  - Document bias assumptions + limitations in model card
```

### 5.3 Data Quality Validation

```
Checks on Farmer Data:
  - Completeness: <10% missing values (impute age with median, income with zero)
  - Outlier Detection: Income > ₹50L (potential data entry error), acres > 1000 (data quality issue)
  - Consistency: Loan-to-income ratio reasonable? (flag ratio > 5 for review)
  - Duplicate: Phone number appears twice? (contact for verification)

Checks on Weather Data:
  - Continuity: No unexplained gaps (use interpolation if <3 days missing)
  - Outliers: Rainfall > 500mm in 24h (possible error or genuine monsoon; investigate)
  - Correlation: Temperature and humidity expected to be negatively correlated; flag if not

Automated Validation Pipeline:
  - Run on every data import
  - Alert admin if data quality < threshold
  - Quarantine suspicious records for manual review
```

---

## 6. Data Infrastructure & Versioning

### 6.1 Data Lineage Tracking

```
Requirement: Track data provenance for reproducibility & debugging

Implementation:
  - DVC (Data Version Control) or MLflow
  - Record for each dataset:
    - Source (API, CSV upload, query)
    - Timestamp
    - Processing steps applied
    - Hash (for integrity checking)
    - Owner (who uploaded)
    
Example:
  version: dataset_v1.2
  source: 
    - openweather_api (2026-07-18)
    - farmer_registrations (2026-07-18, 50k records)
  processing:
    - applied: preprocess_farmer_data
    - applied: normalize_weather_features
    - output_rows: 50000
    - output_cols: 42
    - hash: abc123def456
```

### 6.2 Data Storage Strategy

```
Raw Data (S3 / Cloud Storage):
  - farmer_raw_*.csv (monthly snapshots)
  - weather_raw_*.parquet (daily, compressed)
  - disaster_incidents_*.csv
  - Retention: 2 years minimum

Processed Data (Database):
  - Loaded into PostgreSQL farmer_profiles, farmer_risk_history tables
  - Retention: 5 years (for model training & audit)

Training Datasets (S3):
  - train_v1.0_financial_risk.parquet
  - val_v1.0_financial_risk.parquet
  - test_v1.0_financial_risk.parquet
  - Retention: As long as model in use

Models (S3 / Model Registry):
  - financial_risk_model_v1.2.pkl
  - disaster_risk_model_v2.0.pkl
  - metadata: training_date, performance, approval_status
```

---

## 7. Technology Stack for Data Management

| Tool | Purpose | Justification |
|------|---------|--------------|
| **Pandas** | Data manipulation | Industry-standard; fast; integrates with scikit-learn |
| **Polars** | Large-scale data (future) | Faster than Pandas for 1M+ rows; lazy evaluation |
| **SQLAlchemy** | Database ORM | Type-safe; handles complex queries; aligns with FastAPI |
| **DVC (Data Version Control)** | Dataset versioning | Track data lineage; reproducible experiments |
| **Pydantic** | Data validation | Schema validation on API input; auto-serialization |
| **Great Expectations** | Data quality checks | Define assertions (e.g., "income > 0"); automated testing |
| **Apache Airflow** (Phase 3+) | Data pipelines | Orchestrate recurring jobs (weather fetch, model retraining) |
| **Scikit-learn** | Feature scaling | StandardScaler, preprocessing utilities |
| **Feature-engine** | Feature engineering | Automated encoding, handling missing values |

---

## 8. Privacy & Ethics Framework

### 8.1 Data Privacy
```
DPDP Act 2023 (Indian Privacy Law):
  - Explicit consent: Farmers must opt-in to data sharing with government
  - Minimization: Collect only data needed for risk assessment
  - Anonymization: Remove PII (name, phone) before ML model training
  - Right to deletion: Delete farmer data 2 years after last login
  - Audit trail: Log all access to farmer PII

Implementation:
  - Consent management module: Farmer portal tracks checkboxes
  - Encryption: Farmer name/phone encrypted at rest (AES-256)
  - Access control: Government officers need case-by-case authorization
  - Retention policy: Automated deletion of old records
```

### 8.2 Fairness & Bias Mitigation
```
Risk Stratification Bias:
  - Issue: Model may unfairly classify poor farmers as high-risk (self-fulfilling)
  - Mitigation: Monitor performance across income groups; adjust thresholds if needed

Caste/Religion Bias:
  - Issue: District may correlate with caste composition (proxy bias)
  - Mitigation: Remove district from model; rely on neutral features (loan, income)
  - Evaluation: Stratified metrics by district; ensure performance parity

Allocation Fairness:
  - Objective: Reach small/marginal farmers (often more vulnerable)
  - Constraint in OR-Tools: Min 40% allocation to farmers with <2 acres

Transparency:
  - SHAP explanations for all predictions (farmers understand their risk)
  - Model cards: Document assumptions, limitations, bias analysis
  - Government policy: Clear allocation rules (not opaque)
```

---

## 9. Dataset Summary Table

| Category | Source | Volume (Phase 1) | Update Freq | Sensitivity | Availability |
|----------|--------|------------------|------------|------------|--------------|
| **Farmer Profile** | Self-registration | 1,000 synthetic → 10k real | Daily | High (PII) | Immediate |
| **Weather** | OpenWeather + NASA | 5 locations, 6 yrs history | 6-hourly | Low | Immediate |
| **Disaster History** | NDMA, State govts | 500 incidents/year | Daily | Medium | Phase 2+ |
| **Financial** | Government (future) | – | Monthly | High (sensitive) | Phase 3+ |
| **Land Records** | State revenue depts | – | Yearly | Medium | Phase 3+ |

---

## 10. Next Steps (Phase 1)

1. **Generate synthetic datasets**: 1,000 farmers, 5 districts, 6 years weather history
2. **Set up data pipelines**: Scripts for data fetch, preprocessing, loading
3. **Build feature engineering**: Automated pipeline for farmer + weather features
4. **Train baseline models**: Financial (75% AUC-ROC), Disaster (70% AUC-ROC)
5. **Evaluate fairness**: Stratified metrics across demographics
6. **Document data lineage**: DVC versioning, model cards
7. **Plan real data integration**: Timeline for government partnerships (Phase 3)

---

## Appendix: Open Datasets for Reference

| Dataset | Coverage | Fields | License | Link |
|---------|----------|--------|---------|------|
| **ICRISAT Data** | India (millet farmers) | Income, land, loan, yield | CC-BY | icrisat.org |
| **IMIS (Soil DB)** | India (state-wise) | Soil type, pH, nutrients | Open | soildhealth.dac.gov.in |
| **IMD Weather** | India-wide | Rainfall, temperature | Open | imdpune.gov.in |
| **NASA POWER** | Global | Irradiance, temperature, precip | Open | power.larc.nasa.gov |
| **World Bank Ag Data** | Global aggregates | Production, trade, prices | CC-BY | data.worldbank.org |

---

**End of Dataset Planning Document**
