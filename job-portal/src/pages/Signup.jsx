import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Signup.css'
import { registerCandidate } from '../services/api'

function Signup() {
  const navigate = useNavigate()
  const [role, setRole] = useState('candidate')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (role !== 'candidate') {
      setError("Registration is currently only available for candidates.")
      return
    }

    setLoading(true)
    try {
      // Split full name into first and last name
      const nameParts = formData.fullName.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ') || ''

      const payload = {
        email: formData.email,
        password: formData.password,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: "" // Optional or add field later
      }

      const response = await registerCandidate(payload)

      if (response.success) {
        alert("Registration successful! Please login.")
        navigate('/login')
      } else {
        setError(response.message || "Registration failed")
      }
    } catch (err) {
      console.error("Signup error:", err)
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-left">
          <h2 className="signup-title">Create account.</h2>
          <p className="signup-subtitle">
            Already have an account? <a href="/login" className="signup-link">Log in</a>
          </p>

          <div className="signup-role-switch">
            <p className="role-label">Create account as a</p>
            <div className="role-options">
              <button
                type="button"
                className={`role-option ${role === 'candidate' ? 'active' : ''}`}
                onClick={() => setRole('candidate')}
              >
                Candidate
              </button>
              <button
                type="button"
                className={`role-option ${role === 'recruiter' ? 'active' : ''}`}
                onClick={() => setRole('recruiter')}
              >
                Recruiter
              </button>
            </div>
          </div>

          {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username" // Keeping UI for now but not used in backend yet
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="signup-terms">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I&apos;ve read and agree with your <span>Terms of Service</span>
              </label>
            </div>

            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <div className="signup-right">
          <div className="signup-overlay" />
          <div className="signup-text-block">
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

export default Signup
