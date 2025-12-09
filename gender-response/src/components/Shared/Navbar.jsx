import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getRoleRoute = () => {
    const routes = {
      admin: '/admin',
      victim: '/victim',
      counsellor: '/counsellor',
      legal: '/legal'
    }
    return routes[user?.role] || '/'
  }

  const getRoleName = () => {
    const names = {
      admin: 'Admin',
      victim: 'Victim/Survivor',
      counsellor: 'Counsellor',
      legal: 'Legal Advisor'
    }
    return names[user?.role] || 'User'
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={getRoleRoute()} className="navbar-brand">
          <h2>SANJAYA OS</h2>
        </Link>
        
        <div className="navbar-menu">
          <div className="navbar-user">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{getRoleName()}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

