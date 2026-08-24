import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import { searchDestinations, getDestinations } from '../../services/destinationService'
import { getStates } from '../../services/stateService'
import { getCities } from '../../services/cityService'
import { getCategories } from '../../services/categoryService'
import { useDebounce } from '../../hooks/useDebounce'
import { usePageTitle } from '../../hooks/usePageTitle'
import SearchBar from '../../components/search/SearchBar'
import DestinationCard from '../../components/cards/DestinationCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'
import { inputClass } from '../../components/admin/formStyles'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const debouncedQuery = useDebounce(query, 400)

  const [stateFilter, setStateFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [categories, setCategories] = useState([])

  const [results, setResults] = useState([])
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  usePageTitle(
    debouncedQuery ? `Search results for "${debouncedQuery}"` : 'Search',
    'Search TravelBharat by destination name, state, city, or category.'
  )

  // Filter dropdown options, loaded once.
  useEffect(() => {
    getStates({ limit: 100 })
      .then((res) => setStates(res.data.data.states))
      .catch(() => {})
    getCities({})
      .then((res) => setCities(res.data.data.cities))
      .catch(() => {})
    getCategories()
      .then((res) => setCategories(res.data.data.categories))
      .catch(() => {})
  }, [])

  // Cities narrow down to whichever state is selected in the filter.
  const citiesForSelectedState = useMemo(
    () => (stateFilter ? cities.filter((city) => city.state?.slug === stateFilter) : cities),
    [cities, stateFilter]
  )

  const handleStateChange = (slug) => {
    setStateFilter(slug)
    // A city filter that no longer belongs to the newly picked state is stale.
    if (slug && cityFilter) {
      const stillValid = cities.some((c) => c.slug === cityFilter && c.state?.slug === slug)
      if (!stillValid) setCityFilter('')
    }
  }

  useEffect(() => {
    setSearchParams(debouncedQuery ? { q: debouncedQuery } : {}, { replace: true })

    const hasQuery = debouncedQuery.trim().length > 0
    const hasFilters = stateFilter || cityFilter || categoryFilter

    if (!hasQuery && !hasFilters) {
      setResults([])
      setStatus('idle')
      return
    }

    setStatus('loading')

    if (hasQuery) {
      // Text search doesn't take state/city/category on the API side, so
      // filters are applied client-side on top of the search results —
      // simpler than teaching the search endpoint two query strategies.
      searchDestinations(debouncedQuery)
        .then((res) => {
          let matches = res.data.data.destinations
          if (stateFilter) matches = matches.filter((d) => d.state?.slug === stateFilter)
          if (cityFilter) matches = matches.filter((d) => d.city?.slug === cityFilter)
          if (categoryFilter) matches = matches.filter((d) => d.category?.slug === categoryFilter)
          setResults(matches)
          setStatus('success')
        })
        .catch(() => setStatus('error'))
    } else {
      getDestinations({
        state: stateFilter || undefined,
        city: cityFilter || undefined,
        category: categoryFilter || undefined,
        limit: 50,
      })
        .then((res) => {
          setResults(res.data.data.destinations)
          setStatus('success')
        })
        .catch(() => setStatus('error'))
    }
    // setSearchParams is stable across renders (from react-router) — safe to omit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, stateFilter, cityFilter, categoryFilter])

  const resultsLabel = () => {
    const parts = []
    if (debouncedQuery.trim()) parts.push(`"${debouncedQuery}"`)
    if (stateFilter) parts.push(states.find((s) => s.slug === stateFilter)?.name)
    if (cityFilter) parts.push(cities.find((c) => c.slug === cityFilter)?.name)
    if (categoryFilter) parts.push(categories.find((c) => c.slug === categoryFilter)?.name)
    return parts.filter(Boolean).join(', ')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center max-w-xl mx-auto mb-6">
        <h1 className="text-3xl font-semibold text-slate-900">Search Destinations</h1>
        <p className="text-slate-500 mt-2">Search by destination name, state, city or category.</p>
        <div className="mt-6">
          <SearchBar value={query} onChange={setQuery} placeholder="Try &quot;Ooty&quot;, &quot;Kerala&quot;, or &quot;Heritage&quot;..." />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <select value={stateFilter} onChange={(e) => handleStateChange(e.target.value)} className={`${inputClass} w-auto`}>
          <option value="">All States</option>
          {states.map((state) => (
            <option key={state._id} value={state.slug}>
              {state.name}
            </option>
          ))}
        </select>

        <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className={`${inputClass} w-auto`}>
          <option value="">All Cities</option>
          {citiesForSelectedState.map((city) => (
            <option key={city._id} value={city.slug}>
              {city.name}
            </option>
          ))}
        </select>

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={`${inputClass} w-auto`}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {status === 'idle' && (
        <EmptyState
          icon={SearchIcon}
          title="Start typing or pick a filter"
          message="Search across destinations, states, cities and categories — or narrow things down with the filters above."
        />
      )}

      {status === 'loading' && <LoadingSpinner label="Searching..." />}
      {status === 'error' && <ErrorMessage message="Couldn't complete the search. Please try again." />}

      {status === 'success' && (
        <>
          <p className="text-sm text-slate-500 mb-4">
            {results.length} result{results.length === 1 ? '' : 's'}
            {resultsLabel() && ` for ${resultsLabel()}`}
          </p>
          {results.length === 0 ? (
            <EmptyState icon={SearchIcon} title="No results found" message="Try a different search term or filter combination." />
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
