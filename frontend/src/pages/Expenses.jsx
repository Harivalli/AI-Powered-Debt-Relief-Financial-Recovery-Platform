import { useEffect, useState } from 'react';
import { LuPlus, LuTrash2, LuX } from 'react-icons/lu';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { expensesApi } from '../api/endpoints';

const CATEGORIES = ['Food', 'Rent', 'Shopping', 'Bills', 'EMI', 'Entertainment', 'Healthcare', 'Other'];
const CATEGORY_COLORS = ['#c99a3d', '#6f8f78', '#b4483a', '#8a9bab', '#e3c887', '#4a5b6b', '#d9855c', '#a0785a'];

const emptyForm = { category: 'Food', amount: '', description: '', date: new Date().toISOString().slice(0, 10) };

function formatMoney(v) {
  return `$${Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await expensesApi.list();
      setExpenses(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await expensesApi.create({
        category: form.category,
        amount: parseFloat(form.amount) || 0,
        description: form.description,
        date: form.date,
      });
      setForm(emptyForm);
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    await expensesApi.remove(id);
    await load();
  };

  const totals = {};
  expenses.forEach((e) => { totals[e.category] = (totals[e.category] || 0) + e.amount; });
  const pieData = Object.entries(totals).map(([name, value]) => ({ name, value }));
  const monthTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Spending</div>
          <h1>Expense Tracker</h1>
          <p>Log expenses by category to see where your money actually goes.</p>
        </div>
        <button className="btn btn-gold" onClick={() => setShowForm((s) => !s)}>
          <LuPlus size={16} /> Add Expense
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 22, maxWidth: 640 }}>
          <div className="card-title">
            New Expense
            <button className="btn btn-sm btn-outline" onClick={() => setShowForm(false)}><LuX size={14} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field">
                <label>Category</label>
                <select value={form.category} onChange={handleChange('category')}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Amount</label>
                <input type="number" min="0" step="0.01" required value={form.amount} onChange={handleChange('amount')} placeholder="0.00" />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Date</label>
                <input type="date" required value={form.date} onChange={handleChange('date')} />
              </div>
              <div className="field">
                <label>Description (optional)</label>
                <input value={form.description} onChange={handleChange('description')} placeholder="e.g. Weekly groceries" />
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Add Expense'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="card-title">
            Recent Expenses
            <span className="figure" style={{ fontWeight: 600, color: 'var(--ink-faint)' }}>{formatMoney(monthTotal)} total</span>
          </div>
          {loading ? (
            <div className="empty-state">Loading…</div>
          ) : expenses.length === 0 ? (
            <div className="empty-state">No expenses logged yet.</div>
          ) : (
            <table className="table">
              <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th><th></th></tr></thead>
              <tbody>
                {expenses.map((e) => (
                  <tr key={e.id}>
                    <td>{e.date}</td>
                    <td>{e.category}</td>
                    <td>{e.description || '—'}</td>
                    <td className="figure">{formatMoney(e.amount)}</td>
                    <td>
                      <button className="btn btn-sm btn-danger-outline" onClick={() => handleDelete(e.id)}><LuTrash2 size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <div className="card-title">Category Breakdown</div>
          {pieData.length === 0 ? (
            <div className="empty-state">Add expenses to see the breakdown.</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatMoney(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
