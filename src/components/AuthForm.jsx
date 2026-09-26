import { useState } from 'react'
import { supabase } from '../lib/supabase'

function AuthForm() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function changeMode(nextMode) {
    setMode(nextMode)
    setMessage(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage(null)

    if (!email.trim() || password.length < 6) {
      setMessage({
        type: 'error',
        text: 'Enter a valid email address and a password with at least six characters.',
      })
      return
    }

    setSubmitting(true)

    const credentials = { email: email.trim(), password }
    const result =
      mode === 'register'
        ? await supabase.auth.signUp(credentials)
        : await supabase.auth.signInWithPassword(credentials)

    setSubmitting(false)

    if (result.error) {
      setMessage({ type: 'error', text: result.error.message })
      return
    }

    if (mode === 'register' && !result.data.session) {
      setMessage({
        type: 'success',
        text: 'Account created. Check your email to confirm the account, then log in.',
      })
      setMode('login')
      setPassword('')
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-intro" aria-labelledby="auth-heading">
        <a className="brand auth-brand" href="/" aria-label="Research Source Tracker home">
          <span className="brand-mark" aria-hidden="true">
            RS
          </span>
          <span>
            <strong>Research Source Tracker</strong>
            <small>Senior design collection workspace</small>
          </span>
        </a>

        <div className="auth-intro-copy">
          <p className="eyebrow">FAU Engineering Design 2</p>
          <h1 id="auth-heading">Turn scattered research links into an organized collection.</h1>
          <p>
            Track news articles, government pages, blogs, comment availability, and
            collection progress in one secure workspace.
          </p>
        </div>

        <ul className="feature-list" aria-label="Application features">
          <li>
            <span aria-hidden="true">01</span>
            Organize every source in one place
          </li>
          <li>
            <span aria-hidden="true">02</span>
            Track comments and collection progress
          </li>
          <li>
            <span aria-hidden="true">03</span>
            Keep each account's research separate
          </li>
        </ul>
      </section>

      <section className="auth-panel" aria-label="Account access">
        <div className="auth-card">
          <div className="auth-card-heading">
            <p className="eyebrow">Welcome</p>
            <h2>{mode === 'login' ? 'Log in to your account' : 'Create your account'}</h2>
            <p>
              {mode === 'login'
                ? 'Continue working with your saved research sources.'
                : 'Register with your email address to begin.'}
            </p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Account options">
            <button
              className={mode === 'login' ? 'active' : ''}
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              onClick={() => changeMode('login')}
            >
              Log in
            </button>
            <button
              className={mode === 'register' ? 'active' : ''}
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              onClick={() => changeMode('register')}
            >
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength="6"
                required
              />
            </div>

            {message && (
              <p className={`notice notice-${message.type}`} role="status">
                {message.text}
              </p>
            )}

            <button className="button button-primary auth-submit" type="submit" disabled={submitting}>
              {submitting
                ? 'Please wait…'
                : mode === 'login'
                  ? 'Log in'
                  : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            {mode === 'login' ? 'Need an account?' : 'Already registered?'}{' '}
            <button
              type="button"
              onClick={() => changeMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? 'Register' : 'Log in'}
            </button>
          </p>
        </div>
      </section>
    </main>
  )
}

export default AuthForm
