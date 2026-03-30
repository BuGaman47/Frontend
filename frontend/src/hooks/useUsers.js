import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { userService } from '../services/userService'

export function useUsers() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const debounceRef = useRef(null)

  // ── read from URL ─────────────────────────────────────────────
  const page          = parseInt(searchParams.get('page')          || '1')
  const search        = searchParams.get('search')        || ''
  const gender        = searchParams.get('gender')        || ''
  const department_id = searchParams.get('department_id') || ''
  const sort          = searchParams.get('sort')          || 'u.id'
  const order         = searchParams.get('order')         || 'asc'

  // ── fetch ─────────────────────────────────────────────────────
  const fetchUsers = useCallback(async (params) => {
    setLoading(true)
    setError(null)
    try {
      // strip empty values so backend doesn't get empty strings
      const clean = { limit: 10 }
      if (params.page)          clean.page          = params.page
      if (params.search)        clean.search        = params.search
      if (params.gender)        clean.gender        = params.gender
      if (params.department_id) clean.department_id = params.department_id
      if (params.sort)          clean.sort          = params.sort
      if (params.order)         clean.order         = params.order

      const res = await userService.getAll(clean)
      setUsers(res.data.data.users)
      setPagination(res.data.data.pagination)
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers({ page, search, gender, department_id, sort, order })
  }, [page, search, gender, department_id, sort, order, fetchUsers])

  // ── helpers ───────────────────────────────────────────────────
  const updateParam = (key, value, resetPage = true) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value)
      else       next.delete(key)
      if (resetPage) next.set('page', '1')
      return next
    })
  }

  const setSearchDebounced = (value) => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => updateParam('search', value), 300)
  }

  return {
    users, pagination, loading, error,
    params: { page, search, gender, department_id, sort, order },
    setSearchDebounced,
    setPage:         (p) => updateParam('page',          p,     false),
    setGender:       (v) => updateParam('gender',        v),
    setDepartmentId: (v) => updateParam('department_id', v),
    setSort:         (v) => updateParam('sort',          v),
    setOrder:        (v) => updateParam('order',         v),
    refresh: () => fetchUsers({ page, search, gender, department_id, sort, order }),
  }
}
