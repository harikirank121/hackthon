import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Navbar from '../Shared/Navbar'
import { useAuth } from '../../context/AuthContext'
import { apiService } from '../../services/apiService'
import LegalResources from './LegalResources'
import LegalRequests from './LegalRequests'
import './LegalAdvisorDashboard.css'

function LegalAdvisorDashboard() {
  const { user } = useAuth()
  const location = useLocation()

  if (user?.role !== 'legal') {
    return <div className="loading">Access Denied</div>
  }

  return (
    <div className="legal-dashboard">
      <Navbar />
      <div className="container">
        <div className="dashboard-layout">
          <aside className="sidebar">
            <h3>Legal Advisor Panel</h3>
            <nav className="sidebar-nav">
              <Link to="/legal" className={location.pathname === '/legal' ? 'active' : ''}>
                Overview
              </Link>
              <Link to="/legal/resources" className={location.pathname.includes('/resources') ? 'active' : ''}>
                Legal Resources
              </Link>
              <Link to="/legal/requests" className={location.pathname.includes('/requests') ? 'active' : ''}>
                Legal Requests
              </Link>
            </nav>
          </aside>

          <main className="dashboard-content">
            <Routes>
              <Route path="/" element={<LegalOverview />} />
              <Route path="/resources" element={<LegalResources />} />
              <Route path="/requests" element={<LegalRequests />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}

function LegalOverview() {
  const [stats, setStats] = useState({
    resources: 0,
    requests: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [resources] = await Promise.all([
          apiService.legalResources.getAll()
        ])
        const requests = JSON.parse(localStorage.getItem('help_requests') || '[]')
        const legalRequests = requests.filter(r => r.type === 'legal')
        
        setStats({
          resources: resources.length,
          requests: legalRequests.length
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
      <h1>Legal Advisor Dashboard</h1>
      <p className="welcome-text">Manage legal resources and assist with legal requests.</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Legal Resources</h3>
          <p className="stat-number">{stats.resources}</p>
          <Link to="/legal/resources" className="btn btn-primary btn-sm">Manage Resources</Link>
        </div>
        <div className="stat-card">
          <h3>Legal Requests</h3>
          <p className="stat-number">{stats.requests}</p>
          <Link to="/legal/requests" className="btn btn-primary btn-sm">View Requests</Link>
        </div>
      </div>

      <div className="info-cards">
        <div className="card">
          <h3>Your Role</h3>
          <p>As a legal advisor, you provide legal advice, update legal resources, and assist with legal actions for victims and survivors.</p>
        </div>
        <div className="card">
          <h3>Responsibilities</h3>
          <ul>
            <li>Update legal resources and information</li>
            <li>Respond to legal help requests</li>
            <li>Provide legal guidance and advice</li>
            <li>Assist with legal procedures</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LegalAdvisorDashboard

