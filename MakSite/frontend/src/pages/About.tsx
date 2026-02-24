import type { JSX } from 'react'
import { Link } from 'react-router-dom'

import Footer from '../components/Footer.tsx'
import PageWrapper from '../components/PageWrapper.tsx'

import '../styles/about.scss'

export default function About(): JSX.Element {
  return (
    <>
      <PageWrapper className="page-wrapper_snap">
        <div className="about_1 w-75 vh-100 d-flex flex-column justify-content-center align-items-center">
          <h1 className="text-center display-1"><strong>Maksym Stefaniv</strong></h1>
          <h2 className="text-center"><strong>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corporis dolorum consectetur odit voluptates porro adipisci ut odio vitae temporibus quibusdam, accusantium deserunt totam hic similique, provident ab nostrum, magni repudiandae!</strong></h2>
          <div className="container container_photos position-absolute w-100 h-100 bottom-0">
            <div className="d-inline container-sm container-sm_1 position-absolute"><img className='w-100 h-100' src="https://placehold.co/600x400"/></div>
            <div className="d-inline container-sm container-sm_2 position-absolute"><img className='w-100 h-100' src="https://placehold.co/400x600"/></div>
            <div className="d-inline container-sm container-sm_3 position-absolute"><img className='w-100 h-100' src="https://placehold.co/400x600"/></div>
            <div className="d-inline container-sm container-sm_4 position-absolute"><img className='w-100 h-100' src="https://placehold.co/400x400"/></div>
            <div className="d-inline container-sm container-sm_5 position-absolute"><img className='w-100 h-100' src="https://placehold.co/600x400"/></div>
          </div>
        </div>
        <div className="about_2 w-75 vh-100 d-flex flex-column justify-content-center align-items-center">
          <h1 className="text-center display-1"><strong><Link to="/">Back to Home</Link></strong></h1>
        </div>
        <Footer />
      </PageWrapper>
    </>
  )
}