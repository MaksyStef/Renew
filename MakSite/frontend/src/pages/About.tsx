import type { JSX } from "react"
import { Link } from "react-router-dom"
import { useRef } from "react"
import { gsap } from "gsap/gsap-core"
import { useGSAP } from "@gsap/react"
import { Observer } from 'gsap/Observer'

import Footer from "../components/Footer.tsx"
import PageWrapper from "../components/PageWrapper.tsx"
import AnimatedButton from "../components/AnimatedButton.tsx"

import "../styles/about.scss"

gsap.registerPlugin(useGSAP)
gsap.registerPlugin(Observer)


export default function About(): JSX.Element {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let sections = document.querySelectorAll(".section"),
      images = document.querySelectorAll(".bg"),
      outerWrappers = gsap.utils.toArray(".outer"),
      innerWrappers = gsap.utils.toArray(".inner"),
      currentIndex = -1,
      wrap = gsap.utils.wrap(0, sections.length),
      animating: boolean,
      revealTl: gsap.core.Timeline | null = null

    gsap.set(outerWrappers, { yPercent: 100 })
    gsap.set(innerWrappers, { yPercent: -100 })

    const hiddenState = { autoAlpha: 0, xPercent: -100 }

    const getRevealItems = (section: Element) =>
      Array.from(section.querySelectorAll<HTMLElement>("[data-reveal-priority]"))

    // start everything hidden
    gsap.set("[data-reveal-priority]", hiddenState)

    function reveal(section: Element) {
      revealTl?.kill()
      const items = getRevealItems(section)
      const priorities = [...new Set(items.map(el => Number(el.dataset.revealPriority)))]
        .sort((a, b) => a - b)

      revealTl = gsap.timeline()
      priorities.forEach(p => {
        revealTl!.to(
          items.filter(el => Number(el.dataset.revealPriority) === p),
          { autoAlpha: 1, xPercent: 0, duration: 0.55, ease: "power2.out", stagger: 0.12 },
          ">-0.05" // slight overlap between priority groups
        )
      })
    }

    function gotoSection(index: number, direction: number) {
      index = wrap(index); // make sure it's valid
      animating = true;
      revealTl?.kill();
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
          .set(sections[currentIndex], { autoAlpha: 0 })
          // reset the old section so it can replay next time
          .set(getRevealItems(sections[currentIndex]), hiddenState);
      }
      gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
      tl.fromTo([outerWrappers[index], innerWrappers[index]], {
        yPercent: i => i ? -100 * dFactor : 100 * dFactor
      }, {
        yPercent: 0
      }, 0)
        .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
        .add(() => reveal(sections[index]), 0.9)
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

    //   // I never solved why the first slide gets fucked
    //   // But my job is to make stuff work, and no one cares how 👾
    //   // So this is the fix
    gsap.from(
      [
        document.querySelectorAll(".inner")[0],
        document.querySelectorAll(".outer")[0]
      ],
      { yPercent: 0 }
    )

    //   // Make initial slide
    gotoSection(0, 1)
  }, { scope: wrapperRef })

  useGSAP(() => {
    const root = wrapperRef.current
    if (!root) return

    const mm = gsap.matchMedia()

    // Only on devices with a real pointer, and respect reduced-motion
    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const MAX_SHIFT = 80 // px an element moves at intensity 1

      const layers = Array.from(
        root.querySelectorAll<HTMLElement>("[data-parallax-intensity]")
      ).map(el => ({
        intensity: parseFloat(el.dataset.parallaxIntensity ?? "0") || 0,
        xTo: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }),
        yTo: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" }),
      }))

      const onMove = (e: PointerEvent) => {
        // -1 … 1 relative to viewport center
        const nx = (e.clientX / window.innerWidth - 0.5) * 2
        const ny = (e.clientY / window.innerHeight - 0.5) * 2
        layers.forEach(({ intensity, xTo, yTo }) => {
          xTo(-nx * intensity * MAX_SHIFT)
          yTo(-ny * intensity * MAX_SHIFT)
        })
      }

      const onLeave = () => layers.forEach(({ xTo, yTo }) => { xTo(0); yTo(0) })

      window.addEventListener("pointermove", onMove)
      document.documentElement.addEventListener("pointerleave", onLeave)

      return () => {
        window.removeEventListener("pointermove", onMove)
        document.documentElement.removeEventListener("pointerleave", onLeave)
      }
    })

    return () => mm.revert()
  }, { scope: wrapperRef })

  return (
    <>
      <PageWrapper className="page-wrapper_snap page-wrapper_about" ref={wrapperRef}>
        <section className="section section_1">
          <div className="outer">
            <div className="inner">
              <div className="bg">
                <div className="vw-100 vh-100 d-flex flex-column justify-content-center align-items-center">
                  {/* inspiration: https://shorturl.at/4IsRF */}
                  <div className="photo-card">
                    <div className="photo-card__left">
                      <div className="background">
                        <div className="image-container">
                          <img src="/images/about_1.svg" alt="background" />
                        </div>
                        <div className="text-container" data-reveal-priority="2" data-parallax-intensity=".5">
                          <span>WEB DEVELOPER</span>
                        </div>
                      </div>
                      <div className="foreground" data-reveal-priority="1">
                        <div className="image-container" data-parallax-intensity=".15">
                          <img src="/images/figure.png" alt="Man in a hoodie" />
                        </div>
                        <div className="text-container" data-reveal-priority="2" data-parallax-intensity=".75">
                          <span className="text text_1">frontend</span>
                          <span className="text text_2">deployment</span>
                          <span className="text text_3">backend</span>
                        </div>
                      </div>
                    </div>
                    <div className="photo-card__right">
                      <div className="header">
                        <a href="#" className="link" data-reveal-priority="1">Link</a>
                        <a href="#" className="link" data-reveal-priority="1">Link</a>
                        <a href="#" className="link" data-reveal-priority="0">Link</a>
                      </div>
                      <div className="body">
                        <span className="text text_1" data-reveal-priority="1" data-parallax-intensity=".25">Python</span>
                        <span className="text text_2" data-reveal-priority="2" data-parallax-intensity=".45">Django</span>
                        <span className="text text_3" data-reveal-priority="2" data-parallax-intensity=".47">HTML</span>
                        <span className="text text_4" data-reveal-priority="2" data-parallax-intensity=".45">CSS</span>
                        <span className="text text_5" data-reveal-priority="1" data-parallax-intensity=".42">SASS/SCSS</span>
                        <span className="text text_6" data-reveal-priority="1" data-parallax-intensity=".22">JavaScript</span>
                        <span className="text text_7" data-reveal-priority="2" data-parallax-intensity=".44">React</span>
                        <span className="text text_8" data-reveal-priority="2" data-parallax-intensity=".48">AI</span>
                        <span className="text text_9" data-reveal-priority="1" data-parallax-intensity=".45">Quick</span>
                        <span className="text text_10" data-reveal-priority="2" data-parallax-intensity=".65">High Quality</span>
                        <span className="text text_11" data-reveal-priority="3" data-parallax-intensity=".35">Principles</span>
                        <span className="text text_12" data-reveal-priority="3" data-parallax-intensity=".67">Methodology</span>
                        <span className="image-container image-container_1" data-reveal-priority="2" data-parallax-intensity=".55"><svg data-cds="Spark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="var(--cds-clay, #d97757)" aria-hidden="true"><path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"></path></svg></span>
                        <span className="image-container image-container_2" data-reveal-priority="3" data-parallax-intensity=".38"><svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 2406 2406">
                          <path d="M1 578.4C1 259.5 259.5 1 578.4 1h1249.1c319 0 577.5 258.5 577.5 577.4V2406H578.4C259.5 2406 1 2147.5 1 1828.6V578.4z" fill="#74aa9c" />
                          <path id="a" d="M1107.3 299.1c-197.999 0-373.9 127.3-435.2 315.3L650 743.5v427.9c0 21.4 11 40.4 29.4 51.4l344.5 198.515V833.3h.1v-27.9L1372.7 604c33.715-19.52 70.44-32.857 108.47-39.828L1447.6 450.3C1361 353.5 1237.1 298.5 1107.3 299.1zm0 117.5-.6.6c79.699 0 156.3 27.5 217.6 78.4-2.5 1.2-7.4 4.3-11 6.1L952.8 709.3c-18.4 10.4-29.4 30-29.4 51.4V1248l-155.1-89.4V755.8c-.1-187.099 151.601-338.9 339-339.2z" fill="#fff" />
                          <use xlinkHref="#a" transform="rotate(60 1203 1203)" />
                          <use xlinkHref="#a" transform="rotate(120 1203 1203)" />
                          <use xlinkHref="#a" transform="rotate(180 1203 1203)" />
                          <use xlinkHref="#a" transform="rotate(240 1203 1203)" />
                          <use xlinkHref="#a" transform="rotate(300 1203 1203)" />
                        </svg></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section section_2">
          <div className="outer">
            <div className="inner">
              <div className="bg">
                <div className="w-75 vh-100 d-flex flex-column justify-content-center align-items-center">
                  <h1 className="text-center display-1"><strong><Link to="/"><AnimatedButton>H O M E</AnimatedButton></Link></strong></h1>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </PageWrapper>
    </>
  )
}