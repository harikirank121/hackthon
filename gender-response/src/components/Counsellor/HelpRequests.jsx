import { useState, useEffect } from 'react'
import './HelpRequests.css'

function HelpRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = () => {
    try {
      const data = JSON.parse(localStorage.getItem('help_requests') || '[]')
      setRequests(data)
    } catch (error) {
      console.error('Error loading requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = (id, newStatus) => {
    const updated = requests.map(r => 
      r.id === id ? { ...r, status: newStatus } : r
    )
    setRequests(updated)
    localStorage.setItem('help_requests', JSON.stringify(updated))
  }

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter)

  if (loading) return <div className="loading">Loading help requests...</div>

  return (
    <div>
      <h1>Help Requests</h1>
      
      <div className="filter-tabs">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All ({requests.length})
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''} 
          onClick={() => setFilter('pending')}
        >
          Pending ({requests.filter(r => r.status === 'pending').length})
        </button>
        <button 
          className={filter === 'in_progress' ? 'active' : ''} 
          onClick={() => setFilter('in_progress')}
        >
          In Progress ({requests.filter(r => r.status === 'in_progress').length})
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''} 
          onClick={() => setFilter('completed')}
        >
          Completed ({requests.filter(r => r.status === 'completed').length})
        </button>
      </div>

      <div className="requests-list">
        {filteredRequests.length === 0 ? (
          <div className="text-center">No help requests found.</div>
        ) : (
          filteredRequests.map(request => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <div>
                  <h3>{request.userName}</h3>
                  <p className="request-meta">
                    {new Date(request.createdAt).toLocaleDateString()} • 
                    <span className={`status-badge status-${request.status}`}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </p>
                </div>
                <div className="request-type">{request.type}</div>
              </div>
              
              <div className="request-body">
                <div className={`urgency-badge urgency-${request.urgency}`}>
                  Urgency: {request.urgency}
                </div>
                <p className="request-description">{request.description}</p>
                <div className="request-contact">
                  <strong>Contact:</strong> {request.preferredContact}
                  {request.preferredTime && (
                    <span> • Preferred time: {request.preferredTime}</span>
                  )}
                </div>
              </div>

              <div className="request-actions">
                {request.status === 'pending' && (
                  <button 
                    onClick={() => updateRequestStatus(request.id, 'in_progress')}
                    className="btn btn-primary btn-sm"
                  >
                    Start Helping
                  </button>
                )}
                {request.status === 'in_progress' && (
                  <button 
                    onClick={() => updateRequestStatus(request.id, 'completed')}
                    className="btn btn-success btn-sm"
                  >
                    Mark Complete
                  </button>
                )}
                {request.status !== 'pending' && (
                  <button 
                    onClick={() => updateRequestStatus(request.id, 'pending')}
                    className="btn btn-outline btn-sm"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default HelpRequests

