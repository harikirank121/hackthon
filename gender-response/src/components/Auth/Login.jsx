import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';
import './Auth.css';
// TODO: Insert your RECAPTCHA_SITE_KEY below
const RECAPTCHA_SITE_KEY = "6LfvOxwsAAAAAMcGA0xZApSaYHUnaPmbo7m9WG9i";

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaError, setCaptchaError] = useState('');
  const captchaRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setCaptchaError('');
    if (!validate()) {
      return;
    }
    if (!captchaToken) {
      setCaptchaError('Please verify the CAPTCHA.');
      setErrors((prev) => ({ ...prev, captcha: 'Please verify the CAPTCHA' }));
      setMessage('Please complete the CAPTCHA before logging in.');
      return;
    }
    if (captchaError) {
      setMessage('CAPTCHA error: ' + captchaError);
      return;
    }
    setLoading(true);
    const result = await login(formData.email, formData.password, captchaToken);
    setLoading(false);
    if (result.success) {
      setMessage('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 500);
    } else {
      setMessage(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to access support resources</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {message && (
            <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}
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
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          {/* Google reCAPTCHA v2 Checkbox */}
          <div className="form-group">
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY} // keep the TODO key reference
              onChange={(token) => {
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;

