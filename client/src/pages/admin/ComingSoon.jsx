import { Construction } from 'lucide-react'

// Placeholder for the admin CRUD screens (States/Cities/Destinations/
// Categories management) — the sidebar links to these routes now so the
// nav is complete, but the actual tables/forms land in the next module.
export default function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center text-slate-500">
      <Construction className="w-10 h-10 mb-3 text-slate-300" />
      <h1 className="text-lg font-semibold text-slate-700">{title}</h1>
      <p className="text-sm mt-1">This section is being built in the next module (Admin CRUD).</p>
    </div>
  )
}
