import json
from collections import defaultdict

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.auth import get_current_user
from app.ai.gemini_client import generate_text, build_debt_analysis_prompt, build_chat_prompt
from app.ai.financial_score import calculate_financial_health_score, build_repayment_plan

router = APIRouter(prefix="/api/ai", tags=["AI Features"])


def _profile_dict(profile: models.FinancialProfile | None) -> dict:
    if not profile:
        return {}
    return {
        "monthly_income": profile.monthly_income,
        "monthly_expenses": profile.monthly_expenses,
        "savings": profile.savings,
        "employment_status": profile.employment_status,
        "dependents": profile.dependents,
        "financial_goals": profile.financial_goals,
    }


def _debts_list(debts) -> list:
    return [
        {
            "loan_name": d.loan_name,
            "loan_type": d.loan_type,
            "remaining_balance": d.remaining_balance,
            "interest_rate": d.interest_rate,
            "emi": d.emi,
            "status": d.status,
        }
        for d in debts
    ]


@router.post("/analysis", response_model=schemas.AIReportOut)
def generate_debt_analysis(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    profile = db.query(models.FinancialProfile).filter(
        models.FinancialProfile.user_id == current_user.id
    ).first()
    debts = db.query(models.Debt).filter(models.Debt.user_id == current_user.id).all()
    expenses = db.query(models.Expense).filter(models.Expense.user_id == current_user.id).all()

    category_totals = defaultdict(float)
    for e in expenses:
        category_totals[e.category] += e.amount

    prompt = build_debt_analysis_prompt(_profile_dict(profile), _debts_list(debts), dict(category_totals))
    content = generate_text(prompt)

    report = models.AIReport(user_id=current_user.id, report_type="debt_analysis", content=content)
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/analysis/history", response_model=list[schemas.AIReportOut])
def analysis_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.AIReport).filter(
        models.AIReport.user_id == current_user.id,
        models.AIReport.report_type == "debt_analysis",
    ).order_by(models.AIReport.created_at.desc()).all()


@router.post("/chat", response_model=schemas.ChatResponse)
def chat_with_assistant(
    chat_in: schemas.ChatRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    profile = db.query(models.FinancialProfile).filter(
        models.FinancialProfile.user_id == current_user.id
    ).first()
    debts = db.query(models.Debt).filter(models.Debt.user_id == current_user.id).all()

    context_summary = {
        "profile": _profile_dict(profile),
        "total_debt": sum(d.remaining_balance for d in debts),
        "num_active_loans": len([d for d in debts if d.status == "active"]),
    }

    prompt = build_chat_prompt(chat_in.message, context_summary)
    reply = generate_text(prompt)

    db.add(models.AIReport(user_id=current_user.id, report_type="chat", content=f"Q: {chat_in.message}\nA: {reply}"))
    db.commit()

    return schemas.ChatResponse(reply=reply)


@router.get("/score", response_model=schemas.FinancialScoreOut)
def get_financial_score(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    profile = db.query(models.FinancialProfile).filter(
        models.FinancialProfile.user_id == current_user.id
    ).first()
    debts = db.query(models.Debt).filter(
        models.Debt.user_id == current_user.id, models.Debt.status == "active"
    ).all()

    total_debt = sum(d.remaining_balance for d in debts)
    total_emi = sum(d.emi for d in debts)

    score_data = calculate_financial_health_score(
        monthly_income=profile.monthly_income if profile else 0,
        monthly_expenses=profile.monthly_expenses if profile else 0,
        total_debt=total_debt,
        total_emi=total_emi,
        savings=profile.savings if profile else 0,
    )

    record = models.FinancialScore(
        user_id=current_user.id,
        score=score_data["score"],
        rating=score_data["rating"],
        debt_to_income_ratio=score_data["debt_to_income_ratio"],
        savings_rate=score_data["savings_rate"],
        expense_ratio=score_data["expense_ratio"],
    )
    db.add(record)
    db.commit()

    return schemas.FinancialScoreOut(**score_data)


@router.post("/repayment-plan", response_model=schemas.RepaymentPlanOut)
def generate_repayment_plan(
    plan_in: schemas.RepaymentPlanRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    debts = db.query(models.Debt).filter(
        models.Debt.user_id == current_user.id, models.Debt.status == "active"
    ).all()

    debts_data = [
        {
            "loan_name": d.loan_name,
            "remaining_balance": d.remaining_balance,
            "interest_rate": d.interest_rate,
            "emi": d.emi,
        }
        for d in debts
    ]

    plan = build_repayment_plan(debts_data, strategy=plan_in.strategy, extra_monthly_payment=plan_in.extra_monthly_payment)

    record = models.RepaymentPlan(
        user_id=current_user.id,
        strategy=plan["strategy"],
        recommended_monthly_emi=plan["recommended_monthly_emi"],
        estimated_debt_free_date=plan["estimated_debt_free_date"],
        plan_details=plan["plan_details"],
    )
    db.add(record)
    db.commit()

    return schemas.RepaymentPlanOut(
        strategy=plan["strategy"],
        recommended_monthly_emi=plan["recommended_monthly_emi"],
        estimated_debt_free_date=plan["estimated_debt_free_date"],
        plan_details=plan["plan_details"],
    )
