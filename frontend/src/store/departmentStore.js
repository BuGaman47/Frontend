import { create } from 'zustand'
import { departmentService } from '../services/departmentService'

export const useDepartmentStore = create((set, get) => ({
  departments: [],
  loading: false,
  error: null,

  fetchDepartments: async () => {
    // simple in-memory cache — re-fetch only when empty
    if (get().departments.length > 0) return
    set({ loading: true, error: null })
    try {
      const res = await departmentService.getAll()
      set({ departments: res.data.data, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  // call after CRUD that may affect counts
  invalidate: () => set({ departments: [] }),
}))
