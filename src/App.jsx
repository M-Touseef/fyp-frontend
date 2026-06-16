import HomePage from './pages/HomePage'
import ProcessingPage from './pages/ProcessingPage'
import UploadPage from './pages/UploadPage'

export default function App() {
  const path = window.location.pathname

  if (path === '/upload' || path === '/upload-video') return <UploadPage />
  if (path === '/processing') return <ProcessingPage />

  return <HomePage />
}
