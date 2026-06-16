import FramesPage from './pages/FramesPage'
import HomePage from './pages/HomePage'
import ReportPage from './pages/ReportPage'
import ResultsPage from './pages/ResultsPage'
import UploadPage from './pages/UploadPage'

export default function App() {
  const path = window.location.pathname

  if (path === '/upload' || path === '/upload-video') return <UploadPage />
  if (path === '/results') return <ResultsPage />
  if (path === '/frames') return <FramesPage />
  if (path === '/report') return <ReportPage />

  return <HomePage />
}
