
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
 
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
 
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      navigate('/dashboard')
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.brand}>
          <span style={styles.logo}>FL</span>
          <span style={styles.brandName}>FitLife</span>
        </div>
        <h1 style={styles.heroText}>Your fitness journey starts here.</h1>
        <p style={styles.heroSub}>Track workouts, stay motivated, and build healthier habits.</p>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Welcome back</h2>
          <p style={styles.cardSub}>Sign in to continue</p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.field}>
              <label htmlFor="login-email" style={styles.label}>Email address</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                }}
                disabled={loading}
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <div style={styles.fieldHeader}>
                <label htmlFor="login-password" style={styles.label}>Password</label>
                <Link to="/forgot-password" style={styles.forgotLink}>Forgot password?</Link>
              </div>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError('')
                }}
                disabled={loading}
                style={styles.input}
              />
            </div>
            <button type="submit" style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={styles.switchText}>
            Don't have an account?{' '}
            <Link to="/signup" style={styles.switchLink}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    background: '#f8fafc',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  left: {
    flex: 1,
    background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
    color: '#fff',
    padding: '56px 48px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '28px',
  },
  brand: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '14px',
  },
  logo: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: '#fff',
    color: '#0b4c86',
    fontWeight: 700,
    fontSize: '18px',
  },
  brandName: {
    fontSize: '22px',
    fontWeight: 700,
  },
  heroText: {
    fontSize: '3rem',
    lineHeight: 1.05,
    maxWidth: '420px',
  },
  heroSub: {
    maxWidth: '420px',
    fontSize: '1rem',
    lineHeight: 1.75,
    opacity: 0.9,
  },
  right: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    padding: '36px',
    borderRadius: '24px',
    background: '#ffffff',
    boxShadow: '0 24px 80px rgba(15, 23, 42, 0.12)',
  },
  cardTitle: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 700,
  },
  cardSub: {
    margin: '12px 0 28px',
    color: '#475569',
    lineHeight: 1.6,
  },
  error: {
    marginBottom: '18px',
    padding: '14px 16px',
    borderRadius: '14px',
    background: '#fee2e2',
    color: '#b91c1c',
    fontSize: '0.95rem',
  },
  form: {
    display: 'grid',
    gap: '18px',
  },
  field: {
    display: 'grid',
    gap: '10px',
  },
  fieldHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#111827',
  },
  input: {
    width: '100%',
    minHeight: '52px',
    padding: '14px 16px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    background: '#f8fafc',
    outline: 'none',
    fontSize: '1rem',
    transition: 'border-color 160ms ease',
  },
  forgotLink: {
    fontSize: '0.92rem',
    color: '#2563eb',
    textDecoration: 'none',
  },
  btn: {
    width: '100%',
    minHeight: '54px',
    borderRadius: '16px',
    border: 'none',
    cursor: 'pointer',
    background: '#2563eb',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 700,
    transition: 'transform 160ms ease, opacity 160ms ease',
  },
  switchText: {
    marginTop: '18px',
    color: '#64748b',
    fontSize: '0.95rem',
  },
  switchLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: 600,
  },
}

