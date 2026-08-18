import { Link } from 'react-router-dom'
import { MapPin, Landmark } from 'lucide-react'

export default function StateCard({ state }) {
  return (
    <Link
      to={`/states/${state.slug}`}
      className="group block rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={state.image?.url}
          alt={state.image?.alt || state.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900">{state.name}</h3>
        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
          <MapPin className="w-3.5 h-3.5" />
          {state.capital}
        </p>
        <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
          <Landmark className="w-3.5 h-3.5" />
          {state.destinationCount} destination{state.destinationCount === 1 ? '' : 's'} · {state.cityCount} cit
          {state.cityCount === 1 ? 'y' : 'ies'}
        </p>
        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{state.description}</p>
      </div>
    </Link>
  )
}
