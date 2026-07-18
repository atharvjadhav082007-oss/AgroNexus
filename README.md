# AgroNexus
AI-powered compound risk prediction platform that identifies farmers facing simultaneous financial and disaster vulnerability, then optimizes limited relief resource allocation using OR-Tools.



# 🌾 KhetSeva — Compound Risk Intelligence for Farmer Welfare

**Predicting crisis before it happens, not after.**

Farmers aren't ruined by a single flood or a single bad season — they're ruined 
when a disaster hits a household that's already financially vulnerable. KhetSeva 
combines financial risk signals with disaster probability data to detect this 
**compound risk** early, then uses optimization to help government agencies 
allocate limited relief resources where they'll have the most impact.

## What it does

- 📊 **Financial Risk Scoring** — analyzes loan status, income, and landholding 
  data to flag households under financial strain
- 🌧️ **Disaster Probability Scoring** — uses rainfall and historical flood/drought 
  data to estimate environmental risk
- 🔗 **Compound Risk Score (CRS)** — a weighted model that spikes specifically 
  when financial and disaster risk co-occur, not just when either is high alone
- 🧠 **Explainable AI** — every risk score comes with a plain-language breakdown 
  of contributing factors, not just a black-box number
- ⏱️ **Crisis Timeline Estimation** — predicts a window (e.g. 12–18 days) before 
  a household is likely to hit crisis point
- 🎯 **Ranked Intervention Recommendations** — suggests and prioritizes 
  interventions (loan restructuring, crop insurance, PM-Kisan benefits, relief 
  packages) with confidence scores
- ⚙️ **Resource Allocation Optimizer** — uses Google OR-Tools (CP-SAT) to 
  maximize the number of high-risk farmers covered when relief resources are 
  scarce
- 🗺️ **District & Farmer Dashboards** — map-level overview for policymakers, 
  drill-down profile view per farmer

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Leaflet (maps), Plotly (charts) |
| Backend | FastAPI (Python) |
| ML / Scoring | scikit-learn |
| Optimization | Google OR-Tools |
| Database | PostgreSQL |
| Deployment | Docker, Render / Railway |

## Why this matters

Most disaster-response systems predict *where* disasters will strike. KhetSeva 
predicts *who* will be devastated by them — by looking at financial vulnerability 
as a multiplier on disaster risk, not a separate concern. This lets governments 
and NGOs act preventively instead of reactively, and direct limited resources to 
the households that need them most.

Built for Smart India Hackathon 2025 — Disaster Management domain.

## Project Status

🚧 In active development for SIH 2025.

## Getting Started

\`\`\`bash
git clone https://github.com/<your-username>/khetseva.git
cd khetseva
docker-compose up --build
\`\`\`

Backend runs on \`localhost:8000\`, frontend on \`localhost:3000\`.

## License

MIT
