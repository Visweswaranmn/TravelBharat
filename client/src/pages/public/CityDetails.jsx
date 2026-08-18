import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { getCity } from '../../services/cityService'
import { getDestinations } from '../../services/destinationService'
import DestinationCard from '../../components/cards/DestinationCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'

export default function CityDetails() {
  const { stateSlug, citySlug } = useParams()
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')
  const [destinations, setDestinations] = useState([])
  const [destinationsStatus, setDestinationsStatus] = useState('loading')

  useEffect(() => {
    setStatus('loading')
    getCity(stateSlug, citySlug)
      .then((res) => {
        setData(res.data.data)
        setStatus('success')
      })
      .catch(() => setStatus('error'))

    setDestinationsStatus('loading')
    getDestinations({ state: stateSlug, city: citySlug, limit: 50 })
      .then((res) => {
        setDestinations(res.data.data.destinations)
        setDestinationsStatus('success')
      })
      .catch(() => setDestinationsStatus('error'))
  }, [stateSlug, citySlug])

  if (status === 'loading') return <LoadingSpinner label="Loading city..." />
  if (status === 'error') return <ErrorMessage message="Couldn't load this city. It may not exist." />

  const { city, destinationCount } = data

  return (
    <div>
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img src={city.image?.url} alt={city.image?.alt || city.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-4 pb-8 text-white">
          <h1 className="text-3xl sm:text-4xl font-semibold">{city.name}</h1>
          <p className="text-white/90 mt-1">{city.state?.name}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-slate-600 max-w-3xl leading-relaxed">{city.description}</p>
        <p className="text-sm text-slate-500 mt-4">
          {destinationCount} destination{destinationCount === 1 ? '' : 's'}
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-10 mb-4">Major Attractions</h2>
        {destinationsStatus === 'loading' && <LoadingSpinner label="Loading attractions..." />}
        {destinationsStatus === 'error' && <ErrorMessage message="Couldn't load attractions for this city." />}
        {destinationsStatus === 'success' && destinations.length === 0 && (
          <EmptyState icon={Compass} title="No attractions yet" message="Attractions for this city are coming soon." />
        )}
        {destinationsStatus === 'success' && destinations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <DestinationCard key={destination._id} destination={destination} />
            ))}
          </div>
        )}

        <Link
          to={`/states/${city.state?.slug}`}
          className="inline-block mt-10 text-sm font-medium text-orange-600 hover:underline"
        >
          ← Back to {city.state?.name}
        </Link>
      </div>
    </div>
  )
}
