import type { JSX } from 'react'
import PageWrapper from '../components/PageWrapper.tsx'

export default function LoadScreen(props: any): JSX.Element {
  if (!props.isLoading) {
    return <></>
  }
  else {
    return (
      <>
        <PageWrapper>
          <div id="load-screen" className="vw-100 vh-100 d-flex flex-column justify-content-center align-items-center">
            <h1 className="text-center display-1"><strong>Loading...</strong></h1>
          </div>
        </PageWrapper>
      </>
    ) 
  }
}