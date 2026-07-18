from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.auth import get_current_user
from app.ai.financial_score import calculate_financial_health_score

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=schemas.DashboardSummary)
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    profile = db.query(models.FinancialProfile).filter(
        models.FinancialProfile.user_id == current_user.id
    ).first()
    debts = db.query(models.Debt).filter(
        models.Debt.user_id == current_user.id, models.Debt.status != "closed"
    ).all()
    expenses = db.query(models.Expense).filter(models.Expense.user_id == current_user.id).all()

    monthly_income = profile.monthly_income if profile else 0
    savings = profile.savings if profile else 0

    total_debt = sum(d.remaining_balance for d in debts)
    total_emi = sum(d.emi for d in debts)
    total_expenses = sum(e.amount for e in expenses)

    total_credit_limit = sum(d.principal_amount for d in debts) or 1
    credit_utilization = round((total_debt / total_credit_limit) * 100, 1)

    score_data = calculate_financial_health_score(
        monthly_income=monthly_income,
        monthly_expenses=profile.monthly_expenses if profile else 0,
        total_debt=total_debt,
        total_emi=total_emi,
        savings=savings,
    )

    return schemas.DashboardSummary(
        total_income=monthly_income,
        total_expenses=total_expenses,
        total_savings=savings,
        total_debt=total_debt,
        credit_utilization=credit_utilization,
        financial_health_score=score_data["score"],
        financial_health_rating=score_data["rating"],
        upcoming_emi=total_emi,
        ai_summary=None,
    )
