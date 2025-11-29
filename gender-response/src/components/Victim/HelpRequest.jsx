import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './HelpRequest.css'

function HelpRequest() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    type: 'counselling',
    urgency: 'medium',
    description: '',
    preferredContact: user?.phone || '',
    preferredTime: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const validate = () => {
    const newErrors = {}
    
    if (!formData.description.trim()) {
      newErrors.description = 'Please describe how we can help you'
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Please provide more details (at least 20 characters)'
    }
    
    if (!formData.preferredContact.trim()) {
      newErrors.preferredContact = 'Contact information is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    setMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    
    if (!validate()) {
      return
    }

    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // Store in localStorage for demo purposes
      const requests = JSON.parse(localStorage.getItem('help_requests') || '[]')
      const newRequest = {
        id: Date.now().toString(),
        ...formData,
        userId: user.id,
        userName: user.name,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      requests.push(newRequest)
      localStorage.setItem('help_requests', JSON.stringify(requests))
      
      setLoading(false)
      setMessage('Your help request has been submitted successfully. A support professional will contact you soon.')
      setFormData({
        type: 'counselling',
        urgency: 'medium',
        description: '',
        preferredContact: user?.phone || '',
        preferredTime: ''
      })
    }, 1000)
  }

  return (
    <div>
      <h1>Request Help</h1>
      <p className="subtitle">We're here to help. Fill out the form below and a professional will reach out to you.</p>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      <div className="help-form-container">
        <form onSubmit={handleSubmit} className="help-form">
          <div className="form-group">
            <label htmlFor="type" className="form-label">Type of Help Needed</label>
            <select
              id="type"
              name="type"
              className="form-select"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="counselling">Counselling & Emotional Support</option>
              <option value="legal">Legal Advice</option>
              <option value="shelter">Shelter & Housing</option>
              <option value="medical">Medical Support</option>
              <option value="safety">Safety Planning</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="urgency" className="form-label">Urgency Level</label>
            <select
              id="urgency"
              name="urgency"
              className="form-select"
              value={formData.urgency}
              onChange={handleChange}
            >
              <option value="low">Low - Can wait a few days</option>
              <option value="medium">Medium - Within a week</option>
              <option value="high">High - Need help soon</option>
              <option value="urgent">Urgent - Immediate assistance needed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Describe Your Situation</label>
            <textarea
              id="description"
              name="description"
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              value={formData.description}
              onChange={handleChange}
              placeholder="Please provide details about your situation and how we can help you..."
              rows="6"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="preferredContact" className="form-label">Preferred Contact Method</label>
            <input
              type="text"
              id="preferredContact"
              name="preferredContact"
              className={`form-input ${errors.preferredContact ? 'error' : ''}`}
              value={formData.preferredContact}
              onChange={handleChange}
              placeholder="Phone number or email"
            />
            {errors.preferredContact && <span className="error-message">{errors.preferredContact}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="preferredTime" className="form-label">Preferred Contact Time (Optional)</label>
            <input
              type="text"
              id="preferredTime"
              name="preferredTime"
              className="form-input"
              value={formData.preferredTime}
              onChange={handleChange}
              placeholder="e.g., Weekdays 9am-5pm"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Help Request'}
            </button>
          </div>
        </form>

        <div className="help-info">
          <div className="info-card">
            <h3>What Happens Next?</h3>
            <ul>
              <li>Your request will be reviewed by our support team</li>
              <li>A professional will contact you within 24-48 hours</li>
              <li>All information is kept confidential</li>
              <li>You can request help at any time</li>
            </ul>
          </div>

          <div className="info-card emergency">
            <h3>🚨 In Immediate Danger?</h3>
            <p>If you're in immediate danger, please call:</p>
            <p className="emergency-number">911</p>
            <p>National Domestic Violence Hotline:</p>
            <p className="emergency-number">1-800-799-7233</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpRequest

