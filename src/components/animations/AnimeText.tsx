import { useEffect, useRef, createElement } from "react";
import { animate, stagger } from "animejs";

type Props = {
  text: string;
  className?: string;
  letterClassName?: string;
  delay?: number;
  duration?: number;
  staggerMs?: number;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p" | "div";
};

export const AnimeText = ({
  text,
  className = "",
  letterClassName = "inline-block",
  delay = 0,
  duration = 700,
  staggerMs = 28,
  as = "span",
}: Props) => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const letters = el.querySelectorAll<HTMLElement>("[data-letter]");
    if (!letters.length) return;

    const reveal = () => {
      letters.forEach((l) => {
        l.style.opacity = "1";
        l.style.transform = "none";
      });
    };

    // Reduced motion: show immediately, no animation.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return;
    }

    // Play on mount (no IntersectionObserver gate — this is used for
    // above-the-fold headlines, where IO-gating caused the reveal to
    // intermittently never fire and leave the letters stuck at opacity:0).
    // A double rAF ensures layout is settled before animating.
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        animate(letters, {
          opacity: [0, 1],
          translateY: [20, 0],
          rotateZ: [-6, 0],
          duration,
          delay: stagger(staggerMs, { start: delay }),
          easing: "easeOutExpo",
        });
      });
    });

    // Safety net: whatever happens, never leave the text invisible.
    const total = delay + duration + letters.length * staggerMs + 600;
    const safety = window.setTimeout(() => {
      letters.forEach((l) => {
        if (getComputedStyle(l).opacity === "0") {
          l.style.opacity = "1";
          l.style.transform = "none";
        }
      });
    }, total);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(safety);
    };
  }, [delay, duration, staggerMs, text]);

  const children = text.split("").map((ch, i) =>
    createElement(
      "span",
      {
        key: i,
        "data-letter": true,
        className: `${letterClassName} opacity-0`,
        style: { whiteSpace: ch === " " ? "pre" : "normal" },
      },
      ch,
    ),
  );

  return createElement(
    as,
    {
      ref,
      className,
      "aria-label": text,
    },
    ...children,
  );
};
