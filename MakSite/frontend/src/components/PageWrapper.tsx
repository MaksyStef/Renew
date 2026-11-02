import type { ComponentPropsWithRef, ReactElement } from "react"


type PageWrapperProps = ComponentPropsWithRef<"div">;

export default function PageWrapper({ className = "", children, ...rest }: PageWrapperProps): ReactElement {
  return (
    <div {...rest} className={`page-wrapper ${className}`}>
      {children}
    </div>
  );
}