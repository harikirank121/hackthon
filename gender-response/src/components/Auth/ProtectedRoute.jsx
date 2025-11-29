import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const roleRoutes = {
      admin: '/admin',
      victim: '/victim',
      counsellor: '/counsellor',
      legal: '/legal'
    }
    return <Navigate to={roleRoutes[user.role] || '/'} replace />
  }

  return children
}

export default ProtectedRoute

