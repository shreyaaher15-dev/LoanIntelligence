import React from 'react';

export default function MetricCard({ 
  label, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = 'indigo',
  mono = true 
}) {
  const colorMap = {
    indigo: {
      border: 'rgba(99, 102, 241, 0.25)',
      bgIcon: 'rgba(99, 102, 241, 0.12)',
      textIcon: '#818cf8',
      glow: 'rgba(99, 102, 241, 0.15)'
    },
    emerald: {
      border: 'rgba(16, 185, 129, 0.25)',
      bgIcon: 'rgba(16, 185, 129, 0.12)',
      textIcon: '#34d399',
      glow: 'rgba(16, 185, 129, 0.15)'
    },
    rose: {
      border: 'rgba(244, 63, 94, 0.25)',
      bgIcon: 'rgba(244, 63, 94, 0.12)',
      textIcon: '#fb7185',
      glow: 'rgba(244, 63, 94, 0.15)'
    },
    cyan: {
      border: 'rgba(6, 182, 212, 0.25)',
      bgIcon: 'rgba(6, 182, 212, 0.12)',
      textIcon: '#38bdf8',
      glow: 'rgba(6, 182, 212, 0.15)'
    },
    amber: {
      border: 'rgba(245, 158, 11, 0.25)',
      bgIcon: 'rgba(245, 158, 11, 0.12)',
      textIcon: '#fbbf24',
      glow: 'rgba(245, 158, 11, 0.15)'
    }
  };

  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className="glass-panel" style={{
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      border: `1px solid ${c.border}`,
      boxShadow: `0 8px 24px ${c.glow}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </span>
        {Icon && (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: c.bgIcon,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: c.textIcon
          }}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className={mono ? 'mono-number' : ''} style={{
        fontSize: '1.75rem',
        fontWeight: 800,
        color: '#ffffff',
        letterSpacing: '-0.03em',
        lineHeight: 1.1,
        marginBottom: '6px'
      }}>
        {value}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {subtitle && (
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            {subtitle}
          </span>
        )}
        {trend && (
          <span style={{
            fontSize: '0.74rem',
            fontWeight: 600,
            color: trend.isPositive ? '#34d399' : '#fb7185',
            background: trend.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            {trend.text}
          </span>
        )}
      </div>
    </div>
  );
}
