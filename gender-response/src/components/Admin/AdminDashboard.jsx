import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Navbar from '../Shared/Navbar'
import { useAuth } from '../../context/AuthContext'
import { apiService } from '../../services/apiService'
import UserManagement from './UserManagement'
import ResourceManagement from './ResourceManagement'
import SupportServiceManagement from './SupportServiceManagement'
import LegalResourceManagement from './LegalResourceManagement'
import DeploymentSection from './DeploymentSection';
import AdvancedFeaturesSection from './AdvancedFeaturesSection';
import './AdminDashboard.css'
import './DeploymentSection.css';
import './AdvancedFeaturesSection.css';

function AdminDashboard() {
  const { user } = useAuth()
  const location = useLocation()

  if (user?.role !== 'admin') {
    return <div className="loading">Access Denied</div>
  }

  return (
    <div className="admin-dashboard">
      <Navbar />
      <div className="container">
        <div className="dashboard-layout">
          <aside className="sidebar">
            <h3>Admin Panel</h3>
            <nav className="sidebar-nav">
              <Link to="/admin/users" className={location.pathname.includes('/users') ? 'active' : ''}>
                User Management
              </Link>
              <Link to="/admin/resources" className={location.pathname.includes('/resources') ? 'active' : ''}>
                Resources
              </Link>
              <Link to="/admin/services" className={location.pathname.includes('/services') ? 'active' : ''}>
                Support Services
              </Link>
              <Link to="/admin/legal" className={location.pathname.includes('/legal') ? 'active' : ''}>
                Legal Resources
              </Link>
            </nav>
          </aside>

          <main className="dashboard-content">
            <Routes>
              <Route path="/" element={<AdminOverview />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/resources" element={<ResourceManagement />} />
              <Route path="/services" element={<SupportServiceManagement />} />
              <Route path="/legal" element={<LegalResourceManagement />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}

function AdminOverview() {
  const [stats, setStats] = useState({
    users: 0,
    resources: 0,
    services: 0,
    legalResources: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [users, resources, services, legal] = await Promise.all([
          apiService.users.getAll(),
          apiService.resources.getAll(),
          apiService.supportServices.getAll(),
          apiService.legalResources.getAll()
        ])
        setStats({
          users: users.length,
          resources: resources.length,
          services: services.length,
          legalResources: legal.length
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
      <h1>Admin Dashboard</h1>
      <DeploymentSection />
      <AdvancedFeaturesSection />
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.users}</p>
        </div>
        <div className="stat-card">
          <h3>Resources</h3>
          <p className="stat-number">{stats.resources}</p>
        </div>
        <div className="stat-card">
          <h3>Support Services</h3>
          <p className="stat-number">{stats.services}</p>
        </div>
        <div className="stat-card">
          <h3>Legal Resources</h3>
          <p className="stat-number">{stats.legalResources}</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

