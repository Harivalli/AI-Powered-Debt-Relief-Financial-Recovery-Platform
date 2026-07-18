from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ---------- Auth / User ----------
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None


# ---------- Financial Profile ----------
class FinancialProfileBase(BaseModel):
    monthly_income: float = 0.0
    monthly_expenses: float = 0.0
    savings: float = 0.0
    employment_status: str = "employed"
    dependents: int = 0
    financial_goals: str = ""


class FinancialProfileCreate(FinancialProfileBase):
    pass


class FinancialProfileOut(FinancialProfileBase):
    id: int
    user_id: int
    updated_at: datetime

    class Config:
        from_attributes = True


# ---------- Debts ----------
class DebtBase(BaseModel):
    loan_name: str
    loan_type: str = "personal"
    principal_amount: float
    remaining_balance: float
    interest_rate: float = 0.0
    emi: float = 0.0
    due_date: Optional[str] = None
    status: str = "active"


class DebtCreate(DebtBase):
    pass


class DebtUpdate(BaseModel):
    loan_name: Optional[str] = None
    loan_type: Optional[str] = None
    principal_amount: Optional[float] = None
    remaining_balance: Optional[float] = None
    interest_rate: Optional[float] = None
    emi: Optional[float] = None
    due_date: Optional[str] = None
    status: Optional[str] = None


class DebtOut(DebtBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Expenses ----------
class ExpenseBase(BaseModel):
    category: str
    amount: float
    description: str = ""
    date: str


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseOut(ExpenseBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Dashboard ----------
class DashboardSummary(BaseModel):
    total_income: float
    total_expenses: float
    total_savings: float
    total_debt: float
    credit_utilization: float
    financial_health_score: float
    financial_health_rating: str
    upcoming_emi: float
    ai_summary: Optional[str] = None


# ---------- AI ----------
class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


class AIReportOut(BaseModel):
    id: int
    report_type: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Financial Score ----------
class FinancialScoreOut(BaseModel):
    score: float
    rating: str
    debt_to_income_ratio: float
    savings_rate: float
    expense_ratio: float

    class Config:
        from_attributes = True


# ---------- Repayment Plan ----------
class RepaymentPlanRequest(BaseModel):
    strategy: str = "avalanche"  # "avalanche" or "snowball"
    extra_monthly_payment: float = 0.0


class RepaymentPlanOut(BaseModel):
    strategy: str
    recommended_monthly_emi: float
    estimated_debt_free_date: Optional[str]
    plan_details: str

    class Config:
        from_attributes = True
