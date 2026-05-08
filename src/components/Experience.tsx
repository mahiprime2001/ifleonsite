import { Zap, Globe, Brain, GitBranch } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "./animations/ScrollReveal";
import { MagnetCard } from "./animations/MagnetCard";

export const Experience = () => {
  const projects = [
    {
      icon: Brain,
      title: "AI-Powered Analytics Platform",
      client: "Regional Financial Services",
      description:
        "ML models for fraud detection and customer analytics — improved detection accuracy by 40%.",
      technologies: ["Python", "TensorFlow", "AWS SageMaker"],
      accent: "from-purple-500 to-pink-500",
    },
    {
      icon: GitBranch,
      title: "DevOps Automation Pipeline",
      client: "Healthcare Technology Startup",
      description:
        "End-to-end CI/CD pipeline that cut deployment time by 75% and improved release reliability.",
      technologies: ["Jenkins", "Docker", "AWS"],
      accent: "from-emerald-500 to-teal-500",
    },
    {
      icon: Globe,
      title: "Cloud Migration & Optimization",
      client: "Manufacturing SMB",
      description:
        "Legacy-to-cloud migration with performance tuning — achieved 50% operational savings.",
      technologies: ["AWS EC2", "S3", "Lambda"],
      accent: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Cybersecurity Implementation",
      client: "Educational Institution",
      description:
        "Security framework aligned with DPDP compliance and ISO 27001 standards.",
      technologies: ["DPDP", "Threat Detection", "ISO 27001"],
      accent: "from-amber-500 to-orange-500",
    },
  ];

  const competitiveAdvantages = [
    {
      title: "AI & DevOps Expertise",
      description:
        "Hands-on experience delivering real-world AI systems and DevOps automation for diverse industries.",
    },
    {
      title: "Strong Brand Identity",
      description:
        "A memorable domain and consistent digital presence that builds trust and recall.",
    },
    {
      title: "Knowledge Sharing Culture",
      description:
        "Open technical blogs and GitHub repositories that demonstrate transparency and skill depth.",
    },
    {
      title: "Local Roots, National Vision",
      description:
        "Strong understanding of regional markets with a clear pan-India growth strategy.",
    },
  ];

  return (
    <section
      id="experience"
      className="relative py-20 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden"
    >
      <div className="absolute inset-0 mesh-bg opacity-35 pointer-events-none" />
      <div className="absolute -top-40 left-1/3 w-[40rem] h-[40rem] rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-bold text-emerald-400 tracking-[0.3em] uppercase mb-3">
              Our Experience
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
              Real projects.{" "}
              <span className="text-gradient-iflo">Measurable outcomes.</span>
            </h2>
            <p className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto">
              Since 2022, IFLEON has delivered practical AI, DevOps, and cloud
              solutions — building a foundation for scalable, long-term growth.
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-20 perspective-1000"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30, rotateX: -10 },
                  show: { opacity: 1, y: 0, rotateX: 0 },
                }}
                transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <MagnetCard
                  intensity={6}
                  className="h-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl hover:bg-white/10 hover:border-emerald-400/40 transition-all"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex items-start gap-4">
                      <motion.div
                        whileHover={{ rotate: 6, scale: 1.05 }}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${project.accent} shadow-lg`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </motion.div>

                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                          {project.title}
                        </h3>
                        <div className="text-xs md:text-sm text-emerald-400 font-semibold mb-3 uppercase tracking-wide">
                          {project.client}
                        </div>
                        <p className="text-slate-300 mb-4 leading-relaxed text-sm md:text-base">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-white/10 border border-white/10 text-slate-200 rounded-full text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </MagnetCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Competitive Advantage */}
        <ScrollReveal direction="up">
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-10 text-center">
              Our Competitive Advantage
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {competitiveAdvantages.map((adv, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="text-center p-5 md:p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-emerald-400/40 transition-all"
                >
                  <h4 className="text-base md:text-lg font-bold text-white mb-2">
                    {adv.title}
                  </h4>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                    {adv.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
