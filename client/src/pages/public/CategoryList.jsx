import { useEffect, useState } from 'react'
import { getCategories } from '../../services/categoryService'
import { usePageTitle } from '../../hooks/usePageTitle'
import CategoryCard from '../../components/cards/CategoryCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

export default function CategoryList() {
  const [categories, setCategories] = useState([])
  const [status, setStatus] = useState('loading')

  usePageTitle('Browse by Category', 'Heritage, nature, adventure and more — find Indian destinations by what interests you.')

  useEffect(() => {
    getCategories()
      .then((res) => {
        setCategories(res.data.data.categories)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-3xl font-semibold text-slate-900">Browse by Category</h1>
        <p className="text-slate-500 mt-2">Heritage, nature, adventure and more — find destinations by what interests you.</p>
      </div>

      {status === 'loading' && <LoadingSpinner label="Loading categories..." />}
      {status === 'error' && <ErrorMessage message="Couldn't load categories. Please try again." />}
      {status === 'success' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      )}
    </div>
  )
}
