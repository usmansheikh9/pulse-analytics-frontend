import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const { login }        = useAuth()
  const navigate         = useNavigate()
  const [email, setEmail]       = useState('admin@pulse.io')
  const [password, setPassword] = useState('admin123')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.bg} />
      <div className={styles.grid} />

      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h4l3-9 4 18 3-9h4" stroke="#00d9ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className={styles.brandText}>Pulse</span>
        </div>

        <h2 className={styles.heading}>Welcome back</h2>
        <p className={styles.sub}>Sign in to your analytics workspace</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className={`btn-primary ${styles.submit}`} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>

        <div className={styles.demo}>
          <span>Demo:</span>
          <code>admin@pulse.io / admin123</code>
        </div>
      </div>

      <div className={styles.footer}>
        <span>Real-time analytics · Built with WebSockets · PostgreSQL · React</span>
      </div>
    </div>
  )
}
