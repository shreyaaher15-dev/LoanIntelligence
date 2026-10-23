import React from 'react';
import { 
  Calculator, 
  Info, 
  Layers,
  Sparkles
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'predict', label: 'Loan Predictor', icon: Calculator },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px'
      }}>
        {/* Brand identity */}
        <div 
          onClick={() => setActiveTab('predict')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
          }}>
            <Layers size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.08rem', letterSpacing: '-0.02em', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Loan Intelligence
              <span style={{
                fontSize: '0.68rem',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                padding: '2px 7px',
                borderRadius: '6px',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                fontWeight: 600
              }}>
                STUDENT DEMO
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Loan Approval Prediction
            </div>
          </div>
        </div>

        {/* Clean, Simple Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: isActive ? '#a5b4fc' : 'var(--text-muted)',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid transparent',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} color={isActive ? '#818cf8' : 'currentColor'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Status Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.78rem',
          padding: '5px 12px',
          borderRadius: '9999px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          color: '#34d399',
          fontWeight: 500
        }}>
          <Sparkles size={13} color="#34d399" />
          Interactive Demo
        </div>
      </div>
    </header>
  );
}
