import { useState, useEffect } from 'react'
import { apiService } from '../../services/apiService'
import './CRUD.css'

function ResourceManagement() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingResource, setEditingResource] = useState(null)

  useEffect(() => {
    loadResources()
  }, [])

  const loadResources = async () => {
    try {
      setLoading(true)
      const data = await apiService.resources.getAll()
      setResources(data)
      setError('')
    } catch (err) {
      setError('Failed to load resources')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return
    
    try {
      await apiService.resources.delete(id)
      setResources(resources.filter(r => r.id !== id))
    } catch (err) {
      setError('Failed to delete resource')
    }
  }

  const handleCreate = () => {
    setEditingResource(null)
    setShowModal(true)
  }

  const handleEdit = (resource) => {
    setEditingResource(resource)
    setShowModal(true)
  }

  const handleSave = async (resourceData) => {
    try {
      if (editingResource) {
        const updated = await apiService.resources.update(editingResource.id, resourceData)
        setResources(resources.map(r => r.id === updated.id ? updated : r))
      } else {
        const newResource = await apiService.resources.create(resourceData)
        setResources([...resources, newResource])
      }
      setShowModal(false)
      setEditingResource(null)
    } catch (err) {
      setError('Failed to save resource')
    }
  }

  if (loading) return <div className="loading">Loading resources...</div>

  return (
    <div>
      <div className="page-header">
        <h1>Resource Management</h1>
        <button onClick={handleCreate} className="btn btn-primary">Add New Resource</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="cards-grid">
        {resources.length === 0 ? (
          <div className="text-center">No resources found. Create your first resource!</div>
        ) : (
          resources.map(resource => (
            <div key={resource.id} className="card">
              <h3>{resource.title}</h3>
              <p className="text-muted">{resource.category}</p>
              <p>{resource.description}</p>
              <div className="card-actions">
                <button onClick={() => handleEdit(resource)} className="btn btn-secondary btn-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(resource.id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <ResourceModal
          resource={editingResource}
          onClose={() => {
            setShowModal(false)
            setEditingResource(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function ResourceModal({ resource, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: resource?.title || '',
    description: resource?.description || '',
    category: resource?.category || 'general',
    content: resource?.content || ''
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.content.trim()) newErrors.content = 'Content is required'
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
          <h2>{resource ? 'Edit Resource' : 'Create Resource'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="general">General</option>
              <option value="legal">Legal Rights</option>
              <option value="health">Health & Safety</option>
              <option value="support">Support Services</option>
              <option value="emergency">Emergency Help</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-input"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              className="form-textarea"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
            {errors.content && <span className="error-message">{errors.content}</span>}
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

export default ResourceManagement

