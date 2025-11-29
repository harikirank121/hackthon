import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Navbar from '../Shared/Navbar'
import { useAuth } from '../../context/AuthContext'
import { apiService } from '../../services/apiService'
import Resources from './Resources'
import SupportServices from './SupportServices'
import HelpRequest from './HelpRequest'
import './VictimDashboard.css'

function VictimDashboard() {
  const { user } = useAuth()
  const location = useLocation()

  if (user?.role !== 'victim') {
    return <div className="loading">Access Denied</div>
  }

  return (
    <div className="victim-dashboard">
      <Navbar />
      <div className="container">
        <div className="dashboard-layout">
          <aside className="sidebar">
            <h3>Support Center</h3>
            <nav className="sidebar-nav">
              <Link to="/victim" className={location.pathname === '/victim' ? 'active' : ''}>
                Overview
              </Link>
              <Link to="/victim/resources" className={location.pathname.includes('/resources') ? 'active' : ''}>
                Resources
              </Link>
              <Link to="/victim/services" className={location.pathname.includes('/services') ? 'active' : ''}>
                Support Services
              </Link>
              <Link to="/victim/help" className={location.pathname.includes('/help') ? 'active' : ''}>
                Request Help
              </Link>
            </nav>
          </aside>

          <main className="dashboard-content">
            <Routes>
              <Route path="/" element={<VictimOverview />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/services" element={<SupportServices />} />
              <Route path="/help" element={<HelpRequest />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}

function VictimOverview() {
  const [stats, setStats] = useState({
    resources: 0,
    services: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [resources, services] = await Promise.all([
          apiService.resources.getAll(),
          apiService.supportServices.getAll()
        ])
        setStats({
          resources: resources.length,
          services: services.length
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
      <h1>Welcome to Your Support Center</h1>
      <p className="welcome-text">You are not alone. We're here to help you access resources and support services.</p>
      
      <div className="emergency-banner">
        <h3>🚨 Emergency Help</h3>
        <p>If you're in immediate danger, call emergency services: <strong>911</strong></p>
        <p>National Domestic Violence Hotline: <strong>1-800-799-7233</strong></p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Available Resources</h3>
          <p className="stat-number">{stats.resources}</p>
          <Link to="/victim/resources" className="btn btn-primary btn-sm">View Resources</Link>
        </div>
        <div className="stat-card">
          <h3>Support Services</h3>
          <p className="stat-number">{stats.services}</p>
          <Link to="/victim/services" className="btn btn-primary btn-sm">View Services</Link>
        </div>
      </div>

      <div className="info-cards">
        <div className="card">
          <h3>Your Rights</h3>
          <p>You have the right to live free from violence and abuse. Learn about your legal rights and protections available to you.</p>
          <Link to="/victim/resources" className="btn btn-outline">Learn More</Link>
        </div>
        <div className="card">
          <h3>Get Help</h3>
          <p>Connect with counsellors, legal advisors, and support services. You don't have to face this alone.</p>
          <Link to="/victim/help" className="btn btn-outline">Request Help</Link>
        </div>
        <div className="card">
          <h3>Health & Safety</h3>
          <p>Access information about health risks, safety planning, and resources to protect yourself and your family.</p>
          <Link to="/victim/resources" className="btn btn-outline">Learn More</Link>
        </div>
      </div>
    </div>
  )
}

export default VictimDashboard

