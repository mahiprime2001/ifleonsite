"use client";

import { useRef } from "react";
import { ArrowUp, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "@/lib/router";
import { businessServices } from "../data/services";
import { LogoMark } from "./Logo";

const EASE = [0.22, 1, 0.36, 1] as const;

const COMPANY = [
  { label: "About", to: "/#about" },
  { label: "Our work", to: "/portfolio" },
  { label: "Team", to: "/team" },
  { label: "Pricing", to: "/pricing" },
  { label: "FAQ", to: "/faq" },
  { label: "Blog", to: "/blog" },
];

/*
 * The site's closing band in deep brand green: a last call to action, a few focused link
 * columns, and the oversized wordmark that rises into place as the page ends.
 */
export const Footer = () => {
  const wordRef = useRef<HTMLElement | null>(null);
  // Rises from below while the footer scrolls in, settling with its base just past the bottom edge.
  const { scrollYProgress } = useScroll({ target: wordRef, offset: ["start end", "end end"] });
  const wordY = useTransform(scrollYProgress, [0, 1], ["60%", "16%"]);

  return (
    <footer ref={wordRef} className="relative overflow-hidden bg-brand-950 text-brand-100">
      <div aria-hidden className="absolute inset-0 opacity-[0.07] iso-grid-bg invert" />

      {/* Oversized wordmark behind the links, rising as the page ends */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden">
        <motion.p
          style={{ y: wordY }}
          className="no-select text-center font-serif text-[27vw] font-semibold leading-[0.8] tracking-[-0.06em] text-white/[0.06]"
        >
          ifleon
        </motion.p>
      </div>

      <div className="shell relative z-10 pt-20 md:pt-28">
        {/* Closing call to action */}
        <motion.div
          className="flex flex-col gap-8 border-b border-white/10 pb-16 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <h2 className="max-w-2xl font-serif text-4xl font-normal leading-[1.05] text-paper md:text-6xl">
            Have a system that should run <em className="text-brand-300">better</em>? Let&apos;s talk.
          </h2>
          <Link
            to="/#contact"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-paper px-7 py-3.5 text-[0.95rem] font-semibold text-brand-950 transition hover:bg-white active:translate-y-px"
          >
            Book a free consultation
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Links */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark size={36} />
              <span className="font-serif text-2xl font-semibold tracking-[-0.03em] text-paper">ifleon</span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-200/80">
              Infinite Logical Elements of Network. AI, DevOps, cloud and security engineering for businesses and
              individuals across India.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { href: "https://github.com/ifleonlabs", label: "IFLEON on GitHub", Icon: Github },
                { href: "https://www.linkedin.com/company/ifleon/", label: "IFLEON on LinkedIn", Icon: Linkedin },
                { href: "mailto:info@ifleon.com", label: "Email IFLEON", Icon: Mail },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-brand-100 transition hover:border-white/40 hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Services">
            {businessServices.slice(0, 5).map((s) => (
              <FooterLink key={s.id} to="/services">
                {s.title}
              </FooterLink>
            ))}
            <FooterLink to="/services" strong>
              All services
            </FooterLink>
          </FooterColumn>

          <FooterColumn title="Company">
            {COMPANY.map((item) => (
              <FooterLink key={item.label} to={item.to}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Contact">
            <li>
              <a href="mailto:info@ifleon.com" className="text-brand-100/80 transition-colors hover:text-white">
                info@ifleon.com
              </a>
            </li>
            <li className="text-brand-100/80">Nellore, Andhra Pradesh, India</li>
          </FooterColumn>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 py-6 text-xs text-brand-200/70 sm:flex-row sm:items-center">
          {/* Cached pages can be from last year; the browser's year wins without a hydration error. */}
          <p suppressHydrationWarning>
            &copy; {new Date().getFullYear()} IFLEON. Founded by S. Mahendra Reddy in 2022.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-brand-100 transition hover:border-white/40 hover:text-white"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
};

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-brand-300">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children, strong }: { to: string; children: React.ReactNode; strong?: boolean }) {
  return (
    <li>
      <Link
        to={to}
        className={`transition-colors hover:text-white ${strong ? "inline-flex items-center gap-1 font-semibold text-paper" : "text-brand-100/80"}`}
      >
        {children}
        {strong && <ArrowUpRight className="h-3.5 w-3.5" />}
      </Link>
    </li>
  );
}
