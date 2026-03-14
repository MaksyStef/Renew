import type { JSX } from 'react'
import { useEffect, useRef, useState } from 'react'

import Footer from '../components/Footer.tsx'
import PageWrapper from '../components/PageWrapper.tsx'

import '../styles/home.scss'  


function batchCreateProjectCells(container: HTMLElement, projects: { title: string; details: string; imageSrc: string }[]): void {
  projects.forEach(project => {
    // Create a new ProjectCell component for each project and append it to the container
    const cellTemplate = document.getElementById("cell-template") as HTMLTemplateElement
    const cellClone = cellTemplate.content.cloneNode(true) as HTMLElement
    const cellLink = cellClone.querySelector(".cell-link") as HTMLAnchorElement
    const cellTitle = cellClone.querySelector(".cell-tittle") as HTMLElement
    const cellDetails = cellClone.querySelector(".cell-details") as HTMLElement
    const cellImage = cellClone.querySelector("img") as HTMLImageElement
    
    cellLink.href = `/project-detail/${project.title.toLowerCase().replace(/\s+/g, '-')}`
    cellTitle.textContent = project.title
    cellDetails.textContent = project.details
    cellImage.src = project.imageSrc
  })
}

export default function Home(props: any): JSX.Element {
  const projectsContainerRef = useRef<HTMLDivElement>(null)
  const cellLinkContainerStyle: React.CSSProperties = {
    textDecoration: "none", 
    cursor: "pointer"
  }
  const cellTitleBarStyle: React.CSSProperties = {
    "position": "absolute",
    "left": "0.5rem",
    "top": 0,
    "height": "100%",
    "width": "3px",
    "backgroundColor": "rgb(163, 162, 162)"
  }
  const cellInnerContainerStyle: React.CSSProperties = {
    "margin": "0 auto",
    "width": "fit-content",
  }
  const cellImageContainerStyle: React.CSSProperties = {
    "width": "clamp(300px, 100%, 1920px)"
  }
  const [apiAddress, setApiAddress] = props.apiAddress ? useState(props.apiAddress) : useState("http://localhost:8000/api")

  useEffect(() => {
    fetch(`${apiAddress}/projects/`)
    .then(response => response.json())
    .then(data => {
      if (projectsContainerRef.current) {
        batchCreateProjectCells(projectsContainerRef.current, data)
      }
    })
    .catch(error => {
      console.error("Error fetching project list:", error)
    })
  }, [apiAddress])

  return (
    <>
      <PageWrapper className="p-4">
        <div className="d-flex w-100 justify-content-center">
          <h1 className="display-1">Projects</h1>
        </div>
        <div ref={projectsContainerRef} className="row row-cols-1 w-100 mt-4 g-4 text-center">
          {/* Project cells are placed here */}
          <template id="cell-template">
            <a style={cellLinkContainerStyle} className="text-white cell-link col col-md-6 text-start">
              <div style={cellInnerContainerStyle}>
                <div className="position-relative">
                  <div style={cellTitleBarStyle} />
                  <h1 className="cell-tittle display-3 fw-normal w-100 ps-4"></h1>
                </div>
                <div style={cellImageContainerStyle} className="m-0 p-0 container w-100"><img className='w-100' src="https://placehold.co/1920x1080" /></div>
                <p className='cell-details d-block fs-5 fw-light w-100 text-truncate'></p>
              </div>
            </a>
          </template>
        </div>
        <div style={{flex: "1 1 auto"}} className="separator" />
        <Footer />
      </PageWrapper>
    </>
  )
}