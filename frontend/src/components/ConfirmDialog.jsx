export default function ConfirmDialog({ id='confirm-dialog', title, message, onConfirm, loading=false }) {
  const close = () => document.getElementById(id)?.close()
  return (
    <dialog id={id} className="modal">
      <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '380px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 0.5px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#1d1d1f', marginBottom: '8px' }}>{title}</h3>
        <p style={{ fontSize: '14px', color: '#6e6e73', lineHeight: 1.5, marginBottom: '24px' }}>{message}</p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button className="apple-btn apple-btn-ghost" onClick={close} disabled={loading}>ยกเลิก</button>
          <button className="apple-btn apple-btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? '...' : 'ยืนยันการลบ'}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop"><button>close</button></form>
    </dialog>
  )
}