import { useEffect, useState } from 'react'

const blankSource = {
  title: '',
  url: '',
  source_type: 'News',
  comments_status: 'Unknown',
  collection_status: 'Not Started',
  notes: '',
}

function SourceForm({ source, onClose, onSave }) {
  const [values, setValues] = useState(source ?? blankSource)
  const [error, setError] = useState('')

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    document.body.classList.add('modal-open')

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.classList.remove('modal-open')
    }
  }, [onClose])

  function updateField(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!values.title.trim() || !values.url.trim()) {
      setError('A title and URL are required.')
      return
    }

    try {
      new URL(values.url)
    } catch {
      setError('Enter a complete URL beginning with http:// or https://.')
      return
    }

    setError('')
    onSave({
      title: values.title.trim(),
      url: values.url.trim(),
      source_type: values.source_type,
      comments_status: values.comments_status,
      collection_status: values.collection_status,
      notes: values.notes.trim(),
    })
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="source-form-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">Source details</p>
            <h2 id="source-form-title">{source ? 'Edit source' : 'Add a new source'}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close form">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field form-field-wide">
            <label htmlFor="title">Source title</label>
            <input
              id="title"
              name="title"
              value={values.title}
              onChange={updateField}
              placeholder="Example: Federal guidance on AI in education"
              autoFocus
              required
            />
          </div>

          <div className="form-field form-field-wide">
            <label htmlFor="url">Source URL</label>
            <input
              id="url"
              name="url"
              type="url"
              value={values.url}
              onChange={updateField}
              placeholder="https://example.gov/article"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="source_type">Source type</label>
              <select
                id="source_type"
                name="source_type"
                value={values.source_type}
                onChange={updateField}
              >
                <option>News</option>
                <option>Government</option>
                <option>Blog</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="comments_status">Comments</label>
              <select
                id="comments_status"
                name="comments_status"
                value={values.comments_status}
                onChange={updateField}
              >
                <option>Unknown</option>
                <option>Available</option>
                <option>Unavailable</option>
              </select>
            </div>
          </div>

          <div className="form-field form-field-wide">
            <label htmlFor="collection_status">Collection status</label>
            <select
              id="collection_status"
              name="collection_status"
              value={values.collection_status}
              onChange={updateField}
            >
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Complete</option>
            </select>
          </div>

          <div className="form-field form-field-wide">
            <label htmlFor="notes">
              Notes <span>Optional</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              value={values.notes}
              onChange={updateField}
              placeholder="Record anything useful about the article or its comments."
              rows="4"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button className="button button-secondary" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="button button-primary" type="submit">
              {source ? 'Save changes' : 'Add source'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default SourceForm
