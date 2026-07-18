"""
Financial Health Score + Repayment Planner logic.
Uses simple, explainable rules (rather than a black-box model) so the
score is easy to justify in a report or demo -- this can be swapped for
a trained scikit-learn model later without changing the API surface.
"""
import json
from datetime import datetime
from typing import List, Dict


def calculate_financial_health_score(
    monthly_income: float,
    monthly_expenses: float,
    total_debt: float,
    total_emi: float,
    savings: float,
) -> Dict:
    """Returns a 0-100 score plus the component ratios and a rating label."""
    if monthly_income <= 0:
        return {
            "score": 0,
            "rating": "Poor",
            "debt_to_income_ratio": 0,
            "savings_rate": 0,
            "expense_ratio": 0,
        }

    debt_to_income_ratio = total_emi / monthly_income
    expense_ratio = monthly_expenses / monthly_income
    savings_rate = savings / monthly_income if monthly_income else 0

    # Each component contributes to a 0-100 score. Lower debt/expense ratios
    # and higher savings rate are rewarded.
    debt_score = max(0, 100 - debt_to_income_ratio * 200)  # 50% DTI -> 0
    expense_score = max(0, 100 - expense_ratio * 100)      # 100% expense ratio -> 0
    savings_score = min(100, savings_rate * 200)           # 50% savings rate -> 100

    final_score = round((debt_score * 0.4) + (expense_score * 0.35) + (savings_score * 0.25), 1)
    final_score = max(0, min(100, final_score))

    if final_score >= 80:
        rating = "Excellent"
    elif final_score >= 60:
        rating = "Good"
    elif final_score >= 40:
        rating = "Average"
    else:
        rating = "Poor"

    return {
        "score": final_score,
        "rating": rating,
        "debt_to_income_ratio": round(debt_to_income_ratio, 3),
        "savings_rate": round(savings_rate, 3),
        "expense_ratio": round(expense_ratio, 3),
    }


def build_repayment_plan(debts: List[Dict], strategy: str = "avalanche", extra_monthly_payment: float = 0.0) -> Dict:
    """
    debts: list of dicts with keys: loan_name, remaining_balance, interest_rate, emi
    strategy: "avalanche" (highest interest first) or "snowball" (smallest balance first)
    """
    active_debts = [d for d in debts if d.get("remaining_balance", 0) > 0]

    if not active_debts:
        return {
            "strategy": strategy,
            "recommended_monthly_emi": 0,
            "estimated_debt_free_date": None,
            "plan_details": json.dumps([]),
        }

    if strategy == "snowball":
        ordered = sorted(active_debts, key=lambda d: d["remaining_balance"])
    else:
        strategy = "avalanche"
        ordered = sorted(active_debts, key=lambda d: d.get("interest_rate", 0), reverse=True)

    total_emi = sum(d.get("emi", 0) for d in active_debts)
    total_balance = sum(d.get("remaining_balance", 0) for d in active_debts)
    monthly_payment_pool = total_emi + extra_monthly_payment

    # Simple month-by-month simulation applying extra payment to the priority debt
    remaining = {d["loan_name"]: d["remaining_balance"] for d in ordered}
    rates = {d["loan_name"]: d.get("interest_rate", 0) / 100 / 12 for d in ordered}
    min_emis = {d["loan_name"]: d.get("emi", 0) for d in ordered}
    order_names = [d["loan_name"] for d in ordered]

    months = 0
    max_months = 600  # safety cap (50 years)
    payoff_order = []

    while any(bal > 0.5 for bal in remaining.values()) and months < max_months:
        months += 1
        pool = extra_monthly_payment

        for name in order_names:
            if remaining[name] <= 0:
                continue
            interest = remaining[name] * rates[name]
            payment = min_emis[name] + (pool if pool > 0 else 0)
            pool = 0  # only the first active debt in priority order gets the extra payment this month
            remaining[name] = max(0, remaining[name] + interest - payment)
            if remaining[name] <= 0.5 and name not in payoff_order:
                payoff_order.append(name)

    debt_free_date = None
    if months < max_months:
        year = datetime.utcnow().year + (months // 12)
        month = ((datetime.utcnow().month - 1 + months) % 12) + 1
        debt_free_date = f"{year}-{month:02d}"

    plan_details = [
        {
            "priority": i + 1,
            "loan_name": d["loan_name"],
            "remaining_balance": d["remaining_balance"],
            "interest_rate": d.get("interest_rate", 0),
            "emi": d.get("emi", 0),
        }
        for i, d in enumerate(ordered)
    ]

    return {
        "strategy": strategy,
        "recommended_monthly_emi": round(monthly_payment_pool, 2),
        "estimated_debt_free_date": debt_free_date,
        "plan_details": json.dumps(plan_details),
        "months_to_debt_free": months if months < max_months else None,
        "total_balance": round(total_balance, 2),
    }
