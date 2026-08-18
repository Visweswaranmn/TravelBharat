import { useState } from 'react'

export default function ImageGallery({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) return null

  const active = images[activeIndex]

  return (
    <div>
      <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100">
        <img src={active.url} alt={active.alt} className="w-full h-full object-cover" />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}: ${image.alt}`}
              aria-current={index === activeIndex}
              className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                index === activeIndex ? 'border-orange-600' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={image.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
