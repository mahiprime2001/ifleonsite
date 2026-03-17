import { motion } from "framer-motion";
import { Linkedin, Mail, Github, Award, Users, Target } from "lucide-react";

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
  },
  {
    icon: Users,
    title: "Client-Centric Approach",
    description: "Your success is our success. We work as an extension of your team.",
  },
  {
    icon: Award,
    title: "Continuous Innovation",
    description: "Staying ahead with the latest technologies and best practices.",
  },
];

export default function TeamPage() {
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
              <Users className="h-10 w-10" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Team</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Meet the experts driving innovation and delivering exceptional results
              for our clients.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden group"
              >
                <motion.div
                  className="relative h-64 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-blue-300 font-medium">{member.role}</p>
                  </div>
                </motion.div>

                <div className="p-6">
                  <p className="text-sm font-semibold text-blue-600 mb-3">
                    {member.specialization}
                  </p>
                  <p className="text-gray-600 mb-4 leading-relaxed">{member.bio}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      Expertise:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <motion.a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Linkedin className="h-5 w-5" />
                    </motion.a>

                    <motion.a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-900 hover:text-white transition-all"
                    >
                      <Github className="h-5 w-5" />
                    </motion.a>

                    <motion.a
                      href={`mailto:${member.email}`}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                    >
                      <Mail className="h-5 w-5" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our work and relationships with clients.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
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
                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
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
            <h2 className="text-4xl font-bold mb-6">Join Our Growing Team</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals who are passionate about
              technology and innovation.
            </p>

            <motion.a
              href="mailto:careers@ifleon.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg"
            >
              <Mail className="h-5 w-5" />
              Contact Us About Opportunities
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
