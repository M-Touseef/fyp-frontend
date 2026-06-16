import HomePage from './pages/HomePage'
import ResultsPage from './pages/ResultsPage'
import UploadPage from './pages/UploadPage'

export default function App() {
  const path = window.location.pathname

  if (path === '/upload' || path === '/upload-video') return <UploadPage />
  if (path === '/results') return <ResultsPage />

  return <HomePage />
}
