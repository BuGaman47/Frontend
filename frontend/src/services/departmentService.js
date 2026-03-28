import api from './userService'

export const departmentService = {
  getAll: () => api.get('/departments'),
  getById: (id) => api.get(`/departments/${id}`),
  getUsersWithoutDept: () => api.get('/users', { params: { department_id: 'null', limit: 100 } }),
}