import { useEffect, useRef } from "react";
import {
  Network,
  Mail,
  MapPin,
  Calendar,
  ArrowUpRight,
  Github,
  Linkedin,
  ArrowUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { animate, stagger } from "animejs";
import {
  businessServices,
  individualServices,
  specialtyServices,
} from "../data/services";

export const Footer = () => {
  const gridRef = useRef<HTMLDivElement | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    let played = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || played) return;
          played = true;

          const cols = el.querySelectorAll<HTMLElement>("[data-footer-col]");
          animate(cols, {
            opacity: [0, 1],
            translateY: [24, 0],
            duration: 650,
            delay: stagger(100),
            easing: "easeOutExpo",
          });
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10"
        >
          {/* Brand */}
          <div data-footer-col className="lg:col-span-2 opacity-0">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
                <Network className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">IFLEON</span>
                <div className="text-xs text-gray-400">
                  Infinite Logical Elements of Network
                </div>
              </div>
            </div>

            <p className="text-gray-400 mb-6 max-w-md leading-relaxed text-sm">
              Practical AI solutions, DevOps automation, cloud engineering, and
              secure digital systems for businesses and individuals across
              India.
            </p>

            <div className="flex items-center gap-4 mb-5">
              <a
                href="https://github.com/ifleonlabs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IFLEON on GitHub"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
              >
                <Github className="h-4 w-4 text-gray-300" />
              </a>
              <a
                href="https://www.linkedin.com/company/ifleon/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IFLEON on LinkedIn"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
              >
                <Linkedin className="h-4 w-4 text-gray-300" />
              </a>
              <a
                href="mailto:info@ifleon.com"
                aria-label="Email IFLEON"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
              >
                <Mail className="h-4 w-4 text-gray-300" />
              </a>
            </div>

            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Calendar className="h-3.5 w-3.5" />
              <span>Founded 2022 &bull; Nellore, Andhra Pradesh</span>
            </div>
          </div>

          {/* Business Services */}
          <div data-footer-col className="opacity-0">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              For Business
            </h3>
            <ul className="space-y-2 text-sm">
              {businessServices.map((s) => (
                <li key={s.id}>
                  <Link
                    to="/services"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Individual Services */}
          <div data-footer-col className="opacity-0">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              For Individuals
            </h3>
            <ul className="space-y-2 text-sm mb-6">
              {individualServices.map((s) => (
                <li key={s.id}>
                  <Link
                    to="/services"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
              Specialty
            </h3>
            <ul className="space-y-2 text-sm">
              {specialtyServices.slice(0, 3).map((s) => (
                <li key={s.id}>
                  <Link
                    to="/services"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/services"
                  className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                >
                  View all <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company + Contact */}
          <div data-footer-col className="opacity-0">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Company
            </h3>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <a href="/#about" className="text-gray-400 hover:text-blue-400 transition-colors">
                  About
                </a>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Technical Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-blue-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="/#contact" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Contact
                </a>
              </li>
            </ul>

            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
              Get in Touch
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="h-4 w-4 shrink-0" />
                <a
                  href="mailto:info@ifleon.com"
                  className="hover:text-blue-400 transition-colors"
                >
                  info@ifleon.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Nellore, Andhra Pradesh, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} IFLEON. All rights reserved.
              &nbsp;&bull;&nbsp;Founded by S. Mahendra Reddy
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://ifleon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-blue-400 transition-colors inline-flex items-center gap-1"
            >
              Service Portal <ArrowUpRight className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="inline-flex items-center gap-1 bg-gray-800 hover:bg-blue-600 text-gray-200 px-3 py-1.5 rounded-lg text-xs transition-colors"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
