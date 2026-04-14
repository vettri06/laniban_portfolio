import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CertificatesPage from './Certificates'

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root within the React app to the static index.html */}
        <Route path="/" element={<Navigate to="/" replace />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/certificates.html" element={<CertificatesPage />} />
        <Route path="*" element={
          <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
              <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
              <a href="/" className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Go Home
              </a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  )
}
