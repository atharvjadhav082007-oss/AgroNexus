# AgroNexus Development Guide

## Getting Started

### Prerequisites
- Docker & Docker Compose (for local development)
- Python 3.10+ (for backend development)
- Node.js 18+ (for frontend development)
- PostgreSQL client tools (psql, optional)
- Git

### Local Development Setup

#### 1. Clone Repository
```bash
git clone https://github.com/atharvjadhav082007-oss/AgroNexus.git
cd AgroNexus
```

#### 2. Environment Setup
```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your settings
# Key variables:
# - DATABASE_URL=postgresql://user:password@localhost:5432/agronexus_dev
# - SECRET_KEY=your-secret-key-for-jwt
# - OPENWEATHER_API_KEY=your-api-key
```

#### 3. Start Development Environment
```bash
# Using Docker Compose (recommended)
docker-compose up -d

# Verify services are running
docker-compose ps
```

This starts:
- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:3000
- **Database**: localhost:5432
- **pgAdmin** (DB management): http://localhost:5050

#### 4. Initialize Database
```bash
# Run migrations (inside backend container)
docker exec agronexus-backend alembic upgrade head

# Check database schema
docker exec -it agronexus-postgres psql -U postgres -d agronexus_dev -c "\dt"
```

#### 5. Access Applications
- **Backend API Docs**: http://localhost:8000/docs (Swagger UI)
- **Frontend**: http://localhost:3000
- **pgAdmin**: http://localhost:5050

---

## Development Workflow

### Backend Development

#### File Structure
```
backend/
├─ app/
│  ├─ routers/          # API route handlers
│  │  ├─ auth.py        # Authentication endpoints
│  │  ├─ farmer.py      # Farmer profile endpoints
│  │  ├─ government.py  # Government dashboard endpoints
│  │  ├─ optimization.py # Allocation endpoints
│  │  └─ admin.py       # Admin configuration endpoints
│  │
│  ├─ services/         # Business logic
│  │  ├─ farmer_service.py       # Farmer operations
│  │  ├─ risk_service.py         # Risk computation
│  │  ├─ weather_service.py      # Weather integration
│  │  ├─ recommendation_service.py
│  │  ├─ allocation_service.py
│  │  └─ notification_service.py # SMS/Email alerts
│  │
│  ├─ models/           # SQLAlchemy ORM
│  │  ├─ farmer.py
│  │  ├─ risk.py
│  │  ├─ scheme.py
│  │  ├─ allocation.py
│  │  └─ user.py
│  │
│  ├─ schemas/          # Pydantic validation
│  │  ├─ farmer.py
│  │  ├─ risk.py
│  │  └─ allocation.py
│  │
│  ├─ database/
│  │  ├─ engine.py      # SQLAlchemy engine & session
│  │  ├─ base.py        # Base model class
│  │  └─ session.py     # Session factory
│  │
│  ├─ utils/
│  │  ├─ logger.py      # Logging setup
│  │  ├─ errors.py      # Custom exceptions
│  │  └─ constants.py   # App constants
│  │
│  └─ config.py         # Configuration management
│
├─ main.py              # FastAPI app entry point
├─ requirements.txt     # Python dependencies
├─ Dockerfile
└─ .env.example

```

#### Common Tasks

**Add a new API endpoint**:
1. Create function in `app/routers/your_router.py`
2. Define Pydantic schema in `app/schemas/`
3. Call service functions from `app/services/`
4. Test with pytest
5. Document in Swagger (docstrings with examples)

Example:
```python
# routers/farmer.py
from fastapi import APIRouter, Depends, HTTPException
from app.schemas import FarmerOut, FarmerCreate
from app.services import FarmerService

router = APIRouter(prefix="/farmer", tags=["farmer"])

@router.post("/register", response_model=FarmerOut)
async def register_farmer(data: FarmerCreate, service: FarmerService = Depends()):
    """Register a new farmer and return profile"""
    farmer = await service.create_farmer(data)
    return farmer
```

**Add a database model**:
1. Create class in `app/models/`
2. Inherit from `Base`
3. Add table name, columns with types
4. Create Alembic migration:
   ```bash
   docker exec agronexus-backend alembic revision --autogenerate -m "Add new_table"
   docker exec agronexus-backend alembic upgrade head
   ```

**Run backend tests**:
```bash
# All tests
docker exec agronexus-backend pytest

# Specific test file
docker exec agronexus-backend pytest tests/test_farmer_service.py

# With coverage
docker exec agronexus-backend pytest --cov=app tests/
```

### Frontend Development

#### File Structure
```
frontend/
├─ src/
│  ├─ pages/           # Route pages
│  │  ├─ Home.tsx
│  │  ├─ Register.tsx
│  │  ├─ Login.tsx
│  │  ├─ Profile.tsx
│  │  ├─ Risk.tsx
│  │  ├─ Recommendations.tsx
│  │  └─ Dashboard.tsx  # Government dashboard
│  │
│  ├─ components/      # Reusable components
│  │  ├─ Navbar.tsx
│  │  ├─ Footer.tsx
│  │  ├─ Card.tsx
│  │  ├─ Form.tsx
│  │  ├─ Button.tsx
│  │  ├─ RiskGauge.tsx
│  │  ├─ Map.tsx        # Leaflet map
│  │  └─ Charts.tsx     # Plotly charts
│  │
│  ├─ services/        # API clients
│  │  ├─ api.ts        # Axios instance
│  │  ├─ farmer.ts     # Farmer API calls
│  │  └─ government.ts # Government API calls
│  │
│  ├─ context/         # React Context
│  │  └─ AuthContext.tsx
│  │
│  ├─ styles/          # Global CSS
│  │  └─ globals.css   # Tailwind imports
│  │
│  ├─ App.tsx          # Main component
│  └─ main.tsx         # React entry point
│
├─ vite.config.ts      # Vite configuration
├─ package.json
├─ tsconfig.json
└─ Dockerfile
```

#### Common Tasks

**Add a new page**:
1. Create component in `src/pages/YourPage.tsx`
2. Add route in `App.tsx`
3. Create components in `src/components/` as needed
4. Use hooks (useState, useContext) for state

Example:
```tsx
// src/pages/Risk.tsx
import { useEffect, useState } from 'react';
import { getRisk } from '../services/farmer';
import RiskGauge from '../components/RiskGauge';

export default function Risk() {
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRisk().then(setRisk).finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  return <RiskGauge score={risk.compound_score} />;
}
```

**Run frontend tests**:
```bash
cd frontend
npm test

# With coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

**Build for production**:
```bash
cd frontend
npm run build

# Output: dist/ folder ready for deployment
```

---

## Testing

### Backend Tests

Structure: `tests/` folder mirrors `app/` folder

```
tests/
├─ unit/
│  ├─ test_farmer_service.py
│  ├─ test_risk_service.py
│  └─ test_models.py
├─ integration/
│  ├─ test_farmer_endpoints.py
│  ├─ test_auth_endpoints.py
│  └─ test_optimization.py
└─ conftest.py  # Fixtures, test database setup
```

Run tests:
```bash
# All tests
pytest

# Specific module
pytest tests/unit/test_farmer_service.py

# With coverage report
pytest --cov=app --cov-report=html

# Watch mode (requires pytest-watch)
ptw

# Stop on first failure
pytest -x

# Show print statements
pytest -s
```

### Frontend Tests

Use Vitest + React Testing Library

```
frontend/src/
├─ components/
│  └─ Button.test.tsx
├─ services/
│  └─ farmer.test.ts
└─ pages/
   └─ Risk.test.tsx
```

Run tests:
```bash
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### ML Model Tests

```
ml/
├─ financial/
│  ├─ test_train.py
│  └─ test_predict.py
└─ disaster/
   └─ test_train.py
```

Run:
```bash
cd ml
pytest
```

---

## Code Quality

### Linting & Formatting

**Backend**:
```bash
# Format code
docker exec agronexus-backend black app/

# Lint
docker exec agronexus-backend pylint app/

# Type checking
docker exec agronexus-backend mypy app/
```

**Frontend**:
```bash
cd frontend
npm run lint       # ESLint
npm run format     # Prettier
```

### Pre-commit Hooks (Phase 12+)

Automatically run linters before commits:
```bash
pip install pre-commit
pre-commit install
```

---

## Database Management

### Migrations (Alembic)

**Create a new migration**:
```bash
docker exec agronexus-backend alembic revision --autogenerate -m "Description of change"
```

**Apply migration**:
```bash
docker exec agronexus-backend alembic upgrade head
```

**Rollback**:
```bash
docker exec agronexus-backend alembic downgrade -1
```

**View migration history**:
```bash
docker exec agronexus-backend alembic history
```

### Direct Database Access

```bash
# Connect to database
docker exec -it agronexus-postgres psql -U postgres -d agronexus_dev

# Useful commands
\dt               # List tables
\d farmers        # Describe farmers table
SELECT * FROM farmers LIMIT 5;
\q                # Quit
```

### Backup & Restore

```bash
# Backup
docker exec agronexus-postgres pg_dump -U postgres agronexus_dev > backup.sql

# Restore
docker exec -i agronexus-postgres psql -U postgres < backup.sql
```

---

## API Documentation

Backend API documentation is auto-generated:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### Documenting Endpoints

Use docstrings with examples:

```python
@router.post("/farmer/register")
async def register_farmer(data: FarmerCreate) -> FarmerOut:
    """
    Register a new farmer.
    
    Request body:
        - phone: Farmer's phone number (unique)
        - name: Farmer's full name
        - age: Age in years
        
    Response:
        - id: Unique farmer ID
        - phone: Phone number registered
        - risk_score: Initial risk assessment (0-100)
        
    Example:
        POST /farmer/register
        {
            "phone": "9876543210",
            "name": "Ram Kumar",
            "age": 45
        }
        
        Response:
        {
            "id": "uuid-xxx",
            "phone": "9876543210",
            "risk_score": 65
        }
    """
```

---

## Deployment (Phase 12+)

### Docker Build

```bash
# Backend
docker build -f backend/Dockerfile -t agronexus-backend:latest ./backend

# Frontend
docker build -f frontend/Dockerfile -t agronexus-frontend:latest ./frontend

# Run containers
docker run -p 8000:8000 agronexus-backend:latest
docker run -p 3000:3000 agronexus-frontend:latest
```

### Production Deployment

**Render.com** (recommended for this project):
1. Push code to GitHub
2. Connect Render to GitHub repo
3. Create Web Service from Dockerfile
4. Set environment variables in Render dashboard
5. Deploy automatically on push to `main`

**Database** (Neon PostgreSQL):
1. Create account at neon.tech
2. Create new project
3. Copy connection string
4. Set `DATABASE_URL` in .env

**Frontend** (Vercel):
1. Push code to GitHub
2. Import project to Vercel
3. Set build command: `cd frontend && npm run build`
4. Set output directory: `frontend/dist`
5. Deploy

---

## Troubleshooting

### Docker Issues

**Containers won't start**:
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild images
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

**Port already in use**:
```bash
# Find process using port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000                  # macOS/Linux

# Kill process or change port in docker-compose.yml
```

### Database Issues

**Migration fails**:
```bash
# Check migration status
docker exec agronexus-backend alembic current

# Downgrade and try again
docker exec agronexus-backend alembic downgrade -1
docker exec agronexus-backend alembic upgrade head
```

**Can't connect to database**:
- Check `DATABASE_URL` in .env.local
- Ensure PostgreSQL container is running: `docker-compose ps`
- Wait for postgres to be ready: `docker-compose logs postgres`

### API Issues

**401 Unauthorized**:
- Check JWT token in Authorization header
- Token may have expired; re-login to get new token
- Check CORS settings if from different domain

**422 Validation Error**:
- Check request body matches Pydantic schema
- Look at error response for detailed field validation errors
- Use Swagger UI to test endpoint with correct schema

---

## Contributing

### Code Style

**Python** (Backend):
- Black for formatting (line length: 100)
- PEP 8 style guide
- Type hints required for all functions
- Docstrings for all functions and classes

**TypeScript/React** (Frontend):
- Prettier for formatting
- ESLint for style
- Functional components with hooks
- Props interfaces required

### Pull Request Process

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes, commit with clear messages
3. Run tests: `pytest`, `npm test`
4. Push: `git push origin feature/your-feature`
5. Create PR on GitHub with description
6. Address review comments
7. Merge when approved

### Reporting Bugs

Use GitHub Issues with template:
- **Description**: What's the bug?
- **Reproduction**: Steps to reproduce
- **Expected**: What should happen?
- **Actual**: What actually happens?
- **Environment**: OS, Python version, etc.

---

## Common Commands Quick Reference

```bash
# Docker
docker-compose up -d           # Start services
docker-compose down            # Stop services
docker-compose logs -f         # Follow logs
docker exec <container> <cmd>  # Run command in container

# Backend
pytest                         # Run tests
black app/                     # Format code
alembic revision --autogenerate -m "msg"  # Create migration
alembic upgrade head           # Apply migration

# Frontend
npm install                    # Install dependencies
npm run dev                    # Dev server
npm test                       # Run tests
npm run build                  # Build for production

# Database
psql -U postgres -d agronexus_dev  # Connect to DB
\dt                            # List tables
\q                             # Quit
```

---

## Resources

- **FastAPI**: https://fastapi.tiangolo.com
- **SQLAlchemy**: https://docs.sqlalchemy.org
- **React**: https://react.dev
- **TailwindCSS**: https://tailwindcss.com
- **Google OR-Tools**: https://developers.google.com/optimization
- **PostgreSQL**: https://www.postgresql.org/docs

---

**Last Updated**: 2026-07-18  
**Status**: Phase 0 Complete | Phase 1 In Progress
