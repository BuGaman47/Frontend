export default function DepartmentBadge({ department }) {
  if (!department) return (
    <span className="apple-badge" style={{ background: 'rgba(0,0,0,0.04)', color: '#aeaeb2' }}>
      ไม่มีแผนก
    </span>
  )
  return (
    <span className="apple-badge" style={{ background: 'rgba(0,113,227,0.08)', color: '#0071e3' }}>
      {department.name}
    </span>
  )
}