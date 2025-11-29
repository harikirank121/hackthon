import { useState, useEffect } from 'react'
import { apiService } from '../../services/apiService'
import './CRUD.css'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await apiService.users.getAll()
      setUsers(data)
      setError('')
    } catch (err) {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    
    try {
      await apiService.users.delete(id)
      setUsers(users.filter(u => u.id !== id))
    } catch (err) {
      setError('Failed to delete user')
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setShowModal(true)
  }

  const handleUpdate = async (updatedData) => {
    try {
      const updated = await apiService.users.update(editingUser.id, updatedData)
      setUsers(users.map(u => u.id === updated.id ? updated : u))
      setShowModal(false)
      setEditingUser(null)
    } catch (err) {
      setError('Failed to update user')
    }
  }

  if (loading) return <div className="loading">Loading users...</div>

  return (
    <div>
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage user accounts and roles</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No users found</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(user)} className="btn btn-secondary btn-sm">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <EditUserModal
          user={editingUser}
          onClose={() => {
            setShowModal(false)
            setEditingUser(null)
          }}
          onSave={handleUpdate}
        />
      )}
    </div>
  )
}

function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSave(formData)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit User</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="victim">Victim/Survivor</option>
              <option value="counsellor">Counsellor</option>
              <option value="legal">Legal Advisor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserManagement

