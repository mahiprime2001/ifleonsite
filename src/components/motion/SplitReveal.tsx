import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* Kinetic headline — line-mask reveal on scroll-in via GSAP SplitText.
   Reduced-motion users get the text immediately (no split). Waits for
   fonts so line-splitting measures correctly. */
export function SplitReveal({
  children,
  as: Tag = "h2" as ElementType,
  className = "",
  delay = 0,
  start = "top 85%",
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  start?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let split: SplitText | null = null;
    let tween: gsap.core.Tween | null = null;

    const run = () => {
      split = new SplitText(el, { type: "lines", mask: "lines" });
      tween = gsap.from(split.lines, {
        yPercent: 115,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.12,
        delay,
        scrollTrigger: { trigger: el, start, once: true },
      });
    };

    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) fonts.ready.then(run);
    else run();

    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split?.revert();
    };
  }, [delay, start]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

export default SplitReveal;
