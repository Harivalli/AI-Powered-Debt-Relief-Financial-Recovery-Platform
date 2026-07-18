import { useEffect, useState } from 'react';
import { LuPlus, LuTrash2, LuPencil, LuX } from 'react-icons/lu';
import { debtsApi } from '../api/endpoints';

const LOAN_TYPES = ['personal', 'auto', 'home', 'student', 'credit_card', 'business', 'other'];
const STATUSES = ['active', 'overdue', 'closed'];

const emptyForm = {
  loan_name: '', loan_type: 'personal', principal_amount: '', remaining_balance: '',
  interest_rate: '', emi: '', due_date: '', status: 'active',
};

export default function Debts() {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await debtsApi.list();
      setDebts(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (debt) => {
    setForm({
      loan_name: debt.loan_name,
      loan_type: debt.loan_type,
      principal_amount: debt.principal_amount,
      remaining_balance: debt.remaining_balance,
      interest_rate: debt.interest_rate,
      emi: debt.emi,
      due_date: debt.due_date || '',
      status: debt.status,
    });
    setEditingId(debt.id);
    setShowForm(true);
  };

  const handleChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      loan_name: form.loan_name,
      loan_type: form.loan_type,
      principal_amount: parseFloat(form.principal_amount) || 0,
      remaining_balance: parseFloat(form.remaining_balance) || 0,
      interest_rate: parseFloat(form.interest_rate) || 0,
      emi: parseFloat(form.emi) || 0,
      due_date: form.due_date || null,
      status: form.status,
    };
    try {
      if (editingId) {
        await debtsApi.update(editingId, payload);
      } else {
        await debtsApi.create(payload);
      }
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this loan? This cannot be undone.')) return;
    await debtsApi.remove(id);
    await load();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Debts</div>
          <h1>Debt Management</h1>
          <p>Track every loan in one place — balances, rates, and repayment status.</p>
        </div>
        <button className="btn btn-gold" onClick={openNew}>
          <LuPlus size={16} /> Add Loan
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 22, maxWidth: 680 }}>
          <div className="card-title">
            {editingId ? 'Edit Loan' : 'New Loan'}
            <button className="btn btn-sm btn-outline" onClick={() => setShowForm(false)}><LuX size={14} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field">
                <label>Loan Name</label>
                <input required value={form.loan_name} onChange={handleChange('loan_name')} placeholder="e.g. Toyota Auto Loan" />
              </div>
              <div className="field">
                <label>Loan Type</label>
                <select value={form.loan_type} onChange={handleChange('loan_type')}>
                  {LOAN_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Principal Amount</label>
                <input type="number" min="0" step="0.01" required value={form.principal_amount} onChange={handleChange('principal_amount')} />
              </div>
              <div className="field">
                <label>Remaining Balance</label>
                <input type="number" min="0" step="0.01" required value={form.remaining_balance} onChange={handleChange('remaining_balance')} />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Interest Rate (%)</label>
                <input type="number" min="0" step="0.01" value={form.interest_rate} onChange={handleChange('interest_rate')} />
              </div>
              <div className="field">
                <label>EMI (monthly payment)</label>
                <input type="number" min="0" step="0.01" value={form.emi} onChange={handleChange('emi')} />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Due Date</label>
                <input type="date" value={form.due_date} onChange={handleChange('due_date')} />
              </div>
              <div className="field">
                <label>Status</label>
                <select value={form.status} onChange={handleChange('status')}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Update Loan' : 'Add Loan'}
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-title">All Loans</div>
        {loading ? (
          <div className="empty-state">Loading…</div>
        ) : debts.length === 0 ? (
          <div className="empty-state">No loans yet. Add your first one to start tracking.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Loan</th><th>Type</th><th>Balance</th><th>Rate</th><th>EMI</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {debts.map((d) => (
                <tr key={d.id}>
                  <td>{d.loan_name}</td>
                  <td style={{ textTransform: 'capitalize' }}>{d.loan_type.replace('_', ' ')}</td>
                  <td className="figure">${d.remaining_balance.toLocaleString()}</td>
                  <td className="figure">{d.interest_rate}%</td>
                  <td className="figure">${d.emi.toLocaleString()}</td>
                  <td><span className={`badge badge-${d.status}`}>{d.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-sm btn-outline" onClick={() => openEdit(d)}><LuPencil size={13} /></button>
                      <button className="btn btn-sm btn-danger-outline" onClick={() => handleDelete(d.id)}><LuTrash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
