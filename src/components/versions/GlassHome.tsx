/* V9 — Glass: dark glassmorphism. Vivid blurred color orbs drift behind
   frosted translucent panels (backdrop-blur, white/5 fills, white/10 borders,
   inner highlights). Everything is glass floating over colorful blur. */
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

const BRAND = {
  base: "#070A14", // deep dark base
  blue: "#3B82F6",
  cyan: "#22D3EE",
  violet: "#8B5CF6",
};

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
    tint: BRAND.cyan,
  },
  {
    icon: PenTool,
    step: "02",
    title: "Design",
    body: "Architecture, UX, and a delivery plan you can actually read — no black boxes.",
    tint: BRAND.blue,
  },
  {
    icon: Rocket,
    step: "03",
    title: "Build & Ship",
    body: "Iterative builds with CI/CD, tests, and observability baked in from day one.",
    tint: BRAND.violet,
  },
  {
    icon: LifeBuoy,
    step: "04",
    title: "Operate & Scale",
    body: "Monitoring, hardening, and a clean hand-off so it stays yours — and stays fast.",
    tint: BRAND.cyan,
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
  glow: string;
};

const GROUPS: Group[] = [
  {
    key: "business",
    label: "Business Solutions",
    icon: Building2,
    blurb: "For startups, SMBs, SaaS & fintech teams shipping fast.",
    services: businessServices,
    glow: BRAND.blue,
  },
  {
    key: "individual",
    label: "For Individuals",
    icon: User,
    blurb: "Personal tech, security, and career guidance done right.",
    services: individualServices,
    glow: BRAND.cyan,
  },
  {
    key: "specialty",
    label: "Specialty & Add-Ons",
    icon: Layers,
    blurb: "Sharp, focused engagements that slot into your roadmap.",
    services: specialtyServices,
    glow: BRAND.violet,
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
/*  Drifting color orbs (the colorful blur behind the glass)          */
/* ================================================================== */

type Orb = {
  color: string;
  size: string;
  className: string;
  opacity: number;
  drift: { x: number[]; y: number[]; duration: number };
};

const ORBS: Orb[] = [
  {
    color: BRAND.blue,
    size: "46rem",
    className: "left-[-14rem] top-[-10rem]",
    opacity: 0.55,
    drift: { x: [0, 60, -30, 0], y: [0, 40, 70, 0], duration: 26 },
  },
  {
    color: BRAND.violet,
    size: "42rem",
    className: "right-[-12rem] top-[6rem]",
    opacity: 0.5,
    drift: { x: [0, -50, 30, 0], y: [0, 60, -20, 0], duration: 32 },
  },
  {
    color: BRAND.cyan,
    size: "38rem",
    className: "left-1/2 top-[42%] -translate-x-1/2",
    opacity: 0.42,
    drift: { x: [0, 40, -60, 0], y: [0, -40, 30, 0], duration: 29 },
  },
  {
    color: BRAND.blue,
    size: "40rem",
    className: "left-[-8rem] bottom-[-6rem]",
    opacity: 0.4,
    drift: { x: [0, 70, 20, 0], y: [0, -30, -60, 0], duration: 34 },
  },
  {
    color: BRAND.violet,
    size: "36rem",
    className: "right-[-6rem] bottom-[8rem]",
    opacity: 0.42,
    drift: { x: [0, -40, 50, 0], y: [0, 40, -30, 0], duration: 30 },
  },
];

function ColorOrbs({ animate }: { animate: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* base dark wash */}
      <div className="absolute inset-0" style={{ background: BRAND.base }} />
      {ORBS.map((orb, i) =>
        animate ? (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-[120px] ${orb.className}`}
            style={{
              width: orb.size,
              height: orb.size,
              opacity: orb.opacity,
              background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            }}
            animate={{ x: orb.drift.x, y: orb.drift.y }}
            transition={{
              duration: orb.drift.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ) : (
          <div
            key={i}
            className={`absolute rounded-full blur-[120px] ${orb.className}`}
            style={{
              width: orb.size,
              height: orb.size,
              opacity: orb.opacity,
              background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            }}
          />
        )
      )}
      {/* fine noise / grain via subtle gradient overlay to add depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% -10%, rgba(255,255,255,0.05), transparent 45%)",
        }}
      />
    </div>
  );
}

/* ================================================================== */
/*  Frosted-glass primitives                                          */
/* ================================================================== */

/** Reusable frosted panel: semi-transparent white fill, thin border,
    backdrop blur, layered inner highlight for that "real glass" depth. */
function Glass({
  children,
  className = "",
  blur = "backdrop-blur-xl",
}: {
  children: React.ReactNode;
  className?: string;
  blur?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] ${blur} ${className}`}
      style={{
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.18), inset 0 0 0 1px rgba(255,255,255,0.02), 0 24px 60px -24px rgba(0,0,0,0.6)",
      }}
    >
      {/* top-edge sheen */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
        }}
      />
      {children}
    </div>
  );
}

function GlassChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs font-medium text-slate-100 backdrop-blur-md"
      style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.15)" }}
    >
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  blurb,
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mx-auto max-w-2xl text-center"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200 backdrop-blur-md">
        {eyebrow}
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

function ServiceCard({ service, glow }: { service: Service; glow: string }) {
  const Icon = service.icon;
  return (
    <motion.div variants={fadeUp} className="group h-full">
      <Glass
        blur="backdrop-blur-md"
        className="h-full bg-white/[0.05] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.08]"
      >
        {/* hover glow bloom */}
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
          style={{ background: `radial-gradient(circle, ${glow}, transparent 70%)` }}
        />
        <div className="relative">
          <span
            className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-md"
            style={{
              color: glow,
              boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.25), 0 0 26px -8px ${glow}`,
            }}
          >
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="text-lg font-semibold text-white">{service.title}</h3>
          <p className="mt-1 text-sm font-medium" style={{ color: glow }}>
            {service.tagline}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300/75 line-clamp-3">
            {service.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {service.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/10 bg-white/[0.07] px-2 py-0.5 text-[11px] text-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Glass>
    </motion.div>
  );
}

/* ================================================================== */
/*  Main component                                                     */
/* ================================================================== */

export default function GlassHome() {
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
      style={{ background: BRAND.base }}
    >
      {/* ---- colorful blurred orbs behind everything ---- */}
      <ColorOrbs animate={animate} />

      {/* ---------------- HERO ---------------- */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-28 md:pt-32">
        <div className="flex flex-col items-center pb-20 text-center md:pb-28">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GlassChip>
              <SparklesIcon className="h-3.5 w-3.5 text-cyan-300" />
              Founder-led · AI · DevOps · Cloud · Security
            </GlassChip>
          </motion.div>

          <motion.h1
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-7 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
          >
            Infinite Possibilities,
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.cyan}, ${BRAND.violet})`,
                textShadow: "0 0 40px rgba(34,211,238,0.25)",
              }}
            >
              Logical Solutions.
            </span>
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
            <a
              href="mailto:info@ifleon.com"
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-[#070A14] transition-transform hover:scale-[1.03]"
              style={{
                backgroundImage: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.cyan})`,
                boxShadow: "0 0 44px -10px rgba(34,211,238,0.7)",
              }}
            >
              <Mail className="h-4 w-4" />
              Request a Free Consultation
            </a>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/[0.12]"
              style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.18)" }}
            >
              Explore Services
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {/* floating glass metric + compliance chips */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-2.5"
          >
            {METRICS.map((m) => (
              <GlassChip key={m.label}>
                <span className="font-semibold text-white">
                  {m.value}
                  {m.suffix}
                </span>
                <span className="text-slate-300/70">{m.label}</span>
              </GlassChip>
            ))}
            <span className="mx-1 hidden h-4 w-px bg-white/15 sm:block" />
            {COMPLIANCE.map((c) => (
              <GlassChip key={c}>
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
                {c}
              </GlassChip>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHeading
          eyebrow="What we build"
          title={`${totalServices} ways we move you forward`}
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
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-md"
                    style={{
                      color: group.glow,
                      boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.22), 0 0 28px -10px ${group.glow}`,
                    }}
                  >
                    <GroupIcon className="h-5 w-5" />
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
                  {group.services.map((service) => (
                    <ServiceCard key={service.id} service={service} glow={group.glow} />
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
          <Glass className="p-10 md:p-14">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background: `radial-gradient(circle at 18% 0%, ${BRAND.blue}40, transparent 50%), radial-gradient(circle at 82% 100%, ${BRAND.violet}40, transparent 50%)`,
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
                  <div
                    className="bg-clip-text font-display text-5xl font-bold tracking-tight text-transparent md:text-6xl"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, #ffffff, rgba(34,211,238,0.85))",
                      textShadow: "0 0 30px rgba(34,211,238,0.2)",
                    }}
                  >
                    {m.value}
                    {m.suffix}
                  </div>
                  <div className="mt-2 text-sm text-slate-300/70">{m.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </Glass>
        </motion.div>
      </section>

      {/* ---------------- HOW WE WORK ---------------- */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHeading
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
          {PROCESS.map((p) => {
            const Icon = p.icon;
            return (
              <motion.div key={p.step} variants={fadeUp} className="h-full">
                <Glass blur="backdrop-blur-md" className="h-full bg-white/[0.05] p-6">
                  <div className="font-mono text-5xl font-bold text-white/[0.08]">
                    {p.step}
                  </div>
                  <span
                    className="-mt-8 mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-md"
                    style={{
                      color: p.tint,
                      boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.22), 0 0 24px -8px ${p.tint}`,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300/75">
                    {p.body}
                  </p>
                </Glass>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHeading eyebrow="In their words" title="Outcomes, not promises" />

        <motion.div
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} variants={fadeUp} className="h-full">
              <Glass blur="backdrop-blur-md" className="flex h-full flex-col bg-white/[0.05] p-7">
                <Quote className="h-7 w-7 text-cyan-300/50" />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-100/90">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-4">
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-slate-300/65">{t.role}</div>
                </figcaption>
              </Glass>
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
          <Glass className="px-8 py-16 text-center md:px-16 md:py-20">
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background: `radial-gradient(circle at 50% -10%, ${BRAND.blue}45, transparent 60%), radial-gradient(circle at 50% 120%, ${BRAND.violet}50, transparent 60%)`,
              }}
            />
            <div className="relative">
              <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
                Let&apos;s engineer your next leap.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-200/85">
                Tell us what you&apos;re building. We&apos;ll bring the architecture, the
                automation, and the security to make it real.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="mailto:info@ifleon.com"
                  className="group inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-[#070A14] transition-transform hover:scale-[1.03]"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.cyan})`,
                    boxShadow: "0 0 44px -10px rgba(34,211,238,0.7)",
                  }}
                >
                  <Mail className="h-4 w-4" />
                  info@ifleon.com
                </a>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/[0.12]"
                  style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.18)" }}
                >
                  Browse all services
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://github.com/ifleonlabs"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/[0.12]"
                  style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.18)" }}
                >
                  <Github className="h-4 w-4" />
                  github.com/ifleonlabs
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-300/70" />
                </a>
              </div>
            </div>
          </Glass>
        </motion.div>
      </section>
    </div>
  );
}
