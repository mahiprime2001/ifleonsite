import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "./Avatar";
import { Logo } from "./Logo";

type User = Record<string, unknown>;

const NAV = [
  { label: "Services", path: "/services" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Team", path: "/team" },
  { label: "Blog", path: "/blog" },
  { label: "Pricing", path: "/pricing" },
];

const REVEAL_MS = 30_000;
// Easing curve from animations.dev — feels intentional, not sluggish
const SMOOTH_EASE = [0.32, 0.72, 0, 1] as const;

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [manualExpanded, setManualExpanded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const expandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHome = location.pathname === "/";
  // Show frosted bar once user has scrolled OR when on inner pages
  const frosted = scrolled || !isHome;
  // Collapse contents into logo only after the hero is mostly out of view
  // and only on the home page (inner pages always show full nav).
  const collapsed = isHome && pastHero && !manualExpanded;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Threshold: roughly 60% of viewport height — past the hero copy area
      setPastHero(y > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    try {
      const u = localStorage.getItem("currentUser");
      if (u) setUser(JSON.parse(u));
    } catch {
      /* ignore */
    }
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

  // Cleanup any pending 30s timer on unmount
  useEffect(() => {
    return () => {
      if (expandTimerRef.current) clearTimeout(expandTimerRef.current);
    };
  }, []);

  const startReturnTimer = () => {
    if (expandTimerRef.current) clearTimeout(expandTimerRef.current);
    expandTimerRef.current = setTimeout(() => {
      setManualExpanded(false);
    }, REVEAL_MS);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (collapsed) {
      // First tap expands the header; navigation suppressed.
      e.preventDefault();
      setManualExpanded(true);
      startReturnTimer();
    }
    // When already expanded, the <Link> handles normal navigation to "/"
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        frosted
          ? "bg-slate-950/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo — also acts as the "expand" button when collapsed */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center gap-3 group relative"
            aria-label={collapsed ? "Show navigation" : "Go home"}
          >
            <motion.div
              animate={{
                scale: collapsed ? 1.08 : 1,
                filter: collapsed
                  ? "drop-shadow(0 0 14px rgba(52,211,153,0.55))"
                  : "drop-shadow(0 0 0 rgba(52,211,153,0))",
              }}
              transition={{ duration: 0.45, ease: SMOOTH_EASE }}
            >
              <Logo
                size={36}
                className="flex-shrink-0 transition-transform group-hover:scale-105"
              />
            </motion.div>
            <div>
              <span
                className="font-bold text-lg leading-none text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                IFLEON
              </span>
              <span className="block text-[10px] font-medium tracking-widest uppercase text-emerald-300">
                Consulting
              </span>
            </div>
            {/* Subtle pulse cue when collapsed (clickable hint) */}
            {collapsed && (
              <motion.span
                aria-hidden
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </Link>

          {/* Right group — animates "into" the logo when collapsed */}
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                key="header-right"
                className="flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: SMOOTH_EASE }}
              >
                {/* Desktop nav */}
                <nav className="hidden lg:flex items-center gap-1">
                  {NAV.map((link, i) => {
                    const active = location.pathname === link.path;
                    return (
                      <motion.div
                        key={link.path}
                        initial={{
                          opacity: 0,
                          x: -80 - (NAV.length - i) * 28,
                          scale: 0.4,
                        }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{
                          opacity: 0,
                          x: -80 - (NAV.length - i) * 28,
                          scale: 0.4,
                        }}
                        transition={{
                          duration: 0.55,
                          ease: SMOOTH_EASE,
                          delay: i * 0.04,
                        }}
                      >
                        <Link
                          to={link.path}
                          className={`px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
                            active
                              ? "text-white bg-white/15 border border-white/10"
                              : "text-white/75 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Right-side actions */}
                <div className="hidden lg:flex items-center gap-3 ml-3">
                  {user ? (
                    <Avatar />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: -120, scale: 0.4 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -120, scale: 0.4 }}
                      transition={{
                        duration: 0.55,
                        ease: SMOOTH_EASE,
                        delay: NAV.length * 0.04,
                      }}
                    >
                      <Link
                        to="/#contact"
                        className="text-sm font-semibold px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 text-white transition-all"
                      >
                        Get Started
                      </Link>
                    </motion.div>
                  )}
                </div>

                {/* Mobile burger */}
                <motion.button
                  className="lg:hidden p-2 rounded-md transition-colors text-white hover:bg-white/10"
                  onClick={() => setMenuOpen((p) => !p)}
                  aria-label="Toggle menu"
                  aria-expanded={menuOpen}
                  initial={{ opacity: 0, x: -60, scale: 0.4 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -60, scale: 0.4 }}
                  transition={{ duration: 0.5, ease: SMOOTH_EASE }}
                >
                  {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && !collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden bg-slate-950/95 backdrop-blur-md border-b border-white/10"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-1">
              {NAV.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "text-white bg-white/10"
                        : "text-white/75 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-white/10">
                <Link
                  to="/#contact"
                  className="block text-sm font-semibold px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
