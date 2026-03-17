import { motion } from "framer-motion";
import { useState } from "react";
import {
  Briefcase,
  ExternalLink,
  Github,
  Calendar,
  Tag,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

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
      "Developed a comprehensive machine learning platform for fraud detection and customer behavior analysis, improving detection accuracy by 40%.",
    technologies: ["Python", "TensorFlow", "AWS SageMaker", "React", "PostgreSQL"],
    results: [
      "40% improvement in fraud detection accuracy",
      "Reduced false positives by 35%",
      "Processed 1M+ transactions daily",
      "Real-time analytics dashboard",
    ],
    features: [
      "Real-time fraud detection",
      "Customer segmentation",
      "Predictive analytics",
      "Automated reporting",
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
      "Complete CI/CD pipeline automation, reducing deployment time by 75% and improving release reliability with zero-downtime deployments.",
    technologies: ["Jenkins", "Docker", "Kubernetes", "AWS", "Terraform"],
    results: [
      "75% reduction in deployment time",
      "Zero-downtime deployments",
      "100% automated testing coverage",
      "5x faster release cycles",
    ],
    features: [
      "Automated CI/CD pipelines",
      "Container orchestration",
      "Infrastructure as Code",
      "Automated rollbacks",
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
      "Migrated legacy on-premise infrastructure to AWS cloud with comprehensive optimization, achieving 50% cost reduction.",
    technologies: ["AWS EC2", "S3", "Lambda", "CloudFormation", "RDS"],
    results: [
      "50% reduction in infrastructure costs",
      "99.9% uptime achieved",
      "3x performance improvement",
      "Automated backup & recovery",
    ],
    features: [
      "Multi-region deployment",
      "Auto-scaling infrastructure",
      "Cost optimization",
      "Disaster recovery setup",
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
      "Implemented comprehensive security framework with DPDP compliance, threat detection, and incident response capabilities.",
    technologies: ["Linux Hardening", "Security Tools", "Monitoring", "Compliance"],
    results: [
      "100% DPDP compliance achieved",
      "Zero security incidents",
      "Real-time threat monitoring",
      "Complete audit trail",
    ],
    features: [
      "Security audits",
      "Threat detection",
      "Compliance reporting",
      "Access control",
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
      "Developed a fully customized ERP system with mobile access, inventory management, and advanced customer analytics.",
    technologies: ["Odoo", "Python", "React Native", "PostgreSQL", "REST API"],
    results: [
      "30% increase in operational efficiency",
      "Real-time inventory tracking",
      "Mobile access for field teams",
      "Integrated customer analytics",
    ],
    features: [
      "Inventory management",
      "Sales tracking",
      "Customer analytics",
      "Mobile application",
    ],
    tags: ["ERP", "Custom Development", "Mobile"],
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
      "Delivered smart home automation solutions with voice integration, security systems, and energy management.",
    technologies: ["IoT Devices", "Home Assistant", "Voice Integration", "Mobile Apps"],
    results: [
      "15+ homes automated",
      "30% energy savings achieved",
      "Voice-controlled systems",
      "Remote monitoring enabled",
    ],
    features: [
      "Smart lighting",
      "Security cameras",
      "Voice control",
      "Energy monitoring",
    ],
    tags: ["IoT", "Smart Home", "Automation"],
  },
];

const categories = ["All", "AI & Machine Learning", "DevOps & Automation", "Cloud Infrastructure", "Cybersecurity", "Custom Development", "IoT Solutions"];

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <section className="py-20 bg-gradient-to-br from-blue-600 via-teal-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6"
            >
              <Briefcase className="h-10 w-10" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Portfolio</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Real-world projects that showcase our expertise in delivering
              transformative technology solutions.
            </p>

            <div className="flex items-center justify-center gap-8 text-center">
              <div>
                <div className="text-4xl font-bold">25+</div>
                <div className="text-blue-200">Projects Delivered</div>
              </div>
              <div>
                <div className="text-4xl font-bold">50+</div>
                <div className="text-blue-200">Happy Clients</div>
              </div>
              <div>
                <div className="text-4xl font-bold">6</div>
                <div className="text-blue-200">Industries</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500"
              >
                <motion.div
                  className="relative h-64 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-blue-600 rounded-full text-sm font-semibold">
                      {project.year}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-blue-500/90 backdrop-blur-sm text-white rounded-full text-xs font-medium mb-2">
                      {project.category}
                    </span>
                    <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                  </div>
                </motion.div>

                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {project.client}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {project.duration}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Key Results:
                    </h4>
                    <ul className="space-y-2">
                      {project.results.map((result, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help you achieve similar results for your
              business with our proven expertise.
            </p>

            <motion.a
              href="/#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg"
            >
              Schedule Free Consultation
              <ExternalLink className="h-5 w-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
