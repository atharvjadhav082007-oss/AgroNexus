# AgroNexus (KhetSeva) - Problem Statement

## Executive Summary

Indian farmers face multifaceted crises—financial instability, climate-induced disasters, and policy uncertainty. Government schemes exist but remain inaccessible and inefficient due to fragmented data and manual allocation processes. **AgroNexus** is an intelligent, data-driven decision support system that predicts financial and disaster risks for smallholder farmers, generates explainable recommendations, and optimally allocates government resources.

---

## Problem Definition

### 1. **Farmer-Level Challenges**

#### Financial Vulnerability
- 68% of Indian farmers have outstanding loans with limited repayment capacity
- Average loan default rate: 12-15% annually
- Limited access to formal credit; reliance on informal sources at 30-40% interest rates
- Crop failures lead to cascading debt and farmer suicides (~1 per 8 minutes in rural India)

#### Disaster & Climate Risk
- Unpredictable monsoons affect 60% of India's agricultural output
- Floods, droughts, and cyclones destroy 2-3 million hectares annually
- Pest outbreaks (e.g., Fall Armyworm) can destroy entire seasons
- Limited early warning systems reach remote villages

#### Information & Decision-Making Gap
- Farmers lack actionable, timely intelligence on:
  - Personal financial risk
  - Impending weather threats
  - Eligibility for government schemes
  - Optimal crop insurance and relief programs

### 2. **Government & Policy Challenges**

#### Inefficient Resource Allocation
- Government allocates ₹100,000+ crore annually but lacks:
  - Data-driven prioritization
  - Risk-stratified farmer identification
  - Optimal scheme-to-farmer matching
  - Real-time impact measurement

#### Fragmented Systems
- Multiple schemes (PMFBY, KCC, AIBP) operate in silos
- No unified farmer database; duplicate/ghost beneficiaries
- Manual verification processes; 40% error rate
- Delayed disbursements (3-6 months post-incident)

#### Limited Insight
- Governments cannot predict financial crises or disaster impacts
- No explainable reasoning for allocation decisions
- Difficulty justifying policy to stakeholders

---

## Root Causes

1. **Data Fragmentation**: Farmer data scattered across land records, bank systems, insurance databases, and weather stations—no integration.
2. **Lack of Prediction**: No unified financial or disaster risk models; decisions are reactive, not proactive.
3. **Suboptimal Allocation**: Manual or rule-based schemes; no optimization for fairness, impact, and budget constraints.
4. **Black-Box Decisions**: Government schemes lack transparency; farmers cannot understand why they're ineligible.
5. **Scalability Barrier**: Current systems cannot handle India's 150+ million farmers with real-time updates.

---

## Proposed Solution: AgroNexus

### Vision
**Empower smallholder farmers with predictive intelligence and government with data-driven, explainable resource allocation.**

### Core Components

#### For Farmers (Farmer Portal)
- **Self-Assessment Portal**: Register, input financial & land data, receive risk profiles
- **Risk Prediction**: Real-time compound risk scores (financial + disaster)
- **Explainable Recommendations**: "You are at HIGH RISK because of [loan overdue +22] + [rainfall deficit +31] + [no insurance +18]. Consider crop insurance for ₹5,000."
- **Scheme Discovery**: Eligibility and application guidance
- **Early Alerts**: Weather warnings, pest alerts, disaster notifications

#### For Government (Dashboard & Optimization)
- **Risk Analytics**: Map-based visualization of high-risk clusters
- **Predictive Alerts**: Identify farmers likely to face financial stress or disasters
- **Optimal Allocation**: Data-driven scheme allocation using OR-Tools
  - Budget constraints
  - Risk stratification
  - Fairness objectives (reach small-marginal farmers)
  - Multi-period planning
- **Impact Tracking**: Monitor outcomes of allocated schemes
- **Scheme Management**: Configure allocation rules, budgets, and objectives

#### For Researchers & Policy Makers
- **Explainable AI (XAI)**: SHAP-based explanations for all predictions
- **Evaluation Reports**: Model performance, allocation efficiency, farmer outcomes
- **Research Data**: Anonymized farmer and outcome data for academic analysis

---

## Scope

### In Scope
- Farmer risk prediction (financial + disaster)
- Government resource allocation optimization
- Farmer portal for self-assessment and scheme discovery
- Government dashboard for monitoring and allocation
- Explainable AI for all predictions
- Integration with public APIs (OpenWeather, NASA POWER, ISRO)
- PostgreSQL backend; no enterprise ERP integration initially

### Out of Scope (Phase 1)
- Direct integration with all government ministry systems (will build APIs for future integration)
- Mobile app (web-responsive design first)
- Blockchain or decentralized systems
- Real-time satellite imagery processing
- IoT sensor integration (future phase)

---

## Key Assumptions

1. **Data Availability**: Government can provide anonymized farmer data; voluntary farmer registration will grow over time
2. **Weather Data**: Public APIs (OpenWeather, NASA POWER) provide adequate forecasting for risk modeling
3. **Policy Support**: Government recognizes value of data-driven allocation and enables API access
4. **Stakeholder Buy-In**: Farmers and officials understand XAI and trust recommendations
5. **Scalability**: System will start with 1-2 states, expand nationally

---

## Success Metrics

### For Farmers
- 80%+ of registered farmers report improved understanding of personal financial risk
- 60%+ of high-risk farmers successfully access government schemes
- Reduction in loan default rates by 15-20% within 2 years
- Early warning system adoption reaches 40%+ of beneficiaries

### For Government
- Resource allocation efficiency improves by 30% (same budget, 30% more beneficiaries or impact)
- Targeting accuracy: 80%+ of allocated schemes reach intended high-risk farmers
- Reduction in duplicate/fraudulent claims by 50%
- Policy decisions justified with explainable models (transparency)

### For the System
- Support 1 million+ farmers within 18 months
- Sub-second response times for farmer queries
- Model accuracy (AUC-ROC): 85%+ for financial risk, 80%+ for disaster risk
- Optimization solver solves allocation for 100k+ farmers in <5 minutes

---

## Timeline & Phases

See the **13-phase development roadmap** for detailed deliverables and sequencing.

---

## References & Context

- **Indian Agriculture**: 150+ million smallholder farmers; 14% of GDP; 50% of workforce
- **Government Support**: ₹100,000 crore annual allocation across 50+ schemes
- **Climate Impact**: 60% of agriculture rain-fed; monsoon variability ±15% annually
- **Debt Crisis**: 68% of farmers indebted; avg loan ₹1-2 lakhs; default triggers asset loss
- **Tech Adoption**: 35% internet penetration in rural areas; growing smartphone usage (25%+)
