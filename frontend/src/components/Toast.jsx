import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500)
    return () => clearTimeout(t)
  }, [onClose])

  const colors = {
    success: { bg:'#f0fdf4', border:'#bbf7d0', color:'#15803d', icon:'✓' },
    error:   { bg:'#fff0ef', border:'#fcd0cc', color:'#c0392b', icon:'✕' },
  }
  const c = colors[type] || colors.success

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
      background: c.bg, border: `1px solid ${c.border}`, borderRadius: '8px',
      padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px',
      fontSize: '13px', color: c.color, fontWeight: 500,
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      animation: 'fadeIn 0.18s ease',
    }}>
      <span style={{ fontWeight: 700 }}>{c.icon}</span>
      {message}
    </div>
  )
}
