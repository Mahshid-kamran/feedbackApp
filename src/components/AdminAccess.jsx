import { useState } from 'react'
import { useFeedback } from '../context/useFeedback.js'
import Card from './shared/Card.jsx'

export default function AdminAccess() {
  const { isAdmin, session, signIn, signOut, isSupabaseConfigured, saving } = useFeedback()
  const [expanded, setExpanded] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setBusy(true)
    try {
      await signIn(email.trim(), password)
      setPassword('')
      setMessage('Administrator signed in.')
    } catch (error) {
      setMessage(error.message || 'Sign-in failed.')
    } finally {
      setBusy(false)
    }
  }

  const handleSignOut = async () => {
    setMessage('')
    try { await signOut() } catch (error) { setMessage(error.message || 'Sign-out failed.') }
  }

  if (!isSupabaseConfigured) return null

  return (
    <section className="admin-access">
      {isAdmin ? (
        <div className="admin-status">
          <span>Administrator mode is active.</span>
          <button className="text-button" type="button" onClick={handleSignOut} disabled={saving}>Sign out</button>
        </div>
      ) : (
        <>
          <button className="admin-toggle" type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
            {session ? 'Account has no administrator permissions' : 'Administrator sign in'}
          </button>
          {expanded && !session && (
            <Card>
              <form onSubmit={handleSubmit} className="admin-form">
                <h3>Administrator sign in</h3>
                <label htmlFor="admin-email">Email</label>
                <input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
                <label htmlFor="admin-password">Password</label>
                <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
                <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
                {message && <p className="inline-message" role="status">{message}</p>}
              </form>
            </Card>
          )}
        </>
      )}
      {message && !expanded && <p className="inline-message" role="status">{message}</p>}
    </section>
  )
}
