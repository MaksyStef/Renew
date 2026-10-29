import type { JSX } from 'react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap/gsap-core'
import { useGSAP } from '@gsap/react'
import { Observer } from 'gsap/Observer'

import { OverlayTrigger, Popover } from 'react-bootstrap'
import AnimatedButton from '../components/AnimatedButton.tsx'
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
      <div className="d-flex flex-column gap-2">
        <div>Email copied to the clipboard!</div>
        <div className="d-flex flex-row justify-content-around">
          <a href="">
            <div className="img-container img-container_1">
              <svg id="Livello_1" data-name="Livello 1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 240 240"><defs><linearGradient id="linear-gradient" x1="120" y1="240" x2="120" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1d93d2" /><stop offset="1" stop-color="#38b0e3" /></linearGradient></defs><title>Telegram_logo</title><circle cx="120" cy="120" r="120" fill="url(#linear-gradient)" /><path d="M81.229,128.772l14.237,39.406s1.78,3.687,3.686,3.687,30.255-29.492,30.255-29.492l31.525-60.89L81.737,118.6Z" fill="#c8daea" /><path d="M100.106,138.878l-2.733,29.046s-1.144,8.9,7.754,0,17.415-15.763,17.415-15.763" fill="#a9c6d8" /><path d="M81.486,130.178,52.2,120.636s-3.5-1.42-2.373-4.64c.232-.664.7-1.229,2.1-2.2,6.489-4.523,120.106-45.36,120.106-45.36s3.208-1.081,5.1-.362a2.766,2.766,0,0,1,1.885,2.055,9.357,9.357,0,0,1,.254,2.585c-.009.752-.1,1.449-.169,2.542-.692,11.165-21.4,94.493-21.4,94.493s-1.239,4.876-5.678,5.043A8.13,8.13,0,0,1,146.1,172.5c-8.711-7.493-38.819-27.727-45.472-32.177a1.27,1.27,0,0,1-.546-.9c-.093-.469.417-1.05.417-1.05s52.426-46.6,53.821-51.492c.108-.379-.3-.566-.848-.4-3.482,1.281-63.844,39.4-70.506,43.607A3.21,3.21,0,0,1,81.486,130.178Z" fill="#fff" /></svg>
            </div>
          </a>
          <a href="">
            <div className="img-container img-container_2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 175.216 175.552"><defs><linearGradient id="b" x1="85.915" x2="86.535" y1="32.567" y2="137.092" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#57d163" /><stop offset="1" stop-color="#23b33a" /></linearGradient><filter id="a" width="1.115" height="1.114" x="-.057" y="-.057" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="3.531" /></filter></defs><path fill="#b3b3b3" d="m54.532 138.45 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.523h.023c33.707 0 61.139-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.94 25.983c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.558zm-40.811 23.544L24.16 123.88c-6.438-11.154-9.825-23.808-9.821-36.772.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954zm0 0" filter="url(#a)" /><path fill="#fff" d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z" /><path fill="url(#linearGradient1780)" d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z" /><path fill="url(#b)" d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z" /><path fill="#fff" fill-rule="evenodd" d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647" /></svg>
            </div>
          </a>
          <a href="">
            <div className="img-container img-container_3">
              <svg height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 382 382" xmlSpace="preserve">
                <path xmlns="fill:#0077B7;" d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889  C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056  H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806  c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1  s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73  c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079  c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426  c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472  L341.91,330.654L341.91,330.654z" />
              </svg>
            </div>
          </a>
        </div>
      </div>
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
      <PageWrapper className="page-wrapper_snap page-wrapper_home" ref={wrapperRef} >
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
                <h1>
                  <Link className="header-link-glowstick" to="/about" data-text="About Me">
                    <span className="actual-text">&nbsp;About Me&nbsp;</span>
                    <span aria-hidden="true" className="hover-text">&nbsp;About Me&nbsp;</span>
                  </Link>
                </h1>
              </div>
            </div>
          </div>
        </section>
        <section className="section section_4">
          <div className="outer">
            <div className="inner">
              <div className="bg">
                <h1>
                  <Link to="/projects">
                    <AnimatedButton>P O R T F O L I O</AnimatedButton>
                  </Link>
                </h1>
              </div>
            </div>
          </div>
        </section>
        <section className="section section_5">
          <div className="outer">
            <div className="inner">
              <div className="bg">
                <OverlayTrigger overlay={contactMePopover} placement="top" trigger="click" rootClose>
                  <AnimatedButton onClick={onContactMe} ref={contactMeRef}>C O N T A C T S</AnimatedButton>
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