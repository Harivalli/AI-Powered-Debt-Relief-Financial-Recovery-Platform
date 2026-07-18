"""
Thin wrapper around the Google Gemini API so the rest of the app never
imports google.generativeai directly. If GEMINI_API_KEY is not set, this
falls back to a deterministic offline response so the app still runs
end-to-end during development/demo without an API key.
"""
from app.config import settings

_model = None
_configured = False


def _get_model():
    global _model, _configured
    if not settings.GEMINI_API_KEY:
        return None
    if not _configured:
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        _model = genai.GenerativeModel(settings.GEMINI_MODEL)
        _configured = True
    return _model


def _fallback_response(prompt: str) -> str:
    return (
        "AI analysis is running in offline demo mode (no GEMINI_API_KEY configured). "
        "Once you add a valid Gemini API key to backend/.env, this will return real, "
        "personalized financial guidance based on your data.\n\n"
        f"[Offline placeholder response for prompt of length {len(prompt)} characters]"
    )


def generate_text(prompt: str) -> str:
    model = _get_model()
    if model is None:
        return _fallback_response(prompt)
    try:
        response = model.generate_content(
            prompt,
            request_options={"timeout": 20},
        )
        return response.text
    except Exception as exc:  # pragma: no cover - network/quota errors etc.
        return f"AI request failed: {exc}. Falling back to offline mode.\n\n" + _fallback_response(prompt)


def build_debt_analysis_prompt(profile: dict, debts: list, expenses_summary: dict) -> str:
    return f"""
You are a financial advisor AI inside the FinRelief AI platform. Analyze this user's
financial situation and respond in clear sections: Summary, High-Risk Loans,
Spending Analysis, Repayment Suggestions, Financial Improvement Tips.

Financial Profile:
- Monthly Income: {profile.get('monthly_income')}
- Monthly Expenses: {profile.get('monthly_expenses')}
- Savings: {profile.get('savings')}
- Employment Status: {profile.get('employment_status')}
- Dependents: {profile.get('dependents')}
- Goals: {profile.get('financial_goals')}

Debts:
{debts}

Expense Breakdown by Category:
{expenses_summary}

Keep the response concise, practical, and encouraging. Use plain language.
""".strip()


def build_chat_prompt(user_message: str, context_summary: dict) -> str:
    return f"""
You are FinRelief AI's financial assistant chatbot. The user has the following
financial context (use it to personalize your answer, but don't repeat all the
numbers back verbatim unless relevant):

{context_summary}

User question: {user_message}

Answer helpfully and concisely, focused on practical debt relief and financial
recovery guidance.
""".strip()
