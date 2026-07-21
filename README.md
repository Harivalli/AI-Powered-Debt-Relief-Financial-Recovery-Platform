# 💰 FinRelief AI — AI-Powered Debt Relief & Financial Recovery Platform

A full-stack AI-powered financial recovery platform that helps users track debts and expenses, understand their financial health, and receive personalized AI-generated guidance to become debt-free.

Built following the SkillWallet AI/ML Capstone structure using React, FastAPI, SQLite, JWT Authentication, and Google Gemini AI.

---

## 🌐 Live Demo

**Website:** https://finrelief-ai-frontend.onrender.com

**Demo Video:** https://drive.google.com/file/d/1-UngA1mqCgYKpksgnnR0BQMAwPEaXRWd/view?usp=drivesdk


---

# 📸 Application Preview

> Add screenshots of your application here.

- Login Page
- Dashboard
- Debt Management
- Expense Tracker
- AI Financial Assistant
- Reports

---

# 🚀 Tech Stack

### Frontend
- React.js (Vite)
- React Router
- Axios
- Recharts
- React Icons

### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication (python-jose)
- bcrypt Password Hashing

### Database
- SQLite
- Easily configurable for PostgreSQL

### AI & Machine Learning
- Google Gemini API
- Rule-based Financial Health Score Engine
- AI Debt Analysis
- AI Financial Assistant

### Reports
- ReportLab (PDF Generation)

### Deployment
- Frontend: Render
- Backend: Render

---

# 📂 Project Structure

```
finrelief-ai/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth.py
│   │   ├── ai/
│   │   │   ├── gemini_client.py
│   │   │   └── financial_score.py
│   │   └── routers/
│   │       ├── auth.py
│   │       ├── profile.py
│   │       ├── debts.py
│   │       ├── expenses.py
│   │       ├── dashboard.py
│   │       ├── ai.py
│   │       └── reports.py
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── context/
    │   ├── components/
    │   └── pages/
    ├── index.css
    └── package.json
```

---

# 🗄️ Database Tables

- Users
- Financial Profiles
- Debts
- Expenses
- AI Reports
- Financial Scores
- Repayment Plans

---

# ✨ Features

## 🔐 User Authentication

- User Registration
- Secure Login
- JWT Authentication
- Protected Routes
- Logout

---

## 📊 Dashboard

- Total Income
- Total Expenses
- Total Savings
- Total Debt
- Credit Utilization
- Financial Health Score
- Spending Analysis
- Debt Distribution Charts

---

## 👤 Financial Profile

Users can manage:

- Monthly Income
- Monthly Expenses
- Savings
- Employment Status
- Dependents
- Financial Goals

---

## 💳 Debt Management

- Add Debts
- Update Debts
- Delete Debts
- Track Loan Status
- Active / Closed / Overdue Indicators

---

## 💸 Expense Tracker

- Categorized Expenses
- Expense History
- Spending Breakdown
- Pie Chart Visualization

---

## 🤖 AI Debt Analysis

Google Gemini analyzes financial information and provides:

- Personalized Financial Advice
- Debt Risk Analysis
- Spending Insights
- Saving Recommendations

---

## 💬 AI Financial Assistant

Interactive chatbot that answers financial questions using the user's own financial data.

---

## 📈 Financial Health Score

Generates a score between **0–100** based on:

- Debt-to-Income Ratio
- Expense Ratio
- Savings Rate

Ratings:

- Excellent
- Good
- Average
- Poor

---

## 📅 Repayment Planner

Supports two repayment strategies:

- Snowball Method
- Avalanche Method

Provides:

- Month-wise Repayment Plan
- Estimated Debt-Free Date
- Debt Reduction Timeline

---

## 📄 PDF Financial Report

Generate and download a professional financial summary report.

---

## 📴 Offline AI Demo Mode

If the `GEMINI_API_KEY` is not configured, the application switches to an offline demo mode with placeholder AI responses, ensuring all features remain demonstrable.

---

# ⚙️ Installation

## Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt

cp .env.example .env

# Add your GEMINI_API_KEY

uvicorn app.main:app --reload --port 8000
```

API Documentation:

```
http://localhost:8000/docs
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🎯 Future Enhancements

- Credit Score Prediction
- Loan Eligibility Prediction
- OCR-based Bank Statement Analysis
- Voice-enabled AI Assistant
- Investment Recommendations
- Multilingual Support
- Email Notifications
- Advanced Financial Forecasting

---

# 👩‍💻 Author

**Ketha Hari Valli**

B.Tech – Computer Science and Business Systems

Vishnu Institute of Technology

---

# ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.
