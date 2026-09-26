import { useEffect, useState } from 'react'
import AuthForm from './components/AuthForm'
import Dashboard from './components/Dashboard'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import './App.css'

function LoadingScreen() {
  return (
    <main className="system-page" aria-live="polite">
      <div>
        <div className="loading-mark" aria-hidden="true">
          RS
        </div>
        <p>Loading Research Source Tracker…</p>
      </div>
    </main>
  )
}

function SetupNotice() {
  return (
    <main className="system-page">
      <section className="system-card">
        <span className="brand-mark" aria-hidden="true">
          RS
        </span>
        <p className="eyebrow">Setup required</p>
        <h1>Connect the application to Supabase.</h1>
        <p>
          Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to a{' '}
          <code>.env.local</code> file, then restart the development server.
        </p>
        <p className="system-note">
          Copy <code>.env.example</code> for the required variable names. Never place a
          Supabase service-role key in the frontend.
        </p>
      </section>
    </main>
  )
}

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined

    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session)
        setLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  if (!isSupabaseConfigured) return <SetupNotice />
  if (loading) return <LoadingScreen />

  return session ? <Dashboard session={session} /> : <AuthForm />
}

export default App
