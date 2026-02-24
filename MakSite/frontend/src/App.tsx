// Import Libraries
import { Component, lazy, useEffect, useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'

// Import Components
import LoadScreen from './pages/LoadScreen.tsx'

// Lazy Import Components
const Home = lazy(() => import('./pages/Home.tsx'))
const About = lazy(() => import('./pages/About.tsx'))


export default class App extends Component {
  state = {
    isLoading: true
  }

  componentDidMount(): void {
      this.setState({ isLoading: false })
  }
  render() {
    return (
      <>
        <LoadScreen isLoading={this.state.isLoading} />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Router>
      </>
    )
  }
}

