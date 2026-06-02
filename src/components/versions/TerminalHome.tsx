/* ============================================================
   V12 — "TERMINAL"
   Dark dev / terminal aesthetic. Near-black canvas, monospace
   everywhere, terminal-green + amber accents. Hero is a faux
   terminal window (traffic-light dots) that types commands with
   a blinking cursor and prints output. Services render as a
   command list / file tree. ASCII dividers + a subtle scanline.

   Self-contained. Imports limited to:
   react, framer-motion, lucide-react, react-router-dom.
   No three.js / WebGL / external assets.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Terminal,
  ArrowRight,
  Mail,
  Github,
  ChevronRight,
  CornerDownRight,
  Folder,
  FolderGit2,
  CircleDot,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Quote,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

/* ---------------- theme tokens (self-defined) ---------------- */
const BG = "#0A0A0A";
const PANEL = "#0B0F0C";
const PANEL_HEAD = "#11160F";
const GREEN = "#3BE36B";
const GREEN_DIM = "#1f7a3e";
const AMBER = "#FFB454";
const CYAN = "#5CC8FF";
const TEXT = "#C8D6C8";
const TEXT_DIM = "#6E7D6E";
const LINE = "rgba(59,227,107,0.14)";
const LINE_SOFT = "rgba(59,227,107,0.08)";

const MONO =
  'var(--font-mono, "JetBrains Mono"), ui-monospace, SFMono-Regular, Menlo, monospace';

/* ============================================================
   Typed-command hook. Types `text` char-by-char on an interval.
   Reduced motion → immediately complete.
   ============================================================ */
function useTyped(text: string, speed: number, startDelay: number, active: boolean) {
  const reduced = useReducedMotion();
  const [out, setOut] = useState(reduced ? text : "");
  const [done, setDone] = useState(reduced ? true : false);

  useEffect(() => {
    if (reduced) {
      setOut(text);
      setDone(true);
      return;
    }
    if (!active) return;
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setOut(text.slice(0, i));
        if (i >= text.length) {
          if (interval) clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(startTimer);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay, active, reduced]);

  return { out, done };
}

/* blinking block cursor */
function Cursor({ show = true }: { show?: boolean }) {
  const reduced = useReducedMotion();
  if (!show) return null;
  if (reduced)
    return (
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: "0.6em",
          height: "1.05em",
          marginLeft: 2,
          transform: "translateY(0.15em)",
          background: GREEN,
        }}
      />
    );
  return (
    <motion.span
      aria-hidden
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
      style={{
        display: "inline-block",
        width: "0.6em",
        height: "1.05em",
        marginLeft: 2,
        transform: "translateY(0.15em)",
        background: GREEN,
      }}
    />
  );
}

/* small reusable prompt prefix */
function Prompt({ path = "~/ifleon" }: { path?: string }) {
  return (
    <span style={{ whiteSpace: "nowrap" }}>
      <span style={{ color: GREEN }}>ifleon</span>
      <span style={{ color: TEXT_DIM }}>@</span>
      <span style={{ color: CYAN }}>prod</span>
      <span style={{ color: TEXT_DIM }}>:</span>
      <span style={{ color: AMBER }}>{path}</span>
      <span style={{ color: TEXT_DIM }}>$ </span>
    </span>
  );
}

/* ASCII divider */
function AsciiRule({ label }: { label?: string }) {
  return (
    <div
      aria-hidden
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        color: TEXT_DIM,
        fontFamily: MONO,
        fontSize: 12,
        letterSpacing: 1,
        userSelect: "none",
      }}
    >
      <span style={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap" }}>
        {"─".repeat(120)}
      </span>
      {label && (
        <span style={{ color: GREEN_DIM, whiteSpace: "nowrap" }}>
          {"// "}
          {label}
        </span>
      )}
      <span style={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap", textAlign: "right" }}>
        {"─".repeat(120)}
      </span>
    </div>
  );
}

/* scanline + grid overlay (decorative, motion-safe) */
function Backdrop() {
  const reduced = useReducedMotion();
  return (
    <>
      {/* grid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${LINE_SOFT} 1px, transparent 1px), linear-gradient(90deg, ${LINE_SOFT} 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 90% 60% at 50% 0%, #000 0%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 60% at 50% 0%, #000 0%, transparent 80%)",
        }}
      />
      {/* green glow top */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -260,
          left: "50%",
          transform: "translateX(-50%)",
          width: 900,
          height: 600,
          background: `radial-gradient(circle, rgba(59,227,107,0.12), transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
      {/* scanlines */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.32) 0px, rgba(0,0,0,0.32) 1px, transparent 1px, transparent 3px)",
          opacity: 0.5,
          mixBlendMode: "multiply",
        }}
      />
      {/* moving scan beam */}
      {!reduced && (
        <motion.div
          aria-hidden
          initial={{ y: "-20%" }}
          animate={{ y: "120%" }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 120,
            background:
              "linear-gradient(180deg, transparent, rgba(59,227,107,0.06), transparent)",
            pointerEvents: "none",
          }}
        />
      )}
    </>
  );
}

/* traffic-light window dots */
function WindowDots() {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => (
        <span
          key={c}
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: c,
            boxShadow: `0 0 0 1px rgba(0,0,0,0.4) inset`,
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   HERO terminal window
   ============================================================ */
const HERO_CMD = "ifleon deploy --ai --devops --cloud --secure";

function HeroTerminal() {
  const reduced = useReducedMotion();
  const cmd = useTyped(HERO_CMD, 38, 600, true);
  const [phase, setPhase] = useState(reduced ? 99 : 0);

  // advance output lines once the command is typed
  useEffect(() => {
    if (reduced) {
      setPhase(99);
      return;
    }
    if (!cmd.done) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    [0, 360, 720, 1080].forEach((t, idx) => {
      timers.push(setTimeout(() => setPhase((p) => Math.max(p, idx + 1)), t));
    });
    return () => timers.forEach(clearTimeout);
  }, [cmd.done, reduced]);

  const outputs: { text: string; note?: string }[] = [
    { text: "resolving stack ……………", note: "AI · DevOps · Cloud · Security" },
    { text: "provisioning infrastructure as code", note: "terraform applied" },
    { text: "running compliance checks", note: "ISO 27001 · DPDP · SOC 2" },
    { text: "deploy succeeded", note: "uptime 99.9%" },
  ];

  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${LINE}`,
        background: PANEL,
        boxShadow:
          "0 40px 120px -40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.02)",
        overflow: "hidden",
      }}
    >
      {/* title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          background: PANEL_HEAD,
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <WindowDots />
        <div
          style={{
            flex: 1,
            textAlign: "center",
            color: TEXT_DIM,
            fontFamily: MONO,
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Terminal size={12} style={{ color: GREEN_DIM }} />
          ifleon — bash — 96×24
        </div>
        <span style={{ width: 52 }} />
      </div>

      {/* body */}
      <div
        style={{
          padding: "20px clamp(16px,4vw,28px) 26px",
          fontFamily: MONO,
          fontSize: "clamp(13px, 1.5vw, 15px)",
          lineHeight: 1.9,
          color: TEXT,
        }}
      >
        <div>
          <span style={{ color: TEXT_DIM }}># Infinite Possibilities, Logical Solutions.</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <Prompt />
          <span style={{ color: GREEN }}>{cmd.out}</span>
          <Cursor show={!cmd.done || phase < 4} />
        </div>

        {outputs.map((o, i) => (
          <motion.div
            key={o.text}
            initial={reduced ? false : { opacity: 0, x: -6 }}
            animate={
              phase > i || reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }
            }
            transition={{ duration: 0.25 }}
            style={{
              display: phase > i || reduced ? "flex" : "none",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              paddingLeft: 4,
            }}
          >
            <CheckCircle2 size={14} style={{ color: GREEN, flexShrink: 0 }} />
            <span style={{ color: TEXT }}>{o.text}</span>
            {o.note && (
              <span
                style={{
                  color: AMBER,
                  fontSize: "0.85em",
                  border: `1px solid ${LINE}`,
                  borderRadius: 5,
                  padding: "0 7px",
                }}
              >
                {o.note}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SERVICE row — file-tree / command-list styling
   ============================================================ */
function ServiceRow({ s, last }: { s: Service; last: boolean }) {
  const reduced = useReducedMotion();
  const Icon = s.icon;
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: 14,
        padding: "16px 18px",
        borderBottom: last ? "none" : `1px solid ${LINE_SOFT}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          color: TEXT_DIM,
          fontFamily: MONO,
          fontSize: 13,
          paddingTop: 2,
        }}
      >
        <CornerDownRight size={14} style={{ color: GREEN_DIM, marginTop: 2 }} />
        <span
          style={{
            display: "inline-flex",
            color: GREEN,
            border: `1px solid ${LINE}`,
            borderRadius: 6,
            padding: 5,
            background: "rgba(59,227,107,0.05)",
          }}
        >
          <Icon className="w-4 h-4" />
        </span>
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            gap: "6px 10px",
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 15,
              fontWeight: 600,
              color: TEXT,
            }}
          >
            {s.title}
          </span>
          <span style={{ fontFamily: MONO, fontSize: 12, color: AMBER }}>
            — {s.tagline}
          </span>
        </div>
        <p
          style={{
            margin: "6px 0 10px",
            fontFamily: MONO,
            fontSize: 12.5,
            lineHeight: 1.6,
            color: TEXT_DIM,
            maxWidth: 720,
          }}
        >
          <span style={{ color: GREEN_DIM }}># </span>
          {s.description}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {s.technologies.slice(0, 5).map((t) => (
            <span
              key={t}
              style={{
                fontFamily: MONO,
                fontSize: 11,
                color: CYAN,
                border: `1px solid ${LINE_SOFT}`,
                borderRadius: 4,
                padding: "1px 7px",
                background: "rgba(92,200,255,0.04)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ServiceGroup({
  dir,
  count,
  GroupIcon,
  items,
}: {
  dir: string;
  count: number;
  GroupIcon: typeof Folder;
  items: Service[];
}) {
  return (
    <div
      style={{
        border: `1px solid ${LINE}`,
        borderRadius: 10,
        background: PANEL,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 18px",
          background: PANEL_HEAD,
          borderBottom: `1px solid ${LINE}`,
          fontFamily: MONO,
        }}
      >
        <GroupIcon size={15} style={{ color: AMBER }} />
        <span style={{ color: TEXT, fontWeight: 600, fontSize: 14 }}>{dir}/</span>
        <span style={{ color: TEXT_DIM, fontSize: 12 }}>
          {count} {count === 1 ? "module" : "modules"}
        </span>
        <span style={{ flex: 1 }} />
        <CircleDot size={12} style={{ color: GREEN }} />
        <span style={{ color: GREEN_DIM, fontSize: 11 }}>active</span>
      </div>
      <div>
        {items.map((s, i) => (
          <ServiceRow key={s.id} s={s} last={i === items.length - 1} />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Static data
   ============================================================ */
const METRICS = [
  { v: "25", label: "Projects Delivered" },
  { v: "6", label: "Industries Served" },
  { v: "50+", label: "Clients & Individuals" },
  { v: "99.9%", label: "Uptime" },
];

const STEPS = [
  {
    cmd: "ifleon scope",
    title: "Discover & Scope",
    body: "We map the problem, the constraints, and the highest-value use cases before a line of code.",
  },
  {
    cmd: "ifleon architect",
    title: "Architect & Plan",
    body: "A pragmatic blueprint — infra, data, security, and a phased delivery roadmap.",
  },
  {
    cmd: "ifleon build --ship",
    title: "Build & Ship",
    body: "Iterative delivery with CI/CD, tests, and clear handover — nothing thrown over a wall.",
  },
  {
    cmd: "ifleon monitor",
    title: "Operate & Improve",
    body: "Monitoring, optimization, and an evolution playbook so it stays fast, secure, and cheap.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "They moved us from quarterly releases to daily deploys without breaking a thing. The pipelines just work.",
    who: "Head of Engineering",
    org: "fintech-saas",
  },
  {
    quote:
      "Our ISO 27001 readiness went from a vague goal to an audit-ready evidence pack in weeks.",
    who: "Founder",
    org: "b2b-platform",
  },
  {
    quote:
      "Got me from curious to a cloud role in six months. The roadmap and mock interviews were gold.",
    who: "Career Switcher",
    org: "individual",
  },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

/* ============================================================
   PAGE
   ============================================================ */
export default function TerminalHome() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const sectionPad = "px-5 sm:px-8";

  return (
    <div
      ref={rootRef}
      style={{
        background: BG,
        color: TEXT,
        fontFamily: MONO,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ---------------- HERO ---------------- */}
      <section className={`relative pt-28 md:pt-32 pb-20 ${sectionPad}`}>
        <Backdrop />
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                color: GREEN,
                border: `1px solid ${LINE}`,
                borderRadius: 999,
                padding: "4px 12px",
                background: "rgba(59,227,107,0.05)",
              }}
            >
              <CircleDot size={11} />
              <span style={{ color: TEXT_DIM }}>
                IFLEON · founder-led · Nellore, India · est. 2022
              </span>
            </div>

            <h1
              style={{
                margin: "22px 0 0",
                fontFamily: MONO,
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: "-0.01em",
                fontSize: "clamp(34px, 6.4vw, 64px)",
                color: "#EAF6EA",
              }}
            >
              <span style={{ color: GREEN }}>{"> "}</span>
              Infinite Possibilities,
              <br />
              <span style={{ color: GREEN }}>Logical Solutions.</span>
            </h1>

            <p
              style={{
                margin: "20px 0 0",
                maxWidth: 640,
                fontSize: "clamp(14px,1.7vw,16px)",
                lineHeight: 1.7,
                color: TEXT_DIM,
              }}
            >
              A founder-led consultancy shipping{" "}
              <span style={{ color: TEXT }}>AI</span>,{" "}
              <span style={{ color: TEXT }}>DevOps</span>,{" "}
              <span style={{ color: TEXT }}>cloud</span>, and{" "}
              <span style={{ color: TEXT }}>cybersecurity</span> for businesses and
              individuals — in India and globally.
            </p>

            {/* CTAs */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 28,
              }}
            >
              <a
                href="mailto:info@ifleon.com"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  fontFamily: MONO,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#06140A",
                  background: GREEN,
                  borderRadius: 8,
                  padding: "12px 18px",
                  boxShadow: "0 0 28px -6px rgba(59,227,107,0.6)",
                }}
              >
                <Mail size={16} />
                Request a Free Consultation
                <ArrowRight size={16} />
              </a>
              <Link
                to="/services"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  fontFamily: MONO,
                  fontSize: 14,
                  fontWeight: 600,
                  color: GREEN,
                  background: "transparent",
                  border: `1px solid ${LINE}`,
                  borderRadius: 8,
                  padding: "12px 18px",
                }}
              >
                <ChevronRight size={16} />
                Explore Services
              </Link>
            </div>
          </motion.div>

          {/* terminal window */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ marginTop: 40 }}
          >
            <HeroTerminal />
          </motion.div>
        </div>
      </section>

      {/* ---------------- METRICS ---------------- */}
      <section className={`relative py-10 ${sectionPad}`}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 14 }}>
            <AsciiRule label="ifleon status --metrics" />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 1,
              border: `1px solid ${LINE}`,
              borderRadius: 10,
              overflow: "hidden",
              background: LINE,
            }}
          >
            {METRICS.map((m) => (
              <div
                key={m.label}
                style={{
                  background: PANEL,
                  padding: "22px 18px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: "clamp(28px,4vw,40px)",
                    color: GREEN,
                    textShadow: "0 0 18px rgba(59,227,107,0.4)",
                  }}
                >
                  {m.v}
                </div>
                <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 6 }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <section className={`relative py-14 ${sectionPad}`}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 8, fontFamily: MONO, fontSize: 14 }}>
            <Prompt />
            <span style={{ color: GREEN }}>ls -la ./services</span>
          </div>
          <p style={{ color: TEXT_DIM, fontSize: 13, margin: "0 0 22px" }}>
            <span style={{ color: GREEN_DIM }}># </span>
            16 modules across business, individual, and specialty domains.
          </p>

          <div style={{ display: "grid", gap: 22 }}>
            <ServiceGroup
              dir="business"
              count={businessServices.length}
              GroupIcon={Folder}
              items={businessServices}
            />
            <ServiceGroup
              dir="individuals"
              count={individualServices.length}
              GroupIcon={Folder}
              items={individualServices}
            />
            <ServiceGroup
              dir="specialty"
              count={specialtyServices.length}
              GroupIcon={FolderGit2}
              items={specialtyServices}
            />
          </div>
        </div>
      </section>

      {/* ---------------- HOW WE WORK ---------------- */}
      <section className={`relative py-14 ${sectionPad}`}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 18 }}>
            <AsciiRule label="ifleon run pipeline.sh" />
          </div>
          <h2
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: "clamp(22px,3.4vw,30px)",
              color: "#EAF6EA",
              margin: "0 0 22px",
            }}
          >
            <span style={{ color: GREEN }}>{"// "}</span>
            How we work
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                style={{
                  border: `1px solid ${LINE}`,
                  borderRadius: 10,
                  background: PANEL,
                  padding: 18,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    color: GREEN_DIM,
                    marginBottom: 12,
                  }}
                >
                  step {String(i + 1).padStart(2, "0")} / 04
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 13,
                    color: GREEN,
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ color: TEXT_DIM }}>$</span>
                  {step.cmd}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontWeight: 600,
                    fontSize: 15,
                    color: TEXT,
                    marginBottom: 6,
                  }}
                >
                  {step.title}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12.5,
                    lineHeight: 1.6,
                    color: TEXT_DIM,
                  }}
                >
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className={`relative py-14 ${sectionPad}`}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 18 }}>
            <AsciiRule label="cat ./testimonials.log" />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 14,
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.figure
                key={t.who}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                style={{
                  margin: 0,
                  border: `1px solid ${LINE}`,
                  borderLeft: `3px solid ${GREEN}`,
                  borderRadius: 8,
                  background: PANEL,
                  padding: 18,
                }}
              >
                <Quote size={16} style={{ color: GREEN_DIM }} />
                <blockquote
                  style={{
                    margin: "10px 0 14px",
                    fontFamily: MONO,
                    fontSize: 13.5,
                    lineHeight: 1.65,
                    color: TEXT,
                  }}
                >
                  {t.quote}
                </blockquote>
                <figcaption style={{ fontFamily: MONO, fontSize: 12 }}>
                  <span style={{ color: AMBER }}>{t.who}</span>
                  <span style={{ color: TEXT_DIM }}> @ {t.org}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CLOSING CTA ---------------- */}
      <section className={`relative py-16 ${sectionPad}`}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              border: `1px solid ${LINE}`,
              borderRadius: 12,
              background: PANEL,
              overflow: "hidden",
              boxShadow: "0 30px 90px -40px rgba(59,227,107,0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: PANEL_HEAD,
                borderBottom: `1px solid ${LINE}`,
                fontFamily: MONO,
                fontSize: 12,
                color: TEXT_DIM,
              }}
            >
              <WindowDots />
              <span>ifleon — start.sh</span>
            </div>

            <div style={{ padding: "clamp(22px,4vw,40px)" }}>
              <div style={{ fontFamily: MONO, fontSize: 13, marginBottom: 14 }}>
                <Prompt />
                <span style={{ color: GREEN }}>ifleon init --your-project</span>
                <Cursor />
              </div>
              <h2
                style={{
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: "clamp(24px,4vw,38px)",
                  color: "#EAF6EA",
                  margin: "0 0 12px",
                  lineHeight: 1.15,
                }}
              >
                Let&apos;s build something that ships.
              </h2>
              <p
                style={{
                  margin: "0 0 24px",
                  maxWidth: 560,
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: TEXT_DIM,
                }}
              >
                <span style={{ color: GREEN_DIM }}># </span>
                Tell us the problem. We&apos;ll come back with a pragmatic plan and a
                timeline — no jargon, no over-engineering.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <a
                  href="mailto:info@ifleon.com"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                    fontFamily: MONO,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#06140A",
                    background: GREEN,
                    borderRadius: 8,
                    padding: "12px 18px",
                    boxShadow: "0 0 28px -6px rgba(59,227,107,0.6)",
                  }}
                >
                  <Mail size={16} />
                  info@ifleon.com
                </a>
                <Link
                  to="/services"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                    fontFamily: MONO,
                    fontSize: 14,
                    fontWeight: 600,
                    color: GREEN,
                    border: `1px solid ${LINE}`,
                    borderRadius: 8,
                    padding: "12px 18px",
                  }}
                >
                  <ChevronRight size={16} />
                  Explore Services
                </Link>
                <a
                  href="https://github.com/ifleonlabs"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                    fontFamily: MONO,
                    fontSize: 14,
                    fontWeight: 600,
                    color: TEXT,
                    border: `1px solid ${LINE}`,
                    borderRadius: 8,
                    padding: "12px 18px",
                  }}
                >
                  <Github size={16} />
                  github.com/ifleonlabs
                </a>
              </div>

              {/* compliance + signature */}
              <div
                style={{
                  marginTop: 26,
                  paddingTop: 18,
                  borderTop: `1px solid ${LINE_SOFT}`,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 16,
                  fontFamily: MONO,
                  fontSize: 12,
                  color: TEXT_DIM,
                }}
              >
                <span
                  style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
                >
                  <ShieldCheck size={14} style={{ color: GREEN }} />
                  Compliance:
                </span>
                {COMPLIANCE.map((c) => (
                  <span
                    key={c}
                    style={{
                      color: CYAN,
                      border: `1px solid ${LINE_SOFT}`,
                      borderRadius: 4,
                      padding: "1px 8px",
                    }}
                  >
                    {c}
                  </span>
                ))}
                <span style={{ flex: 1 }} />
                <span
                  style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
                >
                  <Cpu size={14} style={{ color: AMBER }} />
                  exit code 0
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <AsciiRule label="EOF" />
          </div>
        </div>
      </section>
    </div>
  );
}
