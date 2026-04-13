import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to My Portfolio</h1>
      <p className="text-lg text-muted-foreground mb-8">Explore my work and achievements.</p>
      <nav className="flex space-x-4">
        <Link to="/certificates" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
          View Certificates
        </Link>
        {/* Add more navigation links here if needed */}
      </nav>
    </div>
  )
}
