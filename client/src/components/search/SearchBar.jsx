import { Search } from 'lucide-react'

// Presentational only — the caller owns the value and decides whether/how
// to debounce it (see hooks/useDebounce).
export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  )
}
