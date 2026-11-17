import { useRef } from "react"
import type { CSSProperties, JSX, PointerEvent as ReactPointerEvent } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

import "../styles/pull_cord.scss"

gsap.registerPlugin(useGSAP)

/* ------------------------------------------------------------------ */
/* Default texture                                                     */
/* ------------------------------------------------------------------ */

/**
 * Braided rope tile, 14 x 14 px, seamless on both axes.
 * Swap it for your own asset with the `texture` prop (any image that tiles
 * vertically), e.g. texture="/textures/rope.png".
 */
const ROPE_TILE_SVG = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">`,
  `<rect width="14" height="14" fill="#4a3822"/>`,
  `<g fill="#d3bc90" stroke="#5b4528" stroke-width="1.2" stroke-linejoin="round">`,
  `<polygon points="0,0 14,-14 14,-5 0,9"/>`,
  `<polygon points="0,14 14,0 14,9 0,23"/>`,
  `</g>`,
  `<g fill="none" stroke="#f0e2bf" stroke-width="1" stroke-linecap="round">`,
  `<line x1="0" y1="2.5" x2="14" y2="-11.5"/>`,
  `<line x1="0" y1="16.5" x2="14" y2="2.5"/>`,
  `</g></svg>`,
].join("")

export const DEFAULT_ROPE_TEXTURE = `data:image/svg+xml,${encodeURIComponent(ROPE_TILE_SVG)}`

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface PullCordProps {
  /** Called at the moment the cord has snapped back up. Start the scroll here. */
  onPull: () => void
  /** Image URL for the cord texture. Must tile vertically. */
  texture?: string
  /** CSS background-size of one texture tile. `100% auto` keeps the tile's aspect ratio. */
  textureSize?: string
  /** Visible cord length at rest, in px. */
  length?: number
  /** How far the cord travels down when pulled, in px. */
  travel?: number
  /** Cord thickness, in px. */
  width?: number
  /** Accessible name of the handle. */
  label?: string
  className?: string
}

/** How far (px) the cord snaps above its resting position on the way back up. */
const REBOUND = 10

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

/**
 * A cord hanging from the top-right corner of its positioned ancestor.
 *
 * - Click, tap, Enter or Space: the cord pulls down by `travel`, snaps up a
 *   little past its resting point, then calls `onPull`.
 * - Drag the handle: follows the pointer. Release past half of `travel` and
 *   it behaves like a pull; release earlier and it springs back without firing.
 */
export default function PullCord({
  onPull,
  texture = DEFAULT_ROPE_TEXTURE,
  textureSize = "100% auto",
  length = 140,
  travel = 64,
  width = 14,
  label = "Pull the cord to continue",
  className = "",
}: PullCordProps): JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null)
  const slideRef = useRef<HTMLDivElement>(null)

  const busy = useRef(false)
  const drag = useRef<{ startY: number; moved: boolean } | null>(null)
  const swallowClick = useRef(false)

  // Always call the latest callback without re-creating handlers.
  const onPullRef = useRef(onPull)
  onPullRef.current = onPull

  const { contextSafe } = useGSAP({ scope: rootRef })

  /**
   * fire = true : snap up past rest, call onPull, settle.
   * fire = false: spring back to rest, no callback.
   */
  const release = contextSafe((fire: boolean) => {
    busy.current = true
    const tl = gsap.timeline({
      onComplete: () => {
        busy.current = false
      },
    })

    if (fire) {
      tl.to(slideRef.current, { y: -REBOUND, duration: 0.2, ease: "power2.out" })
        .call(() => onPullRef.current())
        .to(slideRef.current, { y: 0, duration: 0.45, ease: "sine.inOut" })
    } else {
      tl.to(slideRef.current, { y: 0, duration: 0.6, ease: "elastic.out(1, 0.45)" })
    }
  })

  /** Automatic pull (click, tap, keyboard). */
  const pull = contextSafe(() => {
    if (busy.current) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onPullRef.current()
      return
    }

    busy.current = true
    gsap.to(slideRef.current, {
      y: travel,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => release(true),
    })
  })

  /* ------------------------------- drag -------------------------------- */

  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (busy.current || e.button !== 0) return
    swallowClick.current = false
    drag.current = { startY: e.clientY, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    if (!d) return

    const dy = e.clientY - d.startY
    if (!d.moved && Math.abs(dy) < 4) return // still a click
    d.moved = true

    // Follow the pointer, with a rubber band past the end of travel.
    const y = dy <= travel ? Math.max(0, dy) : travel + (dy - travel) * 0.25
    gsap.set(slideRef.current, { y })
  }

  const endDrag = (cancelled: boolean) => {
    const d = drag.current
    drag.current = null
    if (!d?.moved) return // plain click: onClick takes over

    swallowClick.current = true // the click that follows a drag is not a pull
    const y = Number(gsap.getProperty(slideRef.current, "y"))
    release(!cancelled && y >= travel * 0.5)
  }

  const onClick = () => {
    if (swallowClick.current) {
      swallowClick.current = false
      return
    }
    pull()
  }

  /* ------------------------------ render ------------------------------- */

  const style = {
    "--cord-length": `${length}px`,
    "--cord-extra": `${travel + 48}px`, // rope hidden above the viewport edge
    "--cord-width": `${width}px`,
    "--cord-texture": `url("${texture}")`,
    "--cord-texture-size": textureSize,
  } as CSSProperties

  return (
    <div
      ref={rootRef}
      className={`pull-cord ${className}`.trim()}
      style={style}
    >
      <div ref={slideRef} className="pull-cord__slide">
        <div className="pull-cord__rope" aria-hidden="true" />
        <button
          type="button"
          className="pull-cord__handle"
          aria-label={label}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => endDrag(false)}
          onPointerCancel={() => endDrag(true)}
          onClick={onClick}
        />
      </div>
    </div>
  )
}