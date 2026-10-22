import React, { useState } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles,
  TrendingUp,
  Building,
  RotateCcw
} from 'lucide-react';
import api from '../services/api';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function Predict() {
  const initialForm = {
    no_of_dependents: 2,
    education: 'Graduate',
    self_employed: 'No',
    income_annum: 8500000,
    loan_amount: 22000000,
    loan_term: 12,
    cibil_score: 750,
    residential_assets_value: 8000000,
    commercial_assets_value: 5000000,
    luxury_assets_value: 15000000,
    bank_asset_value: 6000000
  };

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const presets = [
    {
      name: 'Prime Borrower (Strong Credit)',
      data: {
        no_of_dependents: 1,
        education: 'Graduate',
        self_employed: 'No',
        income_annum: 9200000,
        loan_amount: 25000000,
        loan_term: 10,
        cibil_score: 810,
        residential_assets_value: 14000000,
        commercial_assets_value: 8000000,
        luxury_assets_value: 20000000,
        bank_asset_value: 9000000
      }
    },
    {
      name: 'Subprime / High Risk',
      data: {
        no_of_dependents: 4,
        education: 'Not Graduate',
        self_employed: 'Yes',
        income_annum: 3200000,
        loan_amount: 19500000,
        loan_term: 18,
        cibil_score: 410,
        residential_assets_value: 2000000,
        commercial_assets_value: 800000,
        luxury_assets_value: 4500000,
        bank_asset_value: 1200000
      }
    },
    {
      name: 'Mid-Tier Applicant',
      data: {
        no_of_dependents: 2,
        education: 'Graduate',
        self_employed: 'Yes',
        income_annum: 5500000,
        loan_amount: 14000000,
        loan_term: 8,
        cibil_score: 660,
        residential_assets_value: 6000000,
        commercial_assets_value: 2500000,
        luxury_assets_value: 11000000,
        bank_asset_value: 4500000
      }
    }
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleApplyPreset = (presetData) => {
    setForm(presetData);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Basic frontend validation
    if (form.cibil_score < 300 || form.cibil_score > 900) {
      setError('CIBIL credit score must be between 300 and 900.');
      setLoading(false);
      return;
    }
    if (form.loan_amount <= 0 || form.income_annum <= 0) {
      setError('Loan amount and annual income must be greater than zero.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.predictLoan(form);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Error executing prediction model.');
    } finally {
      setLoading(false);
    }
  };

  const formatINR = (val) => {
    if (val === undefined || val === null) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  return (
    <div>
      <DisclaimerBanner />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '4px' }}>
            Loan Approval Simulator & Risk Assessment
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Interactive evaluation using decision parameters calibrated against the trained Random Forest pipeline.
          </p>
        </div>

        {/* Quick fill presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>SAMPLE PROFILES:</span>
          {presets.map(p => (
            <button
              key={p.name}
              type="button"
              className="btn-secondary"
              onClick={() => handleApplyPreset(p.data)}
              style={{ fontSize: '0.78rem', padding: '6px 10px' }}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1.1fr 1fr' : '1fr', gap: '24px', alignItems: 'start' }}>
        {/* Underwriting Input Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calculator size={18} color="#818cf8" /> Applicant Information (Demo Form)
              </h3>
              <button
                type="button"
                onClick={() => { setForm(initialForm); setResult(null); setError(null); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
              >
                <RotateCcw size={12} /> Reset to defaults
              </button>
            </div>

            {error && (
              <div className="alert-error" style={{ marginBottom: '16px' }}>
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1: Demographics */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                1. Borrower Profile (DimApplicant)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Number of Dependents</label>
                  <select
                    name="no_of_dependents"
                    className="select-field"
                    value={form.no_of_dependents}
                    onChange={handleChange}
                  >
                    {[0, 1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'dependent' : 'dependents'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Education</label>
                  <select
                    name="education"
                    className="select-field"
                    value={form.education}
                    onChange={handleChange}
                  >
                    <option value="Graduate">Graduate</option>
                    <option value="Not Graduate">Not Graduate</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Employment Type</label>
                  <select
                    name="self_employed"
                    className="select-field"
                    value={form.self_employed}
                    onChange={handleChange}
                  >
                    <option value="No">Salaried Employee</option>
                    <option value="Yes">Self-Employed / Business</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Credit & Financials */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                2. Credit Rating & Loan Request (DimLoan)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                {/* CIBIL Score Slider + Input */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>CIBIL Credit Score</label>
                    <span className="mono-number" style={{
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      color: form.cibil_score >= 750 ? '#34d399' : form.cibil_score >= 650 ? '#818cf8' : form.cibil_score >= 550 ? '#fbbf24' : '#fb7185'
                    }}>
                      {form.cibil_score} / 900
                    </span>
                  </div>
                  <input
                    type="range"
                    name="cibil_score"
                    min="300"
                    max="900"
                    step="1"
                    value={form.cibil_score}
                    onChange={handleChange}
                    style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    <span>300 (Poor)</span>
                    <span>650 (Good)</span>
                    <span>900 (Excellent)</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Annual Income (₹)</label>
                  <input
                    type="number"
                    name="income_annum"
                    className="input-field mono-number"
                    value={form.income_annum}
                    onChange={handleChange}
                    step="100000"
                    min="100000"
                    required
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '3px', display: 'block' }}>
                    {formatINR(form.income_annum)}
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Loan Amount (₹)</label>
                  <input
                    type="number"
                    name="loan_amount"
                    className="input-field mono-number"
                    value={form.loan_amount}
                    onChange={handleChange}
                    step="100000"
                    min="100000"
                    required
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '3px', display: 'block' }}>
                    {formatINR(form.loan_amount)}
                  </span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Loan Term (Years): <strong className="mono-number" style={{ color: '#818cf8' }}>{form.loan_term} years</strong>
                </label>
                <input
                  type="range"
                  name="loan_term"
                  min="2"
                  max="20"
                  step="2"
                  value={form.loan_term}
                  onChange={handleChange}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  <span>2 yrs (Short)</span>
                  <span>10 yrs</span>
                  <span>20 yrs (Long)</span>
                </div>
              </div>
            </div>

            {/* Section 3: Asset Breakdown */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                3. Pledged Assets & Collateral (₹)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Residential Assets (₹)</label>
                  <input
                    type="number"
                    name="residential_assets_value"
                    className="input-field mono-number"
                    value={form.residential_assets_value}
                    onChange={handleChange}
                    step="100000"
                    required
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{formatINR(form.residential_assets_value)}</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Commercial Assets (₹)</label>
                  <input
                    type="number"
                    name="commercial_assets_value"
                    className="input-field mono-number"
                    value={form.commercial_assets_value}
                    onChange={handleChange}
                    step="100000"
                    min="0"
                    required
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{formatINR(form.commercial_assets_value)}</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Luxury Assets (₹)</label>
                  <input
                    type="number"
                    name="luxury_assets_value"
                    className="input-field mono-number"
                    value={form.luxury_assets_value}
                    onChange={handleChange}
                    step="100000"
                    min="0"
                    required
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{formatINR(form.luxury_assets_value)}</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Bank Liquid Deposits (₹)</label>
                  <input
                    type="number"
                    name="bank_asset_value"
                    className="input-field mono-number"
                    value={form.bank_asset_value}
                    onChange={handleChange}
                    step="100000"
                    min="0"
                    required
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{formatINR(form.bank_asset_value)}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '18px', height: '18px' }} />
                  Evaluating Model Decision...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Execute Underwriting Decision
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results Display */}
        {result ? (
          <div className="glass-panel" style={{
            padding: '24px',
            border: result.prediction === 'Approved' ? '1px solid var(--status-approved-border)' : '1px solid var(--status-rejected-border)',
            boxShadow: result.prediction === 'Approved' ? '0 12px 36px rgba(16, 185, 129, 0.15)' : '0 12px 36px rgba(244, 63, 94, 0.15)'
          }}>
            {/* Banner outcome */}
            <div style={{
              background: result.prediction === 'Approved' ? 'var(--status-approved-bg)' : 'var(--status-rejected-bg)',
              border: `1px solid ${result.prediction === 'Approved' ? 'var(--status-approved-border)' : 'var(--status-rejected-border)'}`,
              borderRadius: '10px',
              padding: '18px 20px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
                {result.prediction === 'Approved' ? (
                  <CheckCircle2 size={32} color="#10b981" />
                ) : (
                  <XCircle size={32} color="#f43f5e" />
                )}
                <span style={{
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: result.prediction === 'Approved' ? '#34d399' : '#fb7185'
                }}>
                  {result.prediction.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                Model Confidence: <strong className="mono-number" style={{ color: '#ffffff' }}>{result.confidence_percentage}%</strong>
              </div>
            </div>

            {/* Probability breakdown */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span>Probability Breakdown</span>
                <span className="mono-number" style={{ color: 'var(--text-dim)' }}>
                  Approved: {(result.probability_approved * 100).toFixed(1)}% | Rejected: {(result.probability_rejected * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', display: 'flex', overflow: 'hidden' }}>
                <div style={{ width: `${result.probability_approved * 100}%`, background: 'var(--status-approved)' }} />
                <div style={{ width: `${result.probability_rejected * 100}%`, background: 'var(--status-rejected)' }} />
              </div>
            </div>

            {/* Ratios & Underwriting Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Credit Bureau Tier</div>
                <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>{result.cibil_band}</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Total Collateral Assets</div>
                <div className="mono-number" style={{ fontSize: '0.96rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>
                  {formatINR(result.total_assets)}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Collateral Coverage</div>
                <div className="mono-number" style={{ fontSize: '0.96rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                  {result.asset_to_loan_ratio}x of Loan
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Loan-to-Income</div>
                <div className="mono-number" style={{ fontSize: '0.96rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                  {result.loan_to_income_ratio}x Annual
                </div>
              </div>
            </div>

            {/* Factor explanations */}
            <div style={{ marginBottom: '20px' }}>
              {result.positive_factors.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckCircle2 size={13} /> Positive Credit Indicators
                  </div>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {result.positive_factors.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              )}

              {result.risk_factors.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fb7185', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <AlertTriangle size={13} /> Underwriting Risk Factors
                  </div>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {result.risk_factors.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Official Mandatory Disclaimer */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '0.76rem',
              color: '#fef3c7',
              lineHeight: 1.45
            }}>
              <strong>NOTICE:</strong> {result.disclaimer}
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', border: '1px dashed var(--border-subtle)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: '#818cf8'
            }}>
              <ShieldCheck size={26} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>Ready for Inference</h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: '340px', margin: '0 auto 20px auto' }}>
              Fill in applicant parameters or pick a sample profile above, then click <strong>Execute Underwriting Decision</strong> to test.
            </p>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
              Model: Random Forest Classifier (Accuracy: 98.24% on Kaggle test set)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
