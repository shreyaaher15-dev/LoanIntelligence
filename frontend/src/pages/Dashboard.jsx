import React, { useEffect, useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  CreditCard, 
  IndianRupee, 
  Building2, 
  ShieldCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import MetricCard from '../components/MetricCard';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function Dashboard({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = () => {
    setLoading(true);
    api.getDashboard()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatINR = (val) => {
    if (val === undefined || val === null) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '16px' }}>
        <div className="spinner" />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading warehouse benchmark summary...</span>
      </div>
    );
  }

  const { kpi, cibil_breakdown, education_breakdown, employment_breakdown, term_breakdown, asset_breakdown } = data;

  return (
    <div>
      <DisclaimerBanner />

      {/* Header with actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '4px' }}>
            Executive Loan Intelligence Dashboard
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Real-time descriptive analytics aggregated from the SQLite dimensional star schema (<code style={{ color: '#818cf8', fontFamily: 'var(--font-mono)' }}>FactLoanApplication</code>).
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            color: '#a5b4fc',
            fontWeight: 500
          }}>
            <Sparkles size={14} color="#818cf8" />
            Verified Sample Benchmark Data
          </div>
          <button className="btn-primary" onClick={() => onNavigate('predict')}>
            <CreditCard size={15} /> Predict Loan
          </button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        <MetricCard
          label="Total Applications"
          value={kpi.total_applications.toLocaleString()}
          subtitle="Full Kaggle Benchmark"
          icon={Users}
          color="indigo"
        />
        <MetricCard
          label="Loans Approved"
          value={kpi.approved_count.toLocaleString()}
          subtitle={`${kpi.approval_rate}% Approval Rate`}
          icon={CheckCircle2}
          color="emerald"
          trend={{ text: `${kpi.approval_rate}% Rate`, isPositive: true }}
        />
        <MetricCard
          label="Loans Rejected"
          value={kpi.rejected_count.toLocaleString()}
          subtitle={`${(100 - kpi.approval_rate).toFixed(2)}% Rejection Rate`}
          icon={XCircle}
          color="rose"
          trend={{ text: `${(100 - kpi.approval_rate).toFixed(1)}% Rejection`, isPositive: false }}
        />
        <MetricCard
          label="Average CIBIL Score"
          value={kpi.avg_cibil}
          subtitle="Scale: 300 to 900"
          icon={ShieldCheck}
          color="cyan"
        />
      </div>

      {/* Financial Measures Row */}
      <div className="grid-cols-4" style={{ marginBottom: '32px' }}>
        <MetricCard
          label="Total Capital Requested"
          value={formatINR(kpi.total_loan_requested)}
          subtitle="Across all applications"
          icon={IndianRupee}
          color="amber"
        />
        <MetricCard
          label="Average Loan Amount"
          value={formatINR(kpi.avg_loan_amount)}
          subtitle="Mean borrowing request"
          icon={CreditCard}
          color="indigo"
        />
        <MetricCard
          label="Average Annual Income"
          value={formatINR(kpi.avg_income)}
          subtitle="Applicant earnings average"
          icon={TrendingUp}
          color="emerald"
        />
        <MetricCard
          label="Avg Total Assets"
          value={formatINR(kpi.avg_total_assets)}
          subtitle="Combined residential, bank, commercial"
          icon={Building2}
          color="cyan"
        />
      </div>

      {/* Analytic Visual Charts Section */}
      <div className="grid-cols-2" style={{ marginBottom: '28px' }}>
        {/* CIBIL Score Breakdown Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>Approval Distribution by CIBIL Band</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CIBIL credit rating is the single strongest decisive feature</p>
            </div>
            <div className="badge-neutral">Star Dimension: Fact.cibil_band</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cibil_breakdown.map((b) => {
              const approvedPct = b.approval_rate;
              const rejectedPct = 100 - approvedPct;
              return (
                <div key={b.cibil_band}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, color: '#f8fafc' }}>{b.cibil_band}</span>
                    <span className="mono-number" style={{ color: 'var(--text-muted)' }}>
                      <strong style={{ color: '#34d399' }}>{b.approved}</strong> Approved ({approvedPct}%) / <strong style={{ color: '#fb7185' }}>{b.rejected}</strong> Rejected
                    </span>
                  </div>
                  {/* Two-tone bar */}
                  <div style={{
                    height: '10px',
                    borderRadius: '5px',
                    background: 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    overflow: 'hidden',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ width: `${approvedPct}%`, background: 'var(--status-approved)', transition: 'width 0.5s ease' }} title={`Approved: ${approvedPct}%`} />
                    <div style={{ width: `${rejectedPct}%`, background: 'var(--status-rejected)', transition: 'width 0.5s ease' }} title={`Rejected: ${rejectedPct.toFixed(1)}%`} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '20px', padding: '12px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.8rem', color: '#c7d2fe' }}>
            <strong>Observation:</strong> Applicants with CIBIL score ≥ 650 achieve over 99% approval rate, while borrowers under 550 face near-total rejection in this benchmark.
          </div>
        </div>

        {/* Education & Employment Demographic Comparison */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>Demographic Slices: Education & Employment</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Aggregated from DimApplicant dimensional hierarchy</p>
            </div>
            <div className="badge-neutral">DimApplicant</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '18px' }}>
            {/* Education Slices */}
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Education Status</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {education_breakdown.map((e) => (
                  <div key={e.education} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600 }}>{e.education}</span>
                      <span className="mono-number" style={{ color: '#34d399', fontWeight: 700 }}>{e.approval_rate}%</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                      {e.approved.toLocaleString()} approved / {e.total.toLocaleString()} total
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Employment Slices */}
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Self-Employed Status</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {employment_breakdown.map((emp) => (
                  <div key={emp.self_employed} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600 }}>{emp.self_employed === 'Yes' ? 'Self-Employed' : 'Salaried'}</span>
                      <span className="mono-number" style={{ color: '#34d399', fontWeight: 700 }}>{emp.approval_rate}%</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                      {emp.approved.toLocaleString()} approved / {emp.total.toLocaleString()} total
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Loan Term Bands */}
          <div style={{ marginTop: '14px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Loan Term Bands (DimLoan)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {term_breakdown.map((t) => (
                <div key={t.loan_term_band} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>{t.loan_term_band}</div>
                  <div className="mono-number" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#818cf8', margin: '3px 0' }}>{t.approval_rate}%</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{t.total} applicants</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Asset Valuation Breakdown */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>Comparative Asset Portfolios: Approved vs. Rejected</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average pledged collateral valuation by loan outcome</p>
          </div>
          <button className="btn-secondary" onClick={() => onNavigate('warehouse')}>
            View Star Schema Analytics →
          </button>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Outcome Status</th>
                <th>Avg. Residential Assets</th>
                <th>Avg. Commercial Assets</th>
                <th>Avg. Luxury Assets</th>
                <th>Avg. Bank Deposit Value</th>
                <th>Avg. Combined Portfolio</th>
              </tr>
            </thead>
            <tbody>
              {asset_breakdown.map((row) => {
                const totalAsset = row.avg_residential + row.avg_commercial + row.avg_luxury + row.avg_bank;
                const isApproved = row.loan_status === 'Approved';
                return (
                  <tr key={row.loan_status}>
                    <td>
                      <span className={isApproved ? 'badge-approved' : 'badge-rejected'}>
                        {isApproved ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {row.loan_status}
                      </span>
                    </td>
                    <td className="mono-number">{formatINR(row.avg_residential)}</td>
                    <td className="mono-number">{formatINR(row.avg_commercial)}</td>
                    <td className="mono-number">{formatINR(row.avg_luxury)}</td>
                    <td className="mono-number">{formatINR(row.avg_bank)}</td>
                    <td className="mono-number" style={{ fontWeight: 700, color: isApproved ? '#34d399' : '#f8fafc' }}>
                      {formatINR(totalAsset)}
                    </td>
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
