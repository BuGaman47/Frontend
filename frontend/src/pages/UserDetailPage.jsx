import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useUser } from '../hooks/useUser'
import { useDepartmentStore } from '../store/departmentStore'
import { userService } from '../services/userService'
import UserDetail from '../components/UserDetail'
import UserFormModal from '../components/UserFormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import LoadingSpinner from '../components/LoadingSpinner'

export default function UserDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, loading, error } = useUser(id)
  const { fetchDepartments } = useDepartmentStore()
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => { fetchDepartments() }, [fetchDepartments])

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await userService.remove(id)
      document.getElementById('detail-confirm-dialog')?.close()
      navigate('/users')
    } catch (err) {
      alert(err.response?.data?.message || 'ลบไม่สำเร็จ')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button className="ap-btn" onClick={() => navigate(-1)}>← กลับ</button>
        {user && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="ap-btn" onClick={() => document.getElementById('detail-user-modal')?.showModal()}>
              แก้ไข
            </button>
            <button className="ap-btn danger" onClick={() => document.getElementById('detail-confirm-dialog')?.showModal()}>
              ลบ
            </button>
          </div>
        )}
      </div>

      {loading ? <LoadingSpinner /> : error ? (
        <div style={{ color: '#ff3b30', fontSize: '14px' }}>{error}</div>
      ) : user ? (
        <UserDetail user={user} />
      ) : null}

      {user && (
        <>
          <UserFormModal id="detail-user-modal" editUser={user} onSuccess={() => window.location.reload()} />
          <ConfirmDialog
            id="detail-confirm-dialog"
            title="ยืนยันการลบ"
            message={`ต้องการลบ "${user.first_name} ${user.last_name}" ใช่หรือไม่?`}
            onConfirm={handleDelete}
            loading={deleteLoading}
          />
        </>
      )}
    </div>
  )
}