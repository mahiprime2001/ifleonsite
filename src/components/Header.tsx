import { useEffect, useState } from "react";
import { Menu, X, Network } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "./Avatar";


type User = Record<string, unknown>;

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  /* ---------------- Scroll State ---------------- */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    try {
      const user = localStorage.getItem("currentUser");
      if (user) setCurrentUser(JSON.parse(user));
    } catch {
      setCurrentUser(null);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- Navigation ---------------- */
  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);

    if (!isHomePage) {
      navigate(`/#${sectionId}`);
      return;
    }

    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = ["Services", "About", "Experience", "Contact"];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? "bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <Network className="h-8 w-8 text-primary" />
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold text-foreground">IFLEON</span>
              <span className="text-xs text-muted-foreground">
                Infinite Logical Elements of Network
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {isHomePage
              ? navItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </button>
                ))
              : (
                <>
                  <Link
                    to="/"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                  {["services", "about", "contact"].map((item) => (
                    <button
                      key={item}
                      onClick={() => scrollToSection(item)}
                      className="text-foreground hover:text-primary transition-colors capitalize"
                    >
                      {item}
                    </button>
                  ))}
                </>
              )}

            <Link
              to="/blog"
              className="text-foreground hover:text-primary transition-colors"
            >
              Blog
            </Link>
            <Link to="/pricing" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/case-studies" className="text-foreground hover:text-primary transition-colors">
              Case Studies
            </Link>

            {currentUser ? (
              <Avatar />
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen((p) => !p)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-background/95 backdrop-blur-lg shadow-lg rounded-xl mt-2 py-4"
            >
              {isHomePage
                ? navItems.map((item) => (
                    <button
                      key={item}
                      onClick={() => scrollToSection(item.toLowerCase())}
                      className="block w-full text-left px-4 py-2 text-foreground hover:bg-accent rounded"
                    >
                      {item}
                    </button>
                  ))
                : (
                  <>
                    <Link
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-foreground hover:bg-accent rounded"
                    >
                      Home
                    </Link>
                    {["services", "about", "contact"].map((item) => (
                      <button
                        key={item}
                        onClick={() => scrollToSection(item)}
                        className="block w-full text-left px-4 py-2 text-foreground hover:bg-accent rounded capitalize"
                      >
                        {item}
                      </button>
                    ))}
                  </>
                )}

              <Link
                to="/blog"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-foreground hover:bg-accent rounded"
              >
                Blog
              </Link>

              {currentUser ? (
                <div className="px-4 pt-2">
                  <Avatar />
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-foreground hover:bg-accent rounded"
                >
                  Login
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
