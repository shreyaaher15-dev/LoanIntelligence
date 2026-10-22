import React from 'react';
import { ShieldAlert, AlertTriangle, Sparkles } from 'lucide-react';

export default function DisclaimerBanner({ compact = false }) {
  if (compact) {
    return (
      <div style={{
        background: 'rgba(99, 102, 241, 0.08)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: '8px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.82rem',
        color: '#c7d2fe',
        marginBottom: '18px'
      }}>
        <Sparkles size={16} color="#818cf8" style={{ flexShrink: 0 }} />
        <span>
          <strong>College Demo Mode:</strong> Interactive simulation driven by empirical Kaggle benchmark data (4,269 applications) and trained Random Forest pipeline boundaries.
        </span>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
      borderLeft: '4px solid var(--accent-primary)',
      padding: '16px 20px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px'
    }}>
      <div style={{
        background: 'rgba(99, 102, 241, 0.15)',
        padding: '8px',
        borderRadius: '8px',
        color: '#818cf8',
        flexShrink: 0,
        marginTop: '2px'
      }}>
        <Sparkles size={20} />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#ffffff' }}>
            College Demonstration Mode — Verified Sample Benchmark Data
          </h4>
          <span style={{
            fontSize: '0.68rem',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '2px 7px',
            borderRadius: '9999px',
            fontWeight: 600
          }}>
            SELF-CONTAINED DEMO
          </span>
        </div>
        <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5 }}>
          “Loan Intelligence” demonstrates the <strong>Knowledge Discovery in Databases (KDD)</strong> process,
          dimensional star-schema warehousing with SQLite, and machine learning pipeline evaluation. All pages are populated with 
          <strong> actual calculated metrics, cross-validation scores, and dimensional aggregations</strong> from the 4,269-record Kaggle benchmark.
        </p>
      </div>
    </div>
  );
}
