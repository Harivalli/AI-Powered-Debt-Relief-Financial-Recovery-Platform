from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("FinancialProfile", back_populates="owner", uselist=False, cascade="all, delete-orphan")
    debts = relationship("Debt", back_populates="owner", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="owner", cascade="all, delete-orphan")
    ai_reports = relationship("AIReport", back_populates="owner", cascade="all, delete-orphan")
    scores = relationship("FinancialScore", back_populates="owner", cascade="all, delete-orphan")
    repayment_plans = relationship("RepaymentPlan", back_populates="owner", cascade="all, delete-orphan")


class FinancialProfile(Base):
    __tablename__ = "financial_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    monthly_income = Column(Float, default=0.0)
    monthly_expenses = Column(Float, default=0.0)
    savings = Column(Float, default=0.0)
    employment_status = Column(String, default="employed")
    dependents = Column(Integer, default=0)
    financial_goals = Column(Text, default="")

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="profile")


class Debt(Base):
    __tablename__ = "debts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    loan_name = Column(String, nullable=False)
    loan_type = Column(String, default="personal")
    principal_amount = Column(Float, nullable=False)
    remaining_balance = Column(Float, nullable=False)
    interest_rate = Column(Float, default=0.0)
    emi = Column(Float, default=0.0)
    due_date = Column(String, nullable=True)
    status = Column(String, default="active")  # active, closed, overdue

    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="debts")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    category = Column(String, nullable=False)  # Food, Rent, Shopping, Bills, EMI, Entertainment, Healthcare, Other
    amount = Column(Float, nullable=False)
    description = Column(String, default="")
    date = Column(String, nullable=False)  # ISO date string

    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="expenses")


class AIReport(Base):
    __tablename__ = "ai_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    report_type = Column(String, default="debt_analysis")  # debt_analysis, chat, monthly_report
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="ai_reports")


class FinancialScore(Base):
    __tablename__ = "financial_scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    score = Column(Float, nullable=False)
    rating = Column(String, nullable=False)  # Excellent, Good, Average, Poor
    debt_to_income_ratio = Column(Float, default=0.0)
    savings_rate = Column(Float, default=0.0)
    expense_ratio = Column(Float, default=0.0)

    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="scores")


class RepaymentPlan(Base):
    __tablename__ = "repayment_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    strategy = Column(String, default="avalanche")  # snowball, avalanche
    recommended_monthly_emi = Column(Float, default=0.0)
    estimated_debt_free_date = Column(String, nullable=True)
    plan_details = Column(Text, default="")  # JSON string of ordered payoff plan

    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="repayment_plans")
