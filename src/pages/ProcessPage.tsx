import { motion } from "framer-motion";
import {
  MessageSquare,
  FileSearch,
  Lightbulb,
  Code,
  TestTube,
  Rocket,
  LifeBuoy,
  CheckCircle,
  ArrowRight,
  Clock,
} from "lucide-react";

const processSteps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Discovery & Consultation",
    subtitle: "Understanding Your Vision",
    description:
      "We start with an in-depth consultation to understand your business goals, technical requirements, challenges, and success criteria.",
    activities: [
      "Initial consultation call",
      "Requirements gathering",
      "Technical assessment",
      "Budget & timeline discussion",
    ],
    deliverables: ["Project brief", "Technical requirements doc"],
    duration: "1-2 weeks",
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    icon: FileSearch,
    title: "Analysis & Planning",
    subtitle: "Strategic Roadmap",
    description:
      "We analyze your requirements, evaluate technical options, and create a comprehensive project roadmap with clear milestones.",
    activities: [
      "Technical architecture design",
      "Risk assessment",
      "Resource planning",
      "Technology stack selection",
    ],
    deliverables: ["Project plan", "Architecture document", "Timeline"],
    duration: "1-2 weeks",
    color: "from-cyan-500 to-teal-500",
  },
  {
    number: "03",
    icon: Lightbulb,
    title: "Design & Prototyping",
    subtitle: "Visualizing Solutions",
    description:
      "We create detailed designs, prototypes, and proof-of-concepts to validate the approach before full-scale development.",
    activities: [
      "System design",
      "Prototype development",
      "User flow mapping",
      "Design review sessions",
    ],
    deliverables: ["Design mockups", "Prototype", "Technical specs"],
    duration: "2-3 weeks",
    color: "from-teal-500 to-green-500",
  },
  {
    number: "04",
    icon: Code,
    title: "Development & Implementation",
    subtitle: "Building Your Solution",
    description:
      "Our team builds your solution using agile methodologies, with regular sprints, code reviews, and progress updates.",
    activities: [
      "Agile development sprints",
      "Code reviews",
      "Continuous integration",
      "Regular demos",
    ],
    deliverables: ["Working software", "Documentation", "Source code"],
    duration: "4-12 weeks",
    color: "from-green-500 to-emerald-500",
  },
  {
    number: "05",
    icon: TestTube,
    title: "Testing & Quality Assurance",
    subtitle: "Ensuring Excellence",
    description:
      "Comprehensive testing across functionality, performance, security, and user experience to ensure the highest quality.",
    activities: [
      "Automated testing",
      "Performance testing",
      "Security audits",
      "User acceptance testing",
    ],
    deliverables: ["Test reports", "Bug fixes", "Performance metrics"],
    duration: "1-2 weeks",
    color: "from-emerald-500 to-lime-500",
  },
  {
    number: "06",
    icon: Rocket,
    title: "Deployment & Launch",
    subtitle: "Going Live",
    description:
      "We handle the complete deployment process, ensuring smooth migration, minimal downtime, and successful launch.",
    activities: [
      "Production deployment",
      "Data migration",
      "Monitoring setup",
      "Launch support",
    ],
    deliverables: ["Live system", "Deployment docs", "Runbooks"],
    duration: "1 week",
    color: "from-lime-500 to-yellow-500",
  },
  {
    number: "07",
    icon: LifeBuoy,
    title: "Support & Optimization",
    subtitle: "Continuous Improvement",
    description:
      "Post-launch support, monitoring, optimization, and ongoing improvements to ensure long-term success.",
    activities: [
      "24/7 monitoring",
      "Bug fixes",
      "Performance optimization",
      "Feature enhancements",
    ],
    deliverables: ["Support tickets", "Optimization reports", "Updates"],
    duration: "Ongoing",
    color: "from-yellow-500 to-orange-500",
  },
];

const methodologies = [
  {
    title: "Agile Development",
    description: "Flexible, iterative approach with regular feedback and adaptation.",
    icon: Rocket,
  },
  {
    title: "Continuous Integration",
    description: "Automated testing and integration for faster, reliable releases.",
    icon: Code,
  },
  {
    title: "DevOps Practices",
    description: "Seamless collaboration between development and operations.",
    icon: LifeBuoy,
  },
];

export default function ProcessPage() {
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

            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Process</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              A proven, transparent approach to delivering successful technology
              projects from concept to launch and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <div
                    className={`flex flex-col ${
                      isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                    } gap-8 items-center`}
                  >
                    <div className="flex-1">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-3xl shadow-lg p-8 relative overflow-hidden"
                      >
                        <div
                          className={`absolute top-0 ${
                            isEven ? "left-0" : "right-0"
                          } w-2 h-full bg-gradient-to-b ${step.color}`}
                        />

                        <div className="flex items-start gap-6 mb-6">
                          <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                          >
                            <Icon className="h-8 w-8 text-white" />
                          </motion.div>

                          <div>
                            <div className="text-6xl font-black text-gray-100 absolute top-4 right-4">
                              {step.number}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                              {step.title}
                            </h3>
                            <p className="text-blue-600 font-semibold mb-3">
                              {step.subtitle}
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              Key Activities:
                            </h4>
                            <ul className="space-y-2">
                              {step.activities.map((activity, i) => (
                                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <FileSearch className="h-5 w-5 text-blue-500" />
                              Deliverables:
                            </h4>
                            <ul className="space-y-2">
                              {step.deliverables.map((deliverable, i) => (
                                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                                  {deliverable}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>Duration: {step.duration}</span>
                        </div>
                      </motion.div>
                    </div>

                    {index < processSteps.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className={`hidden lg:block w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                      >
                        <ArrowRight className="h-6 w-6 text-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Methodologies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We follow industry best practices and proven methodologies to ensure
              project success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {methodologies.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="text-center p-8 bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {method.description}
                  </p>
                </motion.div>
              );
            })}
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
              Let's discuss your requirements and create a customized plan for your
              success.
            </p>

            <motion.a
              href="/#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg"
            >
              Schedule Free Consultation
              <ArrowRight className="h-5 w-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
