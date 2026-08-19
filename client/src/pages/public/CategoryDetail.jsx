import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCategory } from '../../services/categoryService'
import { getDestinations } from '../../services/destinationService'
import { getCategoryIcon } from '../../utils/categoryIcons'
import DestinationCard from '../../components/cards/DestinationCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'

export default function CategoryDetail() {
  const { categorySlug } = useParams()
  const [category, setCategory] = useState(null)
  const [status, setStatus] = useState('loading')
  const [destinations, setDestinations] = useState([])
  const [destinationsStatus, setDestinationsStatus] = useState('loading')

  useEffect(() => {
    setStatus('loading')
    getCategory(categorySlug)
      .then((res) => {
        setCategory(res.data.data.category)
        setStatus('success')
      })
      .catch(() => setStatus('error'))

    setDestinationsStatus('loading')
    getDestinations({ category: categorySlug, limit: 50 })
      .then((res) => {
        setDestinations(res.data.data.destinations)
        setDestinationsStatus('success')
      })
      .catch(() => setDestinationsStatus('error'))
  }, [categorySlug])

  if (status === 'loading') return <LoadingSpinner label="Loading category..." />
  if (status === 'error') return <ErrorMessage message="Couldn't load this category. It may not exist." />

  const Icon = getCategoryIcon(category.slug)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="w-14 h-14 mx-auto rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-3">
          <Icon className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">{category.name}</h1>
        {category.description && <p className="text-slate-500 mt-2">{category.description}</p>}
      </div>

      {destinationsStatus === 'loading' && <LoadingSpinner label="Loading destinations..." />}
      {destinationsStatus === 'error' && <ErrorMessage message="Couldn't load destinations for this category." />}
      {destinationsStatus === 'success' && destinations.length === 0 && (
        <EmptyState title="No destinations yet" message="Destinations in this category are coming soon." />
      )}
      {destinationsStatus === 'success' && destinations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <DestinationCard key={destination._id} destination={destination} />
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <Link to="/categories" className="text-sm font-medium text-orange-600 hover:underline">
          ← All Categories
        </Link>
      </div>
    </div>
  )
}
