/* V16 — PRESS.
   A refined print-magazine editorial homepage for IFLEON. Warm paper canvas,
   Fraunces serif headlines, drop-cap intro, multi-column body, thin rules,
   mono bylines/datelines, elegant pull-quotes, and a "contents"-style index.
   Restrained ink + a single deep-red accent. Self-contained. LIGHT chrome.
   Allowed imports only: react, framer-motion, lucide-react, react-router-dom.
   No WebGL / external assets. */

import { useMemo } from "react";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Github,
  Quote,
  Compass,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
} from "../../data/services";

/* ------------------------------------------------------------------ */
/* Palette — warm print stock + a single refined deep-red accent       */
/* ------------------------------------------------------------------ */
const PAPER = "#F6F1E7"; // warm paper canvas
const INK = "#1A1714"; // warm near-black ink
const INK_SOFT = "#5A534A"; // muted ink for body / meta
const RULE = "#D8CFBE"; // thin warm rule
const RED = "#9E2B25"; // deep editorial red accent
const RED_SOFT = "#C0463F"; // lighter red for fine details

const TODAY = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

/* ------------------------------------------------------------------ */
/* Static editorial content                                            */
/* ------------------------------------------------------------------ */
const STATS = [
  { value: "25", label: "Projects Delivered" },
  { value: "6", label: "Industries Served" },
  { value: "50+", label: "Clients & Individuals" },
  { value: "99.9%", label: "Uptime Maintained" },
];

const METHOD = [
  {
    no: "I",
    title: "Scope the outcome",
    body: "Every engagement opens with the business result you actually need. We work backward from there to the right stack — never technology for its own sake.",
  },
  {
    no: "II",
    title: "Ship in weeks",
    body: "Tight loops, working software early, one-click rollbacks. You review progress you can use, not slideware that ages on a shared drive.",
  },
  {
    no: "III",
    title: "Build it to last",
    body: "Infrastructure-as-code, tests, runbooks, and a clean handover. We leave behind something your own team can own, read, and extend.",
  },
  {
    no: "IV",
    title: "Secure by default",
    body: "ISO 27001, DPDP, and SOC 2 thinking are present from the first line — considered as we go, not bolted on the week before an audit.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "They cut our cloud bill by nearly forty per cent and migrated us with zero downtime. The runbooks they left mean we are not dependent on them — that is rare.",
    name: "Operations Lead",
    org: "Mid-market SaaS · India",
  },
  {
    quote:
      "We walked into our investor meeting with a clickable prototype instead of slides. IFLEON turned a vague idea into something people could actually feel.",
    name: "Founder",
    org: "Early-stage Startup · Global",
  },
  {
    quote:
      "Our support team now deflects forty per cent of tickets with the assistant they built on our own documentation. It does real work, not demo theatre.",
    name: "Head of Support",
    org: "E-commerce · APAC",
  },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const SECTIONS = [
  { label: "Business", services: businessServices },
  { label: "Individuals", services: individualServices },
  { label: "Specialty", services: specialtyServices },
] as const;

/* ------------------------------------------------------------------ */
/* Motion helpers — gentle, print-like fades; gated for reduced motion */
/* ------------------------------------------------------------------ */
function useReveal() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
  };

  const rise: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        },
      };

  const lineUp: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { y: "108%" },
        show: {
          y: "0%",
          transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
        },
      };

  return { reduce, container, rise, lineUp };
}

/* A masked line that clips & slides up — used for the masthead headline. */
function RevealLine({
  children,
  className,
  variants,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  variants: Variants;
  style?: React.CSSProperties;
}) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className={`block ${className ?? ""}`}
        variants={variants}
        style={style}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* Small kicker / section label with a hairline and a red square. */
function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.28em]">
      <span
        className="inline-block h-2 w-2"
        style={{ background: RED }}
        aria-hidden="true"
      />
      <span style={{ color: RED }}>{children}</span>
    </span>
  );
}

const inView = { once: true, amount: 0.3 } as const;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function PressHome() {
  const { reduce, container, rise, lineUp } = useReveal();

  // Continuous 01–16 numbering across all categories for the contents page.
  const numberOf = useMemo(() => {
    const map = new Map<string, string>();
    [...businessServices, ...individualServices, ...specialtyServices].forEach(
      (s, i) => map.set(s.id, String(i + 1).padStart(2, "0")),
    );
    return map;
  }, []);

  return (
    <div
      className="min-h-screen w-full font-sans antialiased"
      style={{
        background: PAPER,
        color: INK,
        // very subtle paper grain via layered radial gradients
        backgroundImage:
          "radial-gradient(circle at 20% 15%, rgba(158,43,37,0.035), transparent 45%), radial-gradient(circle at 85% 70%, rgba(26,23,20,0.04), transparent 50%)",
      }}
    >
      <div
        className="mx-auto w-full max-w-[1180px] px-5 sm:px-8 md:px-12"
        style={{ ["--rule" as string]: RULE }}
      >
        {/* ========================================================== */}
        {/* MASTHEAD                                                    */}
        {/* ========================================================== */}
        <header className="pt-28 md:pt-32">
          {/* nameplate */}
          <div
            className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-end sm:justify-between"
            style={{ borderColor: RULE }}
          >
            <div className="flex items-baseline gap-3">
              <span
                className="font-display font-black leading-none tracking-[-0.02em]"
                style={{ fontSize: "clamp(1.6rem, 4vw, 2.3rem)" }}
              >
                The IFLEON Review
              </span>
              <span
                className="hidden font-mono text-[10px] uppercase tracking-[0.3em] sm:inline"
                style={{ color: RED }}
              >
                Vol. IV
              </span>
            </div>
            <span
              className="font-mono text-[10px] uppercase tracking-[0.26em]"
              style={{ color: INK_SOFT }}
            >
              Nellore, India → Global · Est. 2022
            </span>
          </div>

          {/* dateline strip */}
          <div
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b py-2.5 font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ borderColor: RULE, color: INK_SOFT }}
          >
            <span>{TODAY}</span>
            <span className="hidden md:inline">Technology &amp; Consulting</span>
            <span>Infinite Possibilities, Logical Solutions</span>
          </div>
        </header>

        {/* ========================================================== */}
        {/* HERO / LEAD STORY                                           */}
        {/* ========================================================== */}
        <section className="pt-10 md:pt-14">
          <Kicker>The Lead Story</Kicker>

          {/* Headline built around the tagline */}
          <motion.h1
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-5 font-display leading-[0.92] tracking-[-0.02em]"
            style={{ fontWeight: 600, fontSize: "clamp(2.7rem, 8.5vw, 6.4rem)" }}
          >
            <RevealLine variants={lineUp}>Infinite Possibilities,</RevealLine>
            <RevealLine
              variants={lineUp}
              className="italic"
              style={{ color: RED, fontWeight: 500 }}
            >
              Logical Solutions.
            </RevealLine>
          </motion.h1>

          {/* lead grid: drop-cap intro + dek/CTA rail */}
          <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12">
            {/* drop-cap multi-column intro */}
            <motion.div
              variants={rise}
              initial="hidden"
              animate="show"
              className="lg:col-span-8"
            >
              <p
                className="text-[1.06rem] leading-[1.85] sm:columns-2 sm:gap-10"
                style={{ color: INK_SOFT }}
              >
                <span
                  className="float-left mr-3 mt-1 font-display font-black"
                  style={{
                    color: INK,
                    fontSize: "4.6rem",
                    lineHeight: "0.78",
                    fontWeight: 700,
                  }}
                >
                  I
                </span>
                FLEON is a founder-led consultancy in{" "}
                <span style={{ color: INK }}>
                  artificial intelligence, DevOps, cloud, and cybersecurity
                </span>
                . We turn ambitious ideas into systems that are shipped, secure,
                and maintainable — for established businesses and curious
                individuals alike. From a first conversation to a running
                production stack, every engagement is scoped around the outcome
                you need, then built so your own team can read it, own it, and
                extend it long after we hand over the keys.
              </p>
            </motion.div>

            {/* dek + CTAs rail with a left hairline */}
            <motion.div
              variants={rise}
              initial="hidden"
              animate="show"
              className="lg:col-span-4 lg:border-l lg:pl-10"
              style={{ borderColor: RULE }}
            >
              <p
                className="font-display italic leading-[1.35]"
                style={{ fontSize: "1.35rem", color: INK }}
              >
                Twenty-five projects. Six industries. Fifty-plus clients. One
                standard.
              </p>
              <div className="mt-7 flex flex-col gap-3">
                <a
                  href="mailto:info@ifleon.com"
                  className="group inline-flex items-center justify-between gap-3 px-6 py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-transform duration-200 hover:-translate-y-0.5"
                  style={{ background: RED }}
                >
                  Request a Free Consultation
                  <Mail className="h-4 w-4" />
                </a>
                <Link
                  to="/services"
                  className="group inline-flex items-center justify-between gap-3 border px-6 py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200"
                  style={{ borderColor: INK, color: INK }}
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
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* STATS — fine-ruled almanac row                              */}
        {/* ========================================================== */}
        <section className="mt-14 md:mt-20">
          <motion.dl
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="grid grid-cols-2 border-y md:grid-cols-4"
            style={{ borderColor: INK }}
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                variants={rise}
                className={[
                  "py-7 pr-4 sm:py-8",
                  i !== 0 ? "sm:pl-6 md:pl-8" : "",
                  i % 2 === 1 ? "pl-6" : "",
                  i < 2 ? "border-b md:border-b-0" : "",
                  i !== 0 ? "md:border-l" : "",
                  i === 1 ? "border-l md:border-l" : "",
                ].join(" ")}
                style={{ borderColor: RULE }}
              >
                <dd
                  className="font-display font-black leading-none tracking-[-0.02em]"
                  style={{
                    fontSize: "clamp(2.6rem, 6vw, 4.4rem)",
                    fontWeight: 700,
                  }}
                >
                  {s.value}
                </dd>
                <dt
                  className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: INK_SOFT }}
                >
                  {s.label}
                </dt>
              </motion.div>
            ))}
          </motion.dl>
        </section>

        {/* ========================================================== */}
        {/* TABLE OF CONTENTS — services index, grouped                 */}
        {/* ========================================================== */}
        <section className="mt-20 md:mt-28">
          <div
            className="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between"
            style={{ borderColor: INK }}
          >
            <div>
              <Kicker>In This Issue</Kicker>
              <h2
                className="mt-4 font-display leading-[0.95] tracking-[-0.02em]"
                style={{ fontWeight: 600, fontSize: "clamp(2.2rem, 6vw, 4.4rem)" }}
              >
                Table of Contents
              </h2>
            </div>
            <p
              className="max-w-[36ch] text-sm leading-relaxed"
              style={{ color: INK_SOFT }}
            >
              Sixteen services across business, individual, and specialty work —
              set like a contents page. Choose a line; we will scope it with you.
            </p>
          </div>

          <div className="mt-2">
            {SECTIONS.map((section) => (
              <div key={section.label} className="mt-10 first:mt-8">
                {/* section header row */}
                <div
                  className="flex items-baseline justify-between border-b pb-2"
                  style={{ borderColor: RULE }}
                >
                  <h3
                    className="font-display italic tracking-[-0.01em]"
                    style={{ fontSize: "1.5rem", color: INK }}
                  >
                    {section.label}
                  </h3>
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.24em]"
                    style={{ color: INK_SOFT }}
                  >
                    {section.services.length} entries
                  </span>
                </div>

                <motion.ul
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.05 }}
                >
                  {section.services.map((svc) => {
                    const Icon = svc.icon;
                    return (
                      <motion.li key={svc.id} variants={rise}>
                        <Link
                          to="/services"
                          className="group grid grid-cols-12 items-baseline gap-x-4 gap-y-1 border-b py-5 transition-colors duration-200"
                          style={{ borderColor: RULE }}
                        >
                          {/* folio number */}
                          <span
                            className="col-span-2 font-mono text-sm tabular-nums sm:col-span-1"
                            style={{ color: RED_SOFT }}
                          >
                            {numberOf.get(svc.id)}
                          </span>

                          {/* title + icon */}
                          <span className="col-span-10 sm:col-span-6 lg:col-span-5">
                            <span className="flex items-center gap-3">
                              <span
                                className="inline-flex h-5 w-5 shrink-0 items-center justify-center transition-colors duration-200"
                                style={{ color: INK_SOFT }}
                                aria-hidden="true"
                              >
                                <Icon className="h-[18px] w-[18px]" />
                              </span>
                              <span
                                className="font-display font-semibold leading-tight tracking-[-0.01em] transition-colors duration-200 group-hover:[color:var(--red)]"
                                style={{
                                  fontSize: "clamp(1.15rem, 2.4vw, 1.6rem)",
                                  ["--red" as string]: RED,
                                }}
                              >
                                {svc.title}
                              </span>
                            </span>
                          </span>

                          {/* tagline + leader dots, like a real contents page */}
                          <span className="col-span-12 col-start-3 -mt-1 flex items-baseline sm:col-span-5 sm:col-start-auto sm:mt-0 lg:col-span-6">
                            <span
                              className="hidden flex-1 translate-y-[-3px] border-b border-dotted sm:block"
                              style={{ borderColor: RULE }}
                              aria-hidden="true"
                            />
                            <span
                              className="font-mono text-[11px] uppercase tracking-[0.12em] sm:ml-4"
                              style={{ color: INK_SOFT }}
                            >
                              {svc.tagline}
                            </span>
                            <ArrowRight
                              className="ml-3 hidden h-4 w-4 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 sm:block"
                              style={{ color: RED }}
                              aria-hidden="true"
                            />
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
        {/* FEATURE PULL-QUOTE — the metrics statement                  */}
        {/* ========================================================== */}
        <section className="mt-20 md:mt-28">
          <figure
            className="relative border-y px-1 py-12 text-center md:py-16"
            style={{ borderColor: INK }}
          >
            <Quote
              className="mx-auto h-10 w-10"
              style={{ color: RED }}
              aria-hidden="true"
            />
            <blockquote
              className="mx-auto mt-6 max-w-[22ch] font-display leading-[1.05] tracking-[-0.02em]"
              style={{ fontWeight: 600, fontSize: "clamp(2rem, 5.5vw, 4.2rem)" }}
            >
              Twenty-five projects, fifty-plus clients, and{" "}
              <span style={{ color: RED }}>99.9% uptime</span>.
            </blockquote>
            <figcaption
              className="mx-auto mt-7 max-w-[54ch] text-sm leading-relaxed"
              style={{ color: INK_SOFT }}
            >
              Delivered across six industries, for B2B teams and individuals —
              with compliance considered from the first line of code.
            </figcaption>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
              {COMPLIANCE.map((c) => (
                <span
                  key={c}
                  className="border px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
                  style={{ borderColor: INK, color: INK }}
                >
                  {c}
                </span>
              ))}
            </div>
          </figure>
        </section>

        {/* ========================================================== */}
        {/* HOW WE WORK — feature column                                */}
        {/* ========================================================== */}
        <section className="mt-20 grid grid-cols-1 gap-x-12 gap-y-10 md:mt-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Kicker>The Method</Kicker>
            <h2
              className="mt-4 font-display leading-[0.95] tracking-[-0.02em]"
              style={{ fontWeight: 600, fontSize: "clamp(2.1rem, 5.5vw, 3.8rem)" }}
            >
              How we work
            </h2>
            <p
              className="mt-5 max-w-[34ch] text-[1.02rem] leading-[1.8]"
              style={{ color: INK_SOFT }}
            >
              Four principles, set in stone. They keep us honest, keep your
              project moving, and keep the work readable long after launch.
            </p>
            <div
              className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: RED }}
            >
              <Compass className="h-4 w-4" />
              Discovery → Build → Handover
            </div>
          </div>

          <motion.ol
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="lg:col-span-8"
          >
            {METHOD.map((m) => (
              <motion.li
                key={m.no}
                variants={rise}
                className="grid grid-cols-12 gap-x-5 border-t py-7 first:border-t-0 first:pt-0"
                style={{ borderColor: RULE }}
              >
                <span
                  className="col-span-2 font-display font-black leading-none sm:col-span-1"
                  style={{
                    fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)",
                    color: RED,
                    fontWeight: 700,
                  }}
                >
                  {m.no}
                </span>
                <div className="col-span-10 sm:col-span-11">
                  <h3
                    className="font-display font-semibold leading-tight tracking-[-0.01em]"
                    style={{ fontSize: "clamp(1.2rem, 2.6vw, 1.85rem)" }}
                  >
                    {m.title}
                  </h3>
                  <p
                    className="mt-2 max-w-[58ch] text-[1.02rem] leading-[1.8]"
                    style={{ color: INK_SOFT }}
                  >
                    {m.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </section>

        {/* ========================================================== */}
        {/* LETTERS — testimonial pull-quotes                           */}
        {/* ========================================================== */}
        <section className="mt-20 md:mt-28">
          <div className="border-b pb-6" style={{ borderColor: INK }}>
            <Kicker>Letters &amp; Praise</Kicker>
            <h2
              className="mt-4 font-display italic leading-[1] tracking-[-0.01em]"
              style={{ fontWeight: 500, fontSize: "clamp(1.9rem, 5vw, 3.4rem)" }}
            >
              In their words
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.figure
                key={i}
                initial={reduce ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{
                  duration: 0.6,
                  delay: reduce ? 0 : i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={[
                  "flex flex-col justify-between py-9 md:py-10",
                  i === 1 ? "md:px-9" : i === 0 ? "md:pr-9" : "md:pl-9",
                  i !== 0 ? "border-t md:border-l md:border-t-0" : "",
                ].join(" ")}
                style={{ borderColor: RULE }}
              >
                <blockquote
                  className="font-display leading-[1.3] tracking-[-0.005em]"
                  style={{ fontWeight: 500, fontSize: "1.22rem", color: INK }}
                >
                  <span style={{ color: RED }}>“</span>
                  {t.quote}
                  <span style={{ color: RED }}>”</span>
                </blockquote>
                <figcaption
                  className="mt-7 border-t pt-4 font-mono text-[10px] uppercase tracking-[0.2em]"
                  style={{ borderColor: RULE }}
                >
                  <span className="block font-semibold" style={{ color: INK }}>
                    {t.name}
                  </span>
                  <span style={{ color: INK_SOFT }}>{t.org}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </section>
      </div>

      {/* ============================================================ */}
      {/* COLOPHON / CLOSING CTA — inked footer band                    */}
      {/* ============================================================ */}
      <section
        className="mt-24 py-20 md:py-28"
        style={{ background: INK, color: PAPER }}
      >
        <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8 md:px-12">
          <span className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.28em]">
            <span
              className="inline-block h-2 w-2"
              style={{ background: RED_SOFT }}
              aria-hidden="true"
            />
            <span style={{ color: RED_SOFT }}>The Editor's Note</span>
          </span>

          <h2
            className="mt-6 font-display leading-[0.95] tracking-[-0.02em]"
            style={{ fontWeight: 600, fontSize: "clamp(2.6rem, 8vw, 6rem)" }}
          >
            Have a problem
            <br />
            worth solving
            <span style={{ color: RED_SOFT }}>?</span>
          </h2>

          <div
            className="mt-12 grid grid-cols-1 gap-x-12 gap-y-9 border-t pt-10 lg:grid-cols-12"
            style={{ borderColor: "rgba(246,241,231,0.22)" }}
          >
            <p
              className="text-[1.08rem] leading-[1.8] lg:col-span-6"
              style={{ maxWidth: "44ch", color: "rgba(246,241,231,0.78)" }}
            >
              Tell us what you are trying to ship, secure, or scale. A single
              email opens the conversation — businesses and individuals are
              equally welcome at the desk.
            </p>

            <div className="flex flex-col gap-4 lg:col-span-6 lg:items-end">
              <a
                href="mailto:info@ifleon.com"
                className="group inline-flex w-full items-center justify-between gap-4 px-7 py-4 font-mono text-base font-semibold uppercase tracking-[0.16em] transition-transform duration-200 hover:-translate-y-0.5 lg:w-auto"
                style={{ background: PAPER, color: INK }}
              >
                info@ifleon.com
                <Mail className="h-5 w-5" />
              </a>

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:justify-end">
                <Link
                  to="/services"
                  className="group inline-flex items-center justify-between gap-3 border px-6 py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200"
                  style={{ borderColor: "rgba(246,241,231,0.5)", color: PAPER }}
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
                  className="group inline-flex items-center justify-between gap-3 border px-6 py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200"
                  style={{ borderColor: "rgba(246,241,231,0.5)", color: PAPER }}
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

          {/* colophon baseline */}
          <div
            className="mt-16 flex flex-col gap-2 border-t pt-6 font-mono text-[10px] uppercase tracking-[0.22em] sm:flex-row sm:items-center sm:justify-between"
            style={{
              borderColor: "rgba(246,241,231,0.22)",
              color: "rgba(246,241,231,0.6)",
            }}
          >
            <span>The IFLEON Review © {new Date().getFullYear()}</span>
            <span>Infinite Possibilities, Logical Solutions.</span>
            <span>Nellore · India → Global</span>
          </div>
        </div>
      </section>
    </div>
  );
}
