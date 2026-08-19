import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import { searchDestinations } from '../../services/destinationService'
import { useDebounce } from '../../hooks/useDebounce'
import SearchBar from '../../components/search/SearchBar'
import DestinationCard from '../../components/cards/DestinationCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const debouncedQuery = useDebounce(query, 400)
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  useEffect(() => {
    setSearchParams(debouncedQuery ? { q: debouncedQuery } : {}, { replace: true })

    if (!debouncedQuery.trim()) {
      setResults([])
      setStatus('idle')
      return
    }

    setStatus('loading')
    searchDestinations(debouncedQuery)
      .then((res) => {
        setResults(res.data.data.destinations)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
    // setSearchParams is stable across renders (from react-router) — safe to omit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-3xl font-semibold text-slate-900">Search Destinations</h1>
        <p className="text-slate-500 mt-2">Search by destination name, state, city or category.</p>
        <div className="mt-6">
          <SearchBar value={query} onChange={setQuery} placeholder="Try &quot;Ooty&quot;, &quot;Kerala&quot;, or &quot;Heritage&quot;..." />
        </div>
      </div>

      {status === 'idle' && (
        <EmptyState
          icon={SearchIcon}
          title="Start typing to search"
          message="Search across destinations, states, cities and categories."
        />
      )}

      {status === 'loading' && <LoadingSpinner label="Searching..." />}
      {status === 'error' && <ErrorMessage message="Couldn't complete the search. Please try again." />}

      {status === 'success' && (
        <>
          <p className="text-sm text-slate-500 mb-4">
            {results.length} result{results.length === 1 ? '' : 's'} for &quot;{debouncedQuery}&quot;
          </p>
          {results.length === 0 ? (
            <EmptyState icon={SearchIcon} title="No results found" message="Try a different search term." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((destination) => (
                <DestinationCard key={destination._id} destination={destination} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
