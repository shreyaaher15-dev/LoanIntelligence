import React from 'react';
import { 
  Info, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  BookOpen,
  TrendingUp,
  Award
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function About() {
  const insights = [
    {
      title: "1. Credit Score (CIBIL) is the Primary Gate",
      desc: "In loan underwriting benchmarks, applicants with a CIBIL score of 650 or higher have an approval probability over 98%, whereas borrowers below 550 are almost always rejected."
    },
    {
      title: "2. Debt-to-Income Multiple Matters",
      desc: "Borrowers whose requested loan amount exceeds 5x their annual earnings present elevated default exposure, which can lead to rejection even with fair credit."
    },
    {
      title: "3. Shorter Repayment Terms Lower Risk",
      desc: "Short-term loans (2 to 6 years) demonstrate higher approval probabilities compared to extended 15-to-20 year terms because lender exposure over time is minimized."
    }
  ];

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      <DisclaimerBanner />

      <div style={{ marginBottom: '26px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '6px' }}>
          About the Loan Intelligence Project
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          A student mini-project exploring credit risk assessment and automated loan approval decisions using data mining principles.
        </p>
      </div>

      {/* College Project Overview */}
      <div className="glass-panel" style={{ padding: '26px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#818cf8'
          }}>
            <BookOpen size={18} />
          </div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
            Project Background & Purpose
          </h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '14px' }}>
          This mini-project was developed for college academic presentation. In the modern financial technology sector,
          commercial banks and lending institutions use statistical scoring models to automate initial loan screening.
          The primary goal of this platform is to provide a clean, accessible demonstration of how four core parameters—<strong>credit score, income, loan amount, and tenure</strong>—influence whether an application is likely approved or rejected.
        </p>

        <div style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '0.82rem',
          color: '#c7d2fe'
        }}>
          <strong>Interactive Demonstration Note:</strong> This deployed website runs as a fast, self-contained client-side simulation. It simulates the learned decision boundaries directly in the browser so that visitors, classmates, and evaluators can immediately test predictions without needing a live Python backend server running.
        </div>
      </div>

      {/* Dataset & Key Findings */}
      <div className="glass-panel" style={{ padding: '26px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8'
          }}>
            <Database size={18} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
            Benchmark Dataset (Kaggle)
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>Sample Size</span>
            <strong className="mono-number" style={{ fontSize: '1.05rem', color: '#ffffff' }}>4,269 Applications</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>Historical Approvals</span>
            <strong className="mono-number" style={{ fontSize: '1.05rem', color: '#34d399' }}>62.2% Approved</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>Historical Rejections</span>
            <strong className="mono-number" style={{ fontSize: '1.05rem', color: '#fb7185' }}>37.8% Rejected</strong>
          </div>
        </div>

        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>
          Key Analytical Takeaways:
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {insights.map((item, idx) => (
            <div key={idx} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '12px 14px'
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#818cf8', marginBottom: '3px' }}>
                {item.title}
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimers & Ethics */}
      <div className="glass-panel" style={{ padding: '22px' }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
          Academic Project Disclaimer
        </h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.55 }}>
          This application is created solely for coursework evaluation and demonstration. The outputs are not financial advice, credit commitments, or real-world bank decisions.
        </p>
      </div>
    </div>
  );
}
