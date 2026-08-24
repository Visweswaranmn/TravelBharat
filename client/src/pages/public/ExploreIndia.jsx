import { useEffect, useState } from 'react'
import { Compass } from 'lucide-react'
import { getStates } from '../../services/stateService'
import { useDebounce } from '../../hooks/useDebounce'
import { usePageTitle } from '../../hooks/usePageTitle'
import StateCard from '../../components/cards/StateCard'
import SearchBar from '../../components/search/SearchBar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'

export default function ExploreIndia() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [states, setStates] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error

  usePageTitle('Explore India', 'Browse Indian states and union territories to discover their cities and destinations.')

  useEffect(() => {
    setStatus('loading')
    getStates({ search: debouncedSearch || undefined })
      .then((res) => {
        setStates(res.data.data.states)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [debouncedSearch])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-3xl font-semibold text-slate-900">Explore India</h1>
        <p className="text-slate-500 mt-2">
          Browse states and union territories to discover their cities and destinations.
        </p>
        <div className="mt-6">
          <SearchBar value={search} onChange={setSearch} placeholder="Search states..." />
        </div>
      </div>

      {status === 'loading' && <LoadingSpinner label="Loading states..." />}

      {status === 'error' && (
        <ErrorMessage message="Couldn't load states. Please check your connection and try again." />
      )}

      {status === 'success' && states.length === 0 && (
        <EmptyState icon={Compass} title="No states found" message="Try a different search term." />
      )}

      {status === 'success' && states.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {states.map((state) => (
            <StateCard key={state._id} state={state} />
          ))}
        </div>
      )}
    </div>
  )
}
