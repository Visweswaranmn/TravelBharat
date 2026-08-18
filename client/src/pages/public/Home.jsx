import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight">
        Discover India, One Destination at a Time
      </h1>
      <p className="mt-4 text-lg text-slate-500">
        Explore India&apos;s states, cities, culture, heritage and unforgettable
        destinations — all in one place.
      </p>

      <Link
        to="/explore"
        className="inline-flex items-center gap-2 mt-8 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg px-6 py-3 transition-colors"
      >
        <Compass className="w-4 h-4" />
        Explore India
      </Link>
    </div>
  )
}
