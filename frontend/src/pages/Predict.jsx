import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  RotateCcw,
  CreditCard,
  TrendingUp,
  Clock,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function Predict() {
  const initialForm = {
    cibil_score: 750,
    income_annum: 800000,
    loan_amount: 2000000,
    loan_term: 10
  };

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const presets = [
    {
      label: 'Example: High Credit Prime',
      tag: 'Approved Example',
      data: { cibil_score: 780, income_annum: 1200000, loan_amount: 2500000, loan_term: 10 }
    },
    {
      label: 'Example: Low Credit Subprime',
      tag: 'Rejected Example',
      data: { cibil_score: 440, income_annum: 450000, loan_amount: 2200000, loan_term: 15 }
    },
    {
      label: 'Example: Moderate / Borderline',
      tag: 'Borderline Example',
      data: { cibil_score: 610, income_annum: 700000, loan_amount: 1500000, loan_term: 8 }
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  const handleApplyPreset = (presetData) => {
    setForm(presetData);
    setResult(null);
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await api.predictLoan(form);
    setResult(res);
    setLoading(false);
  };

  const formatINR = (val) => {
    if (val === undefined || val === null || val === '') return '₹0';
    const num = Number(val);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Crore`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lakh`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const getCibilColor = (score) => {
    if (score >= 750) return '#34d399';
    if (score >= 650) return '#818cf8';
    if (score >= 550) return '#fbbf24';
    return '#fb7185';
  };

  const getCibilTier = (score) => {
    if (score >= 750) return 'Excellent (750-900)';
    if (score >= 650) return 'Good (650-749)';
    if (score >= 550) return 'Fair (550-649)';
    return 'Poor (<550)';
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <DisclaimerBanner />

      {/* Main Title & Short Instruction */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ 
          fontSize: '2.1rem', 
          fontWeight: 800, 
          letterSpacing: '-0.03em', 
          color: '#ffffff', 
          marginBottom: '8px' 
        }}>
          Loan Approval Prediction
        </h1>
        <p style={{ 
          fontSize: '0.98rem', 
          color: 'var(--text-muted)', 
          maxWidth: '620px', 
          margin: '0 auto',
          lineHeight: 1.5 
        }}>
          Enter your credit score and financial details below to test whether your loan application is likely to be 
          <strong style={{ color: '#34d399' }}> Approved</strong> or 
          <strong style={{ color: '#fb7185' }}> Rejected</strong>.
        </p>

        {/* Quick Example Clickers */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '10px', 
          marginTop: '16px',
          flexWrap: 'wrap' 
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>TRY SAMPLE:</span>
          {presets.map(p => (
            <button
              key={p.label}
              type="button"
              className="btn-secondary"
              onClick={() => handleApplyPreset(p.data)}
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              {p.label.replace('Example: ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Prediction Section Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: result ? '1.1fr 1fr' : '1fr', gap: '24px', alignItems: 'start' }}>
        {/* Simple 4-Field Form */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <form onSubmit={handlePredict}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} color="#818cf8" />
                Applicant Details
              </div>
              <button
                type="button"
                onClick={() => { setForm(initialForm); setResult(null); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Field 1: CIBIL Score */}
            <div style={{ 
              background: 'rgba(255,255,255,0.02)', 
              padding: '16px', 
              borderRadius: '10px', 
              border: '1px solid var(--border-subtle)',
              marginBottom: '18px' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.86rem', fontWeight: 600, color: '#f8fafc' }}>
                  1. CIBIL Credit Score
                </label>
                <span className="mono-number" style={{
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  color: getCibilColor(form.cibil_score),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {form.cibil_score} / 900
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, opacity: 0.85 }}>({getCibilTier(form.cibil_score)})</span>
                </span>
              </div>
              <input
                type="range"
                name="cibil_score"
                min="300"
                max="900"
                step="5"
                value={form.cibil_score}
                onChange={handleChange}
                style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer', height: '6px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                <span>300 (Subprime / Poor)</span>
                <span>650 (Standard Benchmark)</span>
                <span>900 (Excellent)</span>
              </div>
            </div>

            {/* Field 2 & 3: Annual Income & Loan Amount */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  2. Annual Income (₹)
                </label>
                <input
                  type="number"
                  name="income_annum"
                  className="input-field mono-number"
                  value={form.income_annum}
                  onChange={handleChange}
                  step="50000"
                  min="100000"
                  required
                  placeholder="e.g. 800000"
                />
                <span style={{ fontSize: '0.74rem', color: '#818cf8', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                  {formatINR(form.income_annum)}
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  3. Loan Amount Requested (₹)
                </label>
                <input
                  type="number"
                  name="loan_amount"
                  className="input-field mono-number"
                  value={form.loan_amount}
                  onChange={handleChange}
                  step="50000"
                  min="50000"
                  required
                  placeholder="e.g. 2000000"
                />
                <span style={{ fontSize: '0.74rem', color: '#818cf8', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                  {formatINR(form.loan_amount)}
                </span>
              </div>
            </div>

            {/* Field 4: Loan Term */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  4. Loan Repayment Term
                </label>
                <span className="mono-number" style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.9rem' }}>
                  {form.loan_term} Years
                </span>
              </div>
              <input
                type="range"
                name="loan_term"
                min="2"
                max="20"
                step="2"
                value={form.loan_term}
                onChange={handleChange}
                style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer', height: '6px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                <span>2 Years (Short-term)</span>
                <span>10 Years (Medium)</span>
                <span>20 Years (Long-term)</span>
              </div>
            </div>

            {/* Predict Button */}
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '13px', fontSize: '1.02rem', borderRadius: '10px' }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '18px', height: '18px' }} />
                  Evaluating Application...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Predict Loan Approval
                </>
              )}
            </button>
          </form>
        </div>

        {/* Clear Result Display */}
        {result ? (
          <div className="glass-panel" style={{
            padding: '26px',
            border: result.status_type === 'approved' 
              ? '1px solid var(--status-approved-border)' 
              : '1px solid var(--status-rejected-border)',
            boxShadow: result.status_type === 'approved' 
              ? '0 12px 36px rgba(16, 185, 129, 0.15)' 
              : '0 12px 36px rgba(244, 63, 94, 0.15)'
          }}>
            {/* Clear Result Banner */}
            <div style={{
              background: result.status_type === 'approved' ? 'var(--status-approved-bg)' : 'var(--status-rejected-bg)',
              border: `1px solid ${result.status_type === 'approved' ? 'var(--status-approved-border)' : 'var(--status-rejected-border)'}`,
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '6px' }}>
                {result.status_type === 'approved' ? (
                  <CheckCircle2 size={36} color="#10b981" />
                ) : (
                  <XCircle size={36} color="#f43f5e" />
                )}
                <span style={{
                  fontSize: '1.9rem',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: result.status_type === 'approved' ? '#34d399' : '#fb7185'
                }}>
                  {result.prediction.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                Decision Benchmark: {result.status_type === 'approved' ? 'Meets Credit Criteria' : 'Elevated Default Risk'}
              </div>
            </div>

            {/* Brief Explanation */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                Assessment Explanation
              </div>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                {result.explanation}
              </p>
            </div>

            {/* Key Factor Bullets */}
            <div style={{ 
              background: 'rgba(255,255,255,0.02)', 
              padding: '14px', 
              borderRadius: '8px', 
              border: '1px solid var(--border-subtle)',
              marginBottom: '18px' 
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Key Influencing Factors
              </div>
              <ul style={{ paddingLeft: '18px', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {result.reasons.map((r, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Metric Summary Chips */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>Debt Multiplier</span>
                <span className="mono-number" style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
                  {result.loan_to_income_ratio}x Annual Income
                </span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>Credit Bureau Tier</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: getCibilColor(result.cibil_score) }}>
                  {result.cibil_band}
                </span>
              </div>
            </div>

            {/* Transparent Demo Notice */}
            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', lineHeight: 1.45, fontStyle: 'italic' }}>
              {result.disclaimer}
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '36px 24px', textAlign: 'center', border: '1px dashed var(--border-subtle)' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: '#818cf8'
            }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
              Instant Assessment Ready
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', maxWidth: '300px', margin: '0 auto 18px auto', lineHeight: 1.5 }}>
              Adjust the 4 parameters or pick an example profile, then click <strong>Predict Loan Approval</strong> to see the result.
            </p>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
              Evaluates CIBIL credit tier, loan-to-income multiplier, and repayment horizon.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
