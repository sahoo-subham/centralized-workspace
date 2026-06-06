import { useState } from 'react'
import Navbar    from '../components/Navbar'
import Teams     from './Teams'
import Projects  from './Projects'
import Tasks     from './Tasks'
import Documents from './Documents'
import { logout } from '../services/authService'

function PageContent({ activePage }) {
  if (activePage === 'Teams')     return <Teams />
  if (activePage === 'Projects')  return <Projects />
  if (activePage === 'Tasks')     return <Tasks />
  if (activePage === 'Documents') return <Documents />

  return (
    <main className="w-full px-8 py-6">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      <p className="text-gray-400 mt-2">Welcome back 👋</p>
    </main>
  )
}

export default function Dashboard() {
  const [activePage, setActivePage] = useState('Dashboard')

  return (
    <div className="w-screen h-screen bg-gray-900 flex flex-col overflow-hidden">
      <Navbar
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        onLogout={logout}
      />
      <div className="flex-1 overflow-y-auto">
        <PageContent activePage={activePage} />
      </div>
    </div>
  )
}