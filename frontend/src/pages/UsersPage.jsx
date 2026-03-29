import { useEffect, useState } from 'react'
import { useUsers } from '../hooks/useUsers'
import { useDepartmentStore } from '../store/departmentStore'
import { userService } from '../services/userService'
import UserTable from '../components/UserTable'
import SearchFilterBar from '../components/SearchFilterBar'
import Pagination from '../components/Pagination'
import UserFormModal from '../components/UserFormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import LoadingSpinner from '../components/LoadingSpinner'

export default function UsersPage() {
  const {
    users, pagination, loading, error, params,
    setSearchDebounced, setPage, setGender, setDepartmentId,
    setSort, setOrder, refresh,
  } = useUsers()

  const { fetchDepartments } = useDepartmentStore()
  useEffect(() => { fetchDepartments() }, [fetchDepartments])

  const [editUser, setEditUser] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const openCreate = () => { setEditUser(null); document.getElementById('user-modal')?.showModal() }
  const openEdit = (user) => { setEditUser(user); document.getElementById('user-modal')?.showModal() }
  const openDelete = (user) => { setDeleteTarget(user); document.getElementById('confirm-dialog')?.showModal() }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await userService.remove(deleteTarget.id)
      document.getElementById('confirm-dialog')?.close()
      setDeleteTarget(null)
      refresh()
    } catch (err) {
      alert(err.response?.data?.message || 'ลบไม่สำเร็จ')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.02em' }}>
          รายการผู้ใช้
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {pagination && (
            <div style={{
              background: '#fff',
              borderRadius: '14px',
              border: '0.5px solid rgba(0,0,0,0.08)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)',
              padding: '10px 18px',
              textAlign: 'center',
              minWidth: '100px',
            }}>
              <div style={{ fontSize: '11px', color: '#aeaeb2', letterSpacing: '0.04em', marginBottom: '2px' }}>
                ผู้ใช้ทั้งหมด
              </div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {pagination.totalItems} <span style={{ fontSize: '13px', fontWeight: 400, color: '#aeaeb2' }}>คน</span>
              </div>
            </div>
          )}
          <button className="apple-btn apple-btn-primary" onClick={openCreate}>
            + เพิ่มผู้ใช้
          </button>
        </div>
      </div>

      {/* Filters */}
      <SearchFilterBar
        params={params}
        onSearch={setSearchDebounced}
        onGender={setGender}
        onDepartment={setDepartmentId}
        onSort={setSort}
        onOrder={setOrder}
      />

      {/* Content */}
      <div style={{
        background: '#fff',
        borderRadius: '18px',
        border: '0.5px solid rgba(0,0,0,0.08)',
        boxShadow: '0 7px 8px rgba(0,0,0,0.04)',
        padding: '20px',
      }}>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(255,59,48,0.06)', borderRadius: '12px' }}>
            <span style={{ color: '#ff3b30', fontSize: '14px' }}>{error}</span>
            <button className="apple-btn apple-btn-ghost" style={{ fontSize: '13px' }} onClick={refresh}>ลองใหม่</button>
          </div>
        ) : (
          <>
            <UserTable users={users} onEdit={openEdit} onDelete={openDelete} />
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>

      <UserFormModal id="user-modal" editUser={editUser} onSuccess={refresh} />
      <ConfirmDialog
        id="confirm-dialog"
        title="ยืนยันการลบ"
        message={deleteTarget ? `ต้องการลบ "${deleteTarget.first_name} ${deleteTarget.last_name}" ใช่หรือไม่?` : ''}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  )
}


/*
=========================================
📝 สรุปหลักการทำงานของหน้านี้ (UsersPage)
=========================================
หน้าจอหลักสำหรับ "จัดการข้อมูลผู้ใช้งานทั้งหมด" (User Management) ซึ่งเป็นศูนย์รวมคอมโพเนนต์ต่างๆ

1. แสดงรายการผู้ใช้ (Read & List):
   - นำข้อมูลที่ได้จาก Hook useUsers มาแสดงผลผ่านคอมโพเนนต์ UserTable
   - มีการแสดงจำนวนผู้ใช้งานทั้งหมดไว้ที่มุมขวาบน และมีระบบแบ่งหน้า (Pagination)
2. ค้นหาและกรองข้อมูล (Search & Filter):
   - มีแถบ SearchFilterBar ไว้ค้นหา/กรองข้อมูล 
   - ข้อมูลการกรองเชื่อมกับ URL Params ทำให้สามารถแชร์ลิงก์หน้าเว็บที่กรองแล้วได้
3. เพิ่มผู้ใช้ใหม่ (Create):
   - กดปุ่ม "+ เพิ่มผู้ใช้" จะเรียกป๊อปอัป UserFormModal ขึ้นมา (โหมดสร้างใหม่)
4. แก้ไขข้อมูลผู้ใช้ (Update):
   - กดปุ่ม "แก้ไข" จะเก็บข้อมูลพนักงานลง State editUser และเปิด UserFormModal (โหมดแก้ไข)
5. ลบผู้ใช้งาน (Delete):
   - กดปุ่ม "ลบ" จะเปิด ConfirmDialog หากกดยืนยันจะเรียก API ลบ และดึงข้อมูลใหม่ (Refresh)
*/