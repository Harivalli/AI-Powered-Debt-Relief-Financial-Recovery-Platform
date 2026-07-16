# Phase 3: Project Design

## Overview

The Project Design phase defines the overall architecture, modules, database structure, API endpoints, and workflow of the **AI Powered Debt Relief & Financial Recovery Platform**. The application is designed using a modular architecture to ensure scalability, maintainability, security, and efficient AI integration.

The platform leverages **React.js** for the frontend, **FastAPI** for the backend, **SQLite** for database management, and **Google Gemini AI** to provide intelligent financial guidance and negotiation strategies.

---

# System Architecture

The application follows a three-tier architecture.

```
                User
                  │
                  ▼
         React.js Frontend
                  │
          Axios HTTP Requests
                  │
                  ▼
           FastAPI Backend
                  │
     ┌────────────┼────────────┐
     │            │            │
     ▼            ▼            ▼
 SQLite DB   ML Prediction   Gemini AI
     │            │            │
     └────────────┼────────────┘
                  │
                  ▼
           API Response
                  │
                  ▼
            User Dashboard
```

---

# Module Design

The application consists of the following modules.

## 1. User Authentication Module

Responsible for:

- User Registration
- Secure Login
- JWT Authentication
- Password Encryption
- Session Management

---

## 2. Financial Profile Module

Responsible for

- Monthly Income
- Monthly Expenses
- Savings
- Credit Score
- Employment Details
- Financial Health Assessment

---

## 3. Loan Management Module

Responsible for

- Add Loan
- Edit Loan
- Delete Loan
- Loan Overview
- Outstanding Amount
- Interest Rate
- Due Date

---

## 4. Financial Analysis Module

Responsible for

- Debt-to-Income Ratio
- Monthly Financial Analysis
- Repayment Capacity
- Financial Health Score
- Loan Prioritization

---

## 5. Settlement Prediction Module

Responsible for

- Settlement Prediction
- Estimated Settlement Amount
- Repayment Suggestions
- Debt Recovery Recommendation

---

## 6. AI Recommendation Module

Uses Google Gemini AI to generate

- Negotiation Strategies
- Settlement Suggestions
- Financial Advice
- Debt Recovery Plan
- Personalized Recommendations

---

## 7. Dashboard Module

Displays

- Total Loans
- Outstanding Balance
- Monthly Expenses
- Financial Health Score
- AI Recommendations
- Settlement History

---

# Database Design

The application uses SQLite as the primary database.

## Users Table

| Field | Type |
|---------|------|
| user_id | Integer |
| name | Text |
| email | Text |
| password | Text |
| income | Float |
| expenses | Float |

---

## Loans Table

| Field | Type |
|---------|------|
| loan_id | Integer |
| user_id | Integer |
| loan_type | Text |
| principal_amount | Float |
| outstanding_amount | Float |
| interest_rate | Float |
| due_date | Date |
| status | Text |

---

## Settlements Table

| Field | Type |
|---------|------|
| settlement_id | Integer |
| user_id | Integer |
| loan_id | Integer |
| predicted_amount | Float |
| recommendation | Text |
| generated_date | Date |

---

# ER Diagram

The Entity Relationship Diagram consists of three primary entities:

- Users
- Loans
- Settlements

Relationships

- One User can have Multiple Loans.
- One Loan can generate Multiple Settlement Recommendations.
- Each Settlement belongs to one Loan.

---

# API Design

## Authentication APIs

| Method | Endpoint | Description |
|----------|-----------------|------------------------|
| POST | /register | Register User |
| POST | /login | User Login |
| GET | /profile | View Profile |
| PUT | /update-profile | Update Profile |

---

## Loan APIs

| Method | Endpoint | Description |
|----------|----------------|----------------|
| POST | /loan/add | Add Loan |
| GET | /loan/list | View Loans |
| PUT | /loan/update | Update Loan |
| DELETE | /loan/delete | Delete Loan |

---

## AI APIs

| Method | Endpoint | Description |
|----------|---------------------------|---------------------------|
| POST | /predict-settlement | Settlement Prediction |
| POST | /financial-analysis | Financial Analysis |
| POST | /generate-strategy | AI Negotiation Strategy |

---

## Dashboard APIs

| Method | Endpoint | Description |
|----------|----------------|-------------------|
| GET | /dashboard | Dashboard Summary |
| GET | /statistics | Financial Statistics |

---

# Workflow

```
User Registration
        │
        ▼
User Login
        │
        ▼
Enter Financial Information
        │
        ▼
Loan Management
        │
        ▼
Financial Analysis
        │
        ▼
Settlement Prediction
        │
        ▼
Google Gemini AI
        │
        ▼
Negotiation Strategy
        │
        ▼
Dashboard Display
```

---

# Technology Stack

| Layer | Technology |
|----------|----------------|
| Frontend | React.js |
| Backend | FastAPI |
| Database | SQLite |
| AI Service | Google Gemini AI |
| Authentication | JWT |
| API Testing | Postman |
| Version Control | Git & GitHub |
| Deployment | Render |

---

# Design Principles

The project follows the following design principles:

- Modular Architecture
- Separation of Concerns
- RESTful API Design
- Secure Authentication
- Responsive User Interface
- Database Normalization
- AI Integration
- Error Handling
- Scalability
- Maintainability

---

# Expected Outcome

The proposed architecture enables secure financial data management, intelligent settlement prediction, AI-powered negotiation assistance, and efficient loan tracking. The modular design allows easy maintenance, future enhancements, and seamless deployment while providing users with an intuitive and responsive financial recovery platform.
