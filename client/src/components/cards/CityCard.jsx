import { Link } from 'react-router-dom'

export default function CityCard({ city, stateSlug }) {
  const targetStateSlug = stateSlug || city.state?.slug

  return (
    <Link
      to={`/states/${targetStateSlug}/${city.slug}`}
      className="group block rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={city.image?.url}
          alt={city.image?.alt || city.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900">{city.name}</h3>
        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{city.description}</p>
      </div>
    </Link>
  )
}
