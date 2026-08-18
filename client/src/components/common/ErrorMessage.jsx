import { AlertTriangle } from 'lucide-react'

export default function ErrorMessage({ message = 'Something went wrong. Please try again.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle className="w-10 h-10 mb-3 text-red-400" />
      <p className="text-slate-700 font-medium">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-4 text-sm font-medium text-orange-600 hover:underline">
          Try again
        </button>
      )}
    </div>
  )
}
