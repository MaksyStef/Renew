import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

type ShapeType = "star" | "box" | "triangle";

/**
 * RollingShapesSection
 * ---------------------------------------------------------------------------
 * A full-bleed section with an animated background: rows of star / box /
 * triangle shapes that "roll" across the section horizontally. Every other
 * row rolls in the opposite direction.
 *
 * Install:
 *   npm install gsap @gsap/react
 *
 * Usage:
 *   <RollingShapesSection>
 *     <h1>Your foreground content</h1>
 *   </RollingShapesSection>
 */

// ---- Config -----------------------------------------------------------
const ROW_COUNT = 6; // how many rows of shapes stack vertically
const SHAPES_PER_HALF_ROW = 8; // shapes per copy (each row is duplicated x2 for a seamless loop)
const SHAPE_SEQUENCE: ShapeType[] = ["star", "box", "triangle"];
const MIN_DURATION = 18; // seconds for the slowest row to cross once
const MAX_DURATION = 34; // seconds for the fastest row to cross once

interface ShapeSpec {
  type: ShapeType;
  key: string;
}

function buildRowShapes(rowIndex: number): ShapeSpec[] {
  // Two identical halves back-to-back -> translating exactly -50% loops seamlessly
  const half: ShapeSpec[] = Array.from({ length: SHAPES_PER_HALF_ROW }, (_, i) => {
    const type = SHAPE_SEQUENCE[(rowIndex + i) % SHAPE_SEQUENCE.length];
    return { type, key: `${rowIndex}-${i}` };
  });
  return [...half, ...half.map((s) => ({ ...s, key: s.key + "-dup" }))];
}

function Shape({ type }: { type: ShapeType }) {
  const common = {
    className: "roll-shape__svg",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
  };

  if (type === "box") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    );
  }

  if (type === "triangle") {
    return (
      <svg {...common}>
        <polygon points="12,2 22,21 2,21" />
      </svg>
    );
  }

  // star
  return (
    <svg {...common}>
      <polygon
        points="12,1 15.09,8.26 23,9.27 17,14.97 18.18,22.9 12,19 5.82,22.9 7,14.97 1,9.27 8.91,8.26"
      />
    </svg>
  );
}

interface RollingShapesSectionProps {
  children?: ReactNode;
}

export default function RollingShapesSection({
  children,
}: RollingShapesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Full rolling animation for everyone except reduced-motion users.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        rowRefs.current.forEach((rowEl, i) => {
          if (!rowEl) return;

          const goingRight = i % 2 === 1; // alternate direction per row
          const duration = gsap.utils.mapRange(
            0,
            ROW_COUNT - 1,
            MIN_DURATION,
            MAX_DURATION,
            i
          );

          // Horizontal loop: two duplicated halves, translate exactly 50% of
          // the row's own width, then snap back for a seamless infinite loop.
          gsap.fromTo(
            rowEl,
            { xPercent: goingRight ? -50 : 0 },
            {
              xPercent: goingRight ? 0 : -50,
              duration,
              ease: "none",
              repeat: -1,
            }
          );

          // Rolling rotation on every shape in the row, direction matched to
          // the row's travel direction so the shapes look like they're
          // physically rolling rather than just spinning in place.
          const shapeEls = rowEl.querySelectorAll(".roll-shape__svg");
          gsap.to(shapeEls, {
            rotation: goingRight ? 360 : -360,
            duration: duration / 2,
            ease: "none",
            repeat: -1,
            transformOrigin: "50% 50%",
          });
        });

        return () => { }; // cleanup handled by useGSAP/matchMedia revert
      });

      // Reduced-motion users get a static, evenly spread arrangement instead
      // of a spinning/looping background.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        rowRefs.current.forEach((rowEl) => {
          if (!rowEl) return;
          gsap.set(rowEl, { xPercent: -25 });
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <>
      <div className="roll-section__bg" aria-hidden="true">
        {Array.from({ length: ROW_COUNT }, (_, rowIndex) => (
          <div
            key={rowIndex}
            className="roll-row"
            style={{ top: `${(rowIndex / ROW_COUNT) * 100}%` }}
          >
            <div
              className="roll-row__track"
              ref={(el) => {
                rowRefs.current[rowIndex] = el;
              }}
            >
              {buildRowShapes(rowIndex).map((shape) => (
                <div className="roll-shape" key={shape.key}>
                  <Shape type={shape.type} />
                </div>
              ))}
            </div>
          </div>
        ))}
        <style>{`
            .roll-section {
              position: relative;
              overflow: hidden;
              min-height: 100vh;
              background: #0e1016;
            }

            .roll-section__bg {
              position: absolute;
              inset: 0;
              overflow: hidden;
              z-index: -2;
            }

            .roll-row {
              position: absolute;
              left: 0;
              width: 100%;
              height: ${100 / ROW_COUNT}%;
              display: flex;
              align-items: center;
              overflow: hidden;
              z-index: -2;
            }

            .roll-row__track {
              display: flex;
              align-items: center;
              width: 200%;
              will-change: transform;
            }

            .roll-shape {
              z-index: -2;
              flex: 0 0 auto;
              width: 6vw;
              max-width: 64px;
              min-width: 28px;
              aspect-ratio: 1 / 1;
              margin: 0 3vw;
              opacity: 0.75;
              will-change: transform;
            }

            .roll-shape__svg {
              width: 100%;
              height: 100%;
              fill: #ffcd97;
              display: block;
              z-index: -2;
            }

            .roll-section__content {
              position: relative;
              z-index: 1;
            }
          `}</style>
      </div>
      <div className="roll-section__content d-flex justify-content-center align-items-center w-100 h-100">
        {children}
      </div>
    </>
  );
}