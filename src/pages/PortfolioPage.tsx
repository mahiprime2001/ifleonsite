import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import {
  Briefcase,
  Calendar,
  Tag,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Github,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/PageHero";
import { ScrollReveal } from "../components/animations/ScrollReveal";
import { MagnetCard } from "../components/animations/MagnetCard";
import { site } from "../config/site";

type Project = {
  id: number;
  title: string;
  category: string;
  client: string;
  duration: string;
  year: string;
  image?: string;
  repo?: string;
  description: string;
  technologies: string[];
  results: string[];
  tags: string[];
};

const projects: Project[] = [
  {
    id: 1,
    title: "AI-Powered Customer Analytics Platform",
    category: "AI & Machine Learning",
    client: "Regional Financial Services",
    duration: "6 months",
    year: "2024",
    image: "https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg",
    description:
      "ML platform for fraud detection and customer behavior analysis — improved detection accuracy by 40%.",
    technologies: ["Python", "TensorFlow", "AWS SageMaker", "React", "PostgreSQL"],
    results: [
      "40% improvement in fraud detection accuracy",
      "Reduced false positives by 35%",
      "1M+ transactions processed daily",
    ],
    tags: ["Machine Learning", "Analytics", "Cloud"],
  },
  {
    id: 2,
    title: "Enterprise DevOps Transformation",
    category: "DevOps & Automation",
    client: "Healthcare Technology Startup",
    duration: "4 months",
    year: "2024",
    image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg",
    description:
      "Complete CI/CD pipeline automation — 75% faster deployments with zero-downtime releases.",
    technologies: ["Jenkins", "Docker", "Kubernetes", "AWS", "Terraform"],
    results: [
      "75% reduction in deployment time",
      "Zero-downtime deployments",
      "5x faster release cycles",
    ],
    tags: ["DevOps", "Automation", "Cloud"],
  },
  {
    id: 3,
    title: "Cloud Migration & Optimization",
    category: "Cloud Infrastructure",
    client: "Manufacturing SMB",
    duration: "5 months",
    year: "2023",
    image: "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg",
    description:
      "Legacy on-prem to AWS migration with optimization — 50% cost reduction achieved.",
    technologies: ["AWS EC2", "S3", "Lambda", "CloudFormation", "RDS"],
    results: [
      "50% reduction in infrastructure costs",
      "99.9% uptime achieved",
      "3x performance improvement",
    ],
    tags: ["Cloud Migration", "AWS", "Optimization"],
  },
  {
    id: 4,
    title: "Enterprise Security Framework",
    category: "Cybersecurity",
    client: "Educational Institution",
    duration: "3 months",
    year: "2023",
    image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg",
    description:
      "Security framework with DPDP compliance, threat detection, and incident response capabilities.",
    technologies: ["Linux Hardening", "Security Tools", "Monitoring", "Compliance"],
    results: [
      "100% DPDP compliance achieved",
      "Zero security incidents",
      "Real-time threat monitoring",
    ],
    tags: ["Security", "Compliance", "Monitoring"],
  },
  {
    id: 5,
    title: "Custom ERP System",
    category: "Custom Development",
    client: "Local Retail Chain",
    duration: "8 months",
    year: "2023",
    image: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
    description:
      "Custom ERP with mobile access, inventory management, and integrated customer analytics.",
    technologies: ["Odoo", "Python", "React Native", "PostgreSQL"],
    results: [
      "30% increase in operational efficiency",
      "Real-time inventory tracking",
      "Mobile field-team access",
    ],
    tags: ["ERP", "Mobile", "Custom"],
  },
  {
    id: 6,
    title: "IoT Smart Home Integration",
    category: "IoT Solutions",
    client: "Residential Clients",
    duration: "2 months",
    year: "2024",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    description:
      "Smart home automation with voice integration, security systems, and energy management.",
    technologies: ["IoT Devices", "Home Assistant", "Voice Integration"],
    results: [
      "15+ homes automated",
      "30% energy savings achieved",
      "Voice-controlled systems",
    ],
    tags: ["IoT", "Smart Home"],
  },

  // === Open Source — real public repositories (github.com/ifleonlabs & github.com/mahiprime2001) ===
  {
    id: 7,
    title: "llmkit — Claude API Toolkit",
    category: "Open Source",
    client: "IFLEON Labs",
    duration: "Open source",
    year: "2026",
    repo: "https://github.com/ifleonlabs/llmkit",
    description:
      "Typed Python toolkit for the Claude API — chat & streaming, prompt templates, response & prompt caching, token usage, and an offline mock provider for fully testable code.",
    technologies: ["Python", "Claude API", "httpx"],
    results: [
      "Chat + streaming over the Claude API",
      "Response & prompt caching with token usage",
      "Offline mock provider — testable with no API key",
    ],
    tags: ["AI", "Python", "Open Source"],
  },
  {
    id: 8,
    title: "askdocs — RAG Document Assistant",
    category: "Open Source",
    client: "IFLEON Labs",
    duration: "Open source",
    year: "2026",
    repo: "https://github.com/ifleonlabs/askdocs",
    description:
      "Ask questions over your own documents — a compact Retrieval-Augmented Generation assistant built on llmkit, with pluggable retrieval (keyword now, vector store next).",
    technologies: ["Python", "RAG", "llmkit"],
    results: [
      "Q&A over your own document set",
      "Pluggable retrieval (keyword → vector)",
      "Runs offline in mock mode",
    ],
    tags: ["AI", "RAG", "Python"],
  },
  {
    id: 9,
    title: "vigil — Uptime & Change Monitoring",
    category: "Open Source",
    client: "IFLEON Labs",
    duration: "Open source",
    year: "2026",
    repo: "https://github.com/ifleonlabs/vigil",
    description:
      "An uptime & change-monitoring service assembled from the ifleonlabs engine parts (apikit + taskq), with FastAPI, SQLModel and JWT auth.",
    technologies: ["Python", "FastAPI", "SQLModel", "JWT"],
    results: [
      "Uptime & change monitoring with alerts",
      "JWT-authenticated REST API",
      "Built on the apikit + taskq engine",
    ],
    tags: ["DevOps", "Monitoring", "Python"],
  },
  {
    id: 10,
    title: "taskq — Background Job Queue",
    category: "Open Source",
    client: "IFLEON Labs",
    duration: "Open source",
    year: "2026",
    repo: "https://github.com/ifleonlabs/taskq",
    description:
      "A small, persistent background job queue backed by SQLite — enqueue work and run it in a worker with retries, backoff, scheduling and priorities. No Redis required.",
    technologies: ["Python", "SQLite", "SQLModel"],
    results: [
      "Persistent SQLite-backed job queue",
      "Retries, backoff, scheduling & priorities",
      "Zero external infrastructure (no Redis)",
    ],
    tags: ["DevOps", "Backend", "Python"],
  },
  {
    id: 11,
    title: "apikit — Typed REST Client Toolkit",
    category: "Open Source",
    client: "IFLEON Labs",
    duration: "Open source",
    year: "2026",
    repo: "https://github.com/ifleonlabs/apikit",
    description:
      "A typed REST API client toolkit on httpx — automatic retries with backoff, rate limiting, response caching and pagination, fully testable offline.",
    technologies: ["Python", "httpx"],
    results: [
      "Automatic retries with backoff",
      "Rate limiting + response caching",
      "Pagination, fully testable offline",
    ],
    tags: ["Backend", "Python", "Open Source"],
  },
  {
    id: 12,
    title: "auth-api — FastAPI Auth Service",
    category: "Open Source",
    client: "IFLEON Labs",
    duration: "Open source",
    year: "2026",
    repo: "https://github.com/ifleonlabs/auth-api",
    description:
      "A production-shaped authentication service in FastAPI — bcrypt password hashing, JWT access/refresh tokens, OAuth2 password flow, and protected routes.",
    technologies: ["Python", "FastAPI", "JWT", "OAuth2"],
    results: [
      "bcrypt password hashing",
      "JWT access & refresh tokens",
      "OAuth2 password flow + protected routes",
    ],
    tags: ["Security", "Auth", "Python"],
  },
  {
    id: 13,
    title: "realtime-chat — WebSocket Chat",
    category: "Open Source",
    client: "IFLEON Labs",
    duration: "Open source",
    year: "2026",
    repo: "https://github.com/ifleonlabs/realtime-chat",
    description:
      "Real-time WebSocket chat with rooms, live presence and persisted history, built on FastAPI + SQLModel.",
    technologies: ["Python", "FastAPI", "WebSockets", "SQLModel"],
    results: [
      "Live rooms with presence",
      "Persisted message history",
      "WebSocket real-time delivery",
    ],
    tags: ["Backend", "Realtime", "Python"],
  },
  {
    id: 14,
    title: "roundup — Content Aggregator & Digests",
    category: "Open Source",
    client: "IFLEON Labs",
    duration: "Open source",
    year: "2026",
    repo: "https://github.com/ifleonlabs/roundup",
    description:
      "A content aggregator & digest builder — pull RSS/JSON sources on a schedule, dedupe and store, then push digests. Composed from apikit + taskq + notifykit.",
    technologies: ["Python", "RSS/JSON", "Scheduling"],
    results: [
      "Scheduled RSS/JSON aggregation",
      "Dedupe, store & build digests",
      "Composed from reusable IFLEON toolkits",
    ],
    tags: ["Automation", "Python", "Open Source"],
  },
  {
    id: 15,
    title: "tablescope — CSV Analytics CLI",
    category: "Open Source",
    client: "IFLEON Labs",
    duration: "Open source",
    year: "2026",
    repo: "https://github.com/ifleonlabs/tablescope",
    description:
      "A microscope for your spreadsheets — profile, aggregate, chart and report on any CSV from the command line with pandas + matplotlib.",
    technologies: ["Python", "pandas", "matplotlib"],
    results: [
      "Profile & aggregate any CSV",
      "Charts & reports from the CLI",
      "pandas + matplotlib under the hood",
    ],
    tags: ["Data", "CLI", "Python"],
  },
  {
    id: 16,
    title: "Siri Billing App",
    category: "Open Source",
    client: "Siri Art Jewellery",
    duration: "Open source",
    year: "2026",
    repo: "https://github.com/mahiprime2001/Siri-billing-app",
    description:
      "An inventory & billing system built as a cross-platform desktop app with Tauri, a Next.js front end and a Flask back end — delivered in partnership with IFLEON.",
    technologies: ["Tauri", "Next.js", "Flask", "TypeScript"],
    results: [
      "Cross-platform desktop billing (Tauri)",
      "Next.js UI + Flask API",
      "Inventory & invoicing for a retail business",
    ],
    tags: ["Custom Development", "Full-Stack", "Desktop"],
  },
  {
    id: 17,
    title: "weather-app — Forecasts (CLI + Web)",
    category: "Open Source",
    client: "IFLEON Labs",
    duration: "Open source",
    year: "2026",
    repo: "https://github.com/mahiprime2001/weather-app",
    description:
      "Live weather & forecasts from the free Open-Meteo API with both a CLI and a web UI — async httpx, TTL caching and .env configuration.",
    technologies: ["Python", "httpx", "Open-Meteo"],
    results: [
      "Live weather & multi-day forecasts",
      "Async httpx with TTL caching",
      "CLI + web UI from one codebase",
    ],
    tags: ["Python", "API", "Open Source"],
  },
  {
    id: 18,
    title: "url-shortener — Links + Analytics",
    category: "Open Source",
    client: "IFLEON Labs",
    duration: "Open source",
    year: "2026",
    repo: "https://github.com/ifleonlabs/url-shortener",
    description:
      "A URL shortener with click analytics — SQLite/SQLModel storage plus a CLI, web UI and redirect server.",
    technologies: ["Python", "SQLite", "SQLModel"],
    results: [
      "Short links with click analytics",
      "CLI, web UI & redirect server",
      "SQLModel persistence",
    ],
    tags: ["Backend", "Python", "Open Source"],
  },
];

const categories = [
  "All",
  "AI & Machine Learning",
  "DevOps & Automation",
  "Cloud Infrastructure",
  "Cybersecurity",
  "Custom Development",
  "Open Source",
  "IoT Solutions",
];

export default function PortfolioPage() {
  useDocumentMeta({
    title: "Portfolio — Real AI, DevOps & Cloud Projects | IFLEON",
    description: "Browse IFLEON's project portfolio — AI customer analytics, DevOps transformation, cloud migration, security frameworks, and more. Real engagements, measurable outcomes.",
    canonical: "https://ifleon.com/portfolio",
  });
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Portfolio"
        title="Real projects."
        highlight="Real results."
        description="A showcase of recent engagements across AI, DevOps, cloud, and security — each delivering measurable business outcomes."
      >
        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto pt-2">
          {[
            { num: `${site.metrics.projectsDelivered}`, label: "Projects" },
            { num: `${site.metrics.clients}`, label: "Clients" },
            { num: `${site.metrics.industriesServed}`, label: "Industries" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-2xl md:text-3xl font-semibold text-brand">
                {s.num}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground tracking-wide uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </PageHero>

      {/* Category filter */}
      <section className="sticky top-16 z-30 bg-background/85 backdrop-blur-md border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all border ${
                    active
                      ? "bg-primary text-primary-foreground border-transparent shadow-card"
                      : "surface-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-20 bg-transparent overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 perspective-1000"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.6 }}
                >
                  <MagnetCard
                    intensity={5}
                    className="h-full surface-card !rounded-3xl overflow-hidden hover:border-brand/40 transition-all"
                  >
                    <div className="relative h-56 overflow-hidden">
                      {project.image ? (
                        <motion.img
                          src={project.image}
                          alt={project.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.06 }}
                          transition={{ duration: 0.5 }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0e1a2e] via-[#0a121f] to-[#0a0f18]">
                          <div className="absolute inset-0 iso-grid-bg opacity-30" />
                          <Github className="relative h-16 w-16 text-brand/70" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-white/15 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-bold">
                          {project.year}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-5 right-5">
                        <span className="inline-block px-3 py-1 bg-brand-gradient text-white rounded-full text-[10px] font-bold tracking-[0.15em] uppercase mb-2">
                          {project.category}
                        </span>
                        <h3 className="font-display text-xl md:text-2xl font-bold text-white leading-tight">
                          {project.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6 md:p-7">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5" />
                          {project.client}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {project.duration}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-5 leading-relaxed text-sm md:text-base">
                        {project.description}
                      </p>

                      <div className="mb-5">
                        <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-brand mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Key Results
                        </h4>
                        <ul className="space-y-1.5">
                          {project.results.map((result, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-foreground"
                            >
                              <CheckCircle className="h-4 w-4 text-brand flex-shrink-0 mt-0.5" />
                              <span>{result}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-muted border border-border text-muted-foreground rounded-lg text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                        {project.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-brand rounded-full text-xs font-semibold"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>

                      {project.repo && (
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor
                          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
                        >
                          <Github className="h-4 w-4" />
                          View on GitHub
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </MagnetCard>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 bg-transparent overflow-hidden border-t border-border">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal direction="up">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-5">
              Ready to start your project?
            </h2>
            <p className="text-base md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss how we can deliver similar outcomes for your business.
            </p>
            <Link
              to="/#contact"
              className="shine-on-hover inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 px-8 py-4 rounded-xl font-semibold transition-all"
            >
              Schedule Free Consultation
              <ArrowRight className="h-5 w-5" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
