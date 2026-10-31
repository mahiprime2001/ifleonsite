"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Link, useLocation } from "@/lib/router";
import { Logo } from "./Logo";

const NAV = [
  { label: "Services", path: "/services" },
  { label: "Work", path: "/portfolio" },
  { label: "Team", path: "/team" },
  { label: "Blog", path: "/blog" },
  { label: "Pricing", path: "/pricing" },
];

const EASE = [0.32, 0.72, 0, 1] as const;

/*
 * Sits flat on the paper at the top of the page; once scrolled it floats as a frosted bar that
 * hides while scrolling down and returns on the way up. The active link's underline slides
 * between items (shared layoutId).
 */
export const Header = () => {
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 16);
    setHidden(y > 240 && y > previous && !menuOpen);
  });

  // Close the mobile menu after navigating.
  // eslint-disable-next-line react-hooks/set-state-in-effect -- closing the menu is a reaction to navigation
  useEffect(() => setMenuOpen(false), [pathname]);

  // Lock page scroll behind the open mobile menu.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div className={`transition-[padding] duration-500 ${scrolled ? "px-3 pt-3 sm:px-5" : "px-0 pt-0"}`}>
          <div
            className={`mx-auto flex h-16 items-center justify-between transition-all duration-500 ${
              scrolled
                ? "max-w-[1200px] rounded-full border border-line/80 bg-paper/80 px-4 shadow-soft backdrop-blur-xl sm:px-5"
                : "max-w-[1240px] border border-transparent px-5 sm:px-8"
            }`}
          >
            <Link to="/" aria-label="IFLEON home" className="rounded-lg">
              <Logo size={30} />
            </Link>

            <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
              {NAV.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-full px-4 py-2 text-[0.92rem] font-medium transition-colors ${
                      active ? "text-ink" : "text-ink-3 hover:text-ink"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full bg-brand-600"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <Link to="/#contact" className="btn-primary hidden !px-5 !py-2.5 sm:inline-flex">
                Book a call
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-line-strong bg-white/70 text-ink transition hover:bg-white lg:hidden"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu: a full-height sheet with staggered links */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 bg-paper pt-24 lg:hidden"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <nav aria-label="Mobile" className="shell flex flex-col">
              {[{ label: "Home", path: "/" }, ...NAV].map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.5, ease: EASE }}
                >
                  <Link
                    to={link.path}
                    className={`flex items-baseline justify-between border-b border-line py-4 font-serif text-3xl ${
                      isActive(link.path) && link.path !== "/" ? "text-brand-700" : "text-ink"
                    }`}
                  >
                    {link.label}
                    <span className="font-mono text-xs text-ink-4">0{i + 1}</span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
                className="pt-8"
              >
                <Link to="/#contact" className="btn-primary w-full">
                  Book a free consultation
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <p className="mt-6 text-sm text-ink-3">
                  Or write to{" "}
                  <a href="mailto:info@ifleon.com" className="font-medium text-ink underline decoration-line-strong underline-offset-4">
                    info@ifleon.com
                  </a>
                </p>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
