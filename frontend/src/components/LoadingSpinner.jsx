export default function LoadingSpinner({ text = 'กำลังโหลด...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px', gap: '12px' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2.5px solid rgba(0,113,227,0.15)', borderTopColor: '#0071e3', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ fontSize: '14px', color: '#aeaeb2' }}>{text}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}