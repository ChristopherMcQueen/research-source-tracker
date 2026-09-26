import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import SourceForm from './SourceForm'
import SourceList from './SourceList'

const emptyFilters = {
  search: '',
  sourceType: 'All',
  collectionStatus: 'All',
}

function getAccountLabel(email = '') {
  const rawName = email.split('@')[0].replace(/[._-]+/g, ' ').trim()
  if (!rawName) return 'Researcher'

  return rawName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getInitials(label) {
  return label
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
}

function Dashboard({ session }) {
  const [sources, setSources] = useState([])
  const [filters, setFilters] = useState(emptyFilters)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSource, setEditingSource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [notice, setNotice] = useState(null)

  const accountLabel = getAccountLabel(session.user.email)

  useEffect(() => {
    let active = true

    async function loadSources() {
      setLoading(true)
      const { data, error } = await supabase
        .from('sources')
        .select('*')
        .order('updated_at', { ascending: false })

      if (!active) return

      if (error) {
        setNotice({ type: 'error', text: `Sources could not be loaded: ${error.message}` })
      } else {
        setSources(data ?? [])
      }

      setLoading(false)
    }

    loadSources()

    return () => {
      active = false
    }
  }, [session.user.id])

  useEffect(() => {
    if (!notice) return undefined

    const timer = window.setTimeout(() => setNotice(null), 4500)
    return () => window.clearTimeout(timer)
  }, [notice])

  const filteredSources = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase()

    return sources.filter((source) => {
      const matchesSearch =
        !searchTerm ||
        source.title.toLowerCase().includes(searchTerm) ||
        source.url.toLowerCase().includes(searchTerm) ||
        source.notes.toLowerCase().includes(searchTerm)
      const matchesType =
        filters.sourceType === 'All' || source.source_type === filters.sourceType
      const matchesStatus =
        filters.collectionStatus === 'All' ||
        source.collection_status === filters.collectionStatus

      return matchesSearch && matchesType && matchesStatus
    })
  }, [filters, sources])

  const totals = useMemo(
    () => ({
      total: sources.length,
      complete: sources.filter((source) => source.collection_status === 'Complete')
        .length,
      inProgress: sources.filter(
        (source) => source.collection_status === 'In Progress',
      ).length,
      notStarted: sources.filter(
        (source) => source.collection_status === 'Not Started',
      ).length,
    }),
    [sources],
  )

  function openNewSourceForm() {
    setEditingSource(null)
    setIsFormOpen(true)
  }

  function openEditForm(source) {
    setEditingSource(source)
    setIsFormOpen(true)
  }

  function closeForm() {
    if (saving) return
    setEditingSource(null)
    setIsFormOpen(false)
  }

  async function saveSource(values) {
    setSaving(true)
    setNotice(null)

    const query = editingSource
      ? supabase.from('sources').update(values).eq('id', editingSource.id)
      : supabase.from('sources').insert({ ...values, user_id: session.user.id })

    const { data, error } = await query.select().single()

    if (error) {
      setNotice({ type: 'error', text: `The source could not be saved: ${error.message}` })
      setSaving(false)
      return
    }

    setSources((current) =>
      editingSource
        ? current.map((source) => (source.id === data.id ? data : source))
        : [data, ...current],
    )
    setNotice({
      type: 'success',
      text: editingSource ? 'Source updated successfully.' : 'Source added successfully.',
    })
    setSaving(false)
    setEditingSource(null)
    setIsFormOpen(false)
  }

  async function deleteSource(source) {
    const shouldDelete = window.confirm(
      `Delete “${source.title}”? This action cannot be undone.`,
    )

    if (!shouldDelete) return

    setDeletingId(source.id)
    setNotice(null)
    const { error } = await supabase.from('sources').delete().eq('id', source.id)

    if (error) {
      setNotice({ type: 'error', text: `The source could not be deleted: ${error.message}` })
    } else {
      setSources((current) => current.filter((item) => item.id !== source.id))
      setNotice({ type: 'success', text: 'Source deleted.' })
    }

    setDeletingId(null)
  }

  async function logOut() {
    setNotice(null)
    const { error } = await supabase.auth.signOut()

    if (error) {
      setNotice({ type: 'error', text: `Logout failed: ${error.message}` })
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="Research Source Tracker home">
            <span className="brand-mark" aria-hidden="true">
              RS
            </span>
            <span>
              <strong>Research Source Tracker</strong>
              <small>Senior design collection workspace</small>
            </span>
          </a>

          <div className="account-area">
            <span className="account-avatar" aria-hidden="true">
              {getInitials(accountLabel)}
            </span>
            <span className="account-copy">
              <strong>{accountLabel}</strong>
              <small>{session.user.email}</small>
            </span>
            <button className="button button-quiet" type="button" onClick={logOut}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="main-content" id="top">
        {notice && (
          <div className={`page-notice notice-${notice.type}`} role="status">
            {notice.text}
            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message">
              ×
            </button>
          </div>
        )}

        <section className="page-heading" aria-labelledby="dashboard-title">
          <div>
            <p className="eyebrow">Source collection</p>
            <h1 id="dashboard-title">Research dashboard</h1>
            <p className="page-description">
              Keep article sources, comment availability, and collection progress in one
              place.
            </p>
          </div>
          <button className="button button-primary" type="button" onClick={openNewSourceForm}>
            <span aria-hidden="true">+</span>
            Add source
          </button>
        </section>

        <section className="summary-grid" aria-label="Collection summary">
          <article className="summary-card">
            <span>Total sources</span>
            <strong>{totals.total}</strong>
          </article>
          <article className="summary-card summary-complete">
            <span>Complete</span>
            <strong>{totals.complete}</strong>
          </article>
          <article className="summary-card summary-progress">
            <span>In progress</span>
            <strong>{totals.inProgress}</strong>
          </article>
          <article className="summary-card summary-pending">
            <span>Not started</span>
            <strong>{totals.notStarted}</strong>
          </article>
        </section>

        <section className="workspace" aria-labelledby="sources-title">
          <div className="workspace-heading">
            <div>
              <h2 id="sources-title">Saved sources</h2>
              <p>
                Showing {filteredSources.length} of {sources.length}
              </p>
            </div>
          </div>

          <div className="filter-bar">
            <label className="search-field">
              <span className="sr-only">Search sources</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
              </svg>
              <input
                type="search"
                value={filters.search}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, search: event.target.value }))
                }
                placeholder="Search title, URL, or notes"
              />
            </label>

            <label>
              <span className="sr-only">Filter by source type</span>
              <select
                value={filters.sourceType}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    sourceType: event.target.value,
                  }))
                }
              >
                <option>All</option>
                <option>News</option>
                <option>Government</option>
                <option>Blog</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              <span className="sr-only">Filter by collection status</span>
              <select
                value={filters.collectionStatus}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    collectionStatus: event.target.value,
                  }))
                }
              >
                <option>All</option>
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Complete</option>
              </select>
            </label>

            {(filters.search ||
              filters.sourceType !== 'All' ||
              filters.collectionStatus !== 'All') && (
              <button
                className="button button-link"
                type="button"
                onClick={() => setFilters(emptyFilters)}
              >
                Clear filters
              </button>
            )}
          </div>

          <SourceList
            sources={filteredSources}
            hasAnySources={sources.length > 0}
            loading={loading}
            deletingId={deletingId}
            onAdd={openNewSourceForm}
            onEdit={openEditForm}
            onDelete={deleteSource}
          />
        </section>
      </main>

      <footer className="site-footer">
        <p>Research Source Tracker · FAU Engineering Design 2</p>
      </footer>

      {isFormOpen && (
        <SourceForm
          source={editingSource}
          saving={saving}
          onClose={closeForm}
          onSave={saveSource}
        />
      )}
    </div>
  )
}

export default Dashboard
