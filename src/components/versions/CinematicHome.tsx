/* V3 — Dark cinematic immersive homepage. CSS/SVG/framer only (no WebGL). */
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
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

/* ------------------------------------------------------------------ */
/*  Static content                                                     */
/* ------------------------------------------------------------------ */

const METRICS = [
  { value: "25", label: "Projects Delivered", suffix: "" },
  { value: "6", label: "Industries Served", suffix: "" },
  { value: "50", label: "Clients & Individuals", suffix: "+" },
  { value: "99.9", label: "Uptime", suffix: "%" },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const PROCESS = [
  {
    icon: Compass,
    step: "01",
    title: "Discover",
    body: "We map your goals, constraints, and the highest-leverage problem worth solving first.",
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
    title: "Operate & Scale",
    body: "Monitoring, hardening, and a hand-off so it stays yours — and stays fast.",
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

const GROUPS: {
  key: string;
  label: string;
  icon: typeof Building2;
  blurb: string;
  services: Service[];
  glow: string;
}[] = [
  {
    key: "business",
    label: "Business Solutions",
    icon: Building2,
    blurb: "For startups, SMBs, SaaS & fintech teams shipping fast.",
    services: businessServices,
    glow: "#3B82F6",
  },
  {
    key: "individual",
    label: "For Individuals",
    icon: User,
    blurb: "Personal tech, security, and career guidance done right.",
    services: individualServices,
    glow: "#22D3EE",
  },
  {
    key: "specialty",
    label: "Specialty & Add-Ons",
    icon: Layers,
    blurb: "Sharp, focused engagements that slot into your roadmap.",
    services: specialtyServices,
    glow: "#7C3AED",
  },
];

/* ------------------------------------------------------------------ */
/*  Motion helpers                                                     */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Atmospheric background (glows, stars, grid)                        */
/* ------------------------------------------------------------------ */

function Atmosphere({ reduced }: { reduced: boolean }) {
  const drift = (
    keyframes: { x: number[]; y: number[] },
    dur: number,
  ) =>
    reduced
      ? {}
      : {
          animate: { x: keyframes.x, y: keyframes.y },
          transition: {
            duration: dur,
            repeat: Infinity,
            repeatType: "mirror" as const,
            ease: "easeInOut" as const,
          },
        };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 75%)",
        }}
      />

      {/* star / dot field */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(1.5px 1.5px at 12% 18%, rgba(255,255,255,0.7), transparent), radial-gradient(1px 1px at 28% 62%, rgba(255,255,255,0.5), transparent), radial-gradient(1.5px 1.5px at 47% 12%, rgba(180,210,255,0.7), transparent), radial-gradient(1px 1px at 63% 44%, rgba(255,255,255,0.45), transparent), radial-gradient(1.5px 1.5px at 78% 22%, rgba(160,200,255,0.6), transparent), radial-gradient(1px 1px at 88% 70%, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 36% 84%, rgba(255,255,255,0.4), transparent), radial-gradient(1.5px 1.5px at 70% 88%, rgba(190,210,255,0.55), transparent), radial-gradient(1px 1px at 8% 78%, rgba(255,255,255,0.4), transparent), radial-gradient(1px 1px at 92% 38%, rgba(255,255,255,0.4), transparent)",
        }}
      />

      {/* glow blobs */}
      <motion.div
        className="absolute -top-32 -left-24 h-[42rem] w-[42rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.32) 0%, rgba(59,130,246,0) 68%)",
          filter: "blur(20px)",
        }}
        {...drift({ x: [0, 60, -20], y: [0, 40, 10] }, 26)}
      />
      <motion.div
        className="absolute top-1/3 -right-28 h-[40rem] w-[40rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.26) 0%, rgba(34,211,238,0) 68%)",
          filter: "blur(20px)",
        }}
        {...drift({ x: [0, -50, 20], y: [0, 30, -30] }, 32)}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[36rem] w-[36rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.28) 0%, rgba(124,58,237,0) 68%)",
          filter: "blur(20px)",
        }}
        {...drift({ x: [0, 40, -30], y: [0, -40, 20] }, 38)}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small UI atoms                                                     */
/* ------------------------------------------------------------------ */

function Chip({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon?: typeof ShieldCheck;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/80 backdrop-blur-md">
      {Icon && <Icon className="h-4 w-4 text-cyan-300" />}
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-cyan-300/90 backdrop-blur-md">
      <Sparkles className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CinematicHome() {
  const prefersReduced = useReducedMotion();
  const reduced = !!prefersReduced;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms (neutralized when reduced motion is requested).
  const yHeadline = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -120]);
  const ySub = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -60]);
  const yChips = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 40]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, reduced ? 1 : 0]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#05060A] text-white">
      {/* Global base tint */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% -10%, #0B1224 0%, #070A12 45%, #05060A 100%)",
        }}
      />

      {/* ============================== HERO ============================== */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-28 pb-24 text-center md:pt-32"
      >
        <Atmosphere reduced={reduced} />

        <motion.div
          style={{ y: yHeadline, opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-5xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex justify-center"
          >
            <Chip icon={Sparkles}>Founder-led · Nellore, India · Serving Globally</Chip>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]"
          >
            <span className="block text-white">Engineering the</span>
            <span
              className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent"
              style={{
                filter: "drop-shadow(0 0 28px rgba(59,130,246,0.45))",
              }}
            >
              edge of possible.
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0.4 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mx-auto mt-8 h-px w-72 max-w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            style={{ boxShadow: "0 0 18px rgba(34,211,238,0.7)" }}
          />

          <motion.p
            style={{ y: ySub }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-7 max-w-2xl text-lg text-white/70 md:text-xl"
          >
            <span className="font-medium text-white/90">
              Infinite Possibilities, Logical Solutions.
            </span>{" "}
            IFLEON is your AI, DevOps, Cloud &amp; Cybersecurity partner — building
            systems that ship fast, scale calmly, and stay secure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-8 py-4 text-base font-semibold text-[#05060A] transition-transform hover:scale-[1.03]"
              style={{ boxShadow: "0 0 32px rgba(59,130,246,0.55)" }}
            >
              Explore Services
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="mailto:info@ifleon.com"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-colors hover:border-cyan-400/50 hover:bg-white/[0.08]"
            >
              <Mail className="h-5 w-5 text-cyan-300" />
              Start a Conversation
            </a>
          </motion.div>
        </motion.div>

        {/* Floating glass chips */}
        <motion.div
          style={{ y: yChips, opacity: heroOpacity }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative z-10 mt-16 flex flex-wrap items-center justify-center gap-3"
        >
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-left backdrop-blur-md"
            >
              <div className="font-display text-2xl font-bold text-white">
                {m.value}
                <span className="text-cyan-300">{m.suffix}</span>
              </div>
              <div className="text-xs uppercase tracking-wider text-white/55">
                {m.label}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur-md">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            <span className="text-sm text-white/70">{COMPLIANCE.join(" · ")}</span>
          </div>
        </motion.div>

        {/* scroll cue */}
        {!reduced && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
          >
            <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
              <motion.span
                className="h-2 w-1 rounded-full bg-cyan-300"
                animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}
      </section>

      {/* ============================ SERVICES ============================ */}
      <section className="relative px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mx-auto max-w-3xl text-center"
          >
            <SectionLabel>What we do</SectionLabel>
            <h2 className="font-display mt-6 text-4xl font-bold tracking-tight md:text-5xl">
              Sixteen ways we move you forward
            </h2>
            <p className="mt-4 text-lg text-white/60">
              From boardroom strategy to your home network — one team, real
              outcomes, across every layer of the stack.
            </p>
          </motion.div>

          <div className="mt-20 space-y-24">
            {GROUPS.map((group) => (
              <div key={group.key}>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  className="mb-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"
                      style={{ boxShadow: `0 0 24px ${group.glow}40` }}
                    >
                      <group.icon
                        className="h-6 w-6"
                        style={{ color: group.glow }}
                      />
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-bold">
                        {group.label}
                      </h3>
                      <p className="text-sm text-white/55">{group.blurb}</p>
                    </div>
                  </div>
                  <span className="text-sm text-white/40">
                    {group.services.length} services
                  </span>
                </motion.div>

                <motion.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {group.services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      glow={group.glow}
                    />
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ METRICS BAND ============================ */}
      <section className="relative px-6 py-24">
        <div
          className="absolute inset-x-0 top-1/2 -z-0 h-px -translate-y-1/2"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(59,130,246,0.5), rgba(34,211,238,0.5), transparent)",
          }}
        />
        <div className="relative mx-auto max-w-6xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <SectionLabel>By the numbers</SectionLabel>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-5 lg:grid-cols-4"
          >
            {METRICS.map((m) => (
              <motion.div
                key={m.label}
                variants={fadeUp}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-md"
              >
                <div
                  className="font-display text-5xl font-bold md:text-6xl"
                  style={{ textShadow: "0 0 30px rgba(59,130,246,0.6)" }}
                >
                  <span className="bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent">
                    {m.value}
                    {m.suffix}
                  </span>
                </div>
                <div className="mt-3 text-sm uppercase tracking-wider text-white/55">
                  {m.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================ HOW WE WORK ============================ */}
      <section className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <SectionLabel>How we work</SectionLabel>
            <h2 className="font-display mt-6 text-4xl font-bold tracking-tight md:text-5xl">
              A calm, deliberate path to launch
            </h2>
            <p className="mt-4 text-lg text-white/60">
              No mystery, no chaos. Four clear phases — and you can see exactly
              where your project is at any moment.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="relative mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {PROCESS.map((p) => (
              <motion.div
                key={p.step}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-md"
              >
                <div
                  className="absolute -right-6 -top-8 font-display text-8xl font-bold text-white/[0.04] transition-colors group-hover:text-white/[0.07]"
                  aria-hidden
                >
                  {p.step}
                </div>
                <span className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                  <p.icon className="h-6 w-6 text-cyan-300" />
                </span>
                <h3 className="relative mt-6 font-display text-xl font-bold">
                  {p.title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-white/60">
                  {p.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================ TESTIMONIALS ============================ */}
      <section className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <SectionLabel>Trusted outcomes</SectionLabel>
            <h2 className="font-display mt-6 text-4xl font-bold tracking-tight md:text-5xl">
              What people say after launch
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {TESTIMONIALS.map((t) => (
              <motion.figure
                key={t.role}
                variants={fadeUp}
                className="relative flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md"
              >
                <Quote className="h-8 w-8 text-cyan-300/60" />
                <blockquote className="mt-5 flex-1 text-base leading-relaxed text-white/80">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-4">
                  <div className="font-semibold text-white">{t.name}</div>
                  <div className="text-sm text-white/50">{t.role}</div>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================ CLOSING CTA ============================ */}
      <section className="relative px-6 pb-32 pt-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 p-10 text-center md:p-16"
          style={{
            background:
              "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(59,130,246,0.18), rgba(124,58,237,0.10) 45%, rgba(7,10,18,0) 80%)",
          }}
        >
          {/* inner glow ring */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow: "inset 0 0 80px rgba(34,211,238,0.12)",
              borderRadius: "2rem",
            }}
          />
          <div className="relative">
            <SectionLabel>Let's build</SectionLabel>
            <h2 className="font-display mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Got an idea worth building?
              <span
                className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent"
                style={{ filter: "drop-shadow(0 0 24px rgba(59,130,246,0.4))" }}
              >
                Let's make it real.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/65">
              Tell us where you want to go. We'll bring the AI, the cloud, the
              pipelines, and the security to get you there.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="mailto:info@ifleon.com"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-8 py-4 text-base font-semibold text-[#05060A] transition-transform hover:scale-[1.03]"
                style={{ boxShadow: "0 0 32px rgba(59,130,246,0.55)" }}
              >
                <Mail className="h-5 w-5" />
                info@ifleon.com
              </a>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-colors hover:border-cyan-400/50 hover:bg-white/[0.08]"
              >
                Browse all services
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="https://github.com/ifleonlabs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/[0.08]"
              >
                <Github className="h-5 w-5" />
                github.com/ifleonlabs
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {COMPLIANCE.map((c) => (
                <Chip key={c} icon={ShieldCheck}>
                  {c}
                </Chip>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Service card                                                       */
/* ------------------------------------------------------------------ */

function ServiceCard({ service, glow }: { service: Service; glow: string }) {
  const Icon = service.icon;
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-colors hover:border-white/20"
    >
      {/* hover glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${glow}22, transparent 70%)`,
        }}
      />
      <div className="relative">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]"
          style={{ boxShadow: `0 0 20px ${glow}30`, color: glow }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <h4 className="mt-5 font-display text-lg font-bold leading-snug text-white">
          {service.title}
        </h4>
        <p className="mt-1.5 text-sm font-medium text-cyan-300/80">
          {service.tagline}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          {service.description}
        </p>
        <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-white/40 transition-colors group-hover:text-cyan-300">
          Learn more
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </motion.div>
  );
}
