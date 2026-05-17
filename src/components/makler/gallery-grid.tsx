'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react'
const FALLBACK_IMAGE = 'https://picsum.photos/seed/immo-fallback/800/600'

interface GalleryGridProps {
  images: string[]
  brokerName: string
}

function GalleryImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        const el = e.currentTarget
        el.onerror = null // prevent loop
        el.src = FALLBACK_IMAGE
      }}
    />
  )
}

export function GalleryGrid({ images, brokerName }: GalleryGridProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const close = useCallback(() => setLightboxIdx(null), [])
  const prev  = useCallback(() =>
    setLightboxIdx((i) => i === null ? null : (i - 1 + images.length) % images.length),
    [images.length])
  const next  = useCallback(() =>
    setLightboxIdx((i) => i === null ? null : (i + 1) % images.length),
    [images.length])

  useEffect(() => {
    if (lightboxIdx === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     close()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIdx, close, prev, next])

  if (images.length === 0) return null

  const gridCols =
    images.length === 1  ? 'grid-cols-1' :
    images.length === 2  ? 'grid-cols-2' :
    images.length <= 6   ? 'grid-cols-2 sm:grid-cols-3' :
    'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'

  const firstSpan = images.length >= 3

  return (
    <>
      {/* Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Images className="w-4 h-4 text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-900">Objektgalerie</h2>
          <span className="text-sm text-slate-400">({images.length} Fotos)</span>
        </div>

        <div className={`grid gap-2 ${gridCols}`}>
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightboxIdx(i)}
              className={`relative overflow-hidden rounded-xl cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                ${firstSpan && i === 0 ? 'col-span-2 aspect-video' : 'aspect-[4/3]'}`}
              aria-label={`Foto ${i + 1} von ${images.length} öffnen`}
            >
              <GalleryImage
                src={src}
                alt={`${brokerName} – Objekt ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors"
            aria-label="Schließen (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm tabular-nums select-none">
            {lightboxIdx + 1} / {images.length}
          </div>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-3 sm:left-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              aria-label="Vorheriges Bild"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Main image */}
          <GalleryImage
            src={images[lightboxIdx]}
            alt={`${brokerName} – Objekt ${lightboxIdx + 1}`}
            className="max-w-[86vw] max-h-[82vh] object-contain rounded-lg shadow-2xl select-none"
          />

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-3 sm:right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              aria-label="Nächstes Bild"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 max-w-[90vw] overflow-x-auto pb-1 px-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setLightboxIdx(i) }}
                  className={`flex-shrink-0 w-14 h-10 rounded overflow-hidden transition-all ${
                    i === lightboxIdx
                      ? 'ring-2 ring-white opacity-100'
                      : 'opacity-40 hover:opacity-70'
                  }`}
                  aria-label={`Foto ${i + 1}`}
                >
                  <GalleryImage
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
