import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Navbar from '../Shared/Navbar'
import { useAuth } from '../../context/AuthContext'
import HelpRequests from './HelpRequests'
import './CounsellorDashboard.css'

function CounsellorDashboard() {
  const { user } = useAuth()
  const location = useLocation()

  if (user?.role !== 'counsellor') {
    return <div className="loading">Access Denied</div>
  }

  return (
    <div className="counsellor-dashboard">
      <Navbar />
      <div className="container">
        <div className="dashboard-layout">
          <aside className="sidebar">
            <h3>Counsellor Panel</h3>
            <nav className="sidebar-nav">
              <Link to="/counsellor" className={location.pathname === '/counsellor' ? 'active' : ''}>
                Overview
              </Link>
              <Link to="/counsellor/requests" className={location.pathname.includes('/requests') ? 'active' : ''}>
                Help Requests
              </Link>
            </nav>
          </aside>

          <main className="dashboard-content">
            <Routes>
              <Route path="/" element={<CounsellorOverview />} />
              <Route path="/requests" element={<HelpRequests />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}

function CounsellorOverview() {
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = () => {
      try {
        const requests = JSON.parse(localStorage.getItem('help_requests') || '[]')
        setStats({
          pending: requests.filter(r => r.status === 'pending').length,
          inProgress: requests.filter(r => r.status === 'in_progress').length,
          completed: requests.filter(r => r.status === 'completed').length
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div>
      <h1>Counsellor Dashboard</h1>
      <p className="welcome-text">Monitor and manage help requests from victims and survivors.</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Pending Requests</h3>
          <p className="stat-number">{stats.pending}</p>
          <Link to="/counsellor/requests" className="btn btn-primary btn-sm">View Requests</Link>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p className="stat-number">{stats.inProgress}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number">{stats.completed}</p>
        </div>
      </div>

      <div className="info-cards">
        <div className="card">
          <h3>Your Role</h3>
          <p>As a counsellor, you provide emotional support, guidance, and monitor the progress of those seeking help.</p>
        </div>
        <div className="card">
          <h3>Best Practices</h3>
          <ul>
            <li>Respond to requests promptly</li>
            <li>Maintain confidentiality</li>
            <li>Update request status regularly</li>
            <li>Provide compassionate support</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CounsellorDashboard

