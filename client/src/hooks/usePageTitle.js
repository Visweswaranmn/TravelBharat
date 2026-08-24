import { useEffect } from 'react'

const SITE_NAME = 'TravelBharat'

// Sets the browser tab title and the meta description for the current
// page. No SSR here, so search engines relying on server-rendered <head>
// tags won't see this — but it fixes tab titles, browser history entries,
// and anything that reads the DOM after the page has loaded (social share
// previews that render JS, browser bookmarking, etc).
export function usePageTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Explore India, State by State`

    if (description) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = description
    }
  }, [title, description])
}
