import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav style={{
      background: 'rgba(255,255,255,0.72)',
      backdropFilter: 'saturate(180%) blur(20px)',
      WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      borderBottom: '0.5px solid rgba(0,0,0,0.1)',
      padding: '0 24px',
      height: '52px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <span style={{ fontSize: '17px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.02em' }}>
        UserMS
      </span>
      <div style={{ display: 'flex', gap: '2px', background: 'rgba(0,0,0,0.06)', borderRadius: '10px', padding: '3px' }}>
        {[{ to: '/users', label: 'ผู้ใช้' }, { to: '/departments', label: 'แผนก' }].map(({ to, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            padding: '5px 18px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
            color: isActive ? '#1d1d1f' : '#6e6e73',
            background: isActive ? '#fff' : 'transparent',
            boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1), 0 0 0 0.5px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.15s',
          })}>
            {label}
          </NavLink>
        ))}
      </div>
      <div style={{ width: '80px' }} />
    </nav>
  )
}