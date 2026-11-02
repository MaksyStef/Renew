import type { ComponentPropsWithoutRef, ReactElement } from "react"


type PageWrapperProps = ComponentPropsWithoutRef<"div">;

export default function PageWrapper({ className = "", children, ...rest }: PageWrapperProps): ReactElement {
  return (
    <div {...rest} className={`page-wrapper ${className}`}>
      {children}
    </div>
  );
}