from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.config import settings
from app.routers import auth, profile, debts, expenses, dashboard, ai, reports

# Create all tables on startup (fine for SQLite demo; use Alembic migrations for production)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FinRelief AI",
    description="AI-Powered Debt Relief & Financial Recovery Platform API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(debts.router)
app.include_router(expenses.router)
app.include_router(dashboard.router)
app.include_router(ai.router)
app.include_router(reports.router)


@app.get("/")
def root():
    return {
        "message": "FinRelief AI backend is running",
        "docs": "/docs",
    }


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
