import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import Q1TranscriptPage from './routes/Q1TranscriptPage'
import Q2Q3Page from './routes/Q2Q3Page'
import Q4HighFrequencyPage from './routes/Q4HighFrequencyPage'
import Q5AccountSwitcherPage from './routes/Q5AccountSwitcherPage'
import Q6SentimentPage from './routes/Q6SentimentPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/q1" replace />}
        />
        <Route
          path="/q1"
          element={<Q1TranscriptPage />}
        />
        <Route
          path="/q2-q3"
          element={<Q2Q3Page />}
        />
        <Route
          path="/q4"
          element={<Q4HighFrequencyPage />}
        />
        <Route
          path="/q5"
          element={<Q5AccountSwitcherPage />}
        />
        <Route
          path="/q6"
          element={<Q6SentimentPage />}
        />
        <Route
          path="*"
          element={
            <div className="text-sm text-[color:var(--app-text-muted)]">
              Choose a section from the navigation above to view it.
            </div>
          }
        />
      </Routes>
    </Layout>
  )
}

export default App
