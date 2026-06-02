/* V25 — HOLO: dark holographic / iridescent. Animated conic "holo-foil"
   gradients shimmer across a deep base; card surfaces shift hue via animated
   background-position on a rainbow conic-gradient, with prismatic shimmer
   sweeps and jewel-like prismatic accents. Sleek, high-tech, premium. */
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
  Sparkles as SparklesIcon,
  ShieldCheck,
  Github,
  Mail,
  Building2,
  User,
  Layers,
  Compass,
  PenTool,
  Rocket,
  LifeBuoy,
  Quote,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

/* ================================================================== */
/*  Palette                                                            */
/* ================================================================== */

const BASE = "#05060E"; // near-black jewel base
const BASE_2 = "#0A0B1A";

/* the iridescent "holo-foil" rainbow ramp reused across the page */
const HOLO =
  "#22d3ee, #818cf8, #c084fc, #f472b6, #fb923c, #34d399, #22d3ee";
const HOLO_CONIC = `conic-gradient(from var(--a,0deg), ${HOLO})`;
const HOLO_LINEAR = `linear-gradient(90deg, ${HOLO})`;

const METRICS = [
  { value: "25", suffix: "", label: "Projects Delivered" },
  { value: "6", suffix: "", label: "Industries Served" },
  { value: "50", suffix: "+", label: "Clients & Individuals" },
  { value: "99.9", suffix: "%", label: "Uptime" },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const PROCESS = [
  {
    icon: Compass,
    step: "01",
    title: "Discover",
    body: "We map your goals, constraints, and the highest-leverage problem worth solving first.",
    tint: "#22d3ee",
  },
  {
    icon: PenTool,
    step: "02",
    title: "Design",
    body: "Architecture, UX, and a delivery plan you can actually read — no black boxes.",
    tint: "#818cf8",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Build & Ship",
    body: "Iterative builds with CI/CD, tests, and observability baked in from day one.",
    tint: "#c084fc",
  },
  {
    icon: LifeBuoy,
    step: "04",
    title: "Operate & Scale",
    body: "Monitoring, hardening, and a clean hand-off so it stays yours — and stays fast.",
    tint: "#34d399",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "They migrated us to AWS without a single minute of downtime and trimmed our cloud bill by nearly 40%. The runbooks they left behind are gold.",
    name: "Founder",
    role: "Fintech SaaS · India",
  },
  {
    quote:
      "Our support copilot now answers from our own docs and deflects almost half our tickets. It felt less like a vendor and more like an in-house team.",
    name: "Head of Product",
    role: "B2B Platform · Global",
  },
  {
    quote:
      "I switched into a DevOps role in six months with their guidance. The certification roadmap and mock interviews made all the difference.",
    name: "Cloud Engineer",
    role: "Individual · Career Switch",
  },
];

type Group = {
  key: string;
  label: string;
  icon: typeof Building2;
  blurb: string;
  services: Service[];
  tint: string;
};

const GROUPS: Group[] = [
  {
    key: "business",
    label: "Business Solutions",
    icon: Building2,
    blurb: "For startups, SMBs, SaaS & fintech teams shipping fast.",
    services: businessServices,
    tint: "#818cf8",
  },
  {
    key: "individual",
    label: "For Individuals",
    icon: User,
    blurb: "Personal tech, security, and career guidance done right.",
    services: individualServices,
    tint: "#22d3ee",
  },
  {
    key: "specialty",
    label: "Specialty & Add-Ons",
    icon: Layers,
    blurb: "Sharp, focused engagements that slot into your roadmap.",
    services: specialtyServices,
    tint: "#c084fc",
  },
];

/* ================================================================== */
/*  Motion                                                             */
/* ================================================================== */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

/* ================================================================== */
/*  Holographic primitives                                            */
/* ================================================================== */

/**
 * HoloBorder — a card whose 1px border is a live iridescent conic gradient.
 * The hue "spins" by animating a CSS var --a (registered via @property below),
 * and the inner surface is a dark glassy fill. A diagonal shimmer sweep glides
 * across on hover for that holographic-foil tilt.
 */
function HoloCard({
  children,
  className = "",
  animate,
  hueOffset = 0,
}: {
  children: React.ReactNode;
  className?: string;
  animate: boolean;
  hueOffset?: number;
}) {
  return (
    <div
      className={`holo-card group/holo relative overflow-hidden rounded-2xl p-px ${className}`}
      style={{
        ["--a" as string]: `${hueOffset}deg`,
        background: HOLO_CONIC,
        backgroundSize: "200% 200%",
        animation: animate ? `holoSpin 14s linear infinite` : undefined,
        boxShadow: "0 24px 60px -28px rgba(0,0,0,0.8)",
      }}
    >
      <div
        className="relative h-full w-full rounded-[15px]"
        style={{
          background: `linear-gradient(180deg, ${BASE_2}f2, ${BASE}f2)`,
        }}
      >
        {/* prismatic shimmer sweep */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[15px] opacity-0 transition-opacity duration-500 group-hover/holo:opacity-100"
          style={{
            background:
              "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.16) 47%, rgba(255,255,255,0.04) 53%, transparent 70%)",
            backgroundSize: "250% 100%",
            animation: animate ? "holoSweep 2.4s ease-in-out infinite" : undefined,
          }}
        />
        {/* top edge sheen */}
        <div
          className="pointer-events-none absolute inset-x-4 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
          }}
        />
        {children}
      </div>
    </div>
  );
}

/** Iridescent text — clipped holo-foil rainbow that drifts. */
function HoloText({
  children,
  className = "",
  animate,
}: {
  children: React.ReactNode;
  className?: string;
  animate: boolean;
}) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: HOLO_LINEAR,
        backgroundSize: "300% 100%",
        animation: animate ? "holoDrift 9s ease-in-out infinite" : undefined,
        filter: "saturate(1.15)",
      }}
    >
      {children}
    </span>
  );
}

function HoloChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="relative inline-flex items-center gap-1.5 rounded-full p-px text-xs font-medium"
      style={{ background: `linear-gradient(120deg, #ffffff22, #ffffff08)` }}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/5 bg-[#0A0B1A]/90 px-3 py-1.5 text-slate-100 backdrop-blur-md">
        {children}
      </span>
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  blurb,
  animate,
}: {
  eyebrow: string;
  title: React.ReactNode;
  blurb?: string;
  animate: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mx-auto max-w-2xl text-center"
    >
      <span
        className="inline-flex items-center gap-2 rounded-full p-px font-mono text-[11px] uppercase tracking-[0.28em]"
        style={{ background: HOLO_LINEAR, backgroundSize: "300% 100%", animation: animate ? "holoDrift 9s ease-in-out infinite" : undefined }}
      >
        <span className="rounded-full bg-[#0A0B1A]/95 px-3 py-1">
          <HoloText animate={animate}>{eyebrow}</HoloText>
        </span>
      </span>
      <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
        {title}
      </h2>
      {blurb && (
        <p className="mt-4 text-base leading-relaxed text-slate-300/80">{blurb}</p>
      )}
    </motion.div>
  );
}

function ServiceCard({
  service,
  tint,
  animate,
  index,
}: {
  service: Service;
  tint: string;
  animate: boolean;
  index: number;
}) {
  const Icon = service.icon;
  return (
    <motion.div variants={fadeUp} className="group h-full">
      <HoloCard
        animate={animate}
        hueOffset={index * 40}
        className="h-full transition-transform duration-300 hover:-translate-y-1.5"
      >
        <div className="relative p-6">
          {/* prismatic bloom behind icon */}
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-90"
            style={{ background: `radial-gradient(circle, ${tint}, transparent 70%)` }}
          />
          <span
            className="relative mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl p-px"
            style={{ background: HOLO_CONIC, backgroundSize: "200% 200%", animation: animate ? "holoSpin 14s linear infinite" : undefined }}
          >
            <span
              className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0A0B1A]"
              style={{ color: tint, boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.18), 0 0 22px -8px ${tint}` }}
            >
              <Icon className="h-5 w-5" />
            </span>
          </span>
          <h3 className="relative text-lg font-semibold text-white">{service.title}</h3>
          <p className="relative mt-1 text-sm font-medium" style={{ color: tint }}>
            {service.tagline}
          </p>
          <p className="relative mt-3 text-sm leading-relaxed text-slate-300/75 line-clamp-3">
            {service.description}
          </p>
          <div className="relative mt-4 flex flex-wrap gap-1.5">
            {service.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[11px] text-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </HoloCard>
    </motion.div>
  );
}

/* ================================================================== */
/*  Background — drifting holo aurora + prismatic mesh                 */
/* ================================================================== */

function HoloBackground({ animate }: { animate: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: BASE }} />

      {/* huge slow-spinning iridescent halo top-center */}
      {animate ? (
        <motion.div
          className="absolute left-1/2 top-[-30rem] h-[64rem] w-[64rem] -translate-x-1/2 rounded-full opacity-[0.22] blur-[120px]"
          style={{ background: HOLO_CONIC, backgroundSize: "200% 200%" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        <div
          className="absolute left-1/2 top-[-30rem] h-[64rem] w-[64rem] -translate-x-1/2 rounded-full opacity-[0.18] blur-[120px]"
          style={{ background: HOLO_CONIC }}
        />
      )}

      {/* drifting prismatic orbs */}
      {animate ? (
        <>
          <motion.div
            className="absolute left-[-10rem] top-[24rem] h-[34rem] w-[34rem] rounded-full opacity-30 blur-[110px]"
            style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }}
            animate={{ x: [0, 70, -30, 0], y: [0, 50, 90, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[-8rem] top-[40rem] h-[30rem] w-[30rem] rounded-full opacity-30 blur-[110px]"
            style={{ background: "radial-gradient(circle, #f472b6, transparent 70%)" }}
            animate={{ x: [0, -60, 30, 0], y: [0, -40, 40, 0] }}
            transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-1/3 bottom-[-6rem] h-[32rem] w-[32rem] rounded-full opacity-25 blur-[110px]"
            style={{ background: "radial-gradient(circle, #34d399, transparent 70%)" }}
            animate={{ x: [0, 50, -40, 0], y: [0, -30, -60, 0] }}
            transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : (
        <>
          <div
            className="absolute left-[-10rem] top-[24rem] h-[34rem] w-[34rem] rounded-full opacity-25 blur-[110px]"
            style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }}
          />
          <div
            className="absolute right-[-8rem] top-[40rem] h-[30rem] w-[30rem] rounded-full opacity-25 blur-[110px]"
            style={{ background: "radial-gradient(circle, #f472b6, transparent 70%)" }}
          />
        </>
      )}

      {/* fine prismatic grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 30%, transparent 75%)",
        }}
      />

      {/* top vignette for legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% -10%, rgba(255,255,255,0.06), transparent 45%)",
        }}
      />
    </div>
  );
}

/* ================================================================== */
/*  Main component                                                     */
/* ================================================================== */

export default function HoloHome() {
  const prefersReduced = useReducedMotion();
  const animate = !prefersReduced;

  const totalServices = useMemo(
    () =>
      businessServices.length + individualServices.length + specialtyServices.length,
    []
  );

  return (
    <div
      className="relative min-h-screen overflow-hidden text-slate-100 antialiased"
      style={{ background: BASE }}
    >
      {/* keyframes + @property for the spinning conic angle */}
      <style>{`
        @property --a {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }
        @keyframes holoSpin {
          to { --a: 360deg; }
        }
        @keyframes holoDrift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes holoSweep {
          0% { background-position: 150% 0; }
          100% { background-position: -150% 0; }
        }
      `}</style>

      <HoloBackground animate={animate} />

      {/* ---------------- HERO ---------------- */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-28 md:pt-32">
        <div className="flex flex-col items-center pb-20 text-center md:pb-28">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HoloChip>
              <SparklesIcon className="h-3.5 w-3.5 text-cyan-300" />
              Founder-led · AI · DevOps · Cloud · Security
            </HoloChip>
          </motion.div>

          <motion.h1
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-7 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
          >
            Infinite Possibilities,
            <HoloText
              animate={animate}
              className="block"
            >
              Logical Solutions.
            </HoloText>
          </motion.h1>

          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-slate-200/85 md:text-lg"
          >
            IFLEON is a founder-led consultancy engineering AI, DevOps, cloud, and
            cybersecurity solutions for businesses and individuals — from Nellore,
            India to the world.
          </motion.p>

          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            {/* iridescent primary CTA */}
            <a
              href="mailto:info@ifleon.com"
              className="group relative inline-flex items-center gap-2 rounded-full p-px text-sm font-semibold transition-transform hover:scale-[1.03]"
              style={{
                background: HOLO_LINEAR,
                backgroundSize: "300% 100%",
                animation: animate ? "holoDrift 9s ease-in-out infinite" : undefined,
                boxShadow: "0 0 44px -10px rgba(129,140,248,0.7)",
              }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-[#070814] px-7 py-3 text-white">
                <Mail className="h-4 w-4" />
                Request a Free Consultation
              </span>
            </a>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/[0.1]"
              style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.18)" }}
            >
              Explore Services
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {/* floating metric + compliance chips */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-2.5"
          >
            {METRICS.map((m) => (
              <HoloChip key={m.label}>
                <span className="font-semibold text-white">
                  {m.value}
                  {m.suffix}
                </span>
                <span className="text-slate-300/70">{m.label}</span>
              </HoloChip>
            ))}
            <span className="mx-1 hidden h-4 w-px bg-white/15 sm:block" />
            {COMPLIANCE.map((c) => (
              <HoloChip key={c}>
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
                {c}
              </HoloChip>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHeading
          animate={animate}
          eyebrow="What we build"
          title={
            <>
              <HoloText animate={animate}>{totalServices}</HoloText> ways we move you
              forward
            </>
          }
          blurb="One team across AI, DevOps, cloud, and security — for businesses scaling fast and individuals leveling up."
        />

        <div className="mt-16 space-y-20">
          {GROUPS.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.key}>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-80px" }}
                  className="mb-8 flex items-center gap-3"
                >
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl p-px"
                    style={{ background: HOLO_CONIC, backgroundSize: "200% 200%", animation: animate ? "holoSpin 14s linear infinite" : undefined }}
                  >
                    <span
                      className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0A0B1A]"
                      style={{ color: group.tint, boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.2), 0 0 24px -8px ${group.tint}` }}
                    >
                      <GroupIcon className="h-5 w-5" />
                    </span>
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{group.label}</h3>
                    <p className="text-sm text-slate-300/70">{group.blurb}</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-80px" }}
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {group.services.map((service, i) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      tint={group.tint}
                      animate={animate}
                      index={i}
                    />
                  ))}
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------- METRICS BAND ---------------- */}
      <section className="relative z-10 px-6 py-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-6xl"
        >
          <HoloCard animate={animate}>
            <div className="relative p-10 md:p-14">
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  background:
                    "radial-gradient(circle at 18% 0%, #818cf855, transparent 50%), radial-gradient(circle at 82% 100%, #c084fc55, transparent 50%)",
                }}
              />
              <motion.div
                variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                className="relative grid grid-cols-2 gap-8 text-center md:grid-cols-4"
              >
                {METRICS.map((m) => (
                  <motion.div key={m.label} variants={fadeUp}>
                    <div className="font-display text-5xl font-bold tracking-tight md:text-6xl">
                      <HoloText animate={animate}>
                        {m.value}
                        {m.suffix}
                      </HoloText>
                    </div>
                    <div className="mt-2 text-sm text-slate-300/70">{m.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </HoloCard>
        </motion.div>
      </section>

      {/* ---------------- HOW WE WORK ---------------- */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHeading
          animate={animate}
          eyebrow="How we work"
          title="A sequence you can actually follow"
          blurb="No black boxes. Every engagement runs the same clear arc — from first conversation to a system you own."
        />

        <motion.div
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {PROCESS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div key={p.step} variants={fadeUp} className="group h-full">
                <HoloCard animate={animate} hueOffset={i * 60} className="h-full">
                  <div className="relative p-6">
                    <div className="font-mono text-5xl font-bold text-white/[0.08]">
                      {p.step}
                    </div>
                    <span
                      className="-mt-8 mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl p-px"
                      style={{ background: HOLO_CONIC, backgroundSize: "200% 200%", animation: animate ? "holoSpin 14s linear infinite" : undefined }}
                    >
                      <span
                        className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0A0B1A]"
                        style={{ color: p.tint, boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.2), 0 0 22px -8px ${p.tint}` }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                    </span>
                    <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300/75">
                      {p.body}
                    </p>
                  </div>
                </HoloCard>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHeading
          animate={animate}
          eyebrow="In their words"
          title="Outcomes, not promises"
        />

        <motion.div
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} variants={fadeUp} className="group h-full">
              <HoloCard animate={animate} hueOffset={i * 90} className="h-full">
                <figure className="flex h-full flex-col p-7">
                  <Quote className="h-7 w-7 text-cyan-300/50" />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-100/90">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 border-t border-white/10 pt-4">
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-slate-300/65">{t.role}</div>
                  </figcaption>
                </figure>
              </HoloCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ---------------- CLOSING CTA ---------------- */}
      <section className="relative z-10 px-6 pb-28 pt-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-5xl"
        >
          <HoloCard animate={animate}>
            <div className="relative px-8 py-16 text-center md:px-16 md:py-20">
              <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background:
                    "radial-gradient(circle at 50% -10%, #818cf855, transparent 60%), radial-gradient(circle at 50% 120%, #c084fc60, transparent 60%)",
                }}
              />
              <div className="relative">
                <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
                  Let&apos;s engineer your{" "}
                  <HoloText animate={animate}>next leap.</HoloText>
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-200/85">
                  Tell us what you&apos;re building. We&apos;ll bring the architecture, the
                  automation, and the security to make it real.
                </p>

                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href="mailto:info@ifleon.com"
                    className="group relative inline-flex items-center gap-2 rounded-full p-px text-sm font-semibold transition-transform hover:scale-[1.03]"
                    style={{
                      background: HOLO_LINEAR,
                      backgroundSize: "300% 100%",
                      animation: animate ? "holoDrift 9s ease-in-out infinite" : undefined,
                      boxShadow: "0 0 44px -10px rgba(129,140,248,0.7)",
                    }}
                  >
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#070814] px-7 py-3 text-white">
                      <Mail className="h-4 w-4" />
                      info@ifleon.com
                    </span>
                  </a>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/[0.1]"
                    style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.18)" }}
                  >
                    Browse all services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="https://github.com/ifleonlabs"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/[0.1]"
                    style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.18)" }}
                  >
                    <Github className="h-4 w-4" />
                    github.com/ifleonlabs
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-300/70" />
                  </a>
                </div>
              </div>
            </div>
          </HoloCard>
        </motion.div>
      </section>
    </div>
  );
}
