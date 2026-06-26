
import { useState, useEffect } from 'react'
import api from '../services/api'
import UploadDocumentForm from '../components/UploadDocumentForm'
import { useRole }        from '../hooks/useRole'

// file type icon helper
const getFileIcon = (filename) => {
  if (!filename) return '📄'
  const ext = filename.split('.').pop().toLowerCase()
  if (['pdf'].includes(ext))                    return '📕'
  if (['doc', 'docx'].includes(ext))            return '📝'
  if (['xls', 'xlsx'].includes(ext))            return '📊'
  if (['ppt', 'pptx'].includes(ext))            return '📊'
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return '🖼️'
  if (['zip', 'rar'].includes(ext))             return '🗜️'
  return '📄'
}

function Documents() {

  const { canEdit, canDelete, isAdmin } = useRole()
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const [allDocs, setAllDocs]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)

  // filters
  const [projectFilter, setProjectFilter]   = useState('')
  const [typeFilter, setTypeFilter]         = useState('')
  const [searchFilter, setSearchFilter]     = useState('')

  // pagination
  const [page, setPage]   = useState(1)
  const [pageSize]        = useState(6)

  const fetchAllDocs = async () => {
    setLoading(true)
    try {
      let combined = []
      let url = '/documents/?page=1'
      while (url) {
        const res = await api.get(url)
        combined = [...combined, ...(res.data?.results ?? [])]
        if (res.data?.next) {
          const next = new URL(res.data.next)
          url = `/documents/?${next.searchParams.toString()}`
        } else url = null
      }
      setAllDocs(combined)
    } catch (err) {
      console.error('Failed to fetch documents', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAllDocs() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return
    try {
      await api.delete(`/documents/${id}/`)
      fetchAllDocs()
    } catch (err) {
      console.error('Failed to delete document', err)
    }
  }

  // filters
  const afterProject = projectFilter
    ? allDocs.filter((d) => d.project === parseInt(projectFilter))
    : allDocs

  const afterType = typeFilter
    ? afterProject.filter((d) => d.document_type === parseInt(typeFilter))
    : afterProject

  const filteredDocs = searchFilter
    ? afterType.filter((d) => d.title?.toLowerCase().includes(searchFilter.toLowerCase()))
    : afterType

  // pagination
  const totalPages  = Math.ceil(filteredDocs.length / pageSize)
  const pagedDocs   = filteredDocs.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => { setPage(1) }, [projectFilter, typeFilter, searchFilter])
  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages)
    if (totalPages === 0) setPage(1)
  }, [totalPages])

  // unique projects and types from loaded docs for filter dropdowns
  const projectsForFilter = Array.from(
    new Map(allDocs.map((d) => [d.project, d.project_detail])).entries()
  ).map(([id, detail]) => ({ id, title: detail?.title ?? `Project ${id}` }))

  const typesForFilter = Array.from(
    new Map(allDocs.filter((d) => d.document_type).map((d) => [d.document_type, d.document_type_detail])).entries()
  ).map(([id, detail]) => ({ id, name: detail?.name ?? `Type ${id}` }))

  const anyFilterActive = projectFilter || typeFilter || searchFilter

  const selectStyle = {
    background: '#232938', border: '1px solid #3f4659',
    borderRadius: '12px', color: '#fff', fontSize: '14px',
    padding: '11px 16px', outline: 'none', cursor: 'pointer', fontFamily: 'inherit',
  }

  return (
    <div className="w-full px-8 py-8 bg-gray-900 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Documents</h1>
          <p className="text-gray-400 text-sm mt-1">
            {isAdmin ? 'Manage all documents' : 'Your team documents'}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowForm(true)}
            style={{ background: '#4f46e5', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '600', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = '#4338ca'}
            onMouseLeave={e => e.currentTarget.style.background = '#4f46e5'}
          >+ Upload Document</button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>

        {/* Search */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Search</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#232938', border: '1px solid #3f4659', borderRadius: '12px', padding: '11px 16px', minWidth: '200px' }}>
            <span style={{ color: '#6b7280' }}>🔍</span>
            <input
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by title..."
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '14px', fontFamily: 'inherit', flex: 1 }}
            />
          </div>
        </div>

        {/* Project filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Filter by Project</label>
          <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}
            style={{ ...selectStyle, minWidth: '180px' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'}>
            <option value="">All Projects</option>
            {projectsForFilter.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>

        {/* Type filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Filter by Type</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            style={{ ...selectStyle, minWidth: '180px' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'}>
            <option value="">All Types</option>
            {typesForFilter.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        {/* Clear */}
        {anyFilterActive && (
          <button
            onClick={() => { setProjectFilter(''); setTypeFilter(''); setSearchFilter('') }}
            style={{ background: 'transparent', border: '1px solid #3f4659', color: '#94a3b8', fontSize: '13px', fontWeight: '500', padding: '11px 16px', borderRadius: '12px', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#3f4659'; e.currentTarget.style.color = '#94a3b8' }}
          >✕ Clear</button>
        )}
      </div>

      {/* Upload Modal */}
      {showForm && (
        <UploadDocumentForm
          onUploaded={() => { setShowForm(false); fetchAllDocs() }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Documents Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-sm">Loading documents...</p>
        </div>

      ) : filteredDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-700 rounded-2xl">
          <span className="text-4xl mb-3">📄</span>
          <p className="text-gray-300 font-medium">No documents found</p>
          <p className="text-gray-500 text-sm mt-1">
            {anyFilterActive ? 'Try adjusting your filters' : 'Click "+ Upload Document" to get started'}
          </p>
        </div>

      ) : (
        <>
          <div style={{
            background: '#1a1f2e', border: '1px solid #2d3348',
            borderRadius: '16px', overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)' }}>
                  <th style={thStyle}>Document</th>
                  <th style={thStyle}>Project</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Uploaded By</th>
                  <th style={thStyle}>Date</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedDocs.map((doc, i) => (
                  <tr key={doc.id}
                    style={{ borderTop: i === 0 ? 'none' : '1px solid #2d3348', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                          {getFileIcon(doc.file)}
                        </div>
                        <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{doc.title}</span>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: '#9ca3af', fontSize: '13px' }}>{doc.project_detail?.title || '—'}</span>
                    </td>
                    <td style={tdStyle}>
                      {doc.document_type_detail ? (
                        <span style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '999px' }}>
                          {doc.document_type_detail.name}
                        </span>
                      ) : (
                        <span style={{ color: '#4b5563', fontSize: '13px' }}>—</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: '#9ca3af', fontSize: '13px' }}>{doc.uploaded_by_detail?.name || '—'}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                        {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : '—'}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        {/* View/Download */}
                        {doc.file_url && (
                          <a href={doc.file_url} target="_blank" rel="noreferrer"
                            style={{ background: '#4f46e5', border: 'none', color: '#fff', fontSize: '12px', fontWeight: '600', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#4338ca'}
                            onMouseLeave={e => e.currentTarget.style.background = '#4f46e5'}
                          >⬇ View</a>
                        )}
                        {/* Delete */}
                        {canDelete && (
                          <button onClick={() => handleDelete(doc.id)}
                            style={{ background: '#2d3348', border: 'none', color: '#f87171', fontSize: '12px', fontWeight: '600', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#fca5a5' }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#2d3348'; e.currentTarget.style.color = '#f87171' }}
                          >Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                style={{ background: page === 1 ? '#1f2330' : '#2d3348', border: '1px solid #3f4659', color: page === 1 ? '#4b5563' : '#cbd5e1', fontSize: '14px', fontWeight: '600', padding: '8px 16px', borderRadius: '10px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >← Prev</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ background: p === page ? '#4f46e5' : '#2d3348', border: '1px solid #3f4659', color: p === page ? '#fff' : '#cbd5e1', fontSize: '14px', fontWeight: '600', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer' }}
                >{p}</button>
              ))}

              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ background: page === totalPages ? '#1f2330' : '#2d3348', border: '1px solid #3f4659', color: page === totalPages ? '#4b5563' : '#cbd5e1', fontSize: '14px', fontWeight: '600', padding: '8px 16px', borderRadius: '10px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
              >Next →</button>
            </div>
          )}
        </>
      )}

    </div>
  )
}

const thStyle = { textAlign: 'left', padding: '16px 20px', color: '#94a3b8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }
const tdStyle = { padding: '16px 20px', fontSize: '14px' }

export default Documents