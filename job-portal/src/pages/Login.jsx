import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import { login } from '../services/api'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login(formData)

      if (response.success) {
        localStorage.setItem('token', response.data.accessToken)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        // Redirect based on user role
        const userRole = response.data.user?.role || response.data.user?.Role;
        
        if (userRole === 'Company') {
          navigate('/company/dashboard')
        } else if (userRole === 'Admin') {
          navigate('/admin/dashboard')
        } else {
          // Default to candidate dashboard
          navigate('/candidate/find-jobs')
        }
      } else {
        setError(response.message || "Login failed")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-left">
          <h2 className="login-title">Log in to your account.</h2>
          <p className="login-subtitle">
            Don&apos;t have an account? <a href="/signup" className="login-link">Create one</a>
          </p>

          {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>

        <div className="login-right">
          <div className="login-overlay" />
          <div className="login-text-block">
            <h3>Over 1,75,324 candidates waiting for good employees.</h3>
            <div className="stats">
              <div className="stat">
                <span className="stat-number">1,75,324</span>
                <span className="stat-label">Live Jobs</span>
              </div>
              <div className="stat">
                <span className="stat-number">97,354</span>
                <span className="stat-label">Companies</span>
              </div>
              <div className="stat">
                <span className="stat-number">7,532</span>
                <span className="stat-label">New Jobs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
