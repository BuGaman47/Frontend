import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import UsersPage from './pages/UsersPage'
import UserDetailPage from './pages/UserDetailPage'
import DepartmentsPage from './pages/DepartmentsPage'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
        </Routes>
      </div>
    </div>
  )
}