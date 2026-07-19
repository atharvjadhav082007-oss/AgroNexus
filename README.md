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

**✅ Phase 0: Planning & Research — COMPLETED**

All foundational research and design documentation is complete:
- ✅ Problem Statement (`docs/problem_statement.md`) - Business case, scope, success metrics
- ✅ Literature Review (`docs/literature_review.md`) - Technology analysis, existing systems, ML approaches
- ✅ Requirements Specification (`docs/requirements.md`) - 39 functional + 13 non-functional requirements
- ✅ System Architecture (`docs/architecture.md`) - Tech stack, API design, deployment diagrams
- ✅ Dataset Planning (`docs/dataset_planning.md`) - ML data pipeline, model training strategy
- ✅ Project Tracking (`SQL-based todos`) - Phases 1-13 decomposed into actionable tasks

**⏳ Phase 1: Project Setup — NEXT**
- [ ] Backend: FastAPI app structure, routers, services, models
- [ ] Frontend: React + TypeScript with Vite, TailwindCSS
- [ ] Database: PostgreSQL setup & Alembic migrations
- [ ] DevOps: Docker Compose for local development
- [ ] Documentation: API structure, development guide

🚧 Full development in progress toward SIH 2025 submission.

## 13-Phase Development Roadmap

```
Phase 0 ✅ → Phase 1 ⏳ → Phase 2 → ... → Phase 13
Planning    Setup      Database  ...  Research & Docs
```

See detailed timeline in `README.md` documentation section.

## Documentation

All Phase 0 deliverables are in the `docs/` folder:

| Document | Purpose |
|----------|---------|
| `problem_statement.md` | Problem definition, challenges, proposed solution, success metrics |
| `literature_review.md` | Existing systems, ML technology comparison, policy context |
| `requirements.md` | 39 functional requirements, 13 non-functional requirements (FR-F.1 to FR-O.3, NFR-P.1 to NFR-C.1) |
| `architecture.md` | System architecture, tech stack rationale, API endpoints, database schema, security model |
| `dataset_planning.md` | Data sources, preprocessing pipeline, model training strategy, privacy framework |

## Getting Started (Phase 1+)

Once Phase 1 is complete:

\`\`\`bash
git clone https://github.com/atharvjadhav082007-oss/AgroNexus.git
cd AgroNexus
cp .env.example .env.local
docker-compose up --build
\`\`\`



For development setup instructions, see `DEVELOPMENT.md` (available in Phase 1).

## Key Figures (Phase 0 Analysis)

- **Farmers**: 150+ million smallholder farmers in India; 68% indebted
- **Government Allocation**: ₹100,000+ crore annual relief across 50+ schemes
- **Problem**: Fragmented data, reactive (not predictive) interventions, inefficient allocation
- **Solution**: Compound risk prediction + explainable AI + OR-Tools optimization
- **Target Impact**: 30% improvement in allocation efficiency, 15-20% reduction in defaults

## Contact

**Project**: AgroNexus (KhetSeva) - Compound Risk Intelligence for Farmer Welfare  
**Domain**: Disaster Management / Agricultural Welfare  
**Event**: Smart India Hackathon 2025

## License

MIT
