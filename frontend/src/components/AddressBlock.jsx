export default function AddressBlock({ address }) {
  if (!address) return (
    <span style={{ fontSize: '14px', color: '#aeaeb2', fontStyle: 'italic' }}>ไม่มีที่อยู่</span>
  )
  return (
    <div style={{ background: '#f5f5f7', borderRadius: '12px', padding: '14px 16px', border: '0.5px solid rgba(0,0,0,0.06)' }}>
      <p style={{ fontSize: '14px', color: '#1d1d1f', marginBottom: '4px' }}>
        {address.house_no}{address.street ? ` ${address.street}` : ''}
      </p>
      <p style={{ fontSize: '13px', color: '#6e6e73' }}>
        {address.district}, {address.province} {address.postal_code}
      </p>
    </div>
  )
}