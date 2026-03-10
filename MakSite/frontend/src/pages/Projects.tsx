import type { JSX } from 'react'
import { Link } from 'react-router-dom'

import Footer from '../components/Footer.tsx'
import PageWrapper from '../components/PageWrapper.tsx'

import '../styles/home.scss'


export default function Home(): JSX.Element {
  return (
    <>
      <PageWrapper className="p-4">
        <div className="d-flex w-100 justify-content-center">
          <h1 className="display-1">Projects</h1>
        </div>
        <div className="row row-cols-1 w-100 mt-4 g-4 text-center">
          <div className="col col-md-6 text-start">
            <div style={{
              "margin": "0 auto",
              "width": "fit-content",
            }}>
              <div className="position-relative">
                <div style={{
                  "position": "absolute",
                  "left": "0.5rem",
                  "top": 0,
                  "height": "100%",
                  "width": "3px",
                  "backgroundColor": "rgb(163, 162, 162)"
                }} />
                <h1 className="display-3 fw-normal w-100 ps-4">Project Name</h1>
              </div>
              <div className="m-0 p-0 container w-100"><img className='w-100' src="https://placehold.co/1920x1080" /></div>
              <p className='d-block fs-5 fw-light w-100 text-truncate'>Details are very long, so we need to wrap them properly.</p>
            </div>
          </div>
          <div className="col col-md-6 text-start">
            <div style={{
              "margin": "0 auto",
              "width": "fit-content",
            }}>
              <div className="position-relative">
                <div style={{
                  "position": "absolute",
                  "left": "0.5rem",
                  "top": 0,
                  "height": "100%",
                  "width": "3px",
                  "backgroundColor": "rgb(163, 162, 162)"
                }} />
                <h1 className="display-3 fw-normal w-100 ps-4">Project Name</h1>
              </div>
              <div className="m-0 p-0 container w-100"><img className='w-100' src="https://placehold.co/1920x1080" /></div>
              <p className='d-block fs-5 fw-light w-100 text-truncate'>Details are very long, so we need to wrap them properly.</p>
            </div>
          </div>
          <div className="col col-md-6 text-start">
            <div style={{
              "margin": "0 auto",
              "width": "fit-content",
            }}>
              <div className="position-relative">
                <div style={{
                  "position": "absolute",
                  "left": "0.5rem",
                  "top": 0,
                  "height": "100%",
                  "width": "3px",
                  "backgroundColor": "rgb(163, 162, 162)"
                }} />
                <h1 className="display-3 fw-normal w-100 ps-4">Project Name</h1>
              </div>
              <div className="m-0 p-0 container w-100"><img className='w-100' src="https://placehold.co/1920x1080" /></div>
              <p className='d-block fs-5 fw-light w-100 text-truncate'>Details are very long, so we need to wrap them properly.</p>
            </div>
          </div>
          <div className="col col-md-6 text-start">
            <div style={{
              "margin": "0 auto",
              "width": "fit-content",
            }}>
              <div className="position-relative">
                <div style={{
                  "position": "absolute",
                  "left": "0.5rem",
                  "top": 0,
                  "height": "100%",
                  "width": "3px",
                  "backgroundColor": "rgb(163, 162, 162)"
                }} />
                <h1 className="display-3 fw-normal w-100 ps-4">Project Name</h1>
              </div>
              <div className="m-0 p-0 container w-100"><img className='w-100' src="https://placehold.co/1920x1080" /></div>
              <p className='d-block fs-5 fw-light w-100 text-truncate'>Details are very long, so we need to wrap them properly.</p>
            </div>
          </div>
          <div className="col col-md-6 text-start">
            <div style={{
              "margin": "0 auto",
              "width": "fit-content",
            }}>
              <div className="position-relative">
                <div style={{
                  "position": "absolute",
                  "left": "0.5rem",
                  "top": 0,
                  "height": "100%",
                  "width": "3px",
                  "backgroundColor": "rgb(163, 162, 162)"
                }} />
                <h1 className="display-3 fw-normal w-100 ps-4">Project Name</h1>
              </div>
              <div style={{"width": "clamp(300px, 100%, 1920px)"}} className="m-0 p-0 container w-100"><img className='w-100' src="https://placehold.co/1920x1080" /></div>
              <p className='d-block fs-5 fw-light w-100 text-truncate'>Details are very long, so we need to wrap them properly.</p>
            </div>
          </div>
        </div>
        <Footer />
      </PageWrapper>
    </>
  )
}