const MAP = {
  male:        { label: 'ชาย',    bg: 'rgba(0,122,255,0.1)',  color: '#0071e3' },
  female:      { label: 'หญิง',   bg: 'rgba(255,45,85,0.1)',  color: '#ff2d55' },
  unspecified: { label: 'ไม่ระบุ', bg: 'rgba(0,0,0,0.06)',    color: '#6e6e73' },
}
export default function GenderBadge({ gender }) {
  const g = MAP[gender] || MAP.unspecified
  return (
    <span className="apple-badge" style={{ background: g.bg, color: g.color }}>
      {g.label}
    </span>
  )
}