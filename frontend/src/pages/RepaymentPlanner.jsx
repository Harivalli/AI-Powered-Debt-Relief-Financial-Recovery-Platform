import { useState } from 'react';
import { LuRoute, LuCalendarCheck } from 'react-icons/lu';
import { aiApi } from '../api/endpoints';

export default function RepaymentPlanner() {
  const [strategy, setStrategy] = useState('avalanche');
  const [extra, setExtra] = useState('0');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await aiApi.repaymentPlan(strategy, parseFloat(extra) || 0);
      setPlan(res.data);
    } finally {
      setLoading(false);
    }
  };

  const details = plan ? JSON.parse(plan.plan_details) : [];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Strategy</div>
          <h1>Repayment Planner</h1>
          <p>Compare the Snowball and Avalanche methods to find your fastest path to debt-free.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 22, maxWidth: 640 }}>
        <form onSubmit={generate}>
          <div className="field-row">
            <div className="field">
              <label>Strategy</label>
              <select value={strategy} onChange={(e) => setStrategy(e.target.value)}>
                <option value="avalanche">Avalanche — highest interest rate first</option>
                <option value="snowball">Snowball — smallest balance first</option>
              </select>
            </div>
            <div className="field">
              <label>Extra Monthly Payment</label>
              <input type="number" min="0" step="0.01" value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="0" />
            </div>
          </div>
          <button className="btn btn-gold" type="submit" disabled={loading}>
            <LuRoute size={15} /> {loading ? 'Calculating…' : 'Generate Plan'}
          </button>
        </form>
      </div>

      {plan && (
        <>
          <div className="grid grid-3" style={{ marginBottom: 22 }}>
            <div className="stat-card">
              <div className="stat-label">Recommended Monthly Payment</div>
              <div className="stat-value figure">${plan.recommended_monthly_emi.toLocaleString()}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label"><LuCalendarCheck size={13} style={{ marginRight: 5, verticalAlign: -2 }} />Estimated Debt-Free Date</div>
              <div className="stat-value figure positive">{plan.estimated_debt_free_date || 'N/A'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Strategy</div>
              <div className="stat-value" style={{ textTransform: 'capitalize', fontFamily: 'var(--font-body)', fontSize: '1.1rem' }}>{plan.strategy}</div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Payoff Priority Order</div>
            {details.length === 0 ? (
              <div className="empty-state">No active debts to plan around — you're debt-free!</div>
            ) : (
              <table className="table">
                <thead>
                  <tr><th>Priority</th><th>Loan</th><th>Balance</th><th>Rate</th><th>EMI</th></tr>
                </thead>
                <tbody>
                  {details.map((d) => (
                    <tr key={d.loan_name}>
                      <td className="figure">#{d.priority}</td>
                      <td>{d.loan_name}</td>
                      <td className="figure">${d.remaining_balance.toLocaleString()}</td>
                      <td className="figure">{d.interest_rate}%</td>
                      <td className="figure">${d.emi.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
