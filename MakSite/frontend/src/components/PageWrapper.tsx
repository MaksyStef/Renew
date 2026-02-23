import type { JSX } from "react";


export default function PageWrapper(props: any): JSX.Element {
  return (
    <div {...props} className="page-wrapper">
      {props.children}
    </div>
  );
}