/* V11 — Swiss / International Typographic Style homepage for IFLEON.
   LIGHT chrome. Strict columnar 12-col grid, near-monochrome paper + black ink,
   ONE accent (red #E2231A). Huge clean Inter headings, thin hairline rules,
   numbered sections, massive whitespace. Typography + grid IS the design.
   Self-contained. No WebGL / external assets. */

import { useMemo } from "react";
import {
  motion,
  useReducedMotion,
  type Variants,
  type Transition,
} from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Mail, Github } from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

/* ------------------------------------------------------------------ */
/* Palette — forced light Swiss chrome                                 */
/* ------------------------------------------------------------------ */
const PAPER = "#FBFBF9"; // near-white off-white canvas
const PAPER_2 = "#F2F1EC"; // faint grey paper for inset blocks
const INK = "#111110"; // black ink
const RULE = "#D8D7D0"; // hairline rule grey
const RED = "#E2231A"; // the single accent

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

/* ------------------------------------------------------------------ */
/* Static content                                                      */
/* ------------------------------------------------------------------ */
const STATS = [
  { value: "25", label: "Projects Delivered" },
  { value: "6", label: "Industries Served" },
  { value: "50+", label: "Clients & Individuals" },
  { value: "99.9%", label: "Uptime Maintained" },
];

const METHOD = [
  {
    title: "Scope the outcome",
    body: "Every engagement starts with the business result you actually need — then we work backward to the right stack. No technology for its own sake.",
  },
  {
    title: "Ship in weeks",
    body: "Tight loops, working software early, one-click rollbacks. You see progress you can use, not slideware or quarterly promises.",
  },
  {
    title: "Build it to stay built",
    body: "Infrastructure-as-code, tests, runbooks, handover. We leave you with a system your own team can own, extend, and trust.",
  },
  {
    title: "Secure by default",
    body: "ISO 27001, DPDP, and SOC 2 thinking baked in from line one — never bolted on the week before an audit.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "They cut our cloud bill by nearly 40% and migrated us with zero downtime. The runbooks they left mean we are not dependent on them.",
    name: "Operations Lead",
    org: "Mid-market SaaS · India",
  },
  {
    quote:
      "We walked into our investor meeting with a clickable prototype instead of slides. A vague idea became something people could feel.",
    name: "Founder",
    org: "Early-stage startup · Global",
  },
  {
    quote:
      "Our support team deflects 40%+ of tickets with the AI assistant they built on our own docs. It does real work, not demo theatre.",
    name: "Head of Support",
    org: "E-commerce · APAC",
  },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

/* ------------------------------------------------------------------ */
/* Motion helpers                                                      */
/* ------------------------------------------------------------------ */
function useMotionKit() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
  };

  const lineUp: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { y: "108%" },
        show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
      };

  const fade: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      };

  return { reduce, container, lineUp, fade };
}

/* A masked line that clips and slides up. */
function RevealLine({
  children,
  className,
  variants,
}: {
  children: React.ReactNode;
  className?: string;
  variants: Variants;
}) {
  return (
    <span className="block overflow-hidden">
      <motion.span className={`block ${className ?? ""}`} variants={variants}>
        {children}
      </motion.span>
    </span>
  );
}

/* Section header: numbered eyebrow + label, aligned to the grid. */
function SectionTag({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-baseline gap-4 font-mono text-[11px] uppercase tracking-[0.22em]">
      <span style={{ color: RED }}>{n}</span>
      <span className="h-px w-8 self-center" style={{ background: INK }} />
      <span>{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function SwissHome() {
  const { reduce, container, lineUp, fade } = useMotionKit();
  const inView = { once: true, amount: 0.25 } as const;

  const groups = useMemo(
    () =>
      [
        { tag: "A", label: "Business", items: businessServices },
        { tag: "B", label: "Individuals", items: individualServices },
        { tag: "C", label: "Specialty", items: specialtyServices },
      ] as const,
    [],
  );

  // Continuous 01–16 numbering across every group.
  let runningIndex = 0;

  return (
    <div
      className="min-h-screen w-full font-sans antialiased selection:bg-[#E2231A] selection:text-white"
      style={{ background: PAPER, color: INK }}
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 md:px-12">
        {/* ========================================================== */}
        {/* HERO                                                        */}
        {/* ========================================================== */}
        <section className="pt-28 md:pt-32">
          {/* Top meta rule — masthead */}
          <div
            className="flex items-center justify-between border-b pb-3 font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{ borderColor: INK }}
          >
            <span className="flex items-center gap-2">
              <span className="h-2 w-2" style={{ background: RED }} />
              IFLEON
            </span>
            <span className="hidden sm:inline">
              Nellore · India → Global
            </span>
            <span>Est. 2022</span>
          </div>

          {/* Hero grid: headline (left) + index (right) */}
          <div className="grid grid-cols-12 gap-y-10 pt-12 md:gap-x-8 md:pt-20">
            {/* Headline */}
            <div className="col-span-12 lg:col-span-9">
              <motion.h1
                variants={container}
                initial="hidden"
                animate="show"
                className="font-display font-medium leading-[0.86] tracking-[-0.035em]"
                style={{ fontSize: "clamp(3rem, 11.5vw, 11.5rem)" }}
              >
                <RevealLine variants={lineUp}>Infinite</RevealLine>
                <RevealLine variants={lineUp}>Possibilities,</RevealLine>
                <RevealLine variants={lineUp}>Logical</RevealLine>
                <RevealLine variants={lineUp}>
                  Solutions<span style={{ color: RED }}>.</span>
                </RevealLine>
              </motion.h1>
            </div>

            {/* Right column meta — aligned baseline label */}
            <div className="col-span-12 flex flex-col justify-end lg:col-span-3">
              <motion.div
                variants={fade}
                initial="hidden"
                animate="show"
                className="border-t pt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em]"
                style={{ borderColor: INK }}
              >
                <p style={{ color: RED }}>Founder-led consultancy</p>
                <p className="mt-3 opacity-70">
                  AI · DevOps · Cloud · Cybersecurity
                </p>
              </motion.div>
            </div>
          </div>

          {/* Subhead + CTAs across grid */}
          <div
            className="mt-12 grid grid-cols-12 gap-y-8 border-t pt-10 md:gap-x-8 md:mt-16"
            style={{ borderColor: RULE }}
          >
            <motion.p
              variants={fade}
              initial="hidden"
              animate="show"
              className="col-span-12 text-lg leading-snug tracking-[-0.01em] sm:text-xl md:col-span-7 md:text-2xl"
              style={{ maxWidth: "42ch" }}
            >
              We turn ambitious ideas into shipped, secure, maintainable systems
              — for businesses and individuals alike, from Nellore to anywhere.
            </motion.p>

            <motion.div
              variants={fade}
              initial="hidden"
              animate="show"
              className="col-span-12 flex flex-col gap-3 sm:flex-row md:col-span-5 md:flex-col md:items-stretch lg:flex-row lg:items-end lg:justify-end"
            >
              <a
                href="mailto:info@ifleon.com"
                className="group inline-flex items-center justify-between gap-3 px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white transition-transform duration-200 hover:-translate-y-0.5"
                style={{ background: INK }}
              >
                Request a Free Consultation
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <Link
                to="/services"
                className="group inline-flex items-center justify-between gap-3 border px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-200"
                style={{ borderColor: INK }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = INK;
                  e.currentTarget.style.color = PAPER;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = INK;
                }}
              >
                Explore Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          {/* Stat row — bordered grid, numbered */}
          <motion.dl
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="mt-16 grid grid-cols-2 border-t border-l md:grid-cols-4"
            style={{ borderColor: INK }}
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                variants={fade}
                className="flex flex-col justify-between border-b border-r p-5 sm:p-6"
                style={{ borderColor: INK, minHeight: "9.5rem" }}
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-60">
                  {String(i + 1).padStart(2, "0")} · {s.label}
                </dt>
                <dd
                  className="mt-6 font-display font-medium leading-none tracking-[-0.02em]"
                  style={{ fontSize: "clamp(2.2rem, 6vw, 4.25rem)" }}
                >
                  {s.value}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </section>

        {/* ========================================================== */}
        {/* 01 — SERVICES INDEX                                         */}
        {/* ========================================================== */}
        <section className="pt-24 md:pt-36">
          <SectionTag n="01" label="The Index — what we build" />

          <div className="mt-8 grid grid-cols-12 items-end gap-y-6 border-b pb-8 md:gap-x-8" style={{ borderColor: INK }}>
            <h2
              className="col-span-12 font-display font-medium leading-[0.9] tracking-[-0.03em] md:col-span-8"
              style={{ fontSize: "clamp(2.2rem, 6.5vw, 5.5rem)" }}
            >
              Sixteen ways to ship it.
            </h2>
            <p className="col-span-12 self-end text-sm leading-relaxed opacity-70 md:col-span-4">
              Sixteen real services across business, individual, and specialty
              work. Numbered like a contents page — pick a line, we will scope it.
            </p>
          </div>

          {/* Grouped, numbered rows */}
          <div className="mt-2">
            {groups.map((group) => (
              <div key={group.tag} className="mt-12 first:mt-2">
                {/* group label aligned to grid */}
                <div
                  className="flex items-center gap-4 border-b pb-3 font-mono text-[11px] uppercase tracking-[0.2em]"
                  style={{ borderColor: RULE }}
                >
                  <span style={{ color: RED }}>{group.tag}</span>
                  <span>{group.label}</span>
                  <span className="opacity-50">/ {group.items.length}</span>
                </div>

                <motion.ul
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.05 }}
                >
                  {group.items.map((svc: Service) => {
                    const Icon = svc.icon;
                    const n = String(++runningIndex).padStart(2, "0");
                    return (
                      <motion.li
                        key={svc.id}
                        variants={fade}
                        className="group relative border-b"
                        style={{ borderColor: RULE }}
                      >
                        {/* hover fill sweep */}
                        <span
                          className="pointer-events-none absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
                          style={{ background: INK }}
                        />
                        <Link
                          to="/services"
                          className="relative grid grid-cols-12 items-center gap-x-3 gap-y-1 py-5 md:gap-x-8 md:py-6"
                          style={{ ["--pp" as string]: PAPER }}
                        >
                          <span className="col-span-2 font-mono text-xs tabular-nums opacity-60 transition-colors duration-200 group-hover:text-[var(--pp)] group-hover:opacity-90 md:col-span-1">
                            {n}
                          </span>
                          <span className="col-span-9 transition-colors duration-200 group-hover:text-[var(--pp)] md:col-span-5">
                            <span
                              className="block font-display font-medium leading-[1.02] tracking-[-0.015em]"
                              style={{ fontSize: "clamp(1.25rem, 3vw, 2.35rem)" }}
                            >
                              {svc.title}
                            </span>
                          </span>
                          <span className="col-span-12 col-start-3 -mt-1 font-mono text-[11px] uppercase tracking-[0.12em] opacity-60 transition-colors duration-200 group-hover:text-[var(--pp)] group-hover:opacity-80 md:col-span-5 md:col-start-auto md:mt-0">
                            {svc.tagline}
                          </span>
                          <span
                            className="col-span-1 hidden items-center justify-end gap-2 transition-colors duration-200 group-hover:text-[var(--pp)] md:flex"
                            style={{ color: RED }}
                          >
                            <Icon className="h-5 w-5" />
                            <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                          </span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================== */}
        {/* 02 — METRICS STATEMENT                                      */}
        {/* ========================================================== */}
        <section className="pt-24 md:pt-36">
          <SectionTag n="02" label="By the numbers" />
          <div className="mt-8 grid grid-cols-12 gap-y-8 md:gap-x-8">
            <h2
              className="col-span-12 font-display font-medium leading-[0.92] tracking-[-0.03em] md:col-span-8"
              style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)" }}
            >
              25 projects.{" "}
              <span style={{ color: RED }}>50+</span> clients.
              <br className="hidden sm:block" /> 99.9% uptime.
            </h2>
            <div className="col-span-12 flex flex-col justify-end gap-6 md:col-span-4">
              <p className="text-sm leading-relaxed opacity-70">
                Across 6 industries, for B2B teams and individuals alike —
                delivered with compliance baked in, not bolted on.
              </p>
              <div className="flex flex-wrap gap-2">
                {COMPLIANCE.map((c) => (
                  <span
                    key={c}
                    className="border px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
                    style={{ borderColor: INK }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* 03 — HOW WE WORK                                            */}
        {/* ========================================================== */}
        <section className="pt-24 md:pt-36">
          <SectionTag n="03" label="The Method — how we work" />

          <div className="mt-8 grid grid-cols-12 gap-y-10 md:gap-x-8">
            <div className="col-span-12 md:col-span-4">
              <h2
                className="font-display font-medium leading-[0.9] tracking-[-0.03em]"
                style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)" }}
              >
                Four principles.
              </h2>
              <p className="mt-5 max-w-[34ch] text-sm leading-relaxed opacity-70">
                They keep us honest and keep your project moving — from the first
                call to the final handover.
              </p>
            </div>

            <motion.ol
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="col-span-12 md:col-span-8"
            >
              {METHOD.map((m, i) => (
                <motion.li
                  key={m.title}
                  variants={fade}
                  className="grid grid-cols-12 gap-x-4 border-t py-7 md:gap-x-8"
                  style={{ borderColor: i === 0 ? INK : RULE }}
                >
                  <span
                    className="col-span-2 font-mono text-sm tabular-nums md:col-span-1"
                    style={{ color: RED }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="col-span-10 md:col-span-11">
                    <h3
                      className="font-display font-medium leading-tight tracking-[-0.015em]"
                      style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)" }}
                    >
                      {m.title}
                    </h3>
                    <p className="mt-2 max-w-[58ch] text-sm leading-relaxed opacity-70 md:text-base">
                      {m.body}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </section>

        {/* ========================================================== */}
        {/* 04 — TESTIMONIALS                                           */}
        {/* ========================================================== */}
        <section className="pt-24 md:pt-36">
          <SectionTag n="04" label="In their words" />

          <div
            className="mt-8 grid grid-cols-1 gap-px border md:grid-cols-3"
            style={{ background: RULE, borderColor: INK }}
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.figure
                key={i}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{
                  duration: 0.6,
                  delay: reduce ? 0 : i * 0.1,
                  ease: EASE,
                }}
                className="flex flex-col justify-between p-7 md:p-8"
                style={{ background: i === 1 ? PAPER_2 : PAPER }}
              >
                <div>
                  <span
                    className="font-display leading-none"
                    style={{ fontSize: "3rem", color: RED }}
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <blockquote
                    className="-mt-2 font-display font-normal leading-[1.2] tracking-[-0.01em]"
                    style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.45rem)" }}
                  >
                    {t.quote}
                  </blockquote>
                </div>
                <figcaption
                  className="mt-8 border-t pt-4 font-mono text-[11px] uppercase tracking-[0.14em]"
                  style={{ borderColor: INK }}
                >
                  <span className="block font-semibold">{t.name}</span>
                  <span className="opacity-60">{t.org}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </section>
      </div>

      {/* ============================================================ */}
      {/* CLOSING CTA — full-bleed ink block                           */}
      {/* ============================================================ */}
      <section className="mt-24 md:mt-36" style={{ background: INK, color: PAPER }}>
        <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 md:px-12 md:py-28">
          <div
            className="flex items-center justify-between border-b pb-3 font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{ borderColor: PAPER }}
          >
            <span className="flex items-center gap-3">
              <span style={{ color: RED }}>05</span>
              <span>Let&rsquo;s build</span>
            </span>
            <span className="hidden opacity-60 sm:inline">Get in touch</span>
          </div>

          <h2
            className="mt-12 font-display font-medium leading-[0.86] tracking-[-0.035em]"
            style={{ fontSize: "clamp(2.6rem, 10vw, 9.5rem)" }}
          >
            Got a problem
            <br />
            worth solving<span style={{ color: RED }}>?</span>
          </h2>

          <div
            className="mt-14 grid grid-cols-12 gap-y-8 border-t pt-10 md:gap-x-8"
            style={{ borderColor: PAPER }}
          >
            <p
              className="col-span-12 text-lg leading-snug tracking-[-0.01em] sm:text-xl md:col-span-6"
              style={{ maxWidth: "40ch" }}
            >
              Tell us what you are trying to ship, secure, or scale. One email
              starts the conversation — businesses and individuals both welcome.
            </p>

            <div className="col-span-12 flex flex-col gap-3 md:col-span-6 md:items-end">
              <a
                href="mailto:info@ifleon.com"
                className="group inline-flex w-full items-center justify-between gap-4 px-6 py-5 font-mono text-sm font-semibold uppercase tracking-[0.16em] transition-transform duration-200 hover:-translate-y-0.5 md:w-auto"
                style={{ background: PAPER, color: INK }}
              >
                info@ifleon.com
                <Mail className="h-5 w-5" />
              </a>

              <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto md:justify-end">
                <Link
                  to="/services"
                  className="group inline-flex items-center justify-between gap-3 border px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-200"
                  style={{ borderColor: PAPER }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = PAPER;
                    e.currentTarget.style.color = INK;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = PAPER;
                  }}
                >
                  View all services
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://github.com/ifleonlabs"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-between gap-3 border px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-200"
                  style={{ borderColor: PAPER }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = PAPER;
                    e.currentTarget.style.color = INK;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = PAPER;
                  }}
                >
                  <Github className="h-4 w-4" />
                  github.com/ifleonlabs
                </a>
              </div>
            </div>
          </div>

          {/* baseline meta */}
          <div
            className="mt-16 flex flex-col gap-3 border-t pt-6 font-mono text-[10px] uppercase tracking-[0.18em] opacity-70 sm:flex-row sm:items-center sm:justify-between"
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
