import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Building2, Compass } from 'lucide-react'
import { getState } from '../../services/stateService'
import { getDestinations } from '../../services/destinationService'
import { usePageTitle } from '../../hooks/usePageTitle'
import CityCard from '../../components/cards/CityCard'
import DestinationCard from '../../components/cards/DestinationCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'

export default function StateDetails() {
  const { stateSlug } = useParams()
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')
  const [destinations, setDestinations] = useState([])
  const [destinationsStatus, setDestinationsStatus] = useState('loading')

  useEffect(() => {
    setStatus('loading')
    getState(stateSlug)
      .then((res) => {
        setData(res.data.data)
        setStatus('success')
      })
      .catch(() => setStatus('error'))

    setDestinationsStatus('loading')
    getDestinations({ state: stateSlug, limit: 50 })
      .then((res) => {
        setDestinations(res.data.data.destinations)
        setDestinationsStatus('success')
      })
      .catch(() => setDestinationsStatus('error'))
  }, [stateSlug])

  usePageTitle(data?.state?.name, data?.state?.description)

  if (status === 'loading') return <LoadingSpinner label="Loading state..." />
  if (status === 'error') return <ErrorMessage message="Couldn't load this state. It may not exist." />

  const { state, cities, destinationCount } = data

  return (
    <div>
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img src={state.image?.url} alt={state.image?.alt || state.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-4 pb-8 text-white">
          <h1 className="text-3xl sm:text-4xl font-semibold">{state.name}</h1>
          <p className="flex items-center gap-1.5 mt-2 text-white/90">
            <MapPin className="w-4 h-4" /> Capital: {state.capital}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-slate-600 max-w-3xl leading-relaxed">{state.description}</p>

        <div className="flex gap-6 mt-6 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4" /> {cities.length} cit{cities.length === 1 ? 'y' : 'ies'}
          </span>
          <span>
            {destinationCount} destination{destinationCount === 1 ? '' : 's'}
          </span>
        </div>

        <h2 className="text-xl font-semibold text-slate-900 mt-10 mb-4">Popular Cities</h2>
        {cities.length === 0 ? (
          <EmptyState title="No cities yet" message="Cities for this state are coming soon." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <CityCard key={city._id} city={city} stateSlug={state.slug} />
            ))}
          </div>
        )}

        <h2 className="text-xl font-semibold text-slate-900 mt-10 mb-4">Tourist Destinations</h2>
        {destinationsStatus === 'loading' && <LoadingSpinner label="Loading destinations..." />}
        {destinationsStatus === 'error' && <ErrorMessage message="Couldn't load destinations for this state." />}
        {destinationsStatus === 'success' && destinations.length === 0 && (
          <EmptyState icon={Compass} title="No destinations yet" message="Destinations for this state are coming soon." />
        )}
        {destinationsStatus === 'success' && destinations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <DestinationCard key={destination._id} destination={destination} />
            ))}
          </div>
        )}

        <Link to="/explore" className="inline-block mt-10 text-sm font-medium text-orange-600 hover:underline">
          ← Back to Explore India
        </Link>
      </div>
    </div>
  )
}
