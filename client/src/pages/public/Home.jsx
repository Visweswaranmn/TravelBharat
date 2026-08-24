import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { getCategories } from '../../services/categoryService'
import { usePageTitle } from '../../hooks/usePageTitle'
import SearchBar from '../../components/search/SearchBar'
import CategoryCard from '../../components/cards/CategoryCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [categories, setCategories] = useState([])
  const [categoriesStatus, setCategoriesStatus] = useState('loading')

  usePageTitle(null, "Explore India's states, cities, culture, heritage and unforgettable destinations — all in one place.")

  useEffect(() => {
    getCategories()
      .then((res) => {
        setCategories(res.data.data.categories)
        setCategoriesStatus('success')
      })
      .catch(() => setCategoriesStatus('error'))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div>
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight">
          Discover India, One Destination at a Time
        </h1>
        <p className="mt-4 text-lg text-slate-500">
          Explore India&apos;s states, cities, culture, heritage and unforgettable destinations — all in one place.
        </p>

        <form onSubmit={handleSearch} className="mt-8 max-w-md mx-auto">
          <SearchBar value={query} onChange={setQuery} placeholder="Search destinations, states, categories..." />
        </form>

        <Link
          to="/explore"
          className="inline-flex items-center gap-2 mt-6 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg px-6 py-3 transition-colors"
        >
          <Compass className="w-4 h-4" />
          Explore India
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-24">
        <h2 className="text-2xl font-semibold text-slate-900 text-center mb-8">Browse by Category</h2>
        {categoriesStatus === 'loading' && <LoadingSpinner label="Loading categories..." />}
        {categoriesStatus === 'success' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
