import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Dashboard.css'

function Dashboard() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect to role-specific dashboard
        const roleRoutes = {
          admin: '/admin',
          victim: '/victim',
          counsellor: '/counsellor',
          legal: '/legal'
        }
        const route = roleRoutes[user.role] || '/victim'
        navigate(route, { replace: true })
      } else {
        // No user, redirect to login
        navigate('/login', { replace: true })
      }
    }
  }, [user, loading, navigate])

  return <div className="loading">Loading...</div>
}

export default Dashboard

