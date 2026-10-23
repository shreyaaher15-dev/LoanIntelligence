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
  Scale
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
      label: 'Example: High Credit',
      data: { cibil_score: 780, income_annum: 1200000, loan_amount: 2500000, loan_term: 10 }
    },
    {
      label: 'Example: Low Credit',
      data: { cibil_score: 440, income_annum: 450000, loan_amount: 2200000, loan_term: 15 }
    },
    {
      label: 'Example: Moderate / Borderline',
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
    if (score >= 750) return 'Excellent (750–900)';
    if (score >= 650) return 'Good (650–749)';
    if (score >= 550) return 'Fair (550–649)';
    return 'Poor (300–549)';
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
          Enter your credit score and financial details below to simulate whether your loan application may be 
          <strong style={{ color: '#34d399' }}> Likely Approved</strong> or 
          <strong style={{ color: '#fb7185' }}> Likely Rejected</strong>.
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
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>QUICK SAMPLES:</span>
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

      {/* Main Form & Results Layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Simple 4-Field Form */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <form onSubmit={handlePredict}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} color="#818cf8" />
                Application Parameters
              </div>
              <button
                type="button"
                onClick={() => { setForm(initialForm); setResult(null); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
              >
                <RotateCcw size={12} /> Reset to defaults
              </button>
            </div>

            {/* Field 1: CIBIL Score Slider + Input */}
            <div style={{ 
              background: 'rgba(255,255,255,0.02)', 
              padding: '16px', 
              borderRadius: '10px', 
              border: '1px solid var(--border-subtle)',
              marginBottom: '18px' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                <label style={{ fontSize: '0.86rem', fontWeight: 600, color: '#f8fafc' }}>
                  1. CIBIL Credit Score (300 to 900)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="mono-number" style={{
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    color: getCibilColor(form.cibil_score)
                  }}>
                    {form.cibil_score} / 900
                  </span>
                  <span style={{ 
                    fontSize: '0.72rem', 
                    fontWeight: 600, 
                    color: getCibilColor(form.cibil_score),
                    background: 'rgba(255,255,255,0.05)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {getCibilTier(form.cibil_score)}
                  </span>
                </div>
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
                <span>Poor (&lt; 550)</span>
                <span>Fair (550–649)</span>
                <span>Good (650–749)</span>
                <span>Excellent (750+)</span>
              </div>
            </div>

            {/* Field 2 & 3: Annual Income & Loan Amount */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
              gap: '16px', 
              marginBottom: '18px' 
            }}>
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

            {/* Field 4: Loan Repayment Term */}
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
                <span>2 Years (Short term)</span>
                <span>10 Years (Medium term)</span>
                <span>20 Years (Long term)</span>
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
                  Evaluating Assessment...
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

        {/* Clear Result Section */}
        {result && (
          <div className="glass-panel" style={{
            padding: '26px',
            border: result.status_type === 'approved' 
              ? '1px solid var(--status-approved-border)' 
              : '1px solid var(--status-rejected-border)',
            boxShadow: result.status_type === 'approved' 
              ? '0 12px 36px rgba(16, 185, 129, 0.15)' 
              : '0 12px 36px rgba(244, 63, 94, 0.15)'
          }}>
            {/* 1. Clear Result Banner */}
            <div style={{
              background: result.status_type === 'approved' ? 'var(--status-approved-bg)' : 'var(--status-rejected-bg)',
              border: `1px solid ${result.status_type === 'approved' ? 'var(--status-approved-border)' : 'var(--status-rejected-border)'}`,
              borderRadius: '12px',
              padding: '18px 20px',
              textAlign: 'center',
              marginBottom: '22px'
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
                  {result.prediction}
                </span>
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                Application Evaluation: {result.status_type === 'approved' ? 'Standard Credit Criteria Met' : 'Elevated Credit & Debt Risk'}
              </div>
            </div>

            {/* 2. Structured Comparison Cards (CIBIL, Income Comparison, Term) */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '12px', 
              marginBottom: '20px' 
            }}>
              {/* Entered CIBIL & Range */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <ShieldCheck size={14} color={getCibilColor(result.cibil_score)} />
                  Entered CIBIL Score
                </div>
                <div className="mono-number" style={{ fontSize: '1.15rem', fontWeight: 800, color: getCibilColor(result.cibil_score) }}>
                  {result.cibil_score} / 900
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  Range: <strong>{result.cibil_range}</strong>
                </div>
              </div>

              {/* Loan vs. Annual Income Comparison */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <Scale size={14} color="#818cf8" />
                  Loan-to-Income Comparison
                </div>
                <div className="mono-number" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                  {result.loan_to_income_ratio}x Annual Income
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  {formatINR(result.loan_amount)} loan on {formatINR(result.income_annum)} income
                </div>
              </div>

              {/* Selected Repayment Term */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <Clock size={14} color="#38bdf8" />
                  Selected Repayment Term
                </div>
                <div className="mono-number" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                  {result.loan_term} Years
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  {result.loan_term <= 6 ? 'Short-term horizon' : result.loan_term <= 12 ? 'Medium-term horizon' : 'Extended-term horizon'}
                </div>
              </div>
            </div>

            {/* 3. Short, Easy-to-Understand Summary */}
            <div style={{ 
              background: 'rgba(255,255,255,0.02)', 
              padding: '16px', 
              borderRadius: '10px', 
              border: '1px solid var(--border-subtle)',
              marginBottom: '18px' 
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                Assessment Summary
              </div>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                {result.summary}
              </p>
            </div>

            {/* 4. Key Factors */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Key Contributing Points
              </div>
              <ul style={{ paddingLeft: '18px', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                {result.key_points.map((pt, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{pt}</li>
                ))}
              </ul>
            </div>

            {/* Footnote */}
            <div style={{ 
              padding: '10px 14px', 
              borderRadius: '8px', 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem', 
              color: 'var(--text-dim)', 
              lineHeight: 1.45 
            }}>
              <strong>Demo Disclaimer:</strong> This prediction is an educational simulation based on decision rules derived from Kaggle loan approval data. It runs directly in your browser and does not connect to a live banking system.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
