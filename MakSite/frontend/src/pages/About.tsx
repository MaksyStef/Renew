import type { JSX } from "react"
import { Link } from "react-router-dom"
import { useRef } from "react"
import { gsap } from "gsap/gsap-core"
import { useGSAP } from "@gsap/react"
import { Observer } from 'gsap/Observer'

import Footer from "../components/Footer.tsx"
import PageWrapper from "../components/PageWrapper.tsx"
import AnimatedButton from "../components/AnimatedButton.tsx"
import RollingShapesSection from "../components/RollingShapesSection.tsx"

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

      if (index == 0) {
        let aboutImages = gsap.utils.toArray(".about_grid img")
        aboutImages.forEach((img: any, i) => {

          switch (i) {
            case 0:
              tl.from(img, { alpha: 0, scale: 0.5, duration: .5, delay: .1 })
              break;
            case 1:
              tl.from(img, { alpha: 0, scale: 0.5, yPercent: -50, duration: .5, delay: .1 })
              break;
            case 2:
              tl.from(img, { alpha: 0, scale: 0.5, xPercent: -50, duration: .5, delay: .1 })
              break;
            case 3:
              tl.from(img, { alpha: 0, scale: 0.5, yPercent: 50, duration: .5, delay: .1 })
              break;
            case 4:
              tl.from(img, { alpha: 0, scale: 0.5, xPercent: 50, duration: .5, delay: .1 })
              break;
            default:
              break;
          }
        })
        
        let aboutText = gsap.utils.toArray(".about_grid .text")
        aboutText.forEach((div: any, i) => {

          switch (i) {
            case 0:
              tl.from(div, { alpha: 0, yPercent: -50, duration: .5, delay: .1 })
              break;
            case 1:
              tl.from(div, { alpha: 0, yPercent: 50, duration: .5, delay: .1 })
              break;
            default:
              break;
          }
        })
      }
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
      {
        yPercent: 0
      }
    )

    //   // Make initial slide
    gotoSection(0, 1)
  }, { scope: wrapperRef })

  return (
    <>
      <PageWrapper className="page-wrapper_snap" ref={wrapperRef}>
        <section className="section section_1">
          <div className="outer">
            <div className="inner">
              <div className="bg">
                <RollingShapesSection>
                  <div className="w-75 vh-100 d-flex flex-column justify-content-center align-items-center">
                    <div className="container w-100 h-100">
                      <div className="about_grid d-grid w-100 h-100">
                        <div className="w-100 h-100 d-flex image_center">
                          <img src="https://placehold.co/400x400" />
                        </div>
                        <div className="w-100 h-100 d-flex image_top">
                          <img src="https://placehold.co/600x400" />
                        </div>
                        <div className="w-100 h-100 d-flex  image_left">
                          <img src="https://placehold.co/400x600" />
                        </div>
                        <div className="w-100 h-100 d-flex image_bottom">
                          <img src="https://placehold.co/600x400" />
                        </div>
                        <div className="w-100 h-100 d-flex image_right">
                          <img src="https://placehold.co/400x600" />
                        </div>
                        <div className="text_1 text">
                          <h1 className="display-1"><strong>About Me</strong></h1>
                          <h2 className="display-6 fs-1"><strong>Lorem ipsum dolor sit amet consectetur adipisicing elit.</strong></h2>
                        </div>
                        <div className="text_2 text align-bottom pt-4 text-end">
                          <h2 className="display-6 fs-1"><strong>Aliquid voluptas iure officia ea officiis necessitatibus.</strong></h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </RollingShapesSection>
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