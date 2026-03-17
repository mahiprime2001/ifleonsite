
import {
  Zap,
  Globe,
  Users,
  Smartphone,
  Brain,
  GitBranch,
  Bot,
} from "lucide-react";
import { motion } from "framer-motion";

export const Experience = () => {
  const projects = [
    {
      icon: Brain,
      title: "AI-Powered Analytics Platform",
      client: "Regional Financial Services",
      description:
        "Designed and deployed machine learning models for fraud detection and customer analytics, improving detection accuracy by 40%.",
      technologies: ["Machine Learning", "Python", "TensorFlow", "AWS SageMaker"],
    },
    {
      icon: GitBranch,
      title: "DevOps Automation Pipeline",
      client: "Healthcare Technology Startup",
      description:
        "Built a complete CI/CD automation pipeline, reducing deployment time by 75% and improving release reliability.",
      technologies: ["Jenkins", "Docker", "AWS", "Git Workflows"],
    },
    {
      icon: Globe,
      title: "Cloud Migration & Optimization",
      client: "Manufacturing SMB",
      description:
        "Migrated legacy systems to cloud infrastructure with performance tuning and cost optimization, achieving 50% operational savings.",
      technologies: ["AWS EC2", "S3", "Lambda", "Cost Optimization"],
    },
    {
      icon: Zap,
      title: "Cybersecurity Implementation",
      client: "Educational Institution",
      description:
        "Implemented a robust cybersecurity framework aligned with DPDP compliance and industry security standards.",
      technologies: ["DPDP Compliance", "Security Audits", "Threat Detection", "ISO 27001"],
    },
    {
      icon: Users,
      title: "Smart Home IoT Solutions",
      client: "Residential Clients",
      description:
        "Delivered smart home automation and IoT security solutions for multiple households in the Nellore region.",
      technologies: ["IoT Setup", "Home Automation", "Smart Security", "Voice Integration"],
    },
    {
      icon: Smartphone,
      title: "Custom ERP Development",
      client: "Local Retail Chain",
      description:
        "Developed a customized ERP system with mobile access for inventory management and customer analytics.",
      technologies: ["Odoo ERP", "Mobile Development", "Customer Analytics", "API Integration"],
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
    <section id="experience" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Since 2022, IFLEON has delivered practical AI, DevOps, and cloud
            solutions—building a strong foundation for scalable, long-term growth.
          </p>
        </motion.div>

        {/* Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {project.title}
                    </h3>
                    <div className="text-sm text-blue-600 font-medium mb-3">
                      {project.client}
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Founder Expertise */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-10 text-white mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">Founder’s Expertise</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              IFLEON is led by S. Mahendra Reddy, combining deep technical
              expertise with a practical, business-first mindset.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Bot, title: "AI Generalist", desc: "ML & Analytics" },
                { icon: GitBranch, title: "DevOps Expert", desc: "CI/CD & Automation" },
                { icon: Globe, title: "Cloud Architect", desc: "AWS & Azure" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="bg-blue-700 rounded-xl p-6">
                    <Icon className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-lg font-bold">{item.title}</div>
                    <div className="text-blue-200 text-sm">{item.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Competitive Advantage */}
        <motion.div
          className="bg-white rounded-2xl p-10 shadow-lg mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            Our Competitive Advantage
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {competitiveAdvantages.map((adv, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                  {adv.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {adv.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Market Position */}
        <motion.div
          className="bg-teal-600 rounded-2xl p-10 text-white text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold mb-4">Market Position</h3>
          <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
            Strategically positioned to meet India’s growing demand for AI,
            DevOps, and cloud transformation services.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-teal-700 rounded-xl p-6">
              <div className="text-2xl font-bold">50%</div>
              <div className="text-teal-200">AI & DevOps Solutions</div>
            </div>
            <div className="bg-teal-700 rounded-xl p-6">
              <div className="text-2xl font-bold">30%</div>
              <div className="text-teal-200">Individual Clients</div>
            </div>
            <div className="bg-teal-700 rounded-xl p-6">
              <div className="text-2xl font-bold">20%</div>
              <div className="text-teal-200">Consulting & Education</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
