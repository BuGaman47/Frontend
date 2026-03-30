import { useEffect, useState, useCallback } from 'react'
import { useUsers } from '../hooks/useUsers'
import { useDepartmentStore } from '../store/departmentStore'
import { userService } from '../services/userService'
import UserTable from '../components/UserTable'
import SearchFilterBar from '../components/SearchFilterBar'
import Pagination from '../components/Pagination'
import UserFormModal from '../components/UserFormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import LoadingSpinner from '../components/LoadingSpinner'
import Toast from '../components/Toast'

export default function UsersPage() {
  const {
    users, pagination, loading, error, params,
    setSearchDebounced, setPage, setGender, setDepartmentId,
    setSort, setOrder, refresh,
  } = useUsers()

  const { fetchDepartments } = useDepartmentStore()
  useEffect(() => { fetchDepartments() }, [fetchDepartments])

  const [editUser, setEditUser]             = useState(null)
  const [deleteTarget, setDeleteTarget]     = useState(null)
  const [deleteLoading, setDeleteLoading]   = useState(false)
  const [toast, setToast]                   = useState(null) //แจ้งเตือนการแก้หรือลบผู้ใช้

  const showToast = (message, type = 'success') => setToast({ message, type })
  const hideToast = useCallback(() => setToast(null), [])

  const openCreate = () => { setEditUser(null); document.getElementById('user-modal')?.showModal() }
  const openEdit   = (u)  => { setEditUser(u);   document.getElementById('user-modal')?.showModal() }
  const openDelete = (u)  => { setDeleteTarget(u); document.getElementById('confirm-dialog')?.showModal() }

  const handleSuccess = () => {
    refresh()
    showToast(editUser ? `แก้ไข "${editUser.first_name} ${editUser.last_name}" สำเร็จ` : 'เพิ่มผู้ใช้สำเร็จ')
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await userService.remove(deleteTarget.id)
      document.getElementById('confirm-dialog')?.close()
      showToast(`ลบ "${deleteTarget.first_name} ${deleteTarget.last_name}" สำเร็จ`)
      setDeleteTarget(null)
      refresh()
    } catch (err) {
      showToast(err.response?.data?.message || 'ลบไม่สำเร็จ', 'error')
    } finally { setDeleteLoading(false) }
  }

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>
      {/* <Sidebar params={params} onGender={setGender} onDepartment={setDepartmentId} /> */}
      <main style={{ flex:1, overflowY:'auto', padding:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
          <h1 style={{ fontSize:'16px', fontWeight:600, color:'var(--txt)', letterSpacing:'-0.02em' }}>
            รายการผู้ใช้
          </h1>
          <button className="cd-btn cd-btn-primary" style={{ fontSize:'12px', padding:'5px 14px' }} onClick={openCreate}>
            + เพิ่มผู้ใช้
          </button>
        </div>

        <SearchFilterBar
          params={params}
          onSearch={setSearchDebounced}
          onSort={setSort}
          onOrder={setOrder}
          totalItems={pagination?.totalItems}
        />

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div style={{ background:'#fff0ef', border:'1px solid #fcd0cc', borderRadius:'8px', padding:'12px 16px', fontSize:'13px', color:'#c0392b', display:'flex', alignItems:'center', gap:'10px' }}>
            {error}
            <button className="cd-btn" style={{ marginLeft:'auto', fontSize:'12px' }} onClick={refresh}>ลองใหม่</button>
          </div>
        ) : (
          <div className="cd-fadein">
            <UserTable users={users} onEdit={openEdit} onDelete={openDelete} />
            <Pagination pagination={pagination} onPageChange={setPage} />
          </div>
        )}
      </main>

      <UserFormModal id="user-modal" editUser={editUser} onSuccess={handleSuccess} />
      <ConfirmDialog
        id="confirm-dialog"
        title="ยืนยันการลบ"
        message={deleteTarget ? `ต้องการลบ "${deleteTarget.first_name} ${deleteTarget.last_name}" ใช่หรือไม่?` : ''}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}