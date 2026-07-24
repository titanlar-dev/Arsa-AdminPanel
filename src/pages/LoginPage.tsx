import { useState } from 'react'
import { useNavigate } from 'react-router'
import * as css from './LoginPage.css'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Tum alanlari doldurun'); return }
    setLoading(true)
    setError('')
    setTimeout(() => { setLoading(false); navigate('/') }, 800)
  }

  return (
    <div className={css.root}>
      <div className={css.card}>
        <span className={css.logo}>Arsam.net</span>

        <form className={css.form} onSubmit={handleSubmit}>
          <input
            className={css.input}
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={css.input}
            type="password"
            placeholder="Sifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <span className={css.errorText}>{error}</span>}
          <button type="submit" className={css.button} disabled={loading}>
            {loading ? 'Giris yapiliyor...' : 'Giris Yap'}
          </button>
        </form>
      </div>
    </div>
  )
}
