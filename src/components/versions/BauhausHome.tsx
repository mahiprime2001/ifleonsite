/* V22 — Bauhaus homepage for IFLEON.
   LIGHT, geometric, constructivist. Primary red / blue / yellow + black
   on warm off-white, composed in a strict grid. Bold geometric shapes —
   circles, triangles, half-circles, squares, diagonal bars — as decoration.
   Big geometric sans headings, primary-color blocks, playful but structured.
   Self-contained. No WebGL / external assets / images / fonts. */

import { useMemo, type CSSProperties, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  type Variants,
  type Transition,
} from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Mail, Github, Plus } from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

/* ------------------------------------------------------------------ */
/* Palette — Bauhaus primaries on warm paper                           */
/* ------------------------------------------------------------------ */
const PAPER = "#F4F1E8"; // warm off-white canvas
const INK = "#14110F"; // near-black
const RED = "#E63946";
const BLUE = "#1D3557";
const YELLOW = "#FFD60A";

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

/* ------------------------------------------------------------------ */
/* Static content                                                      */
/* ------------------------------------------------------------------ */
const STATS = [
  { value: "25", label: "Projects Delivered", color: RED },
  { value: "6", label: "Industries Served", color: BLUE },
  { value: "50+", label: "Clients & Individuals", color: YELLOW, ink: true },
  { value: "99.9%", label: "Uptime Maintained", color: INK, paper: true },
] as const;

const METHOD = [
  {
    title: "Scope the outcome",
    body: "Every engagement starts with the business result you actually need — then we work backward to the right stack. No technology for its own sake.",
    color: RED,
  },
  {
    title: "Ship in weeks",
    body: "Tight loops, working software early, one-click rollbacks. You see progress you can use — not slideware or quarterly promises.",
    color: BLUE,
  },
  {
    title: "Build it to stay built",
    body: "Infrastructure-as-code, tests, runbooks, handover. We leave you with a system your own team can own, extend, and trust.",
    color: YELLOW,
  },
  {
    title: "Secure by default",
    body: "ISO 27001, DPDP, and SOC 2 thinking baked in from line one — never bolted on the week before an audit.",
    color: INK,
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "They cut our cloud bill by nearly 40% and migrated us with zero downtime. The runbooks they left mean we are not dependent on them.",
    name: "Operations Lead",
    org: "Mid-market SaaS · India",
    color: RED,
  },
  {
    quote:
      "We walked into our investor meeting with a clickable prototype instead of slides. A vague idea became something people could feel.",
    name: "Founder",
    org: "Early-stage startup · Global",
    color: BLUE,
  },
  {
    quote:
      "Our support team deflects 40%+ of tickets with the AI assistant they built on our own docs. It does real work, not demo theatre.",
    name: "Head of Support",
    org: "E-commerce · APAC",
    color: YELLOW,
  },
] as const;

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const GROUP_COLORS = [RED, BLUE, YELLOW] as const;

/* ------------------------------------------------------------------ */
/* Motion helpers                                                      */
/* ------------------------------------------------------------------ */
function useMotionKit() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.07 } },
  };

  const rise: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 26 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      };

  const pop: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, scale: 0.85 },
        show: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.6, ease: EASE },
        },
      };

  const wipe: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { clipPath: "inset(0 100% 0 0)" },
        show: {
          clipPath: "inset(0 0% 0 0)",
          transition: { duration: 0.8, ease: EASE },
        },
      };

  return { reduce, container, rise, pop, wipe };
}

const inView = { once: true, amount: 0.2 } as const;

/* ------------------------------------------------------------------ */
/* Geometric primitives (pure CSS/SVG, decorative)                     */
/* ------------------------------------------------------------------ */
function Triangle({
  size,
  color,
  rotate = 0,
  className,
  style,
}: {
  size: number;
  color: string;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        display: "inline-block",
        width: 0,
        height: 0,
        borderLeft: `${size / 2}px solid transparent`,
        borderRight: `${size / 2}px solid transparent`,
        borderBottom: `${size}px solid ${color}`,
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    />
  );
}

/* Eyebrow: small shape + number + label, the recurring Bauhaus motif. */
function SectionTag({
  n,
  label,
  color,
}: {
  n: string;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em]">
      <span
        className="inline-block h-3.5 w-3.5"
        style={{ background: color, borderRadius: color === YELLOW ? "999px" : 0 }}
      />
      <span style={{ color }}>{n}</span>
      <span className="h-[2px] w-7" style={{ background: INK }} />
      <span>{label}</span>
    </div>
  );
}

/* A solid framed cell — the building block of the strict grid. */
function GridCell({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`relative ${className ?? ""}`}
      style={{ border: `2px solid ${INK}`, ...style }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function BauhausHome() {
  const { reduce, container, rise, pop, wipe } = useMotionKit();

  const groups = useMemo(
    () =>
      [
        { label: "Business", items: businessServices },
        { label: "Individuals", items: individualServices },
        { label: "Specialty", items: specialtyServices },
      ] as const,
    [],
  );

  let runningIndex = 0;

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden font-sans antialiased selection:bg-[#E63946] selection:text-white"
      style={{ background: PAPER, color: INK }}
    >
      <div className="mx-auto max-w-[1340px] px-5 sm:px-8 md:px-12">
        {/* ========================================================== */}
        {/* HERO                                                        */}
        {/* ========================================================== */}
        <section className="pt-28 md:pt-32">
          {/* Masthead rule */}
          <div
            className="flex items-center justify-between border-b-[3px] pb-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ borderColor: INK }}
          >
            <span className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full" style={{ background: RED }} />
              IFLEON
            </span>
            <span className="hidden sm:inline">Nellore · India → Global</span>
            <span className="flex items-center gap-2.5">
              Est. 2022
              <span className="h-3 w-3" style={{ background: BLUE }} />
            </span>
          </div>

          {/* Composition: headline grid with embedded color/shape blocks */}
          <div className="grid grid-cols-12 gap-3 pt-8 md:gap-4 md:pt-12">
            {/* Big headline block spanning most of the row */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={container}
              className="col-span-12 lg:col-span-9"
            >
              <motion.div
                variants={pop}
                className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.26em]"
                style={{ color: BLUE }}
              >
                <Triangle size={14} color={RED} />
                Founder-led · AI · DevOps · Cloud · Cybersecurity
              </motion.div>

              <motion.h1
                variants={rise}
                className="mt-5 font-display font-semibold leading-[0.84] tracking-[-0.04em]"
                style={{ fontSize: "clamp(2.9rem, 9.5vw, 8.5rem)" }}
              >
                Infinite{" "}
                <span style={{ color: RED }}>Possibilities</span>,
                <br />
                Logical{" "}
                <span className="relative inline-block">
                  <span style={{ color: BLUE }}>Solutions</span>
                  <motion.span
                    aria-hidden
                    initial={reduce ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
                    className="absolute -bottom-1 left-0 block h-[10px] w-full origin-left md:h-[16px]"
                    style={{ background: YELLOW }}
                  />
                </span>
                <span style={{ color: RED }}>.</span>
              </motion.h1>

              <motion.p
                variants={rise}
                className="mt-7 max-w-[46ch] text-base leading-snug sm:text-lg md:text-xl"
                style={{ color: INK }}
              >
                We turn ambitious ideas into shipped, secure, maintainable
                systems — for businesses and individuals alike, from Nellore to
                anywhere.
              </motion.p>

              <motion.div
                variants={rise}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <a
                  href="mailto:info@ifleon.com"
                  className="group inline-flex items-center justify-center gap-3 px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white transition-transform duration-200 hover:-translate-y-1"
                  style={{ background: RED, border: `2px solid ${INK}` }}
                >
                  Request a Free Consultation
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <Link
                  to="/services"
                  className="group inline-flex items-center justify-center gap-3 px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.16em] transition-transform duration-200 hover:-translate-y-1"
                  style={{ background: PAPER, border: `2px solid ${INK}`, color: INK }}
                >
                  Explore Services
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right rail: stacked geometric color blocks (decorative + tagline) */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={container}
              className="col-span-12 grid grid-cols-2 gap-3 md:gap-4 lg:col-span-3 lg:grid-cols-1"
            >
              {/* Yellow circle block */}
              <motion.div variants={pop}>
                <GridCell
                  className="flex aspect-square items-center justify-center overflow-hidden"
                  style={{ background: YELLOW }}
                >
                  <span
                    className="block rounded-full"
                    style={{
                      width: "62%",
                      height: "62%",
                      border: `3px solid ${INK}`,
                      background: BLUE,
                    }}
                  />
                  <span
                    className="absolute right-0 top-0 h-1/2 w-1/2"
                    style={{
                      background: RED,
                      clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                    }}
                  />
                </GridCell>
              </motion.div>

              {/* Blue half-circle block */}
              <motion.div variants={pop}>
                <GridCell
                  className="flex aspect-square items-end justify-center overflow-hidden"
                  style={{ background: BLUE }}
                >
                  <span
                    className="block"
                    style={{
                      width: "78%",
                      height: "78%",
                      background: PAPER,
                      borderTopLeftRadius: "999px",
                      borderTopRightRadius: "999px",
                      borderLeft: `3px solid ${INK}`,
                      borderRight: `3px solid ${INK}`,
                      borderTop: `3px solid ${INK}`,
                    }}
                  />
                  <span
                    className="absolute left-2.5 top-2.5 h-4 w-4 rounded-full"
                    style={{ background: YELLOW }}
                  />
                </GridCell>
              </motion.div>

              {/* Tagline block spanning full width on lg */}
              <motion.div variants={pop} className="col-span-2 lg:col-span-1">
                <GridCell
                  className="flex h-full flex-col justify-between p-4"
                  style={{ background: PAPER }}
                >
                  <Plus className="h-5 w-5" style={{ color: RED }} strokeWidth={3} />
                  <p className="mt-3 font-display text-lg font-semibold leading-[1.05] tracking-[-0.02em]">
                    Building&nbsp;in the open at{" "}
                    <span style={{ color: BLUE }}>github.com/ifleonlabs</span>
                  </p>
                </GridCell>
              </motion.div>
            </motion.div>
          </div>

          {/* Stat row — four primary-color framed cells */}
          <motion.dl
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="mt-3 grid grid-cols-2 gap-3 md:mt-4 md:gap-4 lg:grid-cols-4"
          >
            {STATS.map((s) => {
              const onLight = "paper" in s && s.paper ? false : true;
              const textColor =
                "ink" in s && s.ink
                  ? INK
                  : "paper" in s && s.paper
                    ? PAPER
                    : "#FFFFFF";
              return (
                <motion.div key={s.label} variants={pop}>
                  <GridCell
                    className="flex flex-col justify-between p-5"
                    style={{ background: s.color, minHeight: "9.5rem" }}
                  >
                    <span
                      className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]"
                      style={{ color: textColor, opacity: onLight ? 0.85 : 0.9 }}
                    >
                      {s.label}
                    </span>
                    <span
                      className="font-display font-semibold leading-none tracking-[-0.03em]"
                      style={{
                        color: textColor,
                        fontSize: "clamp(2.4rem, 6vw, 4rem)",
                      }}
                    >
                      {s.value}
                    </span>
                  </GridCell>
                </motion.div>
              );
            })}
          </motion.dl>
        </section>

        {/* ========================================================== */}
        {/* 01 — SERVICES                                               */}
        {/* ========================================================== */}
        <section className="pt-24 md:pt-36">
          <SectionTag n="01" label="What we build" color={RED} />

          <div className="mt-7 grid grid-cols-12 items-end gap-y-6 gap-x-4">
            <h2
              className="col-span-12 font-display font-semibold leading-[0.88] tracking-[-0.035em] md:col-span-8"
              style={{ fontSize: "clamp(2.2rem, 6.5vw, 5.25rem)" }}
            >
              Sixteen ways
              <br />
              to <span style={{ color: BLUE }}>ship</span> it
              <span style={{ color: RED }}>.</span>
            </h2>
            <p className="col-span-12 self-end text-sm leading-relaxed md:col-span-4">
              Sixteen real services across business, individual, and specialty
              work — composed like a Bauhaus grid. Pick a block, we will scope
              it.
            </p>
          </div>

          {/* Grouped service blocks */}
          <div className="mt-12 space-y-12">
            {groups.map((group, gi) => {
              const accent = GROUP_COLORS[gi];
              const yellowAccent = accent === YELLOW;
              return (
                <div key={group.label}>
                  {/* Group label bar */}
                  <div
                    className="mb-3 flex items-center gap-3 border-b-[3px] pb-3 font-mono text-xs font-bold uppercase tracking-[0.2em] md:gap-4"
                    style={{ borderColor: INK }}
                  >
                    <span
                      className="inline-block h-4 w-4"
                      style={{
                        background: accent,
                        borderRadius: yellowAccent ? "999px" : 0,
                      }}
                    />
                    <span>{group.label}</span>
                    <span style={{ color: accent }}>/ {group.items.length}</span>
                  </div>

                  <motion.ul
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.05 }}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3"
                  >
                    {group.items.map((svc: Service) => {
                      const Icon = svc.icon;
                      const n = String(++runningIndex).padStart(2, "0");
                      return (
                        <motion.li key={svc.id} variants={pop} className="h-full">
                          <Link
                            to="/services"
                            className="group block h-full"
                            style={{ ["--accent" as string]: accent }}
                          >
                            <GridCell
                              className="flex h-full flex-col p-5 transition-transform duration-200 group-hover:-translate-x-1 group-hover:-translate-y-1"
                              style={{
                                background: PAPER,
                                boxShadow: `0 0 0 0 ${INK}`,
                              }}
                            >
                              {/* top row: icon swatch + number */}
                              <div className="flex items-start justify-between">
                                <span
                                  className="inline-flex h-11 w-11 items-center justify-center"
                                  style={{
                                    background: accent,
                                    color: yellowAccent ? INK : "#FFFFFF",
                                    border: `2px solid ${INK}`,
                                    borderRadius: yellowAccent ? "999px" : 0,
                                  }}
                                >
                                  <Icon className="h-5 w-5" />
                                </span>
                                <span
                                  className="font-mono text-xs font-bold tabular-nums"
                                  style={{ color: accent }}
                                >
                                  {n}
                                </span>
                              </div>

                              <h3
                                className="mt-5 font-display font-semibold leading-[1.04] tracking-[-0.015em]"
                                style={{ fontSize: "clamp(1.15rem, 2.4vw, 1.5rem)" }}
                              >
                                {svc.title}
                              </h3>
                              <p className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.1em] opacity-70">
                                {svc.tagline}
                              </p>

                              <p className="mt-3 flex-1 text-sm leading-relaxed opacity-80">
                                {svc.description}
                              </p>

                              <span
                                className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em]"
                                style={{ color: accent }}
                              >
                                Scope it
                                <ArrowRight className="h-4 w-4 -translate-x-1 transition-transform duration-200 group-hover:translate-x-0" />
                              </span>
                            </GridCell>
                          </Link>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================== */}
        {/* 02 — METRICS STATEMENT                                      */}
        {/* ========================================================== */}
        <section className="pt-24 md:pt-36">
          <SectionTag n="02" label="By the numbers" color={BLUE} />

          <div className="mt-7 grid grid-cols-12 gap-4">
            {/* statement block */}
            <motion.div
              initial={reduce ? false : "hidden"}
              whileInView="show"
              viewport={inView}
              variants={wipe}
              className="col-span-12 md:col-span-8"
            >
              <GridCell
                className="flex h-full flex-col justify-between gap-8 p-7 md:p-10"
                style={{ background: BLUE, color: "#FFFFFF" }}
              >
                {/* decorative corner shapes */}
                <span
                  aria-hidden
                  className="absolute right-6 top-6 h-12 w-12 rounded-full"
                  style={{ background: YELLOW }}
                />
                <h2
                  className="font-display font-semibold leading-[0.9] tracking-[-0.03em]"
                  style={{ fontSize: "clamp(1.9rem, 5vw, 3.75rem)" }}
                >
                  <span style={{ color: YELLOW }}>25</span> projects.{" "}
                  <span style={{ color: RED }}>50+</span> clients.
                  <br />
                  99.9% uptime.
                </h2>
                <p className="max-w-[52ch] text-sm leading-relaxed opacity-90">
                  Across 6 industries, for B2B teams and individuals alike —
                  delivered with compliance baked in, not bolted on.
                </p>
              </GridCell>
            </motion.div>

            {/* compliance stack */}
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="col-span-12 grid grid-cols-1 gap-4 md:col-span-4"
            >
              {COMPLIANCE.map((c, i) => {
                const palette = [RED, YELLOW, PAPER] as const;
                const bg = palette[i];
                const onYellowOrPaper = bg !== RED;
                return (
                  <motion.div key={c} variants={pop} className="h-full">
                    <GridCell
                      className="flex h-full items-center justify-between p-5"
                      style={{
                        background: bg,
                        color: onYellowOrPaper ? INK : "#FFFFFF",
                        minHeight: "5rem",
                      }}
                    >
                      <span className="font-display text-xl font-semibold tracking-[-0.01em]">
                        {c}
                      </span>
                      <span
                        className="inline-block h-4 w-4"
                        style={{
                          background: onYellowOrPaper ? INK : "#FFFFFF",
                          borderRadius: i === 1 ? "999px" : 0,
                        }}
                      />
                    </GridCell>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* 03 — HOW WE WORK                                            */}
        {/* ========================================================== */}
        <section className="pt-24 md:pt-36">
          <SectionTag n="03" label="How we work" color={YELLOW} />

          <div className="mt-7 grid grid-cols-12 items-end gap-y-5 gap-x-4">
            <h2
              className="col-span-12 font-display font-semibold leading-[0.9] tracking-[-0.03em] md:col-span-7"
              style={{ fontSize: "clamp(2rem, 5.5vw, 4.25rem)" }}
            >
              Four <span style={{ color: RED }}>principles</span>.
            </h2>
            <p className="col-span-12 self-end max-w-[40ch] text-sm leading-relaxed md:col-span-5">
              They keep us honest and keep your project moving — from the first
              call to the final handover.
            </p>
          </div>

          <motion.ol
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4"
          >
            {METHOD.map((m, i) => {
              const onDark = m.color === BLUE || m.color === INK;
              const onYellow = m.color === YELLOW;
              return (
                <motion.li key={m.title} variants={pop} className="h-full">
                  <GridCell
                    className="flex h-full flex-col p-6"
                    style={{
                      background: m.color,
                      color: onDark ? "#FFFFFF" : INK,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="font-display font-semibold leading-none tracking-[-0.03em]"
                        style={{ fontSize: "clamp(2.2rem, 5vw, 3rem)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        aria-hidden
                        className="inline-block h-7 w-7"
                        style={{
                          background: onYellow ? INK : "#FFFFFF",
                          borderRadius: i % 2 === 0 ? "999px" : 0,
                          clipPath:
                            i === 3
                              ? "polygon(0 100%, 50% 0, 100% 100%)"
                              : undefined,
                        }}
                      />
                    </div>
                    <h3
                      className="mt-6 font-display font-semibold leading-tight tracking-[-0.015em]"
                      style={{ fontSize: "clamp(1.2rem, 2.4vw, 1.5rem)" }}
                    >
                      {m.title}
                    </h3>
                    <p
                      className="mt-2 text-sm leading-relaxed"
                      style={{ opacity: onDark || onYellow ? 0.9 : 0.85 }}
                    >
                      {m.body}
                    </p>
                  </GridCell>
                </motion.li>
              );
            })}
          </motion.ol>
        </section>

        {/* ========================================================== */}
        {/* 04 — TESTIMONIALS                                           */}
        {/* ========================================================== */}
        <section className="pt-24 md:pt-36">
          <SectionTag n="04" label="In their words" color={RED} />

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="mt-7 grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-3"
          >
            {TESTIMONIALS.map((t) => {
              const yellowAccent = t.color === YELLOW;
              return (
                <motion.figure key={t.name} variants={pop} className="h-full">
                  <GridCell
                    className="flex h-full flex-col justify-between p-7"
                    style={{ background: PAPER }}
                  >
                    {/* accent bar across the top */}
                    <span
                      aria-hidden
                      className="absolute left-0 top-0 h-2 w-full"
                      style={{ background: t.color }}
                    />
                    <div className="mt-2">
                      <span
                        className="font-display leading-none"
                        style={{
                          fontSize: "3.25rem",
                          color: t.color,
                          display: "block",
                        }}
                        aria-hidden
                      >
                        &ldquo;
                      </span>
                      <blockquote
                        className="-mt-3 font-display font-medium leading-[1.22] tracking-[-0.01em]"
                        style={{ fontSize: "clamp(1.05rem, 2.1vw, 1.35rem)" }}
                      >
                        {t.quote}
                      </blockquote>
                    </div>
                    <figcaption
                      className="mt-8 flex items-center gap-3 border-t-[2px] pt-4 font-mono text-[11px] uppercase tracking-[0.14em]"
                      style={{ borderColor: INK }}
                    >
                      <span
                        className="inline-block h-3.5 w-3.5"
                        style={{
                          background: t.color,
                          borderRadius: yellowAccent ? "999px" : 0,
                        }}
                      />
                      <span>
                        <span className="block font-bold">{t.name}</span>
                        <span className="opacity-60">{t.org}</span>
                      </span>
                    </figcaption>
                  </GridCell>
                </motion.figure>
              );
            })}
          </motion.div>
        </section>
      </div>

      {/* ============================================================ */}
      {/* CLOSING CTA — full-bleed constructivist block                */}
      {/* ============================================================ */}
      <section className="mt-24 md:mt-36" style={{ background: INK, color: PAPER }}>
        {/* color strip */}
        <div className="grid h-3 grid-cols-3 md:h-4">
          <span style={{ background: RED }} />
          <span style={{ background: YELLOW }} />
          <span style={{ background: BLUE }} />
        </div>

        <div className="mx-auto max-w-[1340px] px-5 py-20 sm:px-8 md:px-12 md:py-28">
          <div className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em]">
            <span className="h-3.5 w-3.5 rounded-full" style={{ background: YELLOW }} />
            <span style={{ color: YELLOW }}>05</span>
            <span className="h-[2px] w-7" style={{ background: PAPER }} />
            <span>Let&rsquo;s build</span>
          </div>

          <div className="mt-10 grid grid-cols-12 items-end gap-y-10 gap-x-6">
            <h2
              className="col-span-12 font-display font-semibold leading-[0.84] tracking-[-0.04em] lg:col-span-8"
              style={{ fontSize: "clamp(2.6rem, 9vw, 8rem)" }}
            >
              Got a problem
              <br />
              worth <span style={{ color: RED }}>solving</span>
              <span style={{ color: YELLOW }}>?</span>
            </h2>

            {/* decorative shape stack */}
            <div
              aria-hidden
              className="col-span-12 hidden items-end justify-end gap-3 lg:col-span-4 lg:flex"
            >
              <span className="h-16 w-16" style={{ background: BLUE }} />
              <span className="h-16 w-16 rounded-full" style={{ background: YELLOW }} />
              <Triangle size={64} color={RED} />
            </div>
          </div>

          <div
            className="mt-14 grid grid-cols-12 gap-y-8 border-t-[3px] pt-10 gap-x-6"
            style={{ borderColor: PAPER }}
          >
            <p
              className="col-span-12 text-lg leading-snug sm:text-xl md:col-span-6"
              style={{ maxWidth: "40ch" }}
            >
              Tell us what you are trying to ship, secure, or scale. One email
              starts the conversation — businesses and individuals both welcome.
            </p>

            <div className="col-span-12 flex flex-col gap-3 md:col-span-6 md:items-end">
              <a
                href="mailto:info@ifleon.com"
                className="group inline-flex w-full items-center justify-between gap-4 px-6 py-5 font-mono text-sm font-bold uppercase tracking-[0.16em] transition-transform duration-200 hover:-translate-y-1 md:w-auto"
                style={{ background: RED, color: "#FFFFFF", border: `2px solid ${PAPER}` }}
              >
                info@ifleon.com
                <Mail className="h-5 w-5" />
              </a>

              <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto md:justify-end">
                <Link
                  to="/services"
                  className="group inline-flex items-center justify-between gap-3 px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.16em] transition-transform duration-200 hover:-translate-y-1"
                  style={{ background: YELLOW, color: INK, border: `2px solid ${PAPER}` }}
                >
                  View all services
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://github.com/ifleonlabs"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-between gap-3 px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.16em] transition-transform duration-200 hover:-translate-y-1"
                  style={{ background: "transparent", color: PAPER, border: `2px solid ${PAPER}` }}
                >
                  <Github className="h-4 w-4" />
                  github.com/ifleonlabs
                </a>
              </div>
            </div>
          </div>

          {/* baseline meta */}
          <div
            className="mt-16 flex flex-col gap-3 border-t-[2px] pt-6 font-mono text-[10px] uppercase tracking-[0.18em] opacity-75 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: PAPER }}
          >
            <span>IFLEON © {new Date().getFullYear()}</span>
            <span>Infinite Possibilities, Logical Solutions.</span>
            <span>Nellore · India → Global</span>
          </div>
        </div>
      </section>
    </div>
  );
}
