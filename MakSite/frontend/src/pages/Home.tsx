import type { JSX } from 'react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap/gsap-core'
import { useGSAP } from '@gsap/react'
import { Observer } from 'gsap/Observer'

import { OverlayTrigger, Popover } from 'react-bootstrap'
import Footer from '../components/Footer.tsx'
import PageWrapper from '../components/PageWrapper.tsx'

import '../styles/home.scss'

gsap.registerPlugin(useGSAP)
gsap.registerPlugin(Observer)


export default function Home(): JSX.Element {
  const contactMeRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const contactMePopover = (
    <Popover id="popover-contact-me">
      <span>Email copied to the clipboard!</span>
    </Popover>

  )
  function onContactMe(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!contactMeRef.current) {
      throw new Error("Contact Me button ref is not set");
    }
    window.navigator.clipboard.writeText("maksistef@gmail.com");
  }

  useGSAP(() => {
    let sections = document.querySelectorAll(".section"),
      images = document.querySelectorAll(".bg"),
      outerWrappers = gsap.utils.toArray(".outer"),
      innerWrappers = gsap.utils.toArray(".inner"),
      currentIndex = -1,
      wrap = gsap.utils.wrap(0, sections.length),
      animating: boolean

    gsap.set(outerWrappers, { yPercent: 100 })
    gsap.set(innerWrappers, { yPercent: -100 })

    function gotoSection(index: number, direction: number) {
      index = wrap(index); // make sure it's valid
      animating = true;
      let fromTop = direction === -1,
        dFactor = fromTop ? -1 : 1,
        tl = gsap.timeline({
          defaults: { duration: 1.25, ease: "power1.inOut" },
          onComplete: () => animating = false
        })
      if (currentIndex >= 0) {
        // This runs on every run after the initial one
        gsap.set(sections[currentIndex], { zIndex: 0 });
        tl.to(images[currentIndex], { yPercent: -15 * dFactor })
          .set(sections[currentIndex], { autoAlpha: 0 });
      }
      gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
      tl.fromTo([outerWrappers[index], innerWrappers[index]], {
        yPercent: i => i ? -100 * dFactor : 100 * dFactor
      }, {
        yPercent: 0
      }, 0)
        .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)

      currentIndex = index
    }

    Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () => !animating && gotoSection(currentIndex - 1, -1),
      onUp: () => !animating && gotoSection(currentIndex + 1, 1),
      tolerance: 30,
      preventDefault: true
    })

    // I never solved why the first slide gets fucked
    // But my job is to make stuff work, and no one cares how 👾
    // So this is the fix
    gsap.from(
      [
        document.querySelectorAll(".inner")[0],
        document.querySelectorAll(".outer")[0]
      ],
      {
        yPercent: 0
      }
    )

    // Make initial slide
    gotoSection(0, 1)
  }, { scope: wrapperRef })

  return (
    <>
      <PageWrapper className="page-wrapper_snap" ref={wrapperRef} >
        <section className="section section_1">
          <div className="outer">
            <div className="inner">
              <div className="bg">
                <h1 className="text-center display-1"><strong>Full Stack Web Developer</strong></h1>
              </div>
            </div>
          </div>
        </section>
        <section className="section section_2">
          <div className="outer">
            <div className="inner">
              <div className="bg">
                <h1 className="text-center display-1"><strong className='lh-base'>Experience Building<br /><mark className='px-4 py-0'>Web Applications</mark><br />From the Ground Up</strong></h1>
              </div>
            </div>
          </div>
        </section>
        <section className="section section_3">
          <div className="outer">
            <div className="inner">
              <div className="bg">
                <h1 className="text-center display-1"><strong><Link className="header-link" to="/about" header-content="About Me">About Me</Link></strong></h1>
              </div>
            </div>
          </div>
        </section>
        <section className="section section_4">
          <div className="outer">
            <div className="inner">
              <div className="bg">
                <h1 className="text-center display-1"><strong><Link className="header-link" to="/projects" header-content="Projects">Projects</Link></strong></h1>
              </div>
            </div>
          </div>
        </section>
        <section className="section section_5">
          <div className="outer">
            <div className="inner">
              <div className="bg">
                <OverlayTrigger overlay={contactMePopover} placement="top" trigger="click" rootClose>
                  <button className="btn btn-primary btn-lg p-2 fs-1 fw-bold" onClick={onContactMe} ref={contactMeRef} type="button">Contact Me</button>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </PageWrapper>
    </>
  )
}