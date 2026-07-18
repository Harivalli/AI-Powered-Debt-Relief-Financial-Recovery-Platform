import { useEffect, useState } from 'react';
import { profileApi } from '../api/endpoints';

const EMPLOYMENT_OPTIONS = ['employed', 'self-employed', 'unemployed', 'student', 'retired'];

export default function ProfileSetup() {
  const [form, setForm] = useState({
    monthly_income: '',
    monthly_expenses: '',
    savings: '',
    employment_status: 'employed',
    dependents: 0,
    financial_goals: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await profileApi.get();
        setForm({
          monthly_income: res.data.monthly_income ?? '',
          monthly_expenses: res.data.monthly_expenses ?? '',
          savings: res.data.savings ?? '',
          employment_status: res.data.employment_status || 'employed',
          dependents: res.data.dependents ?? 0,
          financial_goals: res.data.financial_goals || '',
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg('');
    try {
      await profileApi.update({
        monthly_income: parseFloat(form.monthly_income) || 0,
        monthly_expenses: parseFloat(form.monthly_expenses) || 0,
        savings: parseFloat(form.savings) || 0,
        employment_status: form.employment_status,
        dependents: parseInt(form.dependents, 10) || 0,
        financial_goals: form.financial_goals,
      });
      setSavedMsg('Profile saved.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="empty-state">Loading your profile…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Setup</div>
          <h1>Financial Profile</h1>
          <p>These numbers power your dashboard, health score, and AI recommendations.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label>Monthly Income</label>
              <input type="number" min="0" step="0.01" required value={form.monthly_income} onChange={handleChange('monthly_income')} placeholder="5000" />
            </div>
            <div className="field">
              <label>Monthly Expenses (declared)</label>
              <input type="number" min="0" step="0.01" value={form.monthly_expenses} onChange={handleChange('monthly_expenses')} placeholder="3000" />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Savings</label>
              <input type="number" min="0" step="0.01" value={form.savings} onChange={handleChange('savings')} placeholder="2000" />
            </div>
            <div className="field">
              <label>Dependents</label>
              <input type="number" min="0" step="1" value={form.dependents} onChange={handleChange('dependents')} />
            </div>
          </div>

          <div className="field">
            <label>Employment Status</label>
            <select value={form.employment_status} onChange={handleChange('employment_status')}>
              {EMPLOYMENT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Financial Goals</label>
            <textarea rows={3} value={form.financial_goals} onChange={handleChange('financial_goals')} placeholder="e.g. Become debt-free within 2 years, build a 3-month emergency fund" />
          </div>

          {savedMsg && <p style={{ color: 'var(--sage)', fontWeight: 600 }}>{savedMsg}</p>}

          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
