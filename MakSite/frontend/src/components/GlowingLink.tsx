import type { ComponentPropsWithoutRef, ReactElement } from "react";
import { Link } from "react-router-dom";

type GlowingLinkProps = ComponentPropsWithoutRef<"a"> & {
  url: any;
  text: String;
};

export default function GlowingLink({text, url, className = "", ...rest}: GlowingLinkProps): ReactElement {
  return (
    <>
      <Link className={`header-link-glowstick ${className}`} to={url} data-text={text} {...rest}>
          <span className="actual-text">&nbsp;{text}&nbsp;</span>
          <span aria-hidden="true" className="hover-text">&nbsp;{text}&nbsp;</span>
      </Link>
    </>
  )
}