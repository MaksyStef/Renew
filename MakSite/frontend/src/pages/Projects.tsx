import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'

import Footer from '../components/Footer.tsx'
import PageWrapper from '../components/PageWrapper.tsx'
import Pagination from '../components/Pagination.tsx'
import ProjectCell from '../components/ProjectCell.tsx'

import '../styles/projects.scss'
import GlowingLink from '../components/GlowingLink.tsx'

interface Project {
  title: string
  details: string
  thumbnail: string
  url: string
}

interface PaginatedResponse {
  count: number
  total_pages: number
  current_page: number
  results: Project[]
}

function batchCreateProjectCells (projects: Project[]): ReactElement {
  return (
    <>
      {projects.map(project => (
        <ProjectCell key={project.url} title={project.title} details={project.details} imageSrc={project.thumbnail} url={project.url} />
      ))}
    </>
  )
}

export default function Projects (props: any): ReactElement {
  const [apiAddress] = useState<string>(props.apiAddress ?? 'http://localhost:8000/api')
  const [projects, setProjects] = useState<Project[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${apiAddress}/projects/?page=${page}`, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json() as Promise<PaginatedResponse>
      })
      .then(data => {
        setProjects(data.results)
        setTotalPages(data.total_pages)
      })
      .catch(error => {
        if (error.name !== 'AbortError') console.error('Error fetching project list:', error)
      })

    return () => controller.abort() // ignore stale responses when the page changes quickly
  }, [apiAddress, page])

  const handlePageChange = (newPage: number): void => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  };

  const handleBack = (e: any): void => {   
    e.preventDefault()
    history.back()
  }

  return (
    <>
      <PageWrapper>
        <header className="d-flex w-100 flex-row justify-content-between">
          <GlowingLink onClick={handleBack} url="" text={"Back"} className={"fw-bold"} />
          <GlowingLink url={"/"} text={"Homepage"} className={"fw-bold"} />
        </header>
        <div className="row w-100 mt-2 g-4 text-center">
          {batchCreateProjectCells(projects)}
        </div>

        <Pagination
          className="pagination_project m-4"
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <Footer separator={true} className="pb-0" />
      </PageWrapper>
    </>
  )
}