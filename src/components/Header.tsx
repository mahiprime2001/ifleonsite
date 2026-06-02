import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "./Avatar";
import { Logo } from "./Logo";
import ThemeToggle from "./theme/ThemeToggle";

type User = Record<string, unknown>;

const NAV = [
  { label: "Services", path: "/services" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Team", path: "/team" },
  { label: "Blog", path: "/blog" },
  { label: "Pricing", path: "/pricing" },
];

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  const isHome = location.pathname === "/";
  // Show frosted bar once the user has scrolled OR when on inner pages
  const frosted = scrolled || !isHome;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
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

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        frosted ? "frost shadow-card" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo — always a normal home link */}
          <Link
            to="/"
            className="flex items-center gap-3 group relative"
            aria-label="Go home"
          >
            <motion.div
              animate={{
                filter: "drop-shadow(0 0 0 rgba(37,99,235,0))",
              }}
              whileHover={{
                filter: "drop-shadow(0 0 14px rgba(37,99,235,0.45))",
              }}
              transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            >
              <Logo
                size={36}
                className="flex-shrink-0 transition-transform group-hover:scale-105"
              />
            </motion.div>
            <div>
              <span className="font-display font-semibold text-lg leading-none text-foreground">
                IFLEON
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-brand">
                Consulting
              </span>
            </div>
          </Link>

          {/* Right group */}
          <div className="flex items-center gap-1">
            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
                      active
                        ? "text-foreground bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right-side actions */}
            <div className="hidden lg:flex items-center gap-3 ml-3">
              <ThemeToggle />
              {user ? (
                <Avatar />
              ) : (
                <Link
                  to="/#contact"
                  className="text-sm font-semibold px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  Get Started
                </Link>
              )}
            </div>

            {/* Mobile burger */}
            <button
              className="lg:hidden p-2 rounded-md transition-colors text-foreground hover:bg-accent"
              onClick={() => setMenuOpen((p) => !p)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden frost"
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
                        ? "text-foreground bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
                <ThemeToggle />
                <Link
                  to="/#contact"
                  className="flex-1 block text-sm font-semibold px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-center"
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
