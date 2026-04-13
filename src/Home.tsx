import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-3xl flex-col items-center justify-center text-center">
        <h1 className="mb-3 text-balance text-3xl font-bold leading-tight sm:mb-4 sm:text-4xl md:text-5xl">
          Welcome to My Portfolio
        </h1>
        <p className="mb-6 max-w-xl text-sm text-muted-foreground sm:mb-8 sm:text-base md:text-lg">
          Explore my work and achievements.
        </p>
        <nav className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Link
            to="/certificates"
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-blue-700 sm:w-auto sm:text-base"
          >
          View Certificates
          </Link>
        </nav>
      </div>
    </div>
  )
}
