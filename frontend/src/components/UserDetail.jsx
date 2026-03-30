import GenderBadge from './GenderBadge'
import DepartmentBadge from './DepartmentBadge'
import AddressBlock from './AddressBlock'

export default function UserDetail({ user }) {
  const fmt = dt => dt ? new Date(dt).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' }) : '–'
  return (
    <div className="apple-card" style={{ padding: '40px', maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.03em', marginBottom: '10px' }}>
            {user.first_name} {user.last_name}
          </h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <GenderBadge gender={user.gender} />
            <DepartmentBadge department={user.department} />
          </div>
        </div>
        <span style={{ fontSize: '12px', color: '#aeaeb2' }}>ID: {user.id}</span>
      </div>
      <hr className="apple-divider" style={{ marginBottom: '28px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '28px' }}>
        <div>
          <p style={{ fontSize: '11px', color: '#aeaeb2', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>ข้อมูลส่วนตัว</p>
          {[['อายุ', `${user.age} ปี`], ['อีเมล', user.email], ['เบอร์โทร', user.phone || '—'], ['แผนก', user.department?.name || '—']].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: '#aeaeb2', width: '68px', flexShrink: 0 }}>{l}</span>
              <span style={{ fontSize: '14px', color: '#1d1d1f' }}>{v}</span>
            </div>
          ))}
        </div>
        <div>
          <p style={{ fontSize: '11px', color: '#aeaeb2', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>ที่อยู่</p>
          <AddressBlock address={user.address} />
        </div>
      </div>
      <hr className="apple-divider" style={{ marginBottom: '16px' }} />
      <div style={{ display: 'flex', gap: '20px' }}>
        <span style={{ fontSize: '12px', color: '#aeaeb2' }}>สร้างเมื่อ: {fmt(user.created_at)}</span>
        <span style={{ fontSize: '12px', color: '#aeaeb2' }}>แก้ไขล่าสุด: {fmt(user.updated_at)}</span>
      </div>
    </div>
  )
}