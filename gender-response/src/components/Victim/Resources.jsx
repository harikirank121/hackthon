import { useState, useEffect } from 'react'
import { apiService } from '../../services/apiService'
import './Resources.css'

function Resources() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

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

  const filteredResources = filter === 'all' 
    ? resources 
    : resources.filter(r => r.category === filter)

  if (loading) return <div className="loading">Loading resources...</div>

  return (
    <div>
      <h1>Resources & Information</h1>
      
      <div className="filter-tabs">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={filter === 'legal' ? 'active' : ''} 
          onClick={() => setFilter('legal')}
        >
          Legal Rights
        </button>
        <button 
          className={filter === 'health' ? 'active' : ''} 
          onClick={() => setFilter('health')}
        >
          Health & Safety
        </button>
        <button 
          className={filter === 'support' ? 'active' : ''} 
          onClick={() => setFilter('support')}
        >
          Support
        </button>
        <button 
          className={filter === 'emergency' ? 'active' : ''} 
          onClick={() => setFilter('emergency')}
        >
          Emergency
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="resources-grid">
        {filteredResources.length === 0 ? (
          <div className="text-center">No resources found in this category.</div>
        ) : (
          filteredResources.map(resource => (
            <div key={resource.id} className="resource-card">
              <div className="resource-category">{resource.category}</div>
              <h3>{resource.title}</h3>
              <p className="resource-description">{resource.description}</p>
              <div className="resource-content">
                {resource.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Resources

