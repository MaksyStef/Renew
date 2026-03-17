import type { JSX } from "react"
import { Link } from "react-router-dom"

import Footer from "../components/Footer.tsx"
import PageWrapper from "../components/PageWrapper.tsx"

import "../styles/about.scss"

export default function About(): JSX.Element {
  return (
    <>
      <PageWrapper className="page-wrapper_snap">
        <div className="about_1  w-75 vh-100 d-flex flex-column justify-content-center align-items-center">
          <div className="container w-100 h-100">
            <div className="about_grid d-grid w-100 h-100">
              <div className="w-100 h-100 d-flex image_center">
                <img src="https://placehold.co/400x400"/>
              </div>
              <div className="w-100 h-100 d-flex image_top">
                <img src="https://placehold.co/600x400"/>
              </div>
              <div className="w-100 h-100 d-flex  image_left">
                <img src="https://placehold.co/400x600"/>
              </div>
              <div className="w-100 h-100 d-flex image_bottom">
                <img src="https://placehold.co/600x400"/>
              </div>
              <div className="w-100 h-100 d-flex image_right">
                <img src="https://placehold.co/400x600"/>
              </div>
              <div className="text_1">
                <h1 className="display-4 fs-2"><strong>About Me</strong></h1>
                <h2 className="display-6 fs-4"><strong>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem soluta facilis inventore quibusdam repellendus accusamus voluptate beatae vel cupiditate impedit atque, at mollitia</strong></h2>
              </div>
              <div className="text_2 align-bottom pt-4 text-end">
                <h2 className="display-6 fs-4"><strong>Aliquid voluptas iure officia ea officiis necessitatibus saepe corporis sapiente aperiam laudantium in accusamus, iusto, doloremque reprehenderit dolor dolore iusto accusamus ipsa</strong></h2>
              </div>
            </div> 
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