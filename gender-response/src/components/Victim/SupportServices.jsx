import { useState, useEffect } from 'react'
import { apiService } from '../../services/apiService'
import './SupportServices.css'

function SupportServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

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
      setError('Failed to load support services')
    } finally {
      setLoading(false)
    }
  }

  const filteredServices = filter === 'all' 
    ? services 
    : services.filter(s => s.type === filter)

  if (loading) return <div className="loading">Loading support services...</div>

  return (
    <div>
      <h1>Support Services</h1>
      <p className="subtitle">Connect with organizations and professionals who can help</p>
      
      <div className="filter-tabs">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All Services
        </button>
        <button 
          className={filter === 'counselling' ? 'active' : ''} 
          onClick={() => setFilter('counselling')}
        >
          Counselling
        </button>
        <button 
          className={filter === 'shelter' ? 'active' : ''} 
          onClick={() => setFilter('shelter')}
        >
          Shelter
        </button>
        <button 
          className={filter === 'hotline' ? 'active' : ''} 
          onClick={() => setFilter('hotline')}
        >
          Hotline
        </button>
        <button 
          className={filter === 'medical' ? 'active' : ''} 
          onClick={() => setFilter('medical')}
        >
          Medical
        </button>
        <button 
          className={filter === 'legal' ? 'active' : ''} 
          onClick={() => setFilter('legal')}
        >
          Legal Aid
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="services-grid">
        {filteredServices.length === 0 ? (
          <div className="text-center">No services found in this category.</div>
        ) : (
          filteredServices.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-type">{service.type}</div>
              <h3>{service.name}</h3>
              <p className="service-description">{service.description}</p>
              <div className="service-info">
                <div className="info-item">
                  <strong>Contact:</strong> {service.contact}
                </div>
                {service.availability && (
                  <div className="info-item">
                    <strong>Availability:</strong> {service.availability}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SupportServices

