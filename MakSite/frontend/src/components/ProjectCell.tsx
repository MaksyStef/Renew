import type { JSX } from "react"


function formatUrl(url: string): string {
  return url.replace("/api", "#");
}

export default function ProjectCell(props: { title: string; details: string; imageSrc: string, url: string }): JSX.Element {
  // Styles for some cell components
  return (
    <a href={formatUrl(props.url)} className="text-white cell col col-sm-6 text-start">
      <div className="cell__inner">
        <div className="position-relative">
          <div className="cell__title-bar" />
          <h1 className="cell__title text-truncate fw-normal w-100 ps-4">{props.title}</h1>
        </div>
        <div className="cell__image-container m-0 p-0 container w-100">
          <img className='w-100' src={props.imageSrc} />
        </div>
        <p className='cell__details d-block w-100 fs-5 fw-light text-truncate'>{props.details}</p>
      </div>
    </a>
  )
}