import type { JSX } from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import AnimatedButton from '../components/AnimatedButton.tsx'
import PageWrapper from '../components/PageWrapper.tsx'
import PullCord from "../components/PullCord.tsx"

import '../styles/project_details.scss'

import { useFullpageSections } from '../utils/useFulllPageSections.tsx'


export default function ProjectDetails(props: any): JSX.Element {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const fullpage = useFullpageSections(wrapperRef, {
    // Section 1 (index 0) ignores wheel / touch / pointer input; only the cord leaves it.
    lockedSections: [0],
  })

  const [apiAddress, setApiAddress] = props.apiAddress ? useState(props.apiAddress) : useState("http://localhost:8000/api");
  const [project, setProject] = useState<{ title: string; details: string; imageSrc: string; url: string } | null>(null)

  let params = useParams()

  useEffect(() => {
    fetch(`${apiAddress}/projects/${params.pk}`)
      .then(response => response.json())
      .then(data => {
        console.log("Logging the response:");
        console.table(data);


        setProject(data)
      })
      .catch(error => {
        console.error("Error fetching project details:", error)
      })
  }, [apiAddress])


  return (
    <>
      <PageWrapper className="page-wrapper_snap page-wrapper_project-details" ref={wrapperRef}>
        <section className="section section_1">
          <div className="outer">
            <div className="inner">
              <div className="bg d-none" />
              <div className="content w-100 h-100">
                <iframe
                  className="w-100 h-100"
                  src="/"
                  title="Home page preview"
                  tabIndex={-1}
                />
                <PullCord onPull={() => fullpage.current.next()} />
              </div>
            </div>
          </div>
        </section>
        <section className="section section_2">
          <div className="outer">
            <div className="inner">
              <div className="bg">
                <div className="content">
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <h1 className="text-center fs-1 fw-bold">{project?.title}</h1>
                    <p>{project?.details}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section section_3">
          <div className="outer">
            <div className="inner">
              <div className="bg">
                <div className="content">
                  <div className="wh-100 vh-100 d-flex flex-column justify-content-center align-items-center">
                    <h1 className="text-center display-1">
                      <strong>
                        <Link to="/">
                          <AnimatedButton>H O M E</AnimatedButton>
                        </Link>
                      </strong>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageWrapper>
    </>
  )
}