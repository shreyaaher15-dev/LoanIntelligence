import React, { useEffect, useState } from 'react';
import { 
  Info, 
  Layers, 
  Database, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  ExternalLink,
  ShieldCheck,
  Scale
} from 'lucide-react';
import api from '../services/api';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function About() {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    api.getAbout()
      .then(res => setAboutData(res))
      .catch(err => console.error(err));
  }, []);

  const kddSteps = [
    {
      step: '1. Selection & Ingestion',
      title: 'Target Dataset Identification',
      desc: 'Selected the Kaggle Loan Approval Prediction benchmark comprising 4,269 customer applications across 13 borrower, financial, and collateral dimensions. Strictly isolated and excluded loan_id from model features.'
    },
    {
      step: '2. Preprocessing & Cleansing',
      title: 'Data Hygiene & Normalization',
      desc: 'Inspected for null values (0 found), stripped trailing whitespace, verified absence of duplicate feature records, and encoded binary targets as Approved (1) and Rejected (0).'
    },
    {
      step: '3. Transformation & Warehousing',
      title: 'Dimensional Star Schema Design',
      desc: 'Structured the raw data into an analytical SQLite Star Schema consisting of FactLoanApplication, DimApplicant, DimLoan, and DimLoanStatus. Engineered financial ratios (Asset-to-Loan coverage, Loan-to-Income multiplier) and created CIBIL & term bands without fabricating temporal dates.'
    },
    {
      step: '4. Data Mining',
      title: 'Random Forest Supervised Learning',
      desc: 'Constructed an integrated scikit-learn Pipeline with ColumnTransformer (StandardScaler on numeric columns and OneHotEncoder on categorical features) feeding an ensemble of 150 Decision Trees with max depth 12.'
    },
    {
      step: '5. Pattern Evaluation',
      title: 'Cross-Validation & Metric Auditing',
      desc: 'Validated the classifier across a stratified 5-fold cross-validation setup and an independent 20% holdout test set (854 records). Confirmed 98.24% accuracy, 98.13% precision, 99.06% recall, and evaluated feature importance hierarchies.'
    }
  ];

  return (
    <div>
      <DisclaimerBanner />

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '4px' }}>
          About the Loan Intelligence Platform
        </h1>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Academic documentation of the Knowledge Discovery in Databases (KDD) process, dimensional warehouse design, and model constraints.
        </p>
      </div>

      {/* KDD Process Timeline */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <Layers size={20} color="#818cf8" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
            Knowledge Discovery in Databases (KDD) Methodology
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {kddSteps.map((s, idx) => (
            <div key={idx} style={{
              display: 'flex',
              gap: '16px',
              padding: '16px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#a5b4fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9rem',
                flexShrink: 0
              }}>
                {idx + 1}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {s.step}
                  </span>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
                    {s.title}
                  </span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Star Schema Architecture and Dataset Provenance */}
      <div className="grid-cols-2" style={{ marginBottom: '28px' }}>
        {/* Star Schema Dimensional Architecture */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Database size={18} color="#06b6d4" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
              Star Schema Warehouse Architecture
            </h3>
          </div>

          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '16px' }}>
            The data warehouse uses a classic Star Schema design in SQLite, engineered to support fast OLAP aggregation without denormalization bottlenecks:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
            <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <strong style={{ color: '#818cf8' }}>FactLoanApplication (Fact Table)</strong>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.76rem', marginTop: '2px' }}>
                Measures: income_annum, loan_amount, cibil_score, residential_assets, commercial_assets, luxury_assets, bank_asset_value, total_assets_value, asset_to_loan_ratio, loan_to_income_ratio, app_count.
              </div>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ color: '#38bdf8' }}>DimApplicant (Dimension)</strong>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.76rem', marginTop: '2px' }}>
                Attributes: no_of_dependents (0–5), education (Graduate / Not Graduate), self_employed (Yes / No).
              </div>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ color: '#38bdf8' }}>DimLoan (Dimension)</strong>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.76rem', marginTop: '2px' }}>
                Attributes: loan_term (2–20 yrs), loan_term_band (Short, Medium, Long), loan_amount_band (Tier 1–4).
              </div>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ color: '#34d399' }}>DimLoanStatus (Dimension)</strong>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.76rem', marginTop: '2px' }}>
                Outcome: Approved or Rejected.
              </div>
            </div>
          </div>

          <div style={{ marginTop: '14px', fontSize: '0.78rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px' }}>
            <strong>Temporal Dimension Note:</strong> The source dataset contains zero application timestamp columns. Conforming to rigorous data mining practices, no artificial temporal facts or fictitious dates were invented.
          </div>
        </div>

        {/* Dataset Source & Academic License */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <FileText size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
              Dataset Provenance & Security
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Dataset Name:</span>
              <strong style={{ color: '#f8fafc' }}>Loan Approval Dataset</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Source Provider:</span>
              <span>Kaggle Community Benchmark</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Records / Rows:</span>
              <span className="mono-number" style={{ fontWeight: 600 }}>4,269 Rows</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Attributes / Columns:</span>
              <span className="mono-number" style={{ fontWeight: 600 }}>13 Attributes</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Target Class Balance:</span>
              <span>Approved: 62.2% | Rejected: 37.8%</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>License:</span>
              <span style={{ color: '#fbbf24', fontWeight: 600 }}>Open Academic / CC BY-NC-SA 4.0</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Data Privacy:</span>
              <span style={{ color: '#34d399' }}>Isolated to Backend (Not in Client Bundle)</span>
            </div>
          </div>

          <div style={{ marginTop: '18px', padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--status-approved-border)', fontSize: '0.8rem', color: '#a7f3d0' }}>
            <ShieldCheck size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
            The raw CSV data file is stored exclusively within the backend data directory and is never served as a public static asset in the React bundle.
          </div>
        </div>
      </div>

      {/* Model Limitations & Ethics */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <AlertTriangle size={18} color="#fb7185" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
            Documented Model Limitations & Analytical Disclosures
          </h3>
        </div>

        <ul style={{ paddingLeft: '20px', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
          <li>
            <strong>Credit Bureau Skew:</strong> The CIBIL score accounts for <strong>83.0%</strong> of the Gini feature importance. In this dataset, credit scores above 650 virtually guarantee approval while scores below 550 result in rejection, reflecting an aggressive score cutoff in the underlying data generator.
          </li>
          <li>
            <strong>Absence of Geographic and Demographic Data:</strong> The dataset omits applicant age, zip code, residential stability, and industry sector, precluding intersectional fairness analysis across regional or demographic cohorts.
          </li>
          <li>
            <strong>No Macroeconomic Factors:</strong> Macroeconomic indicators (inflation index, prevailing central bank repo rates, unemployment levels) are absent from the dataset.
          </li>
          <li>
            <strong>Non-Binding Student Prototype:</strong> This platform is constructed solely as a student computer science / data mining demonstration. It must not be deployed as an autonomous production decision-making engine.
          </li>
        </ul>
      </div>
    </div>
  );
}
