import type { JSX } from 'react'

import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import PageWrapper from '../components/PageWrapper'
import Footer from '../components/Footer'

export default function ProjectDetails(props: any): JSX.Element {
  const {pk} = useParams();

  const [apiAddress, setApiAddress] = props.apiAddress ? useState(props.apiAddress) : useState("http://localhost:8000/api");
  const [project, setProject] = useState<{ title: string; details: string; imageSrc: string; url: string } | null>(null)

  useEffect(() => {
    fetch(`${apiAddress}/projects/${pk}`)
    .then(response => response.json())
    .then(data => {
      setProject(data)
    })
    .catch(error => {
      console.error("Error fetching project details:", error)
    })
  }, [apiAddress])
  
  return (
    <>
      <PageWrapper className="page-wrapper_snap">
        <div className="container d-flex flex-column align-items-center">
          <h1 className="display-1">{project?.title}</h1>
          <div className="image-container">
            <img src={project?.imageSrc} alt={project?.title} />
          </div>
          <div className="text-container">
            <p>{project?.details}</p>
          </div>
        </div>
        <div style={{flex: "1 1 auto"}} className="separator" />
        <Footer />
      </PageWrapper>
    </>
  )
}