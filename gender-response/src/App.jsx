import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Dashboard from './components/Dashboard/Dashboard'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import AdminDashboard from './components/Admin/AdminDashboard'
import VictimDashboard from './components/Victim/VictimDashboard'
import CounsellorDashboard from './components/Counsellor/CounsellorDashboard'
import LegalAdvisorDashboard from './components/LegalAdvisor/LegalAdvisorDashboard'
import './App.css'

function App() {
  console.log('App component rendering...')
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/victim/*" element={<ProtectedRoute requiredRole="victim"><VictimDashboard /></ProtectedRoute>} />
          <Route path="/counsellor/*" element={<ProtectedRoute requiredRole="counsellor"><CounsellorDashboard /></ProtectedRoute>} />
          <Route path="/legal/*" element={<ProtectedRoute requiredRole="legal"><LegalAdvisorDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

