import '../../styles/Table.css'

function Table({ columns, data, onRowClick, emptyMessage = 'No data found' }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table__empty">{emptyMessage}</td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id || idx} onClick={() => onRowClick?.(row)} className={onRowClick ? 'table__row--clickable' : ''}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
