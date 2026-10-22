import React, { useEffect, useState } from 'react';
import { 
  Database, 
  Filter, 
  ChevronLeft,
  ChevronRight,
  CheckCircle2, 
  XCircle,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function WarehouseAnalytics() {
  const [filters, setFilters] = useState({
    education: 'All',
    self_employed: 'All',
    cibil_band: 'All',
    loan_term_band: 'All',
    group_by: 'cibil_band'
  });

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [recordOffset, setRecordOffset] = useState(0);
  const [totalRecords, setTotalRecords] = useState(15);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const limit = 5;

  const fetchAnalytics = () => {
    setLoading(true);
    api.getWarehouseAnalytics(filters)
      .then(res => {
        setAnalytics(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchRecords = (offset) => {
    setLoadingRecords(true);
    api.getWarehouseRecords(limit, offset)
      .then(res => {
        setRecords(res.records || []);
        setRecordOffset(offset);
        setTotalRecords(res.total_records || 15);
        setLoadingRecords(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingRecords(false);
      });
  };

  useEffect(() => {
    fetchAnalytics();
  }, [filters]);

  useEffect(() => {
    fetchRecords(0);
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const formatINR = (val) => {
    if (val === undefined || val === null) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  return (
    <div>
      <DisclaimerBanner />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '4px' }}>
            Star Schema Dimensional Analytics & OLAP
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Slice and dice application data across <code style={{ color: '#818cf8', fontFamily: 'var(--font-mono)' }}>DimApplicant</code>, <code style={{ color: '#818cf8', fontFamily: 'var(--font-mono)' }}>DimLoan</code>, and <code style={{ color: '#818cf8', fontFamily: 'var(--font-mono)' }}>FactLoanApplication</code>.
          </p>
        </div>
        <div className="badge-neutral" style={{ padding: '6px 12px' }}>
          <Database size={14} /> Star Schema (SQLite OLAP)
        </div>
      </div>

      {/* Filter and Group By Control Bar */}
      <div className="glass-panel" style={{ padding: '18px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <Filter size={15} color="#818cf8" /> Interactive OLAP Dimension Slicers
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
            Filter controls simulate multi-attribute SQL WHERE clauses
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Education</label>
            <select
              className="select-field"
              value={filters.education}
              onChange={(e) => handleFilterChange('education', e.target.value)}
              style={{ padding: '8px 10px', fontSize: '0.84rem' }}
            >
              <option value="All">All Education</option>
              <option value="Graduate">Graduate</option>
              <option value="Not Graduate">Not Graduate</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Self-Employed</label>
            <select
              className="select-field"
              value={filters.self_employed}
              onChange={(e) => handleFilterChange('self_employed', e.target.value)}
              style={{ padding: '8px 10px', fontSize: '0.84rem' }}
            >
              <option value="All">All Employment</option>
              <option value="Yes">Self-Employed (Yes)</option>
              <option value="No">Salaried Employee (No)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>CIBIL Credit Band</label>
            <select
              className="select-field"
              value={filters.cibil_band}
              onChange={(e) => handleFilterChange('cibil_band', e.target.value)}
              style={{ padding: '8px 10px', fontSize: '0.84rem' }}
            >
              <option value="All">All CIBIL Bands</option>
              <option value="Poor (<550)">Poor (&lt; 550)</option>
              <option value="Fair (550-649)">Fair (550-649)</option>
              <option value="Good (650-749)">Good (650-749)</option>
              <option value="Excellent (750+)">Excellent (750+)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Loan Term Band</label>
            <select
              className="select-field"
              value={filters.loan_term_band}
              onChange={(e) => handleFilterChange('loan_term_band', e.target.value)}
              style={{ padding: '8px 10px', fontSize: '0.84rem' }}
            >
              <option value="All">All Term Horizons</option>
              <option value="Short (2-6 yrs)">Short (2-6 yrs)</option>
              <option value="Medium (8-14 yrs)">Medium (8-14 yrs)</option>
              <option value="Long (16-20 yrs)">Long (16-20 yrs)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', color: '#818cf8', fontWeight: 600, marginBottom: '4px' }}>Group By (Dimension)</label>
            <select
              className="select-field"
              value={filters.group_by}
              onChange={(e) => handleFilterChange('group_by', e.target.value)}
              style={{ padding: '8px 10px', fontSize: '0.84rem', borderColor: 'rgba(99, 102, 241, 0.4)' }}
            >
              <option value="cibil_band">CIBIL Score Band</option>
              <option value="education">Education Status</option>
              <option value="self_employed">Employment Status</option>
              <option value="loan_term_band">Loan Term Band</option>
              <option value="loan_amount_band">Loan Amount Tier</option>
              <option value="income_band">Annual Income Tier</option>
              <option value="dependents">Dependents Count</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filtered Aggregates Bar */}
      {analytics && (
        <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Filtered Cohort Size: </span>
              <strong className="mono-number" style={{ fontSize: '1.1rem', color: '#ffffff' }}>
                {analytics.overall_filtered.total_count} Applications
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cohort Approval Rate: </span>
              <strong className="mono-number" style={{ fontSize: '1.1rem', color: '#34d399' }}>
                {analytics.overall_filtered.approval_rate}%
              </strong>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginLeft: '6px' }}>
                ({analytics.overall_filtered.approved_count} Approved / {analytics.overall_filtered.rejected_count} Rejected)
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mean CIBIL: </span>
              <strong className="mono-number" style={{ fontSize: '1.1rem', color: '#38bdf8' }}>
                {analytics.overall_filtered.avg_cibil || 'N/A'}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mean Assets: </span>
              <strong className="mono-number" style={{ fontSize: '1.1rem', color: '#f8fafc' }}>
                {formatINR(analytics.overall_filtered.avg_assets)}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Grouped OLAP Table */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
              OLAP Aggregated Summary Slice
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Grouped by <strong style={{ color: '#818cf8' }}>{filters.group_by.replace('_', ' ')}</strong>
            </p>
          </div>
          {loading && <div className="spinner" style={{ width: '18px', height: '18px' }} />}
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{filters.group_by.replace('_', ' ').toUpperCase()}</th>
                <th>Total Apps</th>
                <th>Approved</th>
                <th>Rejected</th>
                <th>Approval Rate (%)</th>
                <th>Avg CIBIL</th>
                <th>Avg Income</th>
                <th>Avg Loan Amount</th>
                <th>Avg Collateral Assets</th>
                <th>Asset / Loan Ratio</th>
              </tr>
            </thead>
            <tbody>
              {analytics && analytics.grouped_data.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: '#f8fafc' }}>{row.dimension_value || 'Not Specified'}</td>
                  <td className="mono-number">{row.total_apps.toLocaleString()}</td>
                  <td className="mono-number" style={{ color: '#34d399' }}>{row.approved_count.toLocaleString()}</td>
                  <td className="mono-number" style={{ color: '#fb7185' }}>{row.rejected_count.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="mono-number" style={{ fontWeight: 700, minWidth: '45px' }}>{row.approval_rate}%</span>
                      <div style={{ width: '60px', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <div style={{ width: `${row.approval_rate}%`, height: '100%', background: 'var(--status-approved)' }} />
                      </div>
                    </div>
                  </td>
                  <td className="mono-number">{row.avg_cibil}</td>
                  <td className="mono-number">{formatINR(row.avg_income)}</td>
                  <td className="mono-number">{formatINR(row.avg_loan_amount)}</td>
                  <td className="mono-number">{formatINR(row.avg_assets)}</td>
                  <td className="mono-number">{row.avg_asset_to_loan_ratio}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fact & Dimension Table Explorer (Records Browser) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
              Fact & Dimension Joined Records Browser
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Viewing sample benchmark entries from <code style={{ color: '#818cf8', fontFamily: 'var(--font-mono)' }}>FactLoanApplication</code> (Showing {recordOffset + 1} - {Math.min(recordOffset + limit, totalRecords)} of {totalRecords} records)
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="btn-secondary"
              disabled={recordOffset === 0 || loadingRecords}
              onClick={() => fetchRecords(Math.max(0, recordOffset - limit))}
              style={{ padding: '6px 12px' }}
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <span className="mono-number" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Page {Math.floor(recordOffset / limit) + 1} of {Math.ceil(totalRecords / limit)}
            </span>
            <button
              className="btn-secondary"
              disabled={recordOffset + limit >= totalRecords || loadingRecords}
              onClick={() => fetchRecords(recordOffset + limit)}
              style={{ padding: '6px 12px' }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Status</th>
                <th>Education</th>
                <th>Employment</th>
                <th>Dependents</th>
                <th>CIBIL Score</th>
                <th>Annual Income</th>
                <th>Loan Amount</th>
                <th>Term</th>
                <th>Total Assets</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => {
                const isApproved = r.loan_status === 'Approved';
                return (
                  <tr key={r.loan_id}>
                    <td className="mono-number" style={{ color: '#818cf8' }}>#{r.loan_id}</td>
                    <td>
                      <span className={isApproved ? 'badge-approved' : 'badge-rejected'}>
                        {isApproved ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                        {r.loan_status}
                      </span>
                    </td>
                    <td>{r.education}</td>
                    <td>{r.self_employed === 'Yes' ? 'Self-Employed' : 'Salaried'}</td>
                    <td className="mono-number">{r.no_of_dependents}</td>
                    <td>
                      <span className="mono-number" style={{
                        fontWeight: 700,
                        color: r.cibil_score >= 700 ? '#34d399' : r.cibil_score >= 550 ? '#fbbf24' : '#fb7185'
                      }}>
                        {r.cibil_score}
                      </span>
                    </td>
                    <td className="mono-number">{formatINR(r.income_annum)}</td>
                    <td className="mono-number">{formatINR(r.loan_amount)}</td>
                    <td className="mono-number">{r.loan_term}y</td>
                    <td className="mono-number">{formatINR(r.total_assets_value)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
