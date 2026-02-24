import type { JSX } from "react";


export default function PageWrapper(props: any): JSX.Element {
  return (
    <div {...props} 
      className={
        // if classname is provided, add it to the default classname, otherwise just use the default classname
        props.className ? "page-wrapper " + props.className : "page-wrapper"
    }> 
      {props.children}
    </div>
  );
}