import { Link, NavLink, Route, Routes } from 'react-router-dom'
import { FeedbackProvider } from './context/FeedbackContext.jsx'
import { useFeedback } from './context/useFeedback.js'
import Header from './components/Header.jsx'
import FeedbackForm from './components/FeedbackForm.jsx'
import FeedbackList from './components/FeedbackList.jsx'
import FeedbackStats from './components/FeedbackStats.jsx'
import AdminAccess from './components/AdminAccess.jsx'
import AboutPage from './pages/AboutPage.jsx'
import AboutIconLink from './components/AboutIconLink.jsx'
import Card from './components/shared/Card.jsx'

function HomePage() {
  const { isSupabaseConfigured, error, clearError, loading, refreshFeedback } = useFeedback()
  return (
    <>
      {!isSupabaseConfigured && (
        <div className="notice notice-error" role="alert">
          <strong>Setup required:</strong> create <code>.env.local</code> from <code>.env.example</code> and add your Supabase project URL and anon/publishable key.
        </div>
      )}
      {error && (
        <div className="notice notice-error" role="alert">
          <span>{error}</span>
          <button className="text-button" type="button" onClick={clearError}>Dismiss</button>
          {!loading && <button className="text-button" type="button" onClick={refreshFeedback}>Retry loading</button>}
        </div>
      )}
      <FeedbackForm />
      <FeedbackStats />
      <FeedbackList />
    </>
  )
}

function AppContent() {
  return (
    <>
      <Header />
      <main className="container">
        <AdminAccess />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Card><h2>Page not found</h2><p><Link to="/">Return to feedback</Link></p></Card>} />
        </Routes>
        <nav aria-label="Main navigation">
          <Card>
            <ul className="NavShow">
              <li><NavLink to="/" end><strong>Home</strong></NavLink></li>
              <li><NavLink to="/about"><strong>About</strong></NavLink></li>
            </ul>
          </Card>
        </nav>
        <AboutIconLink />
      </main>
    </>
  )
}

export default function App() {
  return <FeedbackProvider><AppContent /></FeedbackProvider>
}
