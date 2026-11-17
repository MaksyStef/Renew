import { useRef } from "react"
import type { RefObject } from "react"
import gsap from "gsap"
import { Observer } from "gsap/Observer"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP, Observer)

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface RevealOptions {
  /** Attribute holding the priority number. Lower numbers reveal first. */
  priorityAttribute?: string
  /** Time (s) on the transition timeline at which the reveal starts. */
  startAt?: number
  duration?: number
  ease?: string
  stagger?: number
  /** Overlap (s) between consecutive priority groups. */
  overlap?: number
  hiddenState?: gsap.TweenVars
  visibleState?: gsap.TweenVars
}

export interface FullpageSectionsOptions {
  selectors?: {
    section?: string
    image?: string
    outer?: string
    inner?: string
  }
  /** Transition duration in seconds. */
  duration?: number
  ease?: string
  /** Background parallax distance in yPercent. */
  parallax?: number
  /** Wrap around at the first/last section. If false, scrolling stops at the ends. */
  loop?: boolean
  /** Observer input types, e.g. "wheel,touch" or "wheel,touch,pointer". */
  inputs?: string
  tolerance?: number
  wheelSpeed?: number
  /** Keeps the original "first slide gets messed up" workaround. */
  fixFirstSlide?: boolean
  /** Fires as soon as a transition into `index` starts. */
  onEnter?: (index: number, from: number) => void
  /** Fires once the old section has been hidden after a transition. */
  onLeave?: (index: number, to: number) => void
  /** Enable priority-based reveal of children. Pass `true` for defaults. */
  reveal?: boolean | RevealOptions
  /** Section indexes where wheel / touch / pointer input is ignored.
   *  Read live on every input. Programmatic goTo / next / prev still work. */
  lockedSections?: number[]
}

export interface FullpageSectionsControls {
  goTo: (index: number, direction?: 1 | -1) => void
  next: () => void
  prev: () => void
  getIndex: () => number
}

/* ------------------------------------------------------------------ */
/* Defaults                                                            */
/* ------------------------------------------------------------------ */

const DEFAULT_SELECTORS = {
  section: ".section",
  image: ".bg",
  outer: ".outer",
  inner: ".inner",
}

const DEFAULT_REVEAL: Required<RevealOptions> = {
  priorityAttribute: "data-reveal-priority",
  startAt: 0.9,
  duration: 0.55,
  ease: "power2.out",
  stagger: 0.12,
  overlap: 0.05,
  hiddenState: { autoAlpha: 0, xPercent: -100 },
  visibleState: { autoAlpha: 1, xPercent: 0 },
}

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

/**
 * Full-screen, scroll-hijacked sections with a GSAP Observer.
 *
 * Structural options (selectors, duration, loop, inputs, reveal...) are read
 * once on mount. Callbacks (onEnter / onLeave) always use the latest closure,
 * so they can safely call React state setters.
 */
export function useFullpageSections(
  scope: RefObject<HTMLElement | null>,
  options: FullpageSectionsOptions = {}
): RefObject<FullpageSectionsControls> {
  const optsRef = useRef(options)
  optsRef.current = options

  const controls = useRef<FullpageSectionsControls>({
    goTo: () => {},
    next: () => {},
    prev: () => {},
    getIndex: () => -1,
  })

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return

      const {
        selectors,
        duration = 1.25,
        ease = "power1.inOut",
        parallax = 15,
        loop = true,
        inputs = "wheel,touch",
        tolerance = 30,
        wheelSpeed = -1,
        fixFirstSlide = true,
        reveal: revealOpt,
      } = optsRef.current

      const sel = { ...DEFAULT_SELECTORS, ...selectors }
      const rv: Required<RevealOptions> | null = revealOpt
        ? { ...DEFAULT_REVEAL, ...(revealOpt === true ? {} : revealOpt) }
        : null

      const sections = gsap.utils.toArray<HTMLElement>(sel.section, root)
      const images = gsap.utils.toArray<HTMLElement>(sel.image, root)
      const outerWrappers = gsap.utils.toArray<HTMLElement>(sel.outer, root)
      const innerWrappers = gsap.utils.toArray<HTMLElement>(sel.inner, root)
      if (!sections.length) return

      const normalize = loop
        ? gsap.utils.wrap(0, sections.length)
        : gsap.utils.clamp(0, sections.length - 1)

      let currentIndex = -1
      let animating = false
      let revealTl: gsap.core.Timeline | null = null

      gsap.set(outerWrappers, { yPercent: 100 })
      gsap.set(innerWrappers, { yPercent: -100 })

      /* ---------- reveal helpers (only used when `reveal` is set) ---------- */

      const revealSelector = rv ? `[${rv.priorityAttribute}]` : ""

      const getRevealItems = (section: Element) =>
        rv ? Array.from(section.querySelectorAll<HTMLElement>(revealSelector)) : []

      const priorityOf = (el: HTMLElement) =>
        Number(el.getAttribute(rv!.priorityAttribute))

      if (rv) gsap.set(gsap.utils.toArray(revealSelector, root), rv.hiddenState)

      function reveal(section: Element) {
        if (!rv) return
        revealTl?.kill()
        const items = getRevealItems(section)
        const priorities = [...new Set(items.map(priorityOf))].sort((a, b) => a - b)

        revealTl = gsap.timeline()
        priorities.forEach((p, i) => {
          revealTl!.to(
            items.filter((el) => priorityOf(el) === p),
            {
              ...rv.visibleState,
              duration: rv.duration,
              ease: rv.ease,
              stagger: rv.stagger,
            },
            i === 0 ? 0 : `>-${rv.overlap}`
          )
        })
      }

      /* ---------------------------- transition ---------------------------- */

      function goTo(index: number, direction: 1 | -1) {
        index = normalize(index)
        if (index === currentIndex) return

        const from = currentIndex
        const dFactor = direction === -1 ? -1 : 1

        animating = true
        revealTl?.kill()

        const tl = gsap.timeline({
          defaults: { duration, ease },
          onComplete: () => {
            animating = false
          },
        })

        optsRef.current.onEnter?.(index, from)

        if (from >= 0) {
          // Runs on every transition after the initial one
          gsap.set(sections[from], { zIndex: 0 })
          tl.to(images[from], { yPercent: -parallax * dFactor })
            .set(sections[from], { autoAlpha: 0 })
            .call(() => optsRef.current.onLeave?.(from, index))

          // Reset the old section so its reveal can replay next time
          if (rv) tl.set(getRevealItems(sections[from]), rv.hiddenState)
        }

        gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 })

        tl.fromTo(
          [outerWrappers[index], innerWrappers[index]],
          { yPercent: (i: number) => (i ? -100 * dFactor : 100 * dFactor) },
          { yPercent: 0 },
          0
        ).fromTo(
          images[index],
          { yPercent: parallax * dFactor },
          { yPercent: 0 },
          0
        )

        if (rv) tl.add(() => reveal(sections[index]), rv.startAt)

        currentIndex = index
      }

      /* ------------------------------ input ------------------------------ */
      const isLocked = () =>
        optsRef.current.lockedSections?.includes(currentIndex) ?? false

      Observer.create({
        type: inputs,
        wheelSpeed,
        tolerance,
        preventDefault: true,
        onDown: () => !animating && !isLocked() && goTo(currentIndex - 1, -1),
        onUp: () => !animating && !isLocked() && goTo(currentIndex + 1, 1),
      })

      /* ------------------------ first-slide workaround ------------------------ */
      // Original note: root cause never found, this makes it behave.
      if (fixFirstSlide && innerWrappers[0] && outerWrappers[0]) {
        gsap.from([innerWrappers[0], outerWrappers[0]], { yPercent: 0 })
      }

      /* ---------------------------- public API ---------------------------- */

      controls.current = {
        goTo: (index, direction) => {
          if (animating) return
          goTo(index, direction ?? (index >= currentIndex ? 1 : -1))
        },
        next: () => !animating && goTo(currentIndex + 1, 1),
        prev: () => !animating && goTo(currentIndex - 1, -1),
        getIndex: () => currentIndex,
      }

      // Initial slide
      goTo(0, 1)
    },
    { scope }
  )

  return controls
}

/* ------------------------------------------------------------------ */
/* Usage                                                               */
/* ------------------------------------------------------------------ */
//
// Snippet 1 / 3 (hero flag, wheel + touch):
//
//   useFullpageSections(wrapperRef, {
//     onEnter: (i) => { if (i === 0) setHeroActive(true) },
//     onLeave: (i) => { if (i === 0) setHeroActive(false) },
//   })
//
// Snippet 2 (reveal animations, pointer input too):
//
//   useFullpageSections(wrapperRef, {
//     inputs: "wheel,touch,pointer",
//     reveal: true,
//   })
//
// Programmatic navigation (e.g. a nav dot):
//
//   const sectionsApi = useFullpageSections(wrapperRef, { ... })
//   <button onClick={() => sectionsApi.current.goTo(2)} />