import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const API_URL = 'http://localhost:8080/api/users'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', location: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Name, email and password are required.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      // ── REAL API CALL ──────────────────────────────────────────────────────
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const result = await response.json()

      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.data))
        navigate('/dashboard')
      } else {
        setError(result.message || 'Signup failed. Please try again.')
      }
      // ──────────────────────────────────────────────────────────────────────

    } catch (err) {
      setError('Cannot connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.brand}>
          <span style={styles.logo}>FF</span>
          <span style={styles.brandName}>FitnessFreak</span>
        </div>
        <h1 style={styles.heroText}>Join thousands on their fitness journey.</h1>
        <p style={styles.heroSub}>Find gyms near you, book personal trainers, and crush your goals.</p>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Create account</h2>
          <p style={styles.cardSub}>Start your fitness journey today</p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSignup} style={styles.form}>
            {[
              { name: 'name', label: 'Full Name', placeholder: 'Vikram Nair', type: 'text' },
              { name: 'email', label: 'Email address', placeholder: 'you@example.com', type: 'email' },
              { name: 'password', label: 'Password', placeholder: '••••••••', type: 'password' },
              { name: 'phone', label: 'Phone (optional)', placeholder: '+91 98765 43210', type: 'tel' },
              { name: 'location', label: 'Location (optional)', placeholder: 'Koramangala, Bengaluru', type: 'text' },
            ].map(field => (
              <div key={field.name} style={styles.field}>
                <label style={styles.label}>{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  disabled={loading}
                  style={styles.input}
                />
              </div>
            ))}

            <button
              type="submit"
              style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.switchLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' },
  left: { flex: 1, background: 'linear-gradient(135deg, #1a6b3c 0%, #2563eb 100%)', color: '#fff', padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '28px' },
  brand: { display: 'inline-flex', alignItems: 'center', gap: '14px' },
  logo: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '14px', background: '#fff', color: '#1a6b3c', fontWeight: 700, fontSize: '18px' },
  brandName: { fontSize: '22px', fontWeight: 700 },
  heroText: { fontSize: '2.8rem', lineHeight: 1.1, maxWidth: '420px' },
  heroSub: { maxWidth: '420px', fontSize: '1rem', lineHeight: 1.75, opacity: 0.9 },
  right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' },
  card: { width: '100%', maxWidth: '440px', padding: '36px', borderRadius: '24px', background: '#ffffff', boxShadow: '0 24px 80px rgba(15, 23, 42, 0.12)' },
  cardTitle: { margin: 0, fontSize: '28px', fontWeight: 700 },
  cardSub: { margin: '12px 0 28px', color: '#475569', lineHeight: 1.6 },
  error: { marginBottom: '18px', padding: '14px 16px', borderRadius: '14px', background: '#fee2e2', color: '#b91c1c', fontSize: '0.95rem' },
  form: { display: 'grid', gap: '16px' },
  field: { display: 'grid', gap: '8px' },
  label: { fontSize: '0.95rem', fontWeight: 600, color: '#111827' },
  input: { width: '100%', minHeight: '52px', padding: '14px 16px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontSize: '1rem' },
  btn: { width: '100%', minHeight: '54px', borderRadius: '16px', border: 'none', cursor: 'pointer', background: '#1a6b3c', color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginTop: 4 },
  switchText: { marginTop: '18px', color: '#64748b', fontSize: '0.95rem' },
  switchLink: { color: '#2563eb', textDecoration: 'none', fontWeight: 600 },
}