import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain,
  GitBranch,
  Cloud,
  Shield,
  Cog,
  Database,
  Rocket,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    id: "ai-solutions",
    icon: Brain,
    title: "AI & Machine Learning Solutions",
    tagline: "Transform Data into Intelligence",
    description:
      "Harness the power of artificial intelligence to automate processes, gain insights, and drive innovation across your organization.",
    features: [
      "Custom ML Model Development",
      "Natural Language Processing",
      "Computer Vision Solutions",
      "Predictive Analytics",
      "AI Strategy Consulting",
      "Model Training & Optimization",
    ],
    technologies: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Hugging Face"],
    useCases: [
      "Fraud Detection Systems",
      "Customer Behavior Analysis",
      "Automated Document Processing",
      "Intelligent Chatbots",
    ],
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "devops",
    icon: GitBranch,
    title: "DevOps & CI/CD Automation",
    tagline: "Accelerate Development, Ensure Quality",
    description:
      "Streamline your software delivery pipeline with modern DevOps practices, continuous integration, and automated deployment strategies.",
    features: [
      "CI/CD Pipeline Design",
      "Infrastructure as Code",
      "Container Orchestration",
      "Automated Testing",
      "Release Management",
      "DevOps Culture Training",
    ],
    technologies: ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform"],
    useCases: [
      "Zero-Downtime Deployments",
      "Multi-Environment Setup",
      "Automated Quality Gates",
      "Infrastructure Scaling",
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "cloud-migration",
    icon: Cloud,
    title: "Cloud Infrastructure & Migration",
    tagline: "Scale with Confidence",
    description:
      "Migrate to cloud platforms with confidence. We design, implement, and optimize cloud infrastructure for performance and cost-efficiency.",
    features: [
      "Cloud Strategy & Planning",
      "AWS & Azure Migration",
      "Cloud Architecture Design",
      "Cost Optimization",
      "Performance Tuning",
      "Disaster Recovery",
    ],
    technologies: ["AWS", "Azure", "Cloud Formation", "Lambda", "S3"],
    useCases: [
      "Legacy System Migration",
      "Multi-Cloud Architecture",
      "Serverless Applications",
      "Cloud-Native Development",
    ],
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "cybersecurity",
    icon: Shield,
    title: "Cybersecurity & Compliance",
    tagline: "Protect What Matters Most",
    description:
      "Safeguard your digital assets with comprehensive security solutions, compliance frameworks, and proactive threat management.",
    features: [
      "Security Audits & Assessments",
      "Compliance Implementation",
      "Threat Detection & Response",
      "Penetration Testing",
      "Security Training",
      "DPDP Act Compliance",
    ],
    technologies: ["ISO 27001", "DPDP", "Security Tools", "Linux Hardening"],
    useCases: [
      "Enterprise Security Framework",
      "Compliance Readiness",
      "Incident Response Planning",
      "Security Monitoring",
    ],
    color: "from-red-500 to-orange-500",
  },
  {
    id: "custom-development",
    icon: Cog,
    title: "Custom Software Development",
    tagline: "Built for Your Business",
    description:
      "Develop tailored software solutions that perfectly align with your unique business processes and growth objectives.",
    features: [
      "Web Application Development",
      "Mobile App Development",
      "ERP & CRM Solutions",
      "API Development & Integration",
      "Legacy System Modernization",
      "Maintenance & Support",
    ],
    technologies: ["React", "TypeScript", "Node.js", "Python", "Odoo"],
    useCases: [
      "Custom Business Applications",
      "E-Commerce Platforms",
      "Management Systems",
      "Integration Solutions",
    ],
    color: "from-green-500 to-teal-500",
  },
  {
    id: "digital-transformation",
    icon: Database,
    title: "Digital Transformation",
    tagline: "Modernize, Automate, Grow",
    description:
      "Transform your business operations with data-driven insights, intelligent automation, and modern technology platforms.",
    features: [
      "Process Automation",
      "Data Analytics & BI",
      "System Integration",
      "Change Management",
      "Technology Roadmapping",
      "Digital Strategy Consulting",
    ],
    technologies: ["Power BI", "Automation Tools", "Integration Platforms"],
    useCases: [
      "Workflow Automation",
      "Data-Driven Decision Making",
      "Legacy System Replacement",
      "Business Process Optimization",
    ],
    color: "from-indigo-500 to-purple-500",
  },
];

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group"
    >
      <div className={`h-2 bg-gradient-to-r ${service.color}`} />

      <div className="p-8">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.6 }}
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg`}
        >
          <Icon className="h-8 w-8 text-white" />
        </motion.div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
        <p className="text-blue-600 font-semibold mb-4">{service.tagline}</p>
        <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
          <ul className="space-y-2">
            {service.features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center text-gray-700"
              >
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Technologies:</h4>
          <div className="flex flex-wrap gap-2">
            {service.technologies.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Use Cases:</h4>
          <ul className="space-y-1">
            {service.useCases.map((useCase, i) => (
              <li key={i} className="text-sm text-gray-600">
                • {useCase}
              </li>
            ))}
          </ul>
        </div>

        <motion.a
          href="#contact"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`inline-flex items-center gap-2 bg-gradient-to-r ${service.color} text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          Get Started
          <ArrowRight className="h-5 w-5" />
        </motion.a>
      </div>
    </motion.div>
  );
};

export default function ServicesPage() {
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
              <Rocket className="h-10 w-10" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Comprehensive IT consulting and technology solutions designed to transform
              your business and accelerate growth.
            </p>

            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {["AI & ML", "DevOps", "Cloud", "Security", "Development", "Transformation"].map(
                (tag, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                )
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
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
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's discuss how IFLEON can help you achieve your technology goals
              with tailored solutions and expert guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/#contact"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg"
              >
                Schedule Free Consultation
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                to="/case-studies"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all"
              >
                View Case Studies
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
