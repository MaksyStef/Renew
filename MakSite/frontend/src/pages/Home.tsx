import type { JSX } from 'react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'

import { OverlayTrigger, Popover } from 'react-bootstrap'
import Footer from '../components/Footer.tsx'
import PageWrapper from '../components/PageWrapper.tsx'

import '../styles/home.scss'


export default function Home(): JSX.Element {
  const contactMeRef = useRef<HTMLButtonElement>(null);
  const curtainsRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const contactMePopover = (
    <Popover id="popover-contact-me">
      <span>Email copied to the clipboard!</span>
    </Popover>
      
  )
  function onContactMe (e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!contactMeRef.current) {
      throw new Error("Contact Me button ref is not set");
    }
    window.navigator.clipboard.writeText("maksistef@gmail.com");
  }

  function curtainsEvent() {
    curtainsRef.current?.classList.add('active');
    setTimeout(() => {
      wrapperRef.current?.style.setProperty('overflow', 'hidden');
    }, 1000);
    setTimeout(() => {
      curtainsRef.current?.classList.remove('active');
      wrapperRef.current?.style.removeProperty('overflow');
    }, 1500);
  }

  return (
    <>
      <PageWrapper className="page-wrapper_snap" onScroll={() => { curtainsEvent() }} ref={wrapperRef} >
        <div className="w-75 vh-100 d-flex flex-column justify-content-center align-items-center">
          <h1 className="text-center display-1"><strong>Full Stack Web Developer</strong></h1>
        </div>
        <div className="w-75 vh-100 d-flex flex-column justify-content-center align-items-center">
          <h1 className="text-center display-1"><strong className='lh-base'>Experience Building<br /><mark className='px-4 py-0'>Web Applications</mark><br />From the Ground Up</strong></h1>
        </div>
        <div className="w-75 vh-100 d-flex flex-column justify-content-center align-items-center">
          <h1 className="text-center display-1"><strong><Link to="/about">About Me</Link></strong></h1>
        </div>
        <div className="w-75 vh-100 d-flex flex-column justify-content-center align-items-center">
          <h1 className="text-center display-1"><strong><Link to="/projects">Projects</Link></strong></h1>
        </div>
        <div className="w-75 vh-100 d-flex flex-column justify-content-center align-items-center">
          <OverlayTrigger overlay={contactMePopover} placement="top" trigger="click" rootClose>
            <button className="btn btn-primary btn-lg p-2 fs-1 fw-bold" onClick={onContactMe} ref={contactMeRef} type="button">Contact Me</button>
          </OverlayTrigger>
        </div>
        <Footer />
        <div className="curtains" ref={curtainsRef} />
      </PageWrapper>
    </>
  )
}