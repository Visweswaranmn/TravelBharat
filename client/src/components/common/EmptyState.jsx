export default function EmptyState({ title = 'Nothing here yet', message, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
      {Icon && <Icon className="w-10 h-10 mb-3 text-slate-300" />}
      <p className="font-medium text-slate-700">{title}</p>
      {message && <p className="text-sm mt-1 max-w-sm">{message}</p>}
    </div>
  )
}
