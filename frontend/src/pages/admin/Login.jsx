import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginAdmin } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Logo from '../../components/Logo'
import '../../styles/Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await loginAdmin(email, password)
      login(result.user, result.token)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-overlay" />

      <div className="login-container">
        <div className="login-brand">
          <Link to="/" className="login-brand__link">
            <Logo size={48} />
          </Link>
          <h1 className="login-brand__title">Family Memorial</h1>
          <p className="login-brand__subtitle">Admin Portal</p>
        </div>

        <div className="login-card">
          <h2 className="login-card__title">Welcome Back</h2>
          <p className="login-card__desc">Sign in to manage your memorial site</p>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                <span className="login-error__icon">!</span>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@familymemorial.com"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="form-input"
              />
            </div>

            <Button type="submit" disabled={loading} className="login-btn">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <Link to="/" className="login-back">
            ← Back to Site
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
