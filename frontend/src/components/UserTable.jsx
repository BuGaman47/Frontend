import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import GenderBadge from './GenderBadge'
import DepartmentBadge from './DepartmentBadge'

function AppleCard({ children, onClick }) {
  const ref = useRef()
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', `${(e.clientX-r.left)/r.width*100}%`)
    ref.current.style.setProperty('--my', `${(e.clientY-r.top)/r.height*100}%`)
  }
  return (
    <div ref={ref} className="apple-card" onMouseMove={move} onClick={onClick}
      style={{ cursor: 'pointer', padding: '20px' }}>
      {children}
    </div>
  )
}

export default function UserTable({ users, onEdit, onDelete }) {
  const navigate = useNavigate()
  if (users.length === 0) return (
    <div style={{ textAlign: 'center', padding: '64px', color: '#aeaeb2' }}>
      <p style={{ fontSize: '32px', marginBottom: '8px' }}>—</p>
      <p style={{ fontSize: '14px' }}>ไม่พบข้อมูล</p>
    </div>
  )
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '12px' }}>
      {users.map(u => (
        <AppleCard key={u.id} onClick={() => navigate(`/users/${u.id}`)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: '#aeaeb2', fontVariantNumeric: 'tabular-nums' }}>
              {String(u.id).padStart(3,'0')}
            </span>
            <GenderBadge gender={u.gender} />
          </div>
          <div style={{ fontSize: '17px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.02em', marginBottom: '2px' }}>
            {u.first_name} {u.last_name}
          </div>
          <div style={{ fontSize: '13px', color: '#aeaeb2', marginBottom: '14px' }}>{u.age} ปี</div>
          <div style={{ fontSize: '13px', color: '#6e6e73', marginBottom: '2px' }}>{u.email}</div>
          <div style={{ fontSize: '12px', color: '#aeaeb2', marginBottom: '14px' }}>{u.phone || '—'}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <DepartmentBadge department={u.department} />
            <span style={{ fontSize: '12px', color: '#aeaeb2' }}>{u.address?.province || '—'}</span>
          </div>
          <hr className="apple-divider" />
          <div style={{ paddingTop: '12px', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}
            onClick={e => e.stopPropagation()}>
            <button className="apple-btn apple-btn-ghost" style={{ fontSize: '13px', padding: '5px 14px' }}
              onClick={() => onEdit(u)}>แก้ไข</button>
            <button className="apple-btn apple-btn-danger" style={{ fontSize: '13px', padding: '5px 14px' }}
              onClick={() => onDelete(u)}>ลบ</button>
          </div>
        </AppleCard>
      ))}
    </div>
  )
}