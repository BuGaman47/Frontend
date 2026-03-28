import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
})

export const userService = {
  // params: { page, limit, search, gender, department_id, sort, order }
  getAll: (params) => api.get('/users', { params }),

  getById: (id) => api.get(`/users/${id}`),

  // data: { first_name, last_name, age, gender, email, phone, department_id, address }
  create: (data) => api.post('/users', data),

  // address: null → ลบที่อยู่ออก
  update: (id, data) => api.put(`/users/${id}`, data),

  remove: (id) => api.delete(`/users/${id}`),
}

export default api
