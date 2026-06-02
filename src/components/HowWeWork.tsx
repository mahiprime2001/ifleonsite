import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  FileSearch,
  Layers,
  Rocket,
  LifeBuoy,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollReveal } from "./animations/ScrollReveal";
import { SplitReveal } from "./motion/SplitReveal";
import { IsoProcess } from "./illustrations/IsoProcess";

gsap.registerPlugin(ScrollTrigger);

type Step = 1 | 2 | 3 | 4 | 5;

const steps: {
  step: string;
  num: Step;
  icon: typeof MessageSquare;
  title: string;
  description: string;
}[] = [
  {
    step: "01",
    num: 1,
    icon: MessageSquare,
    title: "Discovery & Consultation",
    description:
      "We start by understanding your business goals, technical needs, and constraints through a detailed discussion.",
  },
  {
    step: "02",
    num: 2,
    icon: FileSearch,
    title: "Analysis & Planning",
    description:
      "We analyze requirements, propose the right technology approach, timeline, and a clear execution plan.",
  },
  {
    step: "03",
    num: 3,
    icon: Layers,
    title: "Design & Implementation",
    description:
      "Our team builds the solution using best practices in AI, DevOps, cloud, and security engineering.",
  },
  {
    step: "04",
    num: 4,
    icon: Rocket,
    title: "Testing & Deployment",
    description:
      "We thoroughly test, optimize, and deploy the solution with minimal disruption and full transparency.",
  },
  {
    step: "05",
    num: 5,
    icon: LifeBuoy,
    title: "Support & Optimization",
    description:
      "Post-delivery, we provide support, improvements, and guidance to help you scale confidently.",
  },
];

/* ---- Shared step card (used by both horizontal panels and vertical stack) ---- */
const StepCard = ({ item }: { item: (typeof steps)[number] }) => {
  const Icon = item.icon;
  return (
    <div className="surface-card relative flex h-full flex-col justify-center rounded-2xl border border-border p-7 md:p-9 overflow-hidden">
      {/* oversized ghost number */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-6 right-2 select-none font-display text-[7rem] md:text-[9rem] font-bold leading-none text-foreground/[0.04]"
      >
        {item.step}
      </span>

      {/* illustration */}
      <div className="mb-5 max-w-[200px]">
        <IsoProcess step={item.num} className="w-full h-auto rounded-xl" />
      </div>

      {/* step number / eyebrow */}
      <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 border border-border px-3 py-1">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-brand">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
          Step {item.step}
        </span>
      </div>

      <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-3 leading-tight">
        {item.title}
      </h3>

      <p className="text-muted-foreground text-base leading-relaxed">
        {item.description}
      </p>
    </div>
  );
};

export const HowWeWork = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  // true => render the pinned horizontal sequence; false => vertical stack fallback
  const [horizontal, setHorizontal] = useState(false);

  // Decide layout based on viewport + reduced-motion preference.
  useEffect(() => {
    const mql = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)"
    );
    const apply = () => setHorizontal(mql.matches);
    apply();
    // addEventListener for modern, addListener fallback handled via try/catch.
    mql.addEventListener?.("change", apply);
    window.addEventListener("resize", apply);
    return () => {
      mql.removeEventListener?.("change", apply);
      window.removeEventListener("resize", apply);
    };
  }, []);

  // Pinned horizontal-scroll sequence — only when `horizontal` is active.
  useEffect(() => {
    if (!horizontal) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const total = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -total(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + total(),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Recompute on size changes (track width / viewport width).
      const ro = new ResizeObserver(() => ScrollTrigger.refresh());
      ro.observe(track);

      return () => {
        ro.disconnect();
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, section);

    return () => ctx.revert();
  }, [horizontal]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-transparent overflow-hidden"
    >
      {/* backdrop */}
      <div className="absolute inset-0 mesh-bg opacity-50" />
      <div className="absolute inset-0 iso-grid-bg opacity-20" />

      {horizontal ? (
        /* ---------- PINNED HORIZONTAL SEQUENCE (desktop) ---------- */
        <div className="relative flex h-screen flex-col justify-center py-16">
          {/* heading */}
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
            <p className="eyebrow mb-3">Our Process</p>
            <SplitReveal
              as="h2"
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-4"
            >
              How We Work
            </SplitReveal>
            <p className="text-base md:text-xl text-muted-foreground max-w-3xl">
              A clear, transparent, and structured approach — from first
              conversation to long-term success.
            </p>
          </div>

          {/* horizontal track */}
          <div className="relative">
            <div
              ref={trackRef}
              className="flex w-max items-stretch gap-8 px-4 sm:px-6 lg:px-8 will-change-transform"
            >
              {steps.map((item, i) => (
                <div
                  key={item.num}
                  className="relative w-[78vw] max-w-[440px] shrink-0"
                >
                  {/* connector dot between panels */}
                  {i < steps.length - 1 && (
                    <span className="pointer-events-none absolute top-1/2 -right-[1.35rem] z-20 h-2 w-2 -translate-y-1/2 rounded-full bg-brand/70 shadow-[0_0_12px] shadow-brand/50" />
                  )}
                  <StepCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ---------- VERTICAL STACK FALLBACK (mobile / reduced-motion) ---------- */
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="mb-12 text-center md:mb-16">
            <p className="eyebrow mb-3">Our Process</p>
            <SplitReveal
              as="h2"
              className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-4"
            >
              How We Work
            </SplitReveal>
            <p className="text-base md:text-xl text-muted-foreground mx-auto max-w-3xl">
              A clear, transparent, and structured approach — from first
              conversation to long-term success.
            </p>
          </div>

          <motion.div
            className="flex flex-col gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12 } },
            }}
          >
            {steps.map((item) => (
              <motion.div
                key={item.num}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <StepCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* closing note */}
      <ScrollReveal direction="up">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 md:pb-24 text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 border border-border px-5 py-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />
            <p className="text-foreground text-sm md:text-base">
              No hidden steps. No surprises. Just clear execution.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
