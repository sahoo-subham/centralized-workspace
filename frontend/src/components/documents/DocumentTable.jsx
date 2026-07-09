import { useState, useEffect } from 'react'
import {
  FileText, FileSpreadsheet, Presentation, Image, Archive, File as FileIcon,
  Eye, Download, Trash2, Loader2, Folder, User, Calendar,
} from 'lucide-react'

const getFileIconMeta = (filename) => {
  if (!filename) return { Icon: FileIcon, classes: 'bg-purple-500/15 border-purple-500/20 text-purple-300' }
  const ext = filename.split('.').pop().toLowerCase()
  if (['pdf'].includes(ext))
    return { Icon: FileText, classes: 'bg-rose-500/15 border-rose-500/20 text-rose-300' }
  if (['doc', 'docx'].includes(ext))
    return { Icon: FileText, classes: 'bg-indigo-500/15 border-indigo-500/20 text-indigo-300' }
  if (['xls', 'xlsx'].includes(ext))
    return { Icon: FileSpreadsheet, classes: 'bg-emerald-500/15 border-emerald-500/20 text-emerald-300' }
  if (['ppt', 'pptx'].includes(ext))
    return { Icon: Presentation, classes: 'bg-amber-500/15 border-amber-500/20 text-amber-300' }
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext))
    return { Icon: Image, classes: 'bg-purple-500/15 border-purple-500/20 text-purple-300' }
  if (['zip', 'rar'].includes(ext))
    return { Icon: Archive, classes: 'bg-slate-500/15 border-slate-500/20 text-slate-300' }
  return { Icon: FileIcon, classes: 'bg-purple-500/15 border-purple-500/20 text-purple-300' }
}

function DocumentTable({ documents, onDelete, canDelete }) {

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
        <div className="rounded-3xl border border-white/10 bg-white/3 backdrop-blur-2xl shadow-[0_8px_40px_-8px_rgba(0,0,0,0.4)] overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-linear-to-r from-purple-500/8 via-indigo-500/5 to-purple-500/8">
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Document</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Project</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Type</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Uploaded By</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Date</th>
                <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, i) => {
                const { Icon, classes } = getFileIconMeta(doc.file)
                return (
                  <tr key={doc.id}
                    className={`${i === 0 ? '' : 'border-t border-white/6'} transition-colors duration-150 hover:bg-purple-500/4`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${classes}`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-sm font-semibold text-white">{doc.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] text-slate-400">{doc.project_detail?.title || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      {doc.document_type_detail ? (
                        <span className="inline-block whitespace-nowrap rounded-full bg-purple-500/15 px-2.5 py-1 text-[11px] font-bold text-purple-300">
                          {doc.document_type_detail.name}
                        </span>
                      ) : (
                        <span className="text-[13px] text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] text-slate-400">{doc.uploaded_by_detail?.name || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400">
                        {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">

                        {doc.file_url && (
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/4 px-3.5 py-2 text-xs font-semibold text-indigo-300 transition-all duration-200 hover:bg-white/8 hover:text-white"
                          ><Eye size={13} /> View</a>
                        )}

                        <button
                          onClick={() => handleDownload(doc)}
                          disabled={downloadingId === doc.id}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-b from-purple-500 to-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_4px_14px_-2px_rgba(124,58,237,0.5)] transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {downloadingId === doc.id
                            ? <><Loader2 size={13} className="animate-spin" /> Downloading...</>
                            : <><Download size={13} /> Download</>
                          }
                        </button>

                        {canDelete && (
                          <button
                            onClick={() => onDelete(doc.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/4 text-red-400 transition-all duration-200 hover:bg-red-500/15 hover:border-red-400/30 hover:text-red-300"
                          ><Trash2 size={14} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {isMobile && (
        <div className="flex flex-col gap-3">
          {documents.map((doc) => {
            const { Icon, classes } = getFileIconMeta(doc.file)
            return (
              <div key={doc.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-4">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${classes}`}>
                    <Icon size={15} />
                  </div>
                  <span className="flex-1 truncate text-sm font-semibold text-white">{doc.title}</span>
                </div>

                {doc.document_type_detail && (
                  <div>
                    <span className="inline-block whitespace-nowrap rounded-full bg-purple-500/15 px-2.5 py-1 text-[11px] font-bold text-purple-300">
                      {doc.document_type_detail.name}
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-1 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><Folder size={12} /> {doc.project_detail?.title || '—'}</span>
                  <span className="inline-flex items-center gap-1.5"><User size={12} /> {doc.uploaded_by_detail?.name || '—'}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={12} /> {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : '—'}
                  </span>
                </div>

                <div className="flex gap-2 flex-wrap mt-1">
                  {doc.file_url && (
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/4 py-2 text-xs font-semibold text-indigo-300"
                    ><Eye size={13} /> View</a>
                  )}
                  <button
                    onClick={() => handleDownload(doc)}
                    disabled={downloadingId === doc.id}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-linear-to-b from-purple-500 to-indigo-600 py-2 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    {downloadingId === doc.id
                      ? <Loader2 size={13} className="animate-spin" />
                      : <><Download size={13} /> Download</>
                    }
                  </button>
                  {canDelete && (
                    <button
                      onClick={() => onDelete(doc.id)}
                      className="flex-1 rounded-lg border border-white/10 bg-white/4 py-2 text-xs font-semibold text-red-400"
                    >Delete</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default DocumentTable;