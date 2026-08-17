import { useEffect, useState } from 'react'
import api from './services/api'

// Phase 1 placeholder — proves Tailwind is styling correctly and the
// client can reach the Express API. Real routing and pages arrive in
// later phases.
function App() {
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    api
      .get('/health')
      .then(() => setApiStatus('connected'))
      .catch(() => setApiStatus('unreachable'))
  }, [])

  const statusStyles = {
    checking: 'bg-amber-100 text-amber-800',
    connected: 'bg-emerald-100 text-emerald-800',
    unreachable: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg shadow-slate-200 p-8 text-center border border-slate-100">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
          TravelBharat
        </h1>
        <p className="mt-2 text-slate-500">
          Explore India, State by State — project skeleton is running.
        </p>

        <div
          className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusStyles[apiStatus]}`}
        >
          <span className="w-2 h-2 rounded-full bg-current" />
          API status: {apiStatus}
        </div>
      </div>
    </div>
  )
}

export default App
