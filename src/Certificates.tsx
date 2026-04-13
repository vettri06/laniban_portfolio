import { useState, useEffect, useRef, useCallback } from 'react'
import { Award, X, ChevronLeft, ChevronRight, ZoomIn, Loader2, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

interface Certificate {
  id: string
  src: string
  name: string
  date: string
}

const CERTIFICATES_PER_PAGE = 12

// Generate certificates 1 through 23
const certificates: Certificate[] = Array.from({ length: 23 }, (_, i) => ({
  id: `cert-${i + 1}`,
  src: `/certificates/certificate-${i + 1}.jpg`,
  name: `Certificate ${i + 1}`,
  date: 'Apr 13, 2026', // Optional static date or we can just leave it out
}))

function LazyImage({
  src,
  alt,
  className,
  onClick,
}: {
  src: string
  alt: string
  className?: string
  onClick?: () => void
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    )
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden rounded-lg bg-muted', className)} onClick={onClick}>
      {!isLoaded && !error && (
        <div className="absolute inset-0 animate-pulse flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Failed to load</span>
        </div>
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            'w-full h-full object-cover cursor-pointer transition-all duration-300 hover:scale-105',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-end p-3 cursor-pointer pointer-events-none">
        <ZoomIn className="absolute top-3 right-3 h-5 w-5 text-white" />
      </div>
    </div>
  )
}

function Lightbox({
  certificates,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  certificates: Certificate[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const certificate = certificates[currentIndex]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[101]"
      >
        <X className="h-6 w-6 text-white" />
      </button>

      <button
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 z-[101]"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>

      <div className="max-w-5xl max-h-[85vh] w-full flex flex-col items-center">
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={certificate.src}
            alt={certificate.name}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-lg font-medium text-white">{certificate.name}</h3>
          <p className="text-xs text-white/40 mt-1">
            {currentIndex + 1} of {certificates.length}
          </p>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={currentIndex === certificates.length - 1}
        className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 z-[101]"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>
    </div>
  )
}

function CertificateGrid({
  certificates,
  onCertificateClick,
}: {
  certificates: Certificate[]
  onCertificateClick: (index: number) => void
}) {
  const [visibleCount, setVisibleCount] = useState(CERTIFICATES_PER_PAGE)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCount < certificates.length) {
          setVisibleCount(v => Math.min(v + CERTIFICATES_PER_PAGE, certificates.length))
        }
      },
      { rootMargin: '200px' }
    )
    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }
    return () => observer.disconnect()
  }, [visibleCount, certificates.length])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {certificates.slice(0, visibleCount).map((cert, index) => (
        <div key={cert.id} className="relative group">
          <div className="aspect-[4/3] rounded-lg shadow-md border border-border overflow-hidden">
            <LazyImage
              src={cert.src}
              alt={cert.name}
              className="w-full h-full"
              onClick={() => onCertificateClick(index)}
            />
          </div>
          <div className="mt-3 text-center">
            <h3 className="text-sm font-medium">{cert.name}</h3>
          </div>
        </div>
      ))}
      {visibleCount < certificates.length && (
        <div ref={loaderRef} className="col-span-full flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
}

export default function Certificates() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const goToPrev = useCallback(() => {
    setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : i))
  }, [])

  const goToNext = useCallback(() => {
    setLightboxIndex(i => (i !== null && i < certificates.length - 1 ? i + 1 : i))
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header/Nav */}
      <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-full mb-4">
            <Award className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Certificates & Achievements</h1>
          <p className="text-muted-foreground max-w-2xl">
            Browse through my complete collection of {certificates.length} certificates and achievements.
            Click on any certificate to view it in full size.
          </p>
        </div>

        <CertificateGrid certificates={certificates} onCertificateClick={openLightbox} />
      </main>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          certificates={certificates}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </div>
  )
}