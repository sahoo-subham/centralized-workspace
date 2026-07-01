import { useState, useEffect } from 'react'

const getFileIcon = (filename) => {
  if (!filename) return '📄'
  const ext = filename.split('.').pop().toLowerCase()
  if (['pdf'].includes(ext))                       return '📕'
  if (['doc', 'docx'].includes(ext))               return '📝'
  if (['xls', 'xlsx'].includes(ext))               return '📊'
  if (['ppt', 'pptx'].includes(ext))               return '📊'
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return '🖼️'
  if (['zip', 'rar'].includes(ext))                return '🗜️'
  return '📄'
}

export default function DocumentTable({ documents, onDelete, canDelete }) {

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [downloadingId, setDownloadingId] = useState(null)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleDownload = async (doc) => {
    if (!doc.file_url) return
    setDownloadingId(doc.id)
    try {
      const res = await fetch(doc.file_url)
      const blob = await res.blob()

      const urlParts = doc.file_url.split('/')
      const originalFilename = urlParts[urlParts.length - 1]

      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = originalFilename || doc.title
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error('Failed to download file', err)
      alert('Could not download this file. Please try again.')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <>
      {!isMobile && (
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
              {documents.map((doc, i) => (
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

                      {doc.file_url && (
                        <a href={doc.file_url} target="_blank" rel="noreferrer" style={viewBtnStyle}
                          onMouseEnter={e => e.currentTarget.style.background = '#374151'}
                          onMouseLeave={e => e.currentTarget.style.background = '#2d3348'}
                        >👁 View</a>
                      )}

                      {doc.file_url && (
                        <button
                          onClick={() => handleDownload(doc)}
                          disabled={downloadingId === doc.id}
                          style={{
                            ...downloadBtnStyle,
                            cursor: downloadingId === doc.id ? 'not-allowed' : 'pointer',
                            opacity: downloadingId === doc.id ? 0.6 : 1,
                          }}
                          onMouseEnter={e => { if (downloadingId !== doc.id) e.currentTarget.style.background = '#4338ca' }}
                          onMouseLeave={e => e.currentTarget.style.background = '#4f46e5'}
                        >{downloadingId === doc.id ? '⏳ Downloading...' : '⬇ Download'}</button>
                      )}

                      {canDelete && (
                        <button onClick={() => onDelete(doc.id)} style={deleteBtnStyle}
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
      )}

      {isMobile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {documents.map((doc) => (
            <div key={doc.id} style={{
              background: '#1a1f2e', border: '1px solid #2d3348',
              borderRadius: '14px', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                  {getFileIcon(doc.file)}
                </div>
                <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {doc.title}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {doc.document_type_detail && (
                  <span style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '999px' }}>
                    {doc.document_type_detail.name}
                  </span>
                )}
              </div>

              <div style={{ fontSize: '12px', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span>📁 {doc.project_detail?.title || '—'}</span>
                <span>👤 {doc.uploaded_by_detail?.name || '—'}</span>
                <span>📅 {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : '—'}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                {doc.file_url && (
                  <a href={doc.file_url} target="_blank" rel="noreferrer" style={{ ...viewBtnStyle, flex: 1, textAlign: 'center' }}>
                    👁 View
                  </a>
                )}
                {doc.file_url && (
                  <button
                    onClick={() => handleDownload(doc)}
                    disabled={downloadingId === doc.id}
                    style={{ ...downloadBtnStyle, flex: 1, textAlign: 'center', opacity: downloadingId === doc.id ? 0.6 : 1 }}
                  >{downloadingId === doc.id ? '⏳...' : '⬇ Download'}</button>
                )}
                {canDelete && (
                  <button onClick={() => onDelete(doc.id)} style={{ ...deleteBtnStyle, flex: 1 }}>Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

const thStyle = { textAlign: 'left', padding: '16px 20px', color: '#94a3b8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }
const tdStyle = { padding: '16px 20px', fontSize: '14px' }

const viewBtnStyle = {
  background: '#2d3348', border: 'none', color: '#a5b4fc',
  fontSize: '12px', fontWeight: '600', padding: '7px 16px', borderRadius: '8px',
  cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
  justifyContent: 'center', gap: '4px', transition: 'all 0.15s',
}

const downloadBtnStyle = {
  background: '#4f46e5', border: 'none', color: '#fff',
  fontSize: '12px', fontWeight: '600', padding: '7px 16px', borderRadius: '8px',
  cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
  justifyContent: 'center', gap: '4px', transition: 'all 0.15s',
}

const deleteBtnStyle = {
  background: '#2d3348', border: 'none', color: '#f87171',
  fontSize: '12px', fontWeight: '600', padding: '7px 16px', borderRadius: '8px',
  cursor: 'pointer', transition: 'all 0.15s',
}