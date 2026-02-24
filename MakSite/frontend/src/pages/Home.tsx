import type { JSX } from 'react'
import { Link } from 'react-router-dom'

import Footer from '../components/Footer.tsx'
import PageWrapper from '../components/PageWrapper.tsx'

import '../styles/home.scss'


export default function Home(): JSX.Element {
  return (
    <>
      <PageWrapper className="page-wrapper_snap">
        <div className="w-75 vh-100 d-flex flex-column justify-content-center align-items-center">
          <h1 className="text-center display-1"><strong>Full Stack Web Developer</strong></h1>
        </div>
        <div className="w-75 vh-100 d-flex flex-column justify-content-center align-items-center">
          <h1 className="text-center display-1"><strong className='lh-base'>Experience Building<br /><mark className='px-4 py-0'>Web Applications</mark><br />From the Ground Up</strong></h1>
        </div>
        <div className="w-75 vh-100 d-flex flex-column justify-content-center align-items-center">
          <h1 className="text-center display-1"><strong><Link to="/about">About Me</Link></strong></h1>
        </div>
        <div className="w-75 vh-100 d-flex flex-column justify-content-center align-items-center">
          <h1 className="text-center display-1"><strong><Link to="/projects">Projects</Link></strong></h1>
        </div>
        <div className="w-75 vh-100 d-flex flex-column justify-content-center align-items-center">
          <button className="btn btn-primary btn-lg p-2 fs-1 fw-bold" type="submit">Contact Me</button>
        </div>
        <Footer />
      </PageWrapper>
    </>
  )
}