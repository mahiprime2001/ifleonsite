import { motion } from "framer-motion";
import { Linkedin, Mail, Github, Award, Users, Target, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/PageHero";
import { ScrollReveal } from "../components/animations/ScrollReveal";
import { MagnetCard } from "../components/animations/MagnetCard";

const team = [
  {
    name: "S. Mahendra Reddy",
    role: "Founder & Lead Engineer",
    specialization: "AI, DevOps & Cloud Architecture",
    image: "https://i.pravatar.cc/400?img=12",
    bio: "Expert in AI/ML solutions, DevOps automation, and cloud infrastructure with a passion for solving complex business challenges through technology.",
    skills: ["Machine Learning", "AWS/Azure", "CI/CD", "Python", "Kubernetes"],
    linkedin: "https://linkedin.com/in/mahendra",
    github: "https://github.com/mahiprime2001",
    email: "mahendra@ifleon.com",
  },
];

const values = [
  {
    icon: Target,
    title: "Excellence in Delivery",
    description: "We're committed to delivering high-quality solutions that exceed expectations.",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    icon: Users,
    title: "Client-Centric Approach",
    description: "Your success is our success. We work as an extension of your team.",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    icon: Award,
    title: "Continuous Innovation",
    description: "Staying ahead with the latest technologies and best practices.",
    accent: "from-purple-500 to-pink-500",
  },
];

export default function TeamPage() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <PageHero
        eyebrow="Our Team"
        title="Engineers driving"
        highlight="real impact"
        description="Founder-led, hands-on, and committed to building practical technology that businesses can trust."
      />

      {/* Team grid */}
      <section className="relative py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />
        <div className="absolute -top-32 left-1/3 w-[36rem] h-[36rem] rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.7 }}
              >
                <MagnetCard
                  intensity={6}
                  className="h-full bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl overflow-hidden hover:bg-white/10 hover:border-emerald-400/40 transition-all"
                >
                  <div className="relative h-64 overflow-hidden">
                    <motion.img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5">
                      <h3 className="text-2xl font-black text-white mb-1">
                        {member.name}
                      </h3>
                      <p className="text-emerald-300 font-semibold text-sm">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-blue-300 mb-3">
                      {member.specialization}
                    </p>
                    <p className="text-slate-300 text-sm md:text-base mb-5 leading-relaxed">
                      {member.bio}
                    </p>

                    <div className="mb-5">
                      <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-2">
                        Expertise
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-white/5 border border-white/10 text-slate-200 rounded-lg text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                      {[
                        { Icon: Linkedin, href: member.linkedin, color: "from-blue-500 to-cyan-500" },
                        { Icon: Github, href: member.github, color: "from-slate-600 to-slate-800" },
                        { Icon: Mail, href: `mailto:${member.email}`, color: "from-emerald-500 to-teal-500" },
                      ].map(({ Icon, href, color }, i) => (
                        <motion.a
                          key={i}
                          href={href}
                          target={href.startsWith("mailto") ? undefined : "_blank"}
                          rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                          whileHover={{ scale: 1.12, y: -2 }}
                          whileTap={{ scale: 0.92 }}
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
                        >
                          <Icon className="h-4 w-4 text-white" />
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </MagnetCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values — strategic WHITE block */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-100 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-100 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <p className="text-sm font-bold text-blue-600 tracking-[0.3em] uppercase mb-3">
                Our Values
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3">
                Principles that{" "}
                <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  guide every project
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The non-negotiables we bring to every engagement.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br ${value.accent} shadow-lg`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-40" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal direction="up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-5">
              Join our growing team.
            </h2>
            <p className="text-base md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              We're always interested in talented engineers passionate about
              practical technology and continuous learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:careers@ifleon.com"
                className="shine-on-hover inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-600 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 text-white px-8 py-4 rounded-xl font-semibold transition-all"
              >
                <Mail className="h-5 w-5" />
                Email Careers
              </a>
              <Link
                to="/#contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold transition-all backdrop-blur-md"
              >
                General Inquiry
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
