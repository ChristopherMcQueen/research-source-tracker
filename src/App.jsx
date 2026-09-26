import { useMemo, useState } from 'react'
import SourceForm from './components/SourceForm'
import SourceList from './components/SourceList'
import { sampleSources } from './data/sampleSources'
import './App.css'

const emptyFilters = {
  search: '',
  sourceType: 'All',
  collectionStatus: 'All',
}

function App() {
  const [sources, setSources] = useState(sampleSources)
  const [filters, setFilters] = useState(emptyFilters)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSource, setEditingSource] = useState(null)

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
    setEditingSource(null)
    setIsFormOpen(false)
  }

  function saveSource(values) {
    if (editingSource) {
      setSources((current) =>
        current.map((source) =>
          source.id === editingSource.id
            ? { ...source, ...values, updated_at: new Date().toISOString() }
            : source,
        ),
      )
    } else {
      setSources((current) => [
        {
          ...values,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        ...current,
      ])
    }

    closeForm()
  }

  function deleteSource(source) {
    const shouldDelete = window.confirm(
      `Delete “${source.title}”? This action cannot be undone.`,
    )

    if (shouldDelete) {
      setSources((current) => current.filter((item) => item.id !== source.id))
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
              CM
            </span>
            <span className="account-copy">
              <strong>Christopher</strong>
              <small>Signed in</small>
            </span>
            <button className="button button-quiet" type="button">
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="main-content" id="top">
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
        <SourceForm source={editingSource} onClose={closeForm} onSave={saveSource} />
      )}
    </div>
  )
}

export default App
