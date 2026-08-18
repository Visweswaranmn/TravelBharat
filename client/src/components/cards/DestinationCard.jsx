import { Link } from 'react-router-dom'

export default function DestinationCard({ destination }) {
  return (
    <Link
      to={`/destinations/${destination.slug}`}
      className="group block rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
        <img
          src={destination.images?.[0]?.url}
          alt={destination.images?.[0]?.alt || destination.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {destination.category?.name && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-medium text-slate-700 px-2.5 py-1 rounded-full">
            {destination.category.name}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900">{destination.name}</h3>
        {(destination.city?.name || destination.state?.name) && (
          <p className="text-xs text-slate-400 mt-0.5">
            {destination.city?.name}
            {destination.city?.name && destination.state?.name ? ', ' : ''}
            {destination.state?.name}
          </p>
        )}
        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{destination.shortDescription}</p>
      </div>
    </Link>
  )
}
