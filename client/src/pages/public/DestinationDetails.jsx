import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Clock, Ticket, CalendarDays, ExternalLink, Compass } from 'lucide-react'
import { getDestinationBySlug } from '../../services/destinationService'
import ImageGallery from '../../components/gallery/ImageGallery'
import DestinationCard from '../../components/cards/DestinationCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

function FactCard({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
      <Icon className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  )
}

export default function DestinationDetails() {
  const { slug } = useParams()
  const [destination, setDestination] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    setStatus('loading')
    getDestinationBySlug(slug)
      .then((res) => {
        setDestination(res.data.data.destination)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [slug])

  if (status === 'loading') return <LoadingSpinner label="Loading destination..." />
  if (status === 'error') return <ErrorMessage message="Couldn't load this destination. It may not exist." />

  const {
    name,
    state,
    city,
    category,
    shortDescription,
    description,
    historicalSignificance,
    bestTimeToVisit,
    entryFee,
    openingTime,
    closingTime,
    mapUrl,
    images,
    nearbyAttractions,
    travelTips,
  } = destination

  const hours = [openingTime, closingTime].filter(Boolean).join(' – ')

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <p className="text-sm text-slate-500">
        <Link to={`/states/${state?.slug}`} className="hover:text-orange-600">
          {state?.name}
        </Link>
        {city?.name && (
          <>
            {' / '}
            <Link to={`/states/${state?.slug}/${city?.slug}`} className="hover:text-orange-600">
              {city?.name}
            </Link>
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center gap-3 mt-2 mb-6">
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">{name}</h1>
        {category?.name && (
          <span className="bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1 rounded-full">{category.name}</span>
        )}
      </div>

      <ImageGallery images={images} />

      <p className="text-lg text-slate-600 mt-6 leading-relaxed">{shortDescription}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <FactCard icon={CalendarDays} label="Best time to visit" value={bestTimeToVisit} />
        <FactCard icon={Ticket} label="Entry fee" value={entryFee} />
        <FactCard icon={Clock} label="Hours" value={hours} />
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg px-5 py-2.5 transition-colors"
          >
            <MapPin className="w-4 h-4" /> View on Map <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
        {nearbyAttractions?.length > 0 && (
          <a
            href="#nearby"
            className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-lg px-5 py-2.5 transition-colors"
          >
            <Compass className="w-4 h-4" /> Explore Nearby
          </a>
        )}
        <Link
          to={`/states/${state?.slug}`}
          className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-lg px-5 py-2.5 transition-colors"
        >
          ← Back to {state?.name}
        </Link>
      </div>

      <div className="prose prose-slate max-w-none mt-10">
        <h2 className="text-xl font-semibold text-slate-900">About</h2>
        <p className="text-slate-600 leading-relaxed">{description}</p>

        {historicalSignificance && (
          <>
            <h2 className="text-xl font-semibold text-slate-900 mt-6">Historical Significance</h2>
            <p className="text-slate-600 leading-relaxed">{historicalSignificance}</p>
          </>
        )}
      </div>

      {travelTips?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Travel Tips</h2>
          <ul className="space-y-2">
            {travelTips.map((tip, index) => (
              <li key={index} className="flex gap-2 text-slate-600">
                <span className="text-orange-600 mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {nearbyAttractions?.length > 0 && (
        <div id="nearby" className="mt-12 scroll-mt-20">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Nearby Attractions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyAttractions.map((nearby) => (
              <DestinationCard key={nearby._id} destination={nearby} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
