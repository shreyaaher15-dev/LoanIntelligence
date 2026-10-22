import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner({ compact = false }) {
  if (compact) {
    return (
      <div style={{
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        borderRadius: '8px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.82rem',
        color: '#fbbf24',
        marginBottom: '18px'
      }}>
        <AlertTriangle size={16} style={{ flexShrink: 0 }} />
        <span>
          <strong>Academic Mini-Project Notice:</strong> Predictions and analytics are generated solely for research and coursework purposes using open Kaggle data. Not for commercial credit underwriting.
        </span>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
      borderLeft: '4px solid var(--accent-amber)',
      padding: '16px 20px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px'
    }}>
      <div style={{
        background: 'rgba(245, 158, 11, 0.15)',
        padding: '8px',
        borderRadius: '8px',
        color: '#fbbf24',
        flexShrink: 0,
        marginTop: '2px'
      }}>
        <ShieldAlert size={20} />
      </div>
      <div>
        <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#fef3c7', marginBottom: '4px' }}>
          Educational Demonstration & Non-Binding Advisory Disclaimer
        </h4>
        <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5 }}>
          “Loan Intelligence” is an academic project built to demonstrate the <strong>Knowledge Discovery in Databases (KDD)</strong> process,
          dimensional star-schema warehousing with SQLite, and machine learning pipeline integration with FastAPI and React. Predictions produced by this platform
          are strictly educational benchmarks and must not be interpreted as financial advice or authoritative loan underwriting decisions.
        </p>
      </div>
    </div>
  );
}
