import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'

// Footer arrives in the UI polish phase once there's real content to put in it.
export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
