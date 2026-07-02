// import { useState } from 'react'

// function TeamFilter({ teams, selectedTeam, onFilterChange }) {

//   const [search, setSearch]       = useState('')
//   const [dropdownOpen, setDropdownOpen] = useState(false)

//   const filteredTeams = teams.filter((t) =>
//     t.team_name?.toLowerCase().includes(search.toLowerCase())
//   )

//   const selectedTeamObj = teams.find((t) => t.id === parseInt(selectedTeam))

//   const inputStyle = {
//     width: '100%',
//     background: '#232938',
//     border: '1px solid #3f4659',
//     borderRadius: '14px',
//     color: '#fff',
//     fontSize: '14px',
//     padding: '13px 16px',
//     outline: 'none',
//     boxSizing: 'border-box', 
//     fontFamily: 'inherit',
//   }

//   const folderIconStyle = {
//     width: '28px', height: '28px', borderRadius: '8px',
//     background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)',
//     display: 'flex', alignItems: 'center', justifyContent: 'center',
//     fontSize: '13px', flexShrink: 0,
//   }

//   return (
//     <div style={{ width: '100%', maxWidth: '360px', position: 'relative' }}>
//       <label style={{
//         color: '#94a3b8', fontSize: '11px', fontWeight: '600',
//         textTransform: 'uppercase', letterSpacing: '0.08em',
//         display: 'block', marginBottom: '10px',
//       }}>
//         Filter by Team
//       </label>

//       <div
//         onClick={() => setDropdownOpen(true)}
//         style={{
//           ...inputStyle,
//           display: 'flex', alignItems: 'center', gap: '10px',
//           cursor: 'pointer',
//           borderColor: dropdownOpen ? '#6366f1' : '#3f4659',
//         }}
//       >
//         {selectedTeamObj && !dropdownOpen ? (
//           <>
//             <div style={folderIconStyle}>📁</div>
//             <span style={{ color: '#fff', flex: 1 }}>{selectedTeamObj.team_name}</span>
//             <span style={{ color: '#6b7280', fontSize: '12px' }}>▾</span>
//           </>
//         ) : !dropdownOpen && !selectedTeam ? (
//           <>
//             <span style={{ color: '#6b7280' }}>📁</span>
//             <span style={{ color: '#9ca3af', flex: 1 }}>All Teams</span>
//             <span style={{ color: '#6b7280', fontSize: '12px' }}>▾</span>
//           </>
//         ) : (
//           <>
//             <span style={{ color: '#6b7280' }}>🔍</span>
//             <input
//               autoFocus
//               value={search}
//               onChange={(e) => { setSearch(e.target.value); setDropdownOpen(true) }}
//               onFocus={() => setDropdownOpen(true)}
//               placeholder="Search teams..."
//               style={{
//                 flex: 1, background: 'transparent', border: 'none', outline: 'none',
//                 color: '#fff', fontSize: '14px', fontFamily: 'inherit',
//               }}
//             />
//           </>
//         )}
//       </div>

//       {dropdownOpen && (
//         <>
//           <div
//             onClick={() => setDropdownOpen(false)}
//             style={{ position: 'fixed', inset: 0, zIndex: 60 }}
//           />
//           <div style={{
//             position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
//             zIndex: 61,
//             background: '#1f2433',
//             border: '1px solid #3f4659',
//             borderRadius: '14px',
//             boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
//             maxHeight: '280px',
//             overflowY: 'auto',
//             padding: '6px',
//           }}>

//             <div
//               onClick={() => { onFilterChange(''); setSearch(''); setDropdownOpen(false) }}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: '10px',
//                 padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
//                 background: selectedTeam === '' ? 'rgba(99,102,241,0.15)' : 'transparent',
//               }}
//               onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
//               onMouseLeave={e => e.currentTarget.style.background = selectedTeam === '' ? 'rgba(99,102,241,0.15)' : 'transparent'}
//             >
//               <div style={folderIconStyle}>🗂️</div>
//               <span style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: '600' }}>All Teams</span>
//             </div>

//             <div style={{ borderTop: '1px solid #2d3348', margin: '6px 0' }} />

//             {filteredTeams.length === 0 ? (
//               <p style={{ color: '#6b7280', fontSize: '13px', padding: '14px', textAlign: 'center', margin: 0 }}>
//                 No teams found.
//               </p>
//             ) : (
//               filteredTeams.map((t) => (
//                 <div
//                   key={t.id}
//                   onClick={() => { onFilterChange(String(t.id)); setSearch(''); setDropdownOpen(false) }}
//                   style={{
//                     display: 'flex', alignItems: 'center', gap: '10px',
//                     padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
//                     background: parseInt(selectedTeam) === t.id ? 'rgba(99,102,241,0.15)' : 'transparent',
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
//                   onMouseLeave={e => e.currentTarget.style.background = parseInt(selectedTeam) === t.id ? 'rgba(99,102,241,0.15)' : 'transparent'}
//                 >
//                   <div style={folderIconStyle}>📁</div>
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <p style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: '600', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                       {t.team_name}
//                     </p>
//                   </div>
//                   <span style={{
//                     background: 'rgba(99,102,241,0.15)', color: '#a5b4fc',
//                     fontSize: '11px', fontWeight: '700',
//                     padding: '3px 10px', borderRadius: '999px', whiteSpace: 'nowrap',
//                   }}>
//                     👥 {t.members?.length ?? 0}
//                   </span>
//                 </div>
//               ))
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   )
// }
// export default TeamFilter;





import { useState } from 'react'
import { Folder, FolderOpen, Search, ChevronDown, Users, Layers } from 'lucide-react'

function TeamFilter({ teams, selectedTeam, onFilterChange }) {

  const [search, setSearch]       = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const filteredTeams = teams.filter((t) =>
    t.team_name?.toLowerCase().includes(search.toLowerCase())
  )

  const selectedTeamObj = teams.find((t) => t.id === parseInt(selectedTeam))

  return (
    <div className="w-full max-w-sm relative">
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-2.5">
        Filter by Team
      </label>

      <div
        onClick={() => setDropdownOpen(true)}
        className={`flex items-center gap-2.5 w-full rounded-2xl bg-white/80 backdrop-blur-xl border px-4 py-3 cursor-pointer shadow-sm transition-all duration-200 ${
          dropdownOpen ? 'border-purple-400 ring-4 ring-purple-500/10' : 'border-[#E5DBC9] hover:border-[#D9CDBB]'
        }`}
      >
        {selectedTeamObj && !dropdownOpen ? (
          <>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-50 border border-purple-200 text-purple-600">
              <FolderOpen size={14} />
            </span>
            <span className="flex-1 text-sm text-stone-900 truncate">{selectedTeamObj.team_name}</span>
            <ChevronDown size={15} className="text-stone-400" />
          </>
        ) : !dropdownOpen && !selectedTeam ? (
          <>
            <Folder size={16} className="text-stone-400" />
            <span className="flex-1 text-sm text-stone-500">All Teams</span>
            <ChevronDown size={15} className="text-stone-400" />
          </>
        ) : (
          <>
            <Search size={15} className="text-stone-400 shrink-0" />
            <input
              autoFocus
              value={search}
              onChange={(e) => { setSearch(e.target.value); setDropdownOpen(true) }}
              onFocus={() => setDropdownOpen(true)}
              placeholder="Search teams..."
              className="flex-1 bg-transparent outline-none text-sm text-stone-900 placeholder:text-stone-400"
            />
          </>
        )}
      </div>

      {dropdownOpen && (
        <>
          <div
            onClick={() => setDropdownOpen(false)}
            className="fixed inset-0 z-[60]"
          />
          <div className="absolute z-[61] left-0 right-0 top-[calc(100%+6px)] max-h-[280px] overflow-y-auto rounded-2xl border border-[#E5DBC9] bg-white/95 backdrop-blur-2xl shadow-[0_20px_50px_-12px_rgba(80,63,32,0.15)] p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">

            <div
              onClick={() => { onFilterChange(''); setSearch(''); setDropdownOpen(false) }}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 cursor-pointer transition-colors duration-150 ${
                selectedTeam === '' ? 'bg-purple-50' : 'hover:bg-[#F7F2EA]'
              }`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-50 border border-purple-200 text-purple-600">
                <Layers size={13} />
              </span>
              <span className="text-[13px] font-semibold text-stone-700">All Teams</span>
            </div>

            <div className="my-1.5 border-t border-[#EFE8DE]" />

            {filteredTeams.length === 0 ? (
              <p className="py-4 text-center text-[13px] text-stone-400">No teams found.</p>
            ) : (
              filteredTeams.map((t) => (
                <div
                  key={t.id}
                  onClick={() => { onFilterChange(String(t.id)); setSearch(''); setDropdownOpen(false) }}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 cursor-pointer transition-colors duration-150 ${
                    parseInt(selectedTeam) === t.id ? 'bg-purple-50' : 'hover:bg-[#F7F2EA]'
                  }`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-50 border border-purple-200 text-purple-600">
                    <Folder size={13} />
                  </span>
                  <p className="flex-1 min-w-0 truncate text-[13px] font-semibold text-stone-700">
                    {t.team_name}
                  </p>
                  <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-600">
                    <Users size={11} /> {t.members?.length ?? 0}
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
export default TeamFilter;