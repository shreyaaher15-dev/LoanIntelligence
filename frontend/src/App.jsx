import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Predict from './pages/Predict';
import About from './pages/About';

export default function App() {
  const [activeTab, setActiveTab] = useState('predict');

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="content-wrapper" style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 20px 60px 20px' }}>
        {activeTab === 'predict' && <Predict />}
        {activeTab === 'about' && <About />}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(11, 15, 25, 0.95)',
        padding: '22px 20px',
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <strong style={{ color: '#cbd5e1' }}>Loan Intelligence</strong> — College Mini-Project Demo
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <span>Interactive Demo</span>
            <span>•</span>
            <span style={{ color: '#fbbf24' }}>For Academic Demonstration</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
