import {
  Network,
  Mail,
  MapPin,
  Calendar,
  ArrowUpRight,
  Github,
  Linkedin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Top Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Network className="h-8 w-8 text-primary" />
              <div>
                <span className="text-2xl font-bold text-foreground">
                  IFLEON
                </span>
                <div className="text-sm text-muted-foreground">
                  Infinite Logical Elements of Network
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              IFLEON delivers practical AI solutions, DevOps automation, cloud
              engineering, and secure digital systems for businesses and
              individuals across India.
            </p>

            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
              <Calendar className="h-4 w-4" />
              <span>Founded in 2022 • Nellore, Andhra Pradesh</span>
            </div>
          </div>

          {/* Business Services */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Business Services
            </h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              {[
                "AI Solutions & Analytics",
                "DevOps & CI/CD Automation",
                "Cloud Migration & Strategy",
                "Cybersecurity & Compliance",
                "Custom Software Development",
                "Digital Transformation",
              ].map((item, i) => (
                <li
                  key={i}
                  className="hover:text-primary transition-colors cursor-default"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Individual + Contact */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Individual Services
            </h3>
            <ul className="space-y-2 text-muted-foreground text-sm mb-6">
              {[
                "Tech Support & Setup",
                "Personal Cybersecurity",
                "Smart Home Integration",
                "IT & AI Education Guidance",
              ].map((item, i) => (
                <li
                  key={i}
                  className="hover:text-primary transition-colors cursor-default"
                >
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold text-foreground mb-4">
              Contact
            </h3>
            <div className="space-y-3 text-muted-foreground text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:info@ifleon.com"
                  className="hover:text-primary transition-colors"
                >
                  info@ifleon.com
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>
                  Nellore, Andhra Pradesh
                  <br />
                  India
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center md:text-left">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} IFLEON. All rights reserved.
            </p>
            <p className="text-muted-foreground/70 text-xs mt-1">
              Founded by S. Mahendra Reddy • AI & DevOps Consulting
            </p>
          </div>

          <div className="flex items-center space-x-5">
            {/* Internal Links */}
            <Link
              to="/blog"
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Technical Blog
            </Link>

            <Link
              to="/faq"
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              FAQ
            </Link>

            {/* External Brand Links (VERY IMPORTANT FOR SEO) */}
            <a
              href="https://github.com/ifleonlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-sm"
              aria-label="IFLEON on GitHub"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>

            <a
              href="https://linkedin.com/company/ifleon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-sm"
              aria-label="IFLEON on LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>

            {/* Service Portal */}
            <a
              href="https://ifleon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Service Portal <ArrowUpRight className="h-4 w-4" />
            </a>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Back to Top
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
