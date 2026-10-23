import React from 'react';
import { Sparkles } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="glass-panel" style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
      borderLeft: '4px solid var(--accent-primary)',
      padding: '14px 18px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <div style={{
        background: 'rgba(99, 102, 241, 0.15)',
        padding: '6px',
        borderRadius: '8px',
        color: '#818cf8',
        flexShrink: 0
      }}>
        <Sparkles size={18} />
      </div>
      <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.45 }}>
        <strong style={{ color: '#ffffff' }}>College Project Demonstration:</strong> Enter your financial profile below to see an instant simulated loan assessment based on credit and debt-to-income benchmarks from Kaggle loan approval data.
      </div>
    </div>
  );
}
