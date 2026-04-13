import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CertificatesPage from './Certificates'
import Home from './Home'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/certificates" element={<CertificatesPage />} />
      </Routes>
    </Router>
  )
}