export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null
  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination
  const pages = Array.from({ length: totalPages }, (_, i) => i+1)
    .filter(p => p===1 || p===totalPages || Math.abs(p-currentPage)<=2)
  const items = []
  let prev = 0
  for (const p of pages) {
    if (p-prev>1) items.push('...')
    items.push(p)
    prev = p
  }
  const btnStyle = (active) => ({
    width: '32px', height: '32px', borderRadius: '8px', border: 'none',
    fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
    background: active ? '#0071e3' : 'rgba(0,0,0,0.05)',
    color: active ? '#fff' : '#1d1d1f',
    transition: 'all 0.15s',
  })
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
      <span style={{ fontSize: '13px', color: '#aeaeb2' }}>
        {Math.min((currentPage-1)*itemsPerPage+1,totalItems)}–{Math.min(currentPage*itemsPerPage,totalItems)} จาก {totalItems}
      </span>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <button style={btnStyle(false)} disabled={currentPage<=1} onClick={() => onPageChange(currentPage-1)}>‹</button>
        {items.map((item,i) => item==='...'
          ? <span key={i} style={{ color: '#aeaeb2', fontSize: '14px', padding: '0 4px' }}>…</span>
          : <button key={item} style={btnStyle(item===currentPage)} onClick={() => onPageChange(item)}>{item}</button>
        )}
        <button style={btnStyle(false)} disabled={currentPage>=totalPages} onClick={() => onPageChange(currentPage+1)}>›</button>
      </div>
    </div>
  )
}