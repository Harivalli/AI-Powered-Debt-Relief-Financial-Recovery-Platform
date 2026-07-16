# Phase 2: Requirement Analysis

This folder contains the Software Requirement Specification (SRS), functional requirements, non-functional requirements, user requirements, system requirements, assumptions, constraints, and use cases for the AI Powered Debt Relief & Financial Recovery Platform.

---

# 1. Software Requirement Specification (SRS)

## Project Title

**AI Powered Debt Relief & Financial Recovery Platform (FinRelief AI)**

---

## Project Overview

The AI Powered Debt Relief & Financial Recovery Platform is a web-based application that helps borrowers analyze their financial condition, manage outstanding loans, receive AI-powered settlement recommendations, and generate personalized negotiation strategies.

The platform combines Artificial Intelligence, FastAPI, React.js, SQLite, and Google Gemini AI to simplify debt management and improve financial recovery outcomes.

---

# 2. Functional Requirements

### User Registration

- User can create a new account.
- User credentials are securely stored.

### User Login

- Secure authentication using JWT.
- Session management.

### Profile Management

- Update financial profile.
- Edit income and expenses.
- Update borrower details.

### Loan Management

- Add loan information.
- Edit loan details.
- Delete loans.
- View all active loans.

### Financial Analysis

- Calculate debt-to-income ratio.
- Analyze borrower financial health.
- Generate repayment insights.

### Settlement Prediction

- Predict suitable settlement percentage.
- Recommend affordable repayment amount.

### AI Negotiation

- Generate negotiation strategy.
- Generate settlement request email.
- Provide AI financial guidance.

### Dashboard

- Display borrower summary.
- Show loan statistics.
- Display financial health indicators.

---

# 3. Non-Functional Requirements

## Performance

- Fast response time.
- Efficient API communication.
- Optimized database queries.

## Security

- JWT Authentication.
- Password hashing.
- Secure API communication.
- Protected user data.

## Reliability

- Stable backend processing.
- Error handling.
- API fallback mechanism.

## Scalability

- Modular backend.
- Expandable database.
- Easy integration of new AI models.

## Usability

- Responsive interface.
- Easy navigation.
- User-friendly dashboard.

---

# 4. User Requirements

The borrower should be able to:

- Register securely.
- Login securely.
- Manage financial profile.
- Add multiple loans.
- View financial summary.
- Receive settlement prediction.
- Generate AI negotiation strategy.
- Download negotiation letter.

---

# 5. System Requirements

## Hardware Requirements

- Minimum 4 GB RAM
- Dual Core Processor
- Internet Connection
- Modern Web Browser

## Software Requirements

### Frontend

- React.js
- Vite
- CSS

### Backend

- FastAPI
- Python 3.11+

### Database

- SQLite

### AI Integration

- Google Gemini API

### Version Control

- Git
- GitHub

---

# 6. Assumptions

- User provides accurate financial information.
- Internet connection is available.
- Google Gemini API is accessible.
- Loan information is updated regularly.

---

# 7. Constraints

- Settlement prediction depends on user input.
- AI recommendations are advisory only.
- Internet is required for AI services.
- Gemini API quota limitations may apply.

---

# 8. Use Cases

## Borrower

- Register account
- Login
- Manage profile
- Add loan
- View dashboard
- Predict settlement
- Generate AI negotiation strategy
- Download settlement letter

---

## Administrator (Future Scope)

- Monitor users
- View analytics
- Manage platform
- Review reports

---

# 9. Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | React.js |
| Backend | FastAPI |
| Database | SQLite |
| AI Model | Google Gemini AI |
| Authentication | JWT |
| Version Control | Git & GitHub |
| Deployment | Render |

---

# 10. Expected Deliverables

- Responsive web application
- Secure authentication
- Financial analysis dashboard
- AI-powered settlement prediction
- Negotiation strategy generation
- REST APIs
- Database integration
- Deployment-ready application
