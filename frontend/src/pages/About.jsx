import React from 'react';
import { 
  Calculator, 
  Database, 
  Cpu, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function About() {
  const cards = [
    {
      title: "Loan Prediction",
      icon: Calculator,
      color: "#818cf8",
      bgColor: "rgba(99, 102, 241, 0.12)",
      borderColor: "rgba(99, 102, 241, 0.25)",
      description: "The primary objective of this project is to explore automated credit assessment. It evaluates whether an applicant is likely to be Approved or Rejected by weighing their credit score, borrowing amount, annual income, and repayment horizon."
    },
    {
      title: "Kaggle Dataset",
      icon: Database,
      color: "#38bdf8",
      bgColor: "rgba(6, 182, 212, 0.12)",
      borderColor: "rgba(6, 182, 212, 0.25)",
      description: "Trained and benchmarked on the open Kaggle Loan Approval dataset comprising 4,269 real-world loan applications (62.2% Approved, 37.8% Rejected). The data includes credit ratings, annual income, loan amounts, and asset valuations."
    },
    {
      title: "Random Forest",
      icon: Cpu,
      color: "#34d399",
      bgColor: "rgba(16, 185, 129, 0.12)",
      borderColor: "rgba(16, 185, 129, 0.25)",
      description: "The backend machine learning pipeline was trained using a Random Forest classifier with feature scaling and categorical encoding. In empirical evaluation, it achieved 98.24% test accuracy, identifying CIBIL score as the decisive factor."
    },
    {
      title: "Demo Note",
      icon: Sparkles,
      color: "#fbbf24",
      bgColor: "rgba(245, 158, 11, 0.12)",
      borderColor: "rgba(245, 158, 11, 0.25)",
      description: "While the project includes a Python backend model using Random Forest, this public deployed website currently runs simulated frontend predictions in the browser. It is not connected to that backend, enabling an instant, reliable student presentation."
    }
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <DisclaimerBanner />

      {/* Short Introduction */}
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 800, 
          letterSpacing: '-0.02em', 
          color: '#ffffff', 
          marginBottom: '8px' 
        }}>
          About the Project
        </h1>
        <p style={{ 
          fontSize: '0.96rem', 
          color: 'var(--text-muted)', 
          maxWidth: '650px', 
          margin: '0 auto',
          lineHeight: 1.55 
        }}>
          <strong>Loan Intelligence</strong> is an academic student mini-project exploring how machine learning algorithms 
          and credit risk principles predict loan approval outcomes based on borrower financial parameters.
        </p>
      </div>

      {/* Four Simple Cards in Responsive Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '20px', 
        marginBottom: '28px' 
      }}>
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className="glass-panel" 
              style={{ 
                padding: '24px', 
                border: `1px solid ${card.borderColor}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: card.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.color,
                  flexShrink: 0
                }}>
                  <Icon size={20} />
                </div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: '#ffffff' }}>
                  {card.title}
                </h3>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Academic Footnote */}
      <div className="glass-panel" style={{ padding: '18px 22px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
          Built for college academic presentation. The simulation parameters are derived from open Kaggle data and are intended for demonstration only.
        </div>
      </div>
    </div>
  );
}
