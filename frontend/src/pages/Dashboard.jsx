import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { LuTrendingUp, LuTrendingDown, LuPiggyBank, LuLandmark } from 'react-icons/lu';
import { dashboardApi, debtsApi, expensesApi } from '../api/endpoints';

const CATEGORY_COLORS = ['#c99a3d', '#6f8f78', '#b4483a', '#8a9bab', '#e3c887', '#4a5b6b', '#d9855c', '#a0785a'];

function formatMoney(v) {
  return `$${Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [debts, setDebts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [summaryRes, debtsRes, expensesRes] = await Promise.all([
          dashboardApi.summary(),
          debtsApi.list(),
          expensesApi.list(),
        ]);
        setSummary(summaryRes.data);
        setDebts(debtsRes.data);
        setExpenses(expensesRes.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="empty-state">Loading your dashboard…</div>;
  }

  const categoryTotals = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  const debtBarData = debts
    .filter((d) => d.status !== 'closed')
    .map((d) => ({ name: d.loan_name, balance: d.remaining_balance }));

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Overview</div>
          <h1>Your Financial Dashboard</h1>
          <p>A snapshot of where things stand today.</p>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 22 }}>
        <div className="stat-card">
          <div className="stat-label"><LuTrendingUp size={13} style={{ marginRight: 5, verticalAlign: -2 }} />Monthly Income</div>
          <div className="stat-value figure">{formatMoney(summary.total_income)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><LuTrendingDown size={13} style={{ marginRight: 5, verticalAlign: -2 }} />Total Expenses</div>
          <div className="stat-value figure">{formatMoney(summary.total_expenses)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><LuPiggyBank size={13} style={{ marginRight: 5, verticalAlign: -2 }} />Savings</div>
          <div className="stat-value figure positive">{formatMoney(summary.total_savings)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><LuLandmark size={13} style={{ marginRight: 5, verticalAlign: -2 }} />Total Debt</div>
          <div className="stat-value figure negative">{formatMoney(summary.total_debt)}</div>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 22 }}>
        <div className="stat-card">
          <div className="stat-label">Credit Utilization</div>
          <div className="stat-value figure">{summary.credit_utilization}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Upcoming EMI (monthly)</div>
          <div className="stat-value figure">{formatMoney(summary.upcoming_emi)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Financial Health Score</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="stat-value figure">{summary.financial_health_score}</div>
            <span className={`rating-pill rating-${summary.financial_health_rating}`}>
              {summary.financial_health_rating}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-title">Spending by Category</div>
          {pieData.length === 0 ? (
            <div className="empty-state">No expenses logged yet. Add some in the Expense Tracker.</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatMoney(v)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <div className="card-title">Debt Balances</div>
          {debtBarData.length === 0 ? (
            <div className="empty-state">No active debts. Add one in Debt Management.</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={debtBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eae7de" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatMoney(v)} />
                <Bar dataKey="balance" fill="#b4483a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
