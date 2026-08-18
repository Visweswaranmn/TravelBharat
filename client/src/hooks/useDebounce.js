import { useEffect, useState } from 'react'

// Delays updating the returned value until `delay` ms have passed without
// `value` changing again — used to avoid firing an API call on every keystroke.
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
