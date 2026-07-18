import { useEffect, useRef, useState } from 'react';
import { LuSparkles, LuSend, LuRefreshCw } from 'react-icons/lu';
import { aiApi } from '../api/endpoints';

export default function AIAnalysis() {
  const [score, setScore] = useState(null);
  const [report, setReport] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingScore, setLoadingScore] = useState(true);

  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm your FinRelief AI assistant. Ask me anything about your debts, budget, or repayment strategy." },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    aiApi.score().then((res) => setScore(res.data)).finally(() => setLoadingScore(false));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await aiApi.analyze();
      setReport(res.data);
    } finally {
      setAnalyzing(false);
    }
  };

  const sendChat = async (e) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await aiApi.chat(text);
      setMessages((m) => [...m, { role: 'ai', text: res.data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'ai', text: "Sorry, I couldn't process that. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">AI Powered</div>
          <h1>AI Financial Analysis</h1>
          <p>Personalized insight generated from your profile, debts, and spending.</p>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 22 }}>
        <div className="stat-card">
          <div className="stat-label">Financial Health Score</div>
          {loadingScore ? <div className="stat-value figure">—</div> : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="stat-value figure">{score.score}</div>
              <span className={`rating-pill rating-${score.rating}`}>{score.rating}</span>
            </div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-label">Debt-to-Income Ratio</div>
          <div className="stat-value figure">{loadingScore ? '—' : `${(score.debt_to_income_ratio * 100).toFixed(1)}%`}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Savings Rate</div>
          <div className="stat-value figure positive">{loadingScore ? '—' : `${(score.savings_rate * 100).toFixed(1)}%`}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 22 }}>
        <div className="card-title">
          <span><LuSparkles size={15} style={{ marginRight: 6, verticalAlign: -2 }} />Debt & Spending Analysis</span>
          <button className="btn btn-sm btn-gold" onClick={runAnalysis} disabled={analyzing}>
            <LuRefreshCw size={13} /> {analyzing ? 'Analyzing…' : report ? 'Regenerate' : 'Generate Report'}
          </button>
        </div>
        {analyzing ? (
          <div className="empty-state">Generating your personalized analysis<span className="loading-dot" style={{ marginLeft: 6 }} /></div>
        ) : report ? (
          <div className="ai-report-content">{report.content}</div>
        ) : (
          <div className="empty-state">Click "Generate Report" to get an AI summary, high-risk loans, and repayment suggestions based on your data.</div>
        )}
      </div>

      <div className="card-title" style={{ marginBottom: 10 }}>Financial Q&amp;A Assistant</div>
      <div className="chat-shell">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role === 'user' ? 'user' : 'ai'}`}>{m.text}</div>
          ))}
          {chatLoading && <div className="chat-msg ai">Thinking…</div>}
          <div ref={chatEndRef} />
        </div>
        <form className="chat-input-row" onSubmit={sendChat}>
          <input
            placeholder="Ask about debt, budgeting, or savings…"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <button className="btn btn-primary btn-sm" type="submit" disabled={chatLoading}>
            <LuSend size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
