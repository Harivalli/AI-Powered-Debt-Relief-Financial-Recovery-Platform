# FinRelief AI — AI-Powered Debt Relief & Financial Recovery Platform

A full-stack web application that helps users track debts and expenses,
understand their financial health, and get AI-generated guidance on the
fastest path to becoming debt-free.

Built to the SkillWallet AI/ML capstone structure: React (Vite) frontend,
FastAPI backend, SQLite database, JWT authentication, and Google Gemini
for AI features.

---

## Tech Stack

**Frontend:** React.js (Vite), React Router, Axios, Recharts, react-icons
**Backend:** FastAPI, SQLAlchemy, Pydantic, JWT (python-jose), bcrypt
**Database:** SQLite (swap `DATABASE_URL` for PostgreSQL in production)
**AI/ML:** Google Gemini API, rule-based Financial Health Score engine
**Reports:** ReportLab (PDF generation)
**Deployment target:** Render (backend), Vercel or Render Static Site (frontend)

## Project Structure

```
finrelief-ai/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entrypoint
│   │   ├── config.py            # Settings loaded from .env
│   │   ├── database.py          # SQLAlchemy engine/session
│   │   ├── models.py            # DB tables (Users, Debts, Expenses, etc.)
│   │   ├── schemas.py           # Pydantic request/response models
│   │   ├── auth.py              # JWT + password hashing
│   │   ├── ai/
│   │   │   ├── gemini_client.py     # Gemini wrapper + offline fallback
│   │   │   └── financial_score.py   # Health score + repayment planner logic
│   │   └── routers/
│   │       ├── auth.py          # Register / login / me
│   │       ├── profile.py       # Financial profile CRUD
│   │       ├── debts.py         # Debt CRUD
│   │       ├── expenses.py      # Expense CRUD
│   │       ├── dashboard.py     # Aggregated dashboard summary
│   │       ├── ai.py            # AI analysis, chat, score, repayment plan
│   │       └── reports.py       # PDF report generation
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/                 # Axios client + endpoint functions
    │   ├── context/AuthContext.jsx
    │   ├── components/          # AppLayout, ProtectedRoute, ClimbLine
    │   └── pages/               # Login, Register, Dashboard, Debts,
    │                             # Expenses, AIAnalysis, RepaymentPlanner,
    │                             # Reports, Account, ProfileSetup
    ├── index.css                 # Design tokens + all component styles
    └── package.json
```

## Database Tables

`users`, `financial_profiles`, `debts`, `expenses`, `ai_reports`,
`financial_scores`, `repayment_plans` — matching the SkillWallet schema shape.

## Features Implemented

- **Authentication** — register, login, JWT-protected routes, logout
- **Dashboard** — income, expenses, savings, debt, credit utilization,
  financial health score, spending-by-category chart, debt-balance chart
- **Financial Profile** — income, expenses, savings, employment, dependents, goals
- **Debt Management** — full CRUD, status badges (active/overdue/closed)
- **Expense Tracker** — categorized logging + pie chart breakdown
- **AI Debt Analysis** — Gemini-generated summary, risk flags, suggestions
- **AI Financial Assistant** — chat interface grounded in the user's own data
- **Financial Health Score** — 0–100 score from debt-to-income, expense
  ratio, and savings rate, with Excellent/Good/Average/Poor rating
- **Repayment Planner** — Snowball vs. Avalanche strategy simulation with
  month-by-month payoff projection and estimated debt-free date
- **Reports** — downloadable one-page PDF financial summary

### AI offline demo mode

If `GEMINI_API_KEY` is left blank in `backend/.env`, the AI analysis and
chat endpoints still respond (with a clearly labeled placeholder message)
so the app is fully demoable without an API key. Add a real key to get
live Gemini-generated responses.

## Running Locally

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # add your GEMINI_API_KEY if you have one
uvicorn app.main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173` and talks to the backend at the URL in
`frontend/.env` (`VITE_API_URL`, defaults to `http://localhost:8000`).

## Deployment

- **Backend → Render:** create a new Web Service from this repo's
  `backend/` folder, build command `pip install -r requirements.txt`,
  start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Set
  `SECRET_KEY`, `GEMINI_API_KEY`, and `FRONTEND_ORIGINS` as environment
  variables in the Render dashboard.
- **Frontend → Vercel or Render Static Site:** build command
  `npm run build`, output directory `dist`. Set `VITE_API_URL` to your
  deployed backend URL.

## Development Roadmap (as planned)

1. **Project Setup** — repo, Vite frontend, FastAPI backend, SQLite, Git ✅
2. **User Management** — registration, login, JWT, protected routes ✅
3. **Core Financial Features** — profile, debts, expenses, dashboard ✅
4. **AI Features** — Gemini integration, analysis, chat assistant ✅
5. **Smart Planning** — health score, snowball/avalanche planner ✅
6. **Reports & Deployment** — PDF export, deploy frontend + backend ⬜ (deploy is a manual step on your Render/Vercel accounts)

## Notes

- The Financial Health Score uses transparent, explainable rules (not a
  black-box model) so it's easy to justify in a report or demo. It can be
  swapped for a trained scikit-learn model later without changing the API.
- Passwords are hashed with bcrypt directly (not passlib) to avoid a known
  passlib/bcrypt 4.x compatibility bug.
- CORS origins are configurable via `FRONTEND_ORIGINS` in `backend/.env`.
