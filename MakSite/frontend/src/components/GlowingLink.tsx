import type { ReactElement } from "react";
import { Link } from "react-router-dom";

export default function GlowingLink(props: {url: any, text: String, className?: String}): ReactElement {
  return (
    <>
      <Link className={`header-link-glowstick ${props.className}`} to={props.url} data-text={props.text}>
          <span className="actual-text">&nbsp;{props.text}&nbsp;</span>
          <span aria-hidden="true" className="hover-text">&nbsp;{props.text}&nbsp;</span>
      </Link>
    </>
  )
}