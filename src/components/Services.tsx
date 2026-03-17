import {
  Brain,
  Cog as Cogs,
  Cloud,
  Shield,
  Database,
  Monitor,
  Home,
  GraduationCap,
  GitBranch,
  Bot,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

export const Services = () => {
  const businessServices = [
    {
      icon: Brain,
      title: "AI Solutions & Analytics",
      description:
        "Design and deploy intelligent AI systems that automate workflows, extract insights, and drive smarter business decisions.",
      features: [
        "Custom ML Models",
        "AI-Driven Business Insights",
        "Process Automation",
        "Predictive Analytics",
      ],
    },
    {
      icon: GitBranch,
      title: "DevOps & CI/CD Automation",
      description:
        "Accelerate development cycles with automated CI/CD pipelines, reliable deployments, and scalable DevOps practices.",
      features: [
        "CI/CD Pipeline Design",
        "Docker & Containerization",
        "Automated Deployments",
        "Git-Based Workflows",
      ],
    },
    {
      icon: Cloud,
      title: "Cloud Migration & Strategy",
      description:
        "Migrate, optimize, and scale your infrastructure on secure and cost-efficient cloud platforms.",
      features: [
        "AWS & Azure Migration",
        "Cloud Architecture Design",
        "Serverless Solutions",
        "Performance Optimization",
      ],
    },
    {
      icon: Shield,
      title: "Cybersecurity & Compliance",
      description:
        "Protect your business with enterprise-grade security, compliance readiness, and proactive threat mitigation.",
      features: [
        "Security Assessments",
        "DPDP Act Compliance",
        "ISO 27001 Implementation",
        "Threat Detection & Response",
      ],
    },
    {
      icon: Cogs,
      title: "Custom Software Development",
      description:
        "Build scalable, high-performance software tailored to your business workflows and growth plans.",
      features: [
        "Web & Mobile Applications",
        "ERP & Odoo Solutions",
        "API Integrations",
        "Business Process Automation",
      ],
    },
    {
      icon: Database,
      title: "Digital Transformation",
      description:
        "Modernize legacy systems and unlock growth through data-driven, AI-powered digital transformation.",
      features: [
        "AI-Powered Automation",
        "Data Analytics & Dashboards",
        "Legacy System Modernization",
        "Technology Consulting",
      ],
    },
  ];

  const individualServices = [
    {
      icon: Monitor,
      title: "Tech Support & Setup",
      description:
        "Reliable device setup, troubleshooting, and performance optimization for everyday technology needs.",
      features: [
        "Device Configuration",
        "Software Installation",
        "System Troubleshooting",
        "Performance Optimization",
      ],
    },
    {
      icon: Shield,
      title: "Personal Cybersecurity",
      description:
        "Secure your digital life with strong protection against malware, data loss, and online threats.",
      features: [
        "Antivirus & Firewall Setup",
        "Secure Wi-Fi Configuration",
        "Data Backup Solutions",
        "Cyber Safety Guidance",
      ],
    },
    {
      icon: Home,
      title: "Smart Home Integration",
      description:
        "Seamless setup and automation of smart home and IoT devices for comfort and security.",
      features: [
        "IoT Device Setup",
        "Home Automation",
        "Voice Assistant Integration",
        "Smart Security Systems",
      ],
    },
    {
      icon: GraduationCap,
      title: "IT & AI Career Guidance",
      description:
        "Personalized guidance for students and professionals entering AI, DevOps, cloud, or cybersecurity.",
      features: [
        "AI & DevOps Learning Paths",
        "Certification Guidance",
        "Career Roadmaps",
        "Hands-On Mentorship",
      ],
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            End-to-end AI, DevOps, cloud, and cybersecurity solutions designed to
            help businesses grow and individuals stay ahead in technology.
          </p>

          <div className="bg-blue-100 rounded-lg p-4 inline-block">
            <p className="text-blue-800 font-medium">
              Get a free consultation —
              <a
                href="mailto:info@ifleon.com"
                className="underline ml-1 hover:text-blue-900"
              >
                info@ifleon.com
              </a>
            </p>
          </div>
        </motion.div>

        {/* Business Services */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            Business Solutions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.03 }}
                  className="cursor-pointer bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all group"
                >
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <Icon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  <h4 className="text-2xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-teal-500 rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                    Discuss This Service <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Individual Services */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            Individual Solutions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {individualServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="cursor-pointer bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                      <Icon className="h-6 w-6 text-teal-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h4>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-1 text-sm">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Blog & GitHub CTA */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-10 text-white text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold mb-4">
            Technical Insights & Open Source
          </h3>
          <p className="text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
            Explore real-world implementations, technical blogs, and open-source
            contributions from IFLEON.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/blog"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Bot className="h-5 w-5" /> Read Our Blog
            </a>

            <a
              href="https://github.com/mahiprime2001"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <GitBranch className="h-5 w-5" /> View Source Code
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
