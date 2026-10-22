import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Predict from './pages/Predict';
import ModelResults from './pages/ModelResults';
import WarehouseAnalytics from './pages/WarehouseAnalytics';
import About from './pages/About';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="content-wrapper">
        {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
        {activeTab === 'predict' && <Predict />}
        {activeTab === 'model' && <ModelResults />}
        {activeTab === 'warehouse' && <WarehouseAnalytics />}
        {activeTab === 'about' && <About />}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(11, 15, 25, 0.95)',
        padding: '24px 20px',
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong style={{ color: '#cbd5e1' }}>Loan Intelligence Platform</strong> — Academic Student Mini-Project
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Architecture: React + FastAPI + SQLite Star Schema</span>
            <span>•</span>
            <span>Model: Random Forest Pipeline (98.24% Acc)</span>
            <span>•</span>
            <span style={{ color: '#fbbf24' }}>Educational Use Only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
