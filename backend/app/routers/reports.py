import io
from collections import defaultdict

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas

from app.database import get_db
from app import models
from app.auth import get_current_user
from app.ai.financial_score import calculate_financial_health_score

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.get("/financial-summary")
def download_financial_summary(
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

    total_debt = sum(d.remaining_balance for d in debts)
    total_emi = sum(d.emi for d in debts)

    score_data = calculate_financial_health_score(
        monthly_income=profile.monthly_income if profile else 0,
        monthly_expenses=profile.monthly_expenses if profile else 0,
        total_debt=total_debt,
        total_emi=total_emi,
        savings=profile.savings if profile else 0,
    )

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    y = height - 2 * cm

    def line(text, size=11, gap=0.7 * cm, bold=False):
        nonlocal y
        c.setFont("Helvetica-Bold" if bold else "Helvetica", size)
        c.drawString(2 * cm, y, text)
        y -= gap

    line("FinRelief AI - Financial Summary Report", size=16, bold=True)
    line(f"User: {current_user.full_name} ({current_user.email})")
    line(" ")

    line("Financial Profile", size=13, bold=True)
    line(f"Monthly Income: {profile.monthly_income if profile else 0}")
    line(f"Monthly Expenses (declared): {profile.monthly_expenses if profile else 0}")
    line(f"Savings: {profile.savings if profile else 0}")
    line(" ")

    line("Financial Health", size=13, bold=True)
    line(f"Score: {score_data['score']} / 100  ({score_data['rating']})")
    line(f"Debt-to-Income Ratio: {score_data['debt_to_income_ratio']}")
    line(f"Savings Rate: {score_data['savings_rate']}")
    line(f"Expense Ratio: {score_data['expense_ratio']}")
    line(" ")

    line("Debts", size=13, bold=True)
    if debts:
        for d in debts:
            line(f"- {d.loan_name} ({d.loan_type}): Balance {d.remaining_balance}, EMI {d.emi}, Rate {d.interest_rate}%")
    else:
        line("No debts recorded.")
    line(" ")

    line("Expenses by Category", size=13, bold=True)
    if category_totals:
        for cat, amt in category_totals.items():
            line(f"- {cat}: {amt}")
    else:
        line("No expenses recorded.")

    c.showPage()
    c.save()
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=finrelief_financial_summary.pdf"},
    )
