import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'

// TODO: add a real Footer component once there's enough content for one.
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
