import { useRef, useEffect } from 'react'
import { useDepartmentStore } from '../store/departmentStore'

const SORT_OPTIONS = [
  { value: 'u.id',         label: 'ID' },
  { value: 'u.created_at', label: 'วันที่สร้าง' },
  { value: 'u.first_name', label: 'ชื่อ' },
  { value: 'u.last_name',  label: 'นามสกุล' },
  { value: 'u.age',        label: 'อายุ' },
  { value: 'd.name',       label: 'แผนก' },
]

export default function SearchFilterBar({ params, onSearch, onGender, onDepartment, onSort, onOrder }) {
  const { departments } = useDepartmentStore()
  const inputRef = useRef()

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== params.search)
      inputRef.current.value = params.search
  }, [params.search])

  return (
    <div style={{
      background: '#fff',
      borderRadius: '14px',
      border: '0.5px solid rgba(0,0,0,0.08)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      padding: '12px 16px',
      marginBottom: '16px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      alignItems: 'center',
    }}>
      <input
        ref={inputRef}
        type="text"
        defaultValue={params.search}
        placeholder="ค้นหา ชื่อ, อีเมล..."
        className="apple-input"
        style={{ flex: '1', minWidth: '200px' }}
        onChange={(e) => onSearch(e.target.value)}
      />
      {[
        { val: params.gender, fn: onGender, opts: [['','เพศทั้งหมด'],['male','ชาย'],['female','หญิง'],['unspecified','ไม่ระบุ']] },
        { val: params.department_id, fn: onDepartment, opts: [['','แผนกทั้งหมด'],['null','ไม่มีแผนก'], ...departments.filter(d=>d.id!=='null').map(d=>[d.id,d.name])] },
        { val: params.sort, fn: onSort, opts: SORT_OPTIONS.map(o=>[o.value,o.label]) },
        { val: params.order, fn: onOrder, opts: [['asc','น้อย → มาก'],['desc','มาก → น้อย']] },
      ].map((s, i) => (
        <select key={i} className="apple-input" style={{ width: 'auto', flex: 'none' }}
          value={s.val} onChange={e => s.fn(e.target.value)}>
          {s.opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      ))}
    </div>
  )
}