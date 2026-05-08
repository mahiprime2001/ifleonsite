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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(letters, {
            opacity: [0, 1],
            translateY: [20, 0],
            rotateZ: [-6, 0],
            duration,
            delay: stagger(staggerMs, { start: delay }),
            easing: "easeOutExpo",
          });
          observer.disconnect();
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
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
