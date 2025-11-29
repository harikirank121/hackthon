import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';
import './Auth.css';
// TODO: Insert your RECAPTCHA_SITE_KEY below
const RECAPTCHA_SITE_KEY = "6LfvOxwsAAAAAMcGA0xZApSaYHUnaPmbo7m9WG9i";

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'victim',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaError, setCaptchaError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one letter and one number';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setCaptchaError('');
    if (!validate()) return;
    if (!captchaToken) {
      setCaptchaError('Please verify the CAPTCHA.');
      setErrors(prev => ({ ...prev, captcha: 'Please verify the CAPTCHA' }));
      setMessage('Please complete the CAPTCHA before registering.');
      return;
    }
    if (captchaError) {
      setMessage('CAPTCHA error: ' + captchaError);
      return;
    }
    setLoading(true);
    const { confirmPassword, ...userData } = formData;
    const result = await register(userData, captchaToken);
    setLoading(false);
    if (result.success) {
      setMessage('Registration successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 500);
    } else {
      setMessage(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join our support community</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {message && (
            <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="role" className="form-label">I am a</label>
            <select
              id="role"
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="victim">Victim/Survivor</option>
              <option value="counsellor">Counsellor</option>
              <option value="legal">Legal Advisor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          {/* Google reCAPTCHA v2 Checkbox for Registration */}
          <div className="form-group">
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={token => {
                setCaptchaToken(token);
                setCaptchaError("");
              }}
              onExpired={() => {
                setCaptchaToken(null);
                setCaptchaError("CAPTCHA expired, please verify again.");
              }}
            />
            {(errors.captcha || captchaError) ? (
              <span className="error-message">{errors.captcha || captchaError}</span>
            ) : null}
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;

