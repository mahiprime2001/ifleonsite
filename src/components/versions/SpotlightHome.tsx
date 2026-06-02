/* V23 — "SPOTLIGHT": dark cursor-spotlight reveal. A near-black page where a
   soft radial LIGHT follows the cursor like a flashlight — it brightens content,
   reveals a faint dotted grid beneath the pointer, and warms a blue/violet glow.
   Cards have a mouse-follow glow border (pointer tracked relative to each card,
   positioning a radial highlight + an animated border). Elegant, mysterious,
   clean. App forces dark chrome for this version.

   Self-contained. Allowed imports only: react, framer-motion, lucide-react,
   react-router-dom. No WebGL, no external assets/fonts/images. Spotlight uses a
   window pointermove listener + CSS variables; enabled only on fine pointers and
   when prefers-reduced-motion is off (touch / reduced-motion get a static glow). */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Github,
  Building2,
  User,
  Layers,
  Compass,
  PenTool,
  Rocket,
  LifeBuoy,
  Quote,
  ShieldCheck,
  Sparkles,
  MapPin,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

/* ------------------------------------------------------------------ */
/*  Theme tokens                                                       */
/* ------------------------------------------------------------------ */

const BG = "#05060c"; // near-black, faint blue
const PANEL = "rgba(15,17,28,0.66)";
const BLUE = "#5B8CFF";
const VIOLET = "#9A6CFF";
const CYAN = "#54E6FF";
const INK = "#0a0b14";

const MAILTO = "mailto:info@ifleon.com";
const GITHUB = "https://github.com/ifleonlabs";

const ACCENTS = [BLUE, VIOLET, CYAN];

/* ------------------------------------------------------------------ */
/*  Static content                                                     */
/* ------------------------------------------------------------------ */

const METRICS = [
  { value: "25", label: "Projects Delivered" },
  { value: "6", label: "Industries Served" },
  { value: "50+", label: "Clients & Individuals" },
  { value: "99.9%", label: "Uptime" },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const PROCESS = [
  {
    icon: Compass,
    step: "01",
    title: "Discover",
    body: "We map your goals, constraints, and the single highest-leverage problem worth solving first.",
  },
  {
    icon: PenTool,
    step: "02",
    title: "Design",
    body: "Architecture, UX, and a delivery plan you can actually read — no black boxes.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Build & Ship",
    body: "Iterative builds with CI/CD, tests, and observability baked in from day one.",
  },
  {
    icon: LifeBuoy,
    step: "04",
    title: "Support",
    body: "We stay on after launch — monitoring, iteration, and a team that picks up the phone.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "IFLEON moved us from quarterly releases to shipping daily. The CI/CD pipeline alone paid for the engagement in a month.",
    name: "Operations Lead",
    role: "B2B SaaS · India",
  },
  {
    quote:
      "Their AI support copilot answers from our own docs and deflects almost half our tickets. It just works.",
    name: "Head of Support",
    role: "Fintech",
  },
  {
    quote:
      "I went from curious to a cloud role in six months. The learning path and mock interviews were a game-changer.",
    name: "Career Switcher",
    role: "Individual client",
  },
];

const GROUPS: {
  id: string;
  label: string;
  tag: string;
  icon: typeof Building2;
  items: Service[];
}[] = [
  { id: "business", label: "Business", tag: "Enterprise", icon: Building2, items: businessServices },
  { id: "individual", label: "Individuals", tag: "Personal", icon: User, items: individualServices },
  { id: "specialty", label: "Specialty", tag: "Add-on", icon: Layers, items: specialtyServices },
];

/* ------------------------------------------------------------------ */
/*  Presentational helpers                                             */
/* ------------------------------------------------------------------ */

function GradText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        backgroundImage: `linear-gradient(100deg, ${CYAN}, ${BLUE} 45%, ${VIOLET})`,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </span>
  );
}

/* Glow button — primary (filled gradient + glow) or ghost (outline). */
function GlowButton({
  children,
  href,
  to,
  variant = "primary",
  external,
}: {
  children: React.ReactNode;
  href?: string;
  to?: string;
  variant?: "primary" | "ghost";
  external?: boolean;
}) {
  const primary = variant === "primary";
  const base =
    "group/btn relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold tracking-wide transition-transform duration-150 active:translate-y-px";
  const style: React.CSSProperties = primary
    ? {
        color: INK,
        backgroundImage: `linear-gradient(100deg, ${CYAN}, ${BLUE} 55%, ${VIOLET})`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.25) inset, 0 10px 40px -10px ${BLUE}, 0 0 60px -20px ${VIOLET}`,
      }
    : {
        color: "#dfe6ff",
        background: "rgba(255,255,255,0.03)",
        boxShadow: `0 0 0 1px rgba(120,150,255,0.35) inset`,
      };

  const inner = <span className="relative z-10 flex items-center gap-2">{children}</span>;

  if (to) {
    return (
      <Link to={to} className={base} style={style}>
        {inner}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={base}
      style={style}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {inner}
    </a>
  );
}

/* Eyebrow / section label */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.28em]"
      style={{ color: "#8ea2d6" }}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: BLUE, boxShadow: `0 0 10px ${BLUE}` }}
      />
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Glow card — mouse-follow radial highlight + animated border        */
/* ------------------------------------------------------------------ */

function GlowCard({
  accent,
  className,
  staticGlow,
  children,
}: {
  accent: string;
  className?: string;
  staticGlow: boolean; // touch / reduced-motion -> centered static glow
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (staticGlow) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
      el.style.setProperty("--glow", "1");
    },
    [staticGlow],
  );

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.setProperty("--glow", "0");
  }, []);

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`group/card relative overflow-hidden rounded-2xl ${className ?? ""}`}
      style={
        {
          background: PANEL,
          boxShadow: "0 0 0 1px rgba(255,255,255,0.05) inset",
          backdropFilter: "blur(8px)",
          // defaults: for static glow, pin highlight to top-center & show it
          ["--mx" as string]: "50%",
          ["--my" as string]: staticGlow ? "0%" : "50%",
          ["--glow" as string]: staticGlow ? "0.55" : "0",
          ["--accent" as string]: accent,
        } as React.CSSProperties
      }
    >
      {/* radial highlight that tracks the pointer */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: "var(--glow)",
          background:
            "radial-gradient(220px circle at var(--mx) var(--my), color-mix(in srgb, var(--accent) 26%, transparent), transparent 70%)",
        }}
      />
      {/* glow border — masked ring that brightens near the cursor */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: `calc(0.35 + var(--glow) * 0.65)`,
          padding: 1,
          background:
            "radial-gradient(260px circle at var(--mx) var(--my), var(--accent), color-mix(in srgb, var(--accent) 22%, transparent) 45%, rgba(120,140,200,0.10) 75%)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Service card                                                       */
/* ------------------------------------------------------------------ */

function ServiceCard({
  service,
  accent,
  staticGlow,
}: {
  service: Service;
  accent: string;
  staticGlow: boolean;
}) {
  const Icon = service.icon;
  return (
    <GlowCard accent={accent} staticGlow={staticGlow} className="h-full">
      <div className="flex h-full flex-col p-5">
        <div className="mb-3 flex items-center justify-between">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{
              color: accent,
              background: `color-mix(in srgb, ${accent} 14%, transparent)`,
              boxShadow: `0 0 0 1px color-mix(in srgb, ${accent} 45%, transparent) inset`,
            }}
          >
            <Icon className="h-5 w-5" />
          </span>
          <ArrowUpRight
            className="h-4 w-4 text-slate-600 transition-all duration-300 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5"
            style={{ color: "var(--accent)" }}
          />
        </div>

        <h4 className="font-display text-base font-bold leading-snug text-white">
          {service.title}
        </h4>
        <p
          className="mt-1 font-mono text-[11px] font-semibold uppercase tracking-wide"
          style={{ color: accent }}
        >
          {service.tagline}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{service.description}</p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {service.technologies.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-md px-2 py-0.5 font-mono text-[10px] tracking-wide text-slate-300"
              style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(255,255,255,0.06) inset" }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </GlowCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

export default function SpotlightHome() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  // Spotlight is only "live" (mouse-tracked) on fine pointers + motion allowed.
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (reduce) {
      setLive(false);
      return;
    }
    const fine =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: fine)").matches;
    setLive(fine);
  }, [reduce]);

  // window pointermove -> CSS variables on the root (the spotlight position).
  useEffect(() => {
    if (!live) return;
    const el = rootRef.current;
    if (!el) return;

    let raf = 0;
    let px = window.innerWidth / 2;
    let py = window.innerHeight * 0.32;

    const apply = () => {
      raf = 0;
      el.style.setProperty("--sx", `${px}px`);
      el.style.setProperty("--sy", `${py}px`);
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = window.requestAnimationFrame(apply);
    };

    // seed
    apply();
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [live]);

  const animate = !reduce;
  const staticGlow = !live; // cards: touch / reduced-motion -> static glow

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: animate ? 22 : 0 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Static fallback positions when the spotlight isn't mouse-tracked.
  const seedPos: React.CSSProperties = {
    ["--sx" as string]: "50%",
    ["--sy" as string]: "30%",
  } as React.CSSProperties;

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen overflow-x-clip"
      style={{ background: BG, ...seedPos }}
    >
      {/* ---- Spotlight layers (fixed, behind content) ---- */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* base ambient washes */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 80% at 50% -10%, rgba(90,140,255,0.12), transparent 55%), radial-gradient(100% 70% at 50% 110%, rgba(154,108,255,0.10), transparent 60%), ${BG}`,
          }}
        />
        {/* faint dotted grid — only revealed beneath the spotlight via mask */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(150,170,255,0.55) 1px, transparent 1.4px)",
            backgroundSize: "26px 26px",
            opacity: live ? 0.5 : 0.16,
            WebkitMaskImage:
              "radial-gradient(360px circle at var(--sx) var(--sy), #000 0%, rgba(0,0,0,0.35) 40%, transparent 72%)",
            maskImage:
              "radial-gradient(360px circle at var(--sx) var(--sy), #000 0%, rgba(0,0,0,0.35) 40%, transparent 72%)",
          }}
        />
        {/* the flashlight — soft blue/violet radial that brightens content */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(520px circle at var(--sx) var(--sy), rgba(90,140,255,0.16), rgba(154,108,255,0.08) 35%, transparent 65%)",
          }}
        />
        {/* tight warm core */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(180px circle at var(--sx) var(--sy), rgba(180,205,255,0.12), transparent 70%)",
          }}
        />
        {/* vignette to deepen the edges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(130% 110% at 50% 35%, transparent 50%, rgba(0,0,0,0.66) 100%)",
          }}
        />
      </div>

      {/* ===================== HERO ===================== */}
      <section className="relative mx-auto max-w-6xl px-6 pt-28 pb-16 text-center md:pt-32">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <span
            className="mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{
              background: "rgba(255,255,255,0.03)",
              boxShadow: `0 0 0 1px rgba(120,150,255,0.30) inset`,
            }}
          >
            <MapPin size={13} color={BLUE} />
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-slate-300">
              IFLEON · Est. 2022 · Nellore, India
            </span>
          </span>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.05 }}
          className="mx-auto mt-7 max-w-4xl font-display text-5xl font-black leading-[1.05] tracking-tight text-white md:text-7xl"
        >
          Infinite Possibilities,
          <br />
          <GradText>Logical Solutions.</GradText>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg"
        >
          A founder-led consultancy engineering{" "}
          <span style={{ color: CYAN }}>AI, DevOps, cloud, and cybersecurity</span> for
          businesses and individuals — moving in the dark so you don&apos;t have to. From
          Nellore to the rest of the world.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.15 }}
          className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <GlowButton href={MAILTO} variant="primary">
            <Mail size={16} />
            Request a Free Consultation
          </GlowButton>
          <GlowButton to="/services" variant="ghost">
            Explore Services
            <ArrowRight size={16} />
          </GlowButton>
        </motion.div>

        {/* compliance chips */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
        >
          {COMPLIANCE.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-200"
              style={{ background: "rgba(255,255,255,0.03)", boxShadow: `0 0 0 1px rgba(154,108,255,0.30) inset` }}
            >
              <ShieldCheck size={12} color={VIOLET} />
              {c}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ===================== METRICS ===================== */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {METRICS.map((m, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: animate ? 18 : 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
              >
                <GlowCard accent={accent} staticGlow={staticGlow}>
                  <div className="p-5 text-center">
                    <div className="font-display text-4xl font-black md:text-5xl">
                      <GradText>{m.value}</GradText>
                    </div>
                    <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-slate-400">
                      {m.label}
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===================== SERVICES ===================== */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="text-center">
          <Eyebrow>What we build</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-black text-white md:text-5xl">
            16 Services, <GradText>One Team</GradText>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 md:text-base">
            Grouped for businesses, individuals, and the specialty add-ons that round out a
            build. Hover any card — the light follows you.
          </p>
        </div>

        {GROUPS.map((group) => {
          const GIcon = group.icon;
          return (
            <div key={group.id} className="mt-12">
              <div className="mb-5 flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    backgroundImage: `linear-gradient(120deg, ${BLUE}, ${VIOLET})`,
                    color: INK,
                    boxShadow: `0 8px 28px -10px ${BLUE}`,
                  }}
                >
                  <GIcon className="h-4 w-4" />
                </span>
                <h3 className="font-display text-xl font-bold text-white">{group.label}</h3>
                <span
                  className="rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400"
                  style={{ boxShadow: `0 0 0 1px rgba(120,150,255,0.30) inset` }}
                >
                  {group.tag}
                </span>
                <span
                  className="h-px flex-1"
                  style={{ background: `linear-gradient(90deg, rgba(120,150,255,0.4), transparent)` }}
                />
                <span className="font-mono text-xs text-slate-500">
                  {group.items.length.toString().padStart(2, "0")}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((service, i) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: animate ? 18 : 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
                    className="h-full"
                  >
                    <ServiceCard
                      service={service}
                      accent={ACCENTS[i % ACCENTS.length]}
                      staticGlow={staticGlow}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* ===================== HOW WE WORK ===================== */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <Eyebrow>How we work</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-black text-white md:text-5xl">
            Four steps, <GradText>no black boxes</GradText>
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p, i) => {
            const Icon = p.icon;
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: animate ? 18 : 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="h-full"
              >
                <GlowCard accent={accent} staticGlow={staticGlow} className="h-full">
                  <div className="flex h-full flex-col p-5">
                    <div
                      className="font-display text-5xl font-black leading-none"
                      style={{ color: "transparent", WebkitTextStroke: `1px ${accent}99` }}
                    >
                      {p.step}
                    </div>
                    <span
                      className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-xl"
                      style={{
                        color: accent,
                        background: `color-mix(in srgb, ${accent} 14%, transparent)`,
                        boxShadow: `0 0 0 1px color-mix(in srgb, ${accent} 45%, transparent) inset`,
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <h4 className="mt-3 font-display text-lg font-bold text-white">{p.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{p.body}</p>
                  </div>
                </GlowCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: animate ? 18 : 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="h-full"
              >
                <GlowCard accent={accent} staticGlow={staticGlow} className="h-full">
                  <figure className="flex h-full flex-col p-6">
                    <Quote size={22} color={accent} />
                    <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-200">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-4 flex items-center gap-2">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                      />
                      <span className="text-sm font-semibold text-white">{t.name}</span>
                      <span className="font-mono text-[11px] text-slate-500">· {t.role}</span>
                    </figcaption>
                  </figure>
                </GlowCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===================== CLOSING CTA ===================== */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-10">
        <motion.div
          initial={{ opacity: 0, y: animate ? 24 : 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <GlowCard accent={VIOLET} staticGlow={staticGlow}>
            <div
              className="relative px-6 py-14 text-center"
              style={{
                background:
                  "radial-gradient(120% 100% at 50% 0%, rgba(90,140,255,0.16), transparent 60%), radial-gradient(120% 100% at 50% 100%, rgba(154,108,255,0.14), transparent 60%)",
              }}
            >
              <span
                className="mx-auto inline-flex items-center gap-2 rounded-full px-3 py-1"
                style={{ boxShadow: `0 0 0 1px rgba(120,150,255,0.35) inset` }}
              >
                <Sparkles size={13} color={CYAN} />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-200">
                  Step into the light
                </span>
              </span>

              <h2 className="mx-auto mt-5 max-w-3xl font-display text-3xl font-black text-white md:text-5xl">
                Ready when <GradText>you are.</GradText>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm text-slate-300 md:text-base">
                Tell us the problem worth solving first. Free consultation, no slide-deck
                theatre — just a logical plan and a team that ships.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <GlowButton href={MAILTO} variant="primary">
                  <Mail size={16} />
                  info@ifleon.com
                </GlowButton>
                <GlowButton to="/services" variant="ghost">
                  Explore Services
                  <ArrowRight size={16} />
                </GlowButton>
                <GlowButton href={GITHUB} variant="ghost" external>
                  <Github size={16} />
                  github.com/ifleonlabs
                </GlowButton>
              </div>
            </div>
          </GlowCard>
        </motion.div>
      </section>
    </div>
  );
}
