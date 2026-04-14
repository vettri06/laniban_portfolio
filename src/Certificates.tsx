import { useState, useEffect, useRef, useCallback } from 'react'
import { Award, X, ChevronLeft, ChevronRight, ZoomIn, Loader2, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Squares } from './components/Squares'
import { TubesBackground } from './components/TubesBackground'

interface Certificate {
  id: string
  src: string
  name: string
}

const CERTIFICATES_PER_PAGE = 12

// Generate certificates 1 through 23
const certificates: Certificate[] = Array.from({ length: 23 }, (_, i) => ({
  id: `cert-${i + 1}`,
  src: `/certificates/certificate-${i + 1}.jpg`,
  name: `Certificate ${i + 1}`,
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
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden rounded-lg border border-border/70 bg-muted transition-colors hover:border-primary/40',
        className
      )}
      onClick={onClick}
    >
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
            'h-full w-full cursor-pointer object-contain p-1 transition-all duration-300 sm:p-2',
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
  const [error, setError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setError(false)
    setIsLoaded(false)
  }, [currentIndex])

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 backdrop-blur-sm sm:p-4">
      <button
        onClick={onClose}
        className="absolute right-3 top-3 z-[101] rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20 sm:right-4 sm:top-4"
      >
        <X className="h-5 w-5 text-white sm:h-6 sm:w-6" />
      </button>

      <button
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="absolute bottom-4 left-4 z-[101] rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20 disabled:opacity-30 sm:bottom-auto sm:left-4 sm:p-3"
      >
        <ChevronLeft className="h-5 w-5 text-white sm:h-6 sm:w-6" />
      </button>

      <div className="flex max-h-[88vh] w-full max-w-5xl flex-col items-center">
        <div className="relative flex h-full w-full items-center justify-center">
          {!isLoaded && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white/50" />
            </div>
          )}
          {error ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-white/70">
              <Award className="mb-4 h-12 w-12 opacity-20" />
              <p>Failed to load certificate image</p>
            </div>
          ) : (
            <img
              src={certificate.src}
              alt={certificate.name}
              onLoad={() => setIsLoaded(true)}
              onError={() => setError(true)}
              className={cn(
                "max-h-[74vh] max-w-full rounded-lg object-contain shadow-2xl transition-opacity duration-300 sm:max-h-[80vh]",
                isLoaded ? "opacity-100" : "opacity-0"
              )}
            />
          )}
        </div>
        <div className="mt-3 text-center sm:mt-4">
          <h3 className="text-base font-medium text-white sm:text-lg">{certificate.name}</h3>
          <p className="text-xs text-white/40 mt-1">
            {currentIndex + 1} of {certificates.length}
          </p>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={currentIndex === certificates.length - 1}
        className="absolute bottom-4 right-4 z-[101] rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20 disabled:opacity-30 sm:bottom-auto sm:right-4 sm:p-3"
      >
        <ChevronRight className="h-5 w-5 text-white sm:h-6 sm:w-6" />
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {certificates.slice(0, visibleCount).map((cert, index) => (
        <div key={cert.id} className="relative group">
          <div className="aspect-[4/3] sm:aspect-[3/2] rounded-lg shadow-md overflow-hidden">
            <LazyImage
              src={cert.src}
              alt={cert.name}
              className="w-full h-full"
              onClick={() => onCertificateClick(index)}
            />
          </div>
          <div className="mt-2 text-center sm:mt-3">
            <h3 className="text-sm font-medium sm:text-[0.95rem]">{cert.name}</h3>
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
    <TubesBackground className="min-h-screen bg-[#04070d]">
      <div className="relative min-h-screen text-foreground overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <Squares
            speed={0.18}
            squareSize={42}
            direction="diagonal"
            borderColor="rgba(255,255,255,0.12)"
            hoverFillColor="rgba(255,255,255,0.10)"
          />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen pointer-events-none">
          <div className="pointer-events-auto flex flex-col flex-1">
            {/* Header/Nav */}
            <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-14 w-full items-center justify-start px-3 sm:px-4 md:px-6">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </a>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-3 py-6 sm:px-4 sm:py-8">
              <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
                <div className="mb-3 inline-flex items-center justify-center rounded-full bg-primary/10 p-2.5 text-primary sm:mb-4 sm:p-3">
                  <Award className="h-7 w-7 sm:h-8 sm:w-8" />
                </div>
                <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl text-white drop-shadow-[0_0_20px_rgba(0,0,0,1)]">Certificates & Achievements</h1>
                <p className="max-w-2xl text-sm text-white/90 sm:text-base drop-shadow-md">
                  Browse through my complete collection of {certificates.length} certificates and achievements.
                  Click on any certificate to view it in full size.
                </p>
              </div>

              <CertificateGrid certificates={certificates} onCertificateClick={openLightbox} />
            </main>
          </div>

          {/* Lightbox */}
          {lightboxIndex !== null && (
            <div className="pointer-events-auto">
              <Lightbox
                certificates={certificates}
                currentIndex={lightboxIndex}
                onClose={closeLightbox}
                onPrev={goToPrev}
                onNext={goToNext}
              />
            </div>
          )}
        </div>
      </div>
    </TubesBackground>
  )
}
