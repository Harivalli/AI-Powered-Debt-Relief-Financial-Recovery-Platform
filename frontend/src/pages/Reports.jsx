import { useState } from 'react';
import { LuFileText, LuDownload } from 'react-icons/lu';
import api from '../api/client';

export default function Reports() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await api.get('/api/reports/financial-summary', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'finrelief_financial_summary.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Documents</div>
          <h1>Reports</h1>
          <p>Download a snapshot of your financial profile, debts, and health score.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 520 }}>
        <div className="card-title"><LuFileText size={16} style={{ marginRight: 6, verticalAlign: -2 }} />Financial Summary Report</div>
        <p>
          A one-page PDF covering your income, expenses by category, active debts,
          and current financial health score — useful for your own records or to
          share with an advisor.
        </p>
        <button className="btn btn-primary" onClick={handleDownload} disabled={downloading}>
          <LuDownload size={15} /> {downloading ? 'Preparing…' : 'Download PDF'}
        </button>
      </div>
    </div>
  );
}
