import type { JSX } from 'react'
import { useEffect, useState } from 'react'

import Footer from '../components/Footer.tsx'
import PageWrapper from '../components/PageWrapper.tsx'
import ProjectCell from '../components/PrjectCell.tsx'

import '../styles/projects.scss'


function batchCreateProjectCells (projects: { title: string; details: string; imageSrc: string, url: string }[]): JSX.Element {
  return (
    <>
      {projects.map(project => (
        <ProjectCell key={project.title} title={project.title} details={project.details} imageSrc={project.imageSrc} url={project.url} />
      ))}
    </>
  )
}

export default function Home(props: any): JSX.Element {
  const [apiAddress, setApiAddress] = props.apiAddress ? useState(props.apiAddress) : useState("http://localhost:8000/api")
  const [projects, setProjects] = useState<{ title: string; details: string; imageSrc: string; url: string }[]>([])

  useEffect(() => {
    fetch(`${apiAddress}/projects/`)
    .then(response => response.json())
    .then(data => {
      setProjects(data)
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
        <div className="row w-100 mt-4 g-4 text-center">
          {/* Project cells are placed here */}
          { batchCreateProjectCells(projects) }
        </div>
        <Footer separator={true} className="pb-0" />
      </PageWrapper>
    </>
  )
}