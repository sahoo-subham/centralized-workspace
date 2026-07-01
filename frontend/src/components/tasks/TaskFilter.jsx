import { useState } from "react"

const STATUS_FILTERS = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
]

const PRIORITY_FILTERS = [
  { value: "", label: "All Priority" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

export default function TaskFilter({
  projects,
  statusFilter,
  priorityFilter,
  projectFilter,
  onStatusChange,
  onPriorityChange,
  onProjectChange,
  onClear,
}) {

  const [statusOpen,setStatusOpen] = useState(false)
  const [priorityOpen,setPriorityOpen] = useState(false)
  const [projectOpen,setProjectOpen] = useState(false)

  const selectedStatus = STATUS_FILTERS.find(
    s=>s.value===statusFilter
  )

  const selectedPriority = PRIORITY_FILTERS.find(
    p=>p.value===priorityFilter
  )

  const selectedProject = projects.find(
    p=>p.id===parseInt(projectFilter)
  )

  const box = `
  bg-[#232938]
  border border-[#3f4659]
  rounded-xl
  text-white
  px-4 py-3
  cursor-pointer
  transition
  hover:border-indigo-500
  `

  const Item = ({active,children,onClick})=>(
    <div
      onClick={onClick}
      className={`
      px-3 py-2
      rounded-lg
      text-sm
      cursor-pointer
      transition

      ${
        active
        ?
        "bg-indigo-500/20 text-indigo-300"
        :
        "text-gray-300 hover:bg-white/10"
      }

      `}
    >
      {children}
    </div>
  )

  return (

    <div className="
    flex
    gap-4
    mb-6
    flex-wrap
    items-end
    ">

      <div className="relative">

        <label className="
        block text-xs font-semibold
        uppercase tracking-wider
        text-gray-400 mb-2
        ">
          Filter by Status
        </label>

        <div
        onClick={()=>setStatusOpen(true)}
        className={`${box} min-w-45 flex justify-between`}
        >
          {selectedStatus.label}
          <span className="text-gray-500">
            ▾
          </span>
        </div>
        {statusOpen && (
        <>
        <div
        className="fixed inset-0 z-40"
        onClick={()=>setStatusOpen(false)}
        />
        <div className="
        absolute
        z-50
        mt-2
        w-full
        bg-[#1f2433]
        border border-[#3f4659]
        rounded-xl
        p-2
        shadow-2xl
        ">
        {
          STATUS_FILTERS.map(s=>(

            <Item
            key={s.value}
            active={statusFilter===s.value}
            onClick={()=>{

              onStatusChange(s.value)
              setStatusOpen(false)

            }}
            >
            {s.label}
            </Item>
          ))
        }

        </div>
        </>
        )}
      </div>

      <div className="relative">

        <label className="
        block text-xs font-semibold
        uppercase tracking-wider
        text-gray-400 mb-2
        ">
          Filter by Priority
        </label>
        <div
        onClick={()=>setPriorityOpen(true)}
        className={`${box} min-w-45 flex justify-between`}
        >
          {selectedPriority.label}
          <span className="text-gray-500">
            ▾
          </span>
        </div>

        {priorityOpen && (
        <>
        <div
        className="fixed inset-0 z-40"
        onClick={()=>setPriorityOpen(false)}
        />
        <div className="
        absolute z-50 mt-2 w-full
        bg-[#1f2433]
        border border-[#3f4659]
        rounded-xl
        p-2 shadow-2xl
        ">
        {
          PRIORITY_FILTERS.map(p=>(
            <Item
            key={p.value}
            active={priorityFilter===p.value}
            onClick={()=>{
              onPriorityChange(p.value)
              setPriorityOpen(false)
            }}
            >
            {p.label}
            </Item>
          ))
        }
        </div>
        </>
        )}
      </div>

      <div className="relative">

        <label className="
        block text-xs font-semibold
        uppercase tracking-wider
        text-gray-400 mb-2
        ">
          Filter by Project
        </label>

        <div
        onClick={()=>setProjectOpen(true)}
        className={`${box} min-w-[210px] flex justify-between`}
        >
        <span className="truncate">
        {
          selectedProject
          ?
          selectedProject.title
          :
          "All Projects"
        }
        </span>
        <span className="text-gray-500">
          ▾
        </span>
        </div>
        {projectOpen && (
        <>
        <div
        className="fixed inset-0 z-40"
        onClick={()=>setProjectOpen(false)}
        />
        <div className="
        absolute z-50 mt-2 w-full
        bg-[#1f2433]
        border border-[#3f4659]
        rounded-xl
        p-2
        shadow-2xl
        ">
        <Item
        active={!projectFilter}
        onClick={()=>{

          onProjectChange("")
          setProjectOpen(false)

        }}
        >
          All Projects
        </Item>

        {
          projects.map(p=>(

            <Item
            key={p.id}
            active={parseInt(projectFilter)===p.id}
            onClick={()=>{

              onProjectChange(String(p.id))
              setProjectOpen(false)

            }}
            >
            📁 {p.title}

            </Item>
          ))
        }
        </div>
        </>
        )}
      </div>
      {
        (statusFilter || priorityFilter || projectFilter) &&
        <button
        onClick={onClear}
        className="
        px-4 py-3
        rounded-xl
        border border-[#3f4659]
        text-gray-400
        text-sm
        hover:border-red-400
        hover:text-red-400
        transition
        "
        >
        ✕ Clear filters
        </button>
      }
    </div>
  )
}