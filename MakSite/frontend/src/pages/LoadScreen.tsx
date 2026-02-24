import type { JSX } from 'react'
import PageWrapper from '../components/PageWrapper.tsx'

export default function LoadScreen(): JSX.Element {
  return (
    <>
      <PageWrapper>
        <div className="vw-100 vh-100 d-flex flex-column justify-content-center align-items-center">
          <h1 className="text-center display-1"><strong>Loading...</strong></h1>
        </div>
      </PageWrapper>
    </>
  )
}