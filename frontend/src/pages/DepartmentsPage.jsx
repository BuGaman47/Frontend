import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { departmentService } from '../services/departmentService'
import LoadingSpinner from '../components/LoadingSpinner'
import GenderBadge from '../components/GenderBadge'

function DeptCard({ dept, isSelected, onClick }) {
  const ref = useRef()
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', `${(e.clientX-r.left)/r.width*100}%`)
    ref.current.style.setProperty('--my', `${(e.clientY-r.top)/r.height*100}%`)
  }
  return (
    <div ref={ref} className="apple-card" onMouseMove={move} onClick={onClick}
      style={{ cursor: 'pointer', padding: '20px', outline: isSelected ? '2px solid #0071e3' : 'none', outlineOffset: '2px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.01em' }}>
          {dept.id === 'null' ? '👤' : '🏢'} {dept.name}
        </h2>
        <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px', background: dept.id === 'null' ? 'rgba(255,59,48,0.08)' : 'rgba(0,113,227,0.08)', color: dept.id === 'null' ? '#ff3b30' : '#0071e3', whiteSpace: 'nowrap' }}>
          {dept.user_count} คน
        </span>
      </div>
      <p style={{ fontSize: '12px', color: '#aeaeb2' }}>คลิกเพื่อดูรายชื่อสมาชิก</p>
    </div>
  )
}

export default function DepartmentsPage() {
  const navigate = useNavigate()
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [deptDetail, setDeptDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState(null)

  useEffect(() => {
    setLoading(true)
    departmentService.getAll()
      .then(res => setDepartments(res.data.data))
      .catch(err => setError(err.response?.data?.message || 'โหลดข้อมูลไม่สำเร็จ'))
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = async (dept) => {
    if (selected?.id === dept.id) { setSelected(null); setDeptDetail(null); return }
    setSelected(dept)
    setDeptDetail(null)
    setDetailLoading(true)
    setDetailError(null)
    try {
      if (dept.id === 'null') {
        const res = await departmentService.getUsersWithoutDept()
        setDeptDetail({ ...dept, users: res.data.data.users })
      } else {
        const res = await departmentService.getById(dept.id)
        setDeptDetail(res.data.data)
      }
    } catch (err) {
      setDetailError(err.response?.data?.message || 'โหลดรายชื่อไม่สำเร็จ')
    } finally {
      setDetailLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <div style={{ color: '#ff3b30', fontSize: '14px' }}>{error}</div>

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.02em', marginBottom: '24px' }}>
        รายการแผนก
      </h1>

      {departments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', color: '#aeaeb2' }}>
          <p style={{ fontSize: '32px', marginBottom: '8px' }}>🏢</p>
          <p style={{ fontSize: '14px' }}>ไม่มีแผนก</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {departments.map(dept => (
            <DeptCard key={dept.id} dept={dept} isSelected={selected?.id === dept.id} onClick={() => handleSelect(dept)} />
          ))}
        </div>
      )}

      {selected && (
        <div style={{ marginTop: '24px' }}>
          <div className="apple-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                  {selected.id === 'null' ? '👤' : '🏢'} {selected.name}
                  <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px', background: selected.id === 'null' ? 'rgba(255,59,48,0.08)' : 'rgba(0,113,227,0.08)', color: selected.id === 'null' ? '#ff3b30' : '#0071e3', marginLeft: '10px' }}>
                    {selected.user_count} คน
                  </span>
                </h2>
                <p style={{ fontSize: '12px', color: '#aeaeb2' }}>
                  {selected.id === 'null' ? 'ผู้ใช้ที่ยังไม่ได้รับการกำหนดแผนก' : 'แสดงเฉพาะผู้ใช้ที่อยู่ในแผนกนี้ (INNER JOIN)'}
                </p>
              </div>
              <button className="apple-btn apple-btn-ghost" style={{ fontSize: '13px' }}
                onClick={() => { setSelected(null); setDeptDetail(null) }}>
                ✕ ปิด
              </button>
            </div>

            <hr className="apple-divider" style={{ margin: '16px 0' }} />

            {detailLoading ? (
              <LoadingSpinner text="กำลังโหลดรายชื่อ..." />
            ) : detailError ? (
              <div style={{ color: '#ff3b30', fontSize: '14px' }}>{detailError}</div>
            ) : deptDetail ? (
              deptDetail.users.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#aeaeb2' }}>
                  <p style={{ fontSize: '14px' }}>ไม่มีผู้ใช้ในแผนกนี้</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                        {['ID', 'ชื่อ – นามสกุล', 'อีเมล', 'อายุ', 'เพศ'].map(h => (
                          <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', color: '#aeaeb2', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {deptDetail.users.map(u => (
                        <tr key={u.id} onClick={() => navigate(`/users/${u.id}`)}
                          style={{ borderBottom: '0.5px solid rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f5f5f7'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '12px', color: '#aeaeb2', fontSize: '12px' }}>{u.id}</td>
                          <td style={{ padding: '12px', fontWeight: 500, color: '#1d1d1f' }}>{u.first_name} {u.last_name}</td>
                          <td style={{ padding: '12px', color: '#6e6e73' }}>{u.email}</td>
                          <td style={{ padding: '12px', color: '#6e6e73' }}>{u.age} ปี</td>
                          <td style={{ padding: '12px' }}><GenderBadge gender={u.gender} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}