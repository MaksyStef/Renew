// Import Libraries
import { lazy, Suspense } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'

// Import Components
import LoadScreen from './pages/LoadScreen.tsx'

// Lazy Import Components
const Home = lazy(() => import('./pages/Home.tsx'))
const About = lazy(() => import('./pages/About.tsx'))


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={
            <Suspense fallback={<LoadScreen />}>
              <Home />
            </Suspense>
          } />
          <Route path="/about" element={
            <Suspense fallback={<LoadScreen />}>
              <About />
            </Suspense>
            } />
        </Routes>
      </Router>
    </>
  )
}

export default App
