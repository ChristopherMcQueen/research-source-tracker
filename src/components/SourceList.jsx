function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function statusClass(status) {
  return status.toLowerCase().replaceAll(' ', '-')
}

function SourceList({ sources, hasAnySources, onAdd, onEdit, onDelete }) {
  if (!sources.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon" aria-hidden="true">
          {hasAnySources ? '⌕' : '+'}
        </div>
        <h3>{hasAnySources ? 'No sources match these filters' : 'Add your first source'}</h3>
        <p>
          {hasAnySources
            ? 'Change or clear the filters to see the rest of your collection.'
            : 'Save the articles, government pages, and blogs you plan to review.'}
        </p>
        {!hasAnySources && (
          <button className="button button-primary" type="button" onClick={onAdd}>
            Add source
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>Type</th>
            <th>Comments</th>
            <th>Status</th>
            <th>Updated</th>
            <th>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sources.map((source) => (
            <tr key={source.id}>
              <td data-label="Source">
                <div className="source-title-cell">
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title}
                  </a>
                  <span>{source.notes || source.url}</span>
                </div>
              </td>
              <td data-label="Type">
                <span className={`type-badge type-${source.source_type.toLowerCase()}`}>
                  {source.source_type}
                </span>
              </td>
              <td data-label="Comments">{source.comments_status}</td>
              <td data-label="Status">
                <span className={`status-badge status-${statusClass(source.collection_status)}`}>
                  <span aria-hidden="true" />
                  {source.collection_status}
                </span>
              </td>
              <td data-label="Updated">{formatDate(source.updated_at)}</td>
              <td className="row-actions">
                <button className="button button-link" type="button" onClick={() => onEdit(source)}>
                  Edit
                </button>
                <button
                  className="button button-link button-danger"
                  type="button"
                  onClick={() => onDelete(source)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SourceList
