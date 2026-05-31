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
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/PageHero";
import { ScrollReveal } from "../components/animations/ScrollReveal";
import { MagnetCard } from "../components/animations/MagnetCard";

const projects = [
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
];

const categories = [
  "All",
  "AI & Machine Learning",
  "DevOps & Automation",
  "Cloud Infrastructure",
  "Cybersecurity",
  "Custom Development",
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
    <div className="bg-slate-950 min-h-screen">
      <PageHero
        eyebrow="Portfolio"
        title="Real projects."
        highlight="Real results."
        description="A showcase of recent engagements across AI, DevOps, cloud, and security — each delivering measurable business outcomes."
      >
        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto pt-2">
          {[
            { num: "25+", label: "Projects" },
            { num: "50+", label: "Clients" },
            { num: "6", label: "Industries" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-blue-400">
                {s.num}
              </div>
              <div className="text-xs md:text-sm text-slate-400 tracking-wide uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </PageHero>

      {/* Category filter */}
      <section className="sticky top-16 z-30 bg-slate-950/85 backdrop-blur-md border-b border-white/10 py-4">
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
                      ? "text-white border-transparent shadow-lg"
                      : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-md"
                  }`}
                  style={
                    active
                      ? {
                          background:
                            "linear-gradient(90deg, #3b82f6, #10b981)",
                          boxShadow:
                            "0 10px 25px -8px rgba(59,130,246,0.5)",
                        }
                      : undefined
                  }
                >
                  {category}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-25 pointer-events-none" />

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
                    className="h-full bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl overflow-hidden hover:bg-white/10 hover:border-emerald-400/40 transition-all"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <motion.img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-white/15 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-bold">
                          {project.year}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-5 right-5">
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-full text-[10px] font-bold tracking-[0.15em] uppercase mb-2">
                          {project.category}
                        </span>
                        <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                          {project.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6 md:p-7">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-slate-400 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5" />
                          {project.client}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {project.duration}
                        </div>
                      </div>

                      <p className="text-slate-300 mb-5 leading-relaxed text-sm md:text-base">
                        {project.description}
                      </p>

                      <div className="mb-5">
                        <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-300 mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Key Results
                        </h4>
                        <ul className="space-y-1.5">
                          {project.results.map((result, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-slate-200"
                            >
                              <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
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
                              className="px-3 py-1 bg-white/5 border border-white/10 text-slate-200 rounded-lg text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                        {project.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="flex items-center gap-1 px-3 py-1 bg-emerald-400/10 text-emerald-300 rounded-full text-xs font-semibold"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </MagnetCard>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 mesh-bg opacity-40" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal direction="up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-5">
              Ready to start your project?
            </h2>
            <p className="text-base md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can deliver similar outcomes for your business.
            </p>
            <Link
              to="/#contact"
              className="shine-on-hover inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-600 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 text-white px-8 py-4 rounded-xl font-semibold transition-all"
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
