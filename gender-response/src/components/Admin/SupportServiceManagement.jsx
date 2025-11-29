import { useState, useEffect } from 'react'
import { apiService } from '../../services/apiService'
import './CRUD.css'

function SupportServiceManagement() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState(null)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      setLoading(true)
      const data = await apiService.supportServices.getAll()
      setServices(data)
      setError('')
    } catch (err) {
      setError('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return
    
    try {
      await apiService.supportServices.delete(id)
      setServices(services.filter(s => s.id !== id))
    } catch (err) {
      setError('Failed to delete service')
    }
  }

  const handleCreate = () => {
    setEditingService(null)
    setShowModal(true)
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setShowModal(true)
  }

  const handleSave = async (serviceData) => {
    try {
      if (editingService) {
        const updated = await apiService.supportServices.update(editingService.id, serviceData)
        setServices(services.map(s => s.id === updated.id ? updated : s))
      } else {
        const newService = await apiService.supportServices.create(serviceData)
        setServices([...services, newService])
      }
      setShowModal(false)
      setEditingService(null)
    } catch (err) {
      setError('Failed to save service')
    }
  }

  if (loading) return <div className="loading">Loading services...</div>

  return (
    <div>
      <div className="page-header">
        <h1>Support Service Management</h1>
        <button onClick={handleCreate} className="btn btn-primary">Add New Service</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="cards-grid">
        {services.length === 0 ? (
          <div className="text-center">No services found. Create your first service!</div>
        ) : (
          services.map(service => (
            <div key={service.id} className="card">
              <h3>{service.name}</h3>
              <p className="text-muted">{service.type}</p>
              <p>{service.description}</p>
              <p><strong>Contact:</strong> {service.contact}</p>
              <div className="card-actions">
                <button onClick={() => handleEdit(service)} className="btn btn-secondary btn-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(service.id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <ServiceModal
          service={editingService}
          onClose={() => {
            setShowModal(false)
            setEditingService(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function ServiceModal({ service, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    type: service?.type || 'counselling',
    description: service?.description || '',
    contact: service?.contact || '',
    availability: service?.availability || '24/7'
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.contact.trim()) newErrors.contact = 'Contact information is required'
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
          <h2>{service ? 'Edit Service' : 'Create Service'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Service Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="counselling">Counselling</option>
              <option value="shelter">Shelter</option>
              <option value="hotline">Hotline</option>
              <option value="medical">Medical Support</option>
              <option value="legal">Legal Aid</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Contact Information</label>
            <input
              type="text"
              className="form-input"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="Phone, email, or address"
            />
            {errors.contact && <span className="error-message">{errors.contact}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Availability</label>
            <input
              type="text"
              className="form-input"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              placeholder="e.g., 24/7, Mon-Fri 9am-5pm"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SupportServiceManagement

