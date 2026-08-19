import { Link } from 'react-router-dom'
import { getCategoryIcon } from '../../utils/categoryIcons'

export default function CategoryCard({ category }) {
  const Icon = getCategoryIcon(category.slug)

  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group flex flex-col items-center text-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all"
    >
      <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-slate-900">{category.name}</h3>
      {typeof category.destinationCount === 'number' && (
        <p className="text-xs text-slate-400">
          {category.destinationCount} destination{category.destinationCount === 1 ? '' : 's'}
        </p>
      )}
    </Link>
  )
}
