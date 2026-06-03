import { Toaster } from "sonner";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

import { AuroraBackground } from "./components/AuroraBackground";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { SmoothScrollProvider, useRouteScroll } from "./components/motion/SmoothScroll";
import Cursor from "./components/motion/Cursor";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Testimonials } from "./components/Testimonials";
import { Newsletter } from "./components/Newsletter";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { NotFoundPage } from "./components/Pagenotfound";
import { Metrics } from "./components/Metrics";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { HowWeWork } from "./components/HowWeWork";
import { FloatingContactButton } from "./components/FloatingContactButton";
import { TrustStrip } from "./components/TrustStrip";
import { useAnalytics } from "./hooks/useAnalytics";
import { useDocumentMeta } from "./hooks/useDocumentMeta";
import { SectionCut } from "./components/animations/SectionCut";
import { ErrorBoundary } from "./components/ErrorBoundary";

/* ---------------- Lazy-loaded pages (code splitting) ---------------- */
const Blog           = lazy(() => import("./pages/Blog").then(m => ({ default: m.Blog })));
const BlogPost       = lazy(() => import("./pages/BlogPost").then(m => ({ default: m.BlogPost })));
const Login          = lazy(() => import("./pages/Login"));
const Signup         = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Settings       = lazy(() => import("./components/Settings"));
const Profile        = lazy(() => import("./components/Profile"));
const FAQPage        = lazy(() => import("./pages/FAQPage"));
const TechStackPage  = lazy(() => import("./pages/TechStackPage"));
const CaseStudiesPage = lazy(() => import("./pages/CaseStudiesPage"));
const PricingPage    = lazy(() => import("./pages/PricingPage"));
const ServicesPage   = lazy(() => import("./pages/ServicesPage"));
const TeamPage       = lazy(() => import("./pages/TeamPage"));
const PortfolioPage   = lazy(() => import("./pages/PortfolioPage"));
const PrivacyPolicy   = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService  = lazy(() => import("./pages/TermsOfService"));

/* Theme-version homepages (V2+) are loaded on demand from the lazy registry. */

/* ---------------- Page Transition Wrapper ---------------- */

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const reduce = useReducedMotion();

  // Reduced motion: no fade/blur, render content instantly.
  if (reduce) return <div className="min-h-screen">{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      // Hold briefly so the new page reveals just as the curtain wipes away.
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
      transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1], delay: 0.12 }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
};

/* ---------------- Route-change curtain wipe ---------------- */
/**
 * Full-screen brand-gradient curtain that wipes ACROSS the viewport on every
 * route change. Driven by clip-path so it never repaints layout: the panel
 * enters from the right (covering the screen), then exits to the left
 * (uncovering the freshly-mounted page). Keyed on location.pathname inside an
 * AnimatePresence mode="wait" so each navigation fires exactly one sweep.
 *
 * It is pointer-events-none and sits at a very high z-index, so it can paint
 * over the page without ever intercepting clicks.
 */
const RouteCurtain = () => {
  const location = useLocation();
  const reduce = useReducedMotion();
  const firstRender = useRef(true);
  const [show, setShow] = useState(false);

  // Only sweep on actual navigations — never cover the very first load.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setShow(true);
    const t = setTimeout(() => setShow(false), 750);
    return () => clearTimeout(t);
  }, [location.pathname]);

  // Reduced-motion (or between navigations) renders nothing.
  if (reduce || !show) return null;

  return (
    <motion.div
      key={location.pathname}
      className="bg-brand-gradient fixed inset-0 z-[200] pointer-events-none"
      // Starts covering, then wipes AWAY to the right to reveal the new page.
      initial={{ clipPath: "inset(0 0 0 0)" }}
      animate={{ clipPath: "inset(0 0 0 100%)" }}
      transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
    >
      {/* Subtle sheen so the flat gradient reads as a moving panel of light. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, transparent 30%, hsl(0 0% 100% / 0.18) 50%, transparent 70%)",
        }}
      />
    </motion.div>
  );
};

/* ---------------- App Content ---------------- */

function AppContent() {
  const location = useLocation();
  useAnalytics();

  useEffect(() => {
    console.log(
      "%cBuilt with care by IFLEON 🚀",
      "color:#2563eb;font-size:14px;font-weight:bold;"
    );
  }, []);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";
  const isForgotPasswordPage = location.pathname === "/forgot-password";
  const isSettingsPage = location.pathname === "/settings";
  const isProfilePage = location.pathname === "/profile";

  const showHeaderFooter =
    !isAdminRoute &&
    !isLoginPage &&
    !isSignupPage &&
    !isForgotPasswordPage &&
    !isSettingsPage &&
    !isProfilePage;

  // Smooth scroll on marketing routes; native scroll in the app/console.
  useRouteScroll(location.pathname, showHeaderFooter);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Cursor />
      <AuroraBackground />
      <Toaster position="top-center" richColors />
      {showHeaderFooter && <Header />}

      <main id="main">
      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              }
            />

            <Route
              path="/blog"
              element={
                <PageTransition>
                  <Blog />
                </PageTransition>
              }
            />

            <Route
              path="/pricing"
              element={
                <PageTransition>
                  <PricingPage />
                </PageTransition>
              }
            />

            <Route
              path="/case-studies"
              element={
                <PageTransition>
                  <CaseStudiesPage />
                </PageTransition>
              }
            />

            <Route
              path="/blog/:slug"
              element={
                <PageTransition>
                  <BlogPost />
                </PageTransition>
              }
            />

            <Route
              path="/login"
              element={
                <PageTransition>
                  <Login />
                </PageTransition>
              }
            />

            <Route
              path="/signup"
              element={
                <PageTransition>
                  <Signup />
                </PageTransition>
              }
            />

            <Route
              path="/forgot-password"
              element={
                <PageTransition>
                  <ForgotPassword />
                </PageTransition>
              }
            />

            <Route
              path="/settings"
              element={
                <PageTransition>
                  <Settings />
                </PageTransition>
              }
            />

            <Route
              path="/profile"
              element={
                <PageTransition>
                  <Profile />
                </PageTransition>
              }
            />

            <Route
              path="/faq"
              element={
                <PageTransition>
                  <FAQPage />
                </PageTransition>
              }
            />

            <Route
              path="/tech-stack"
              element={
                <PageTransition>
                  <TechStackPage />
                </PageTransition>
              }
            />

            <Route
              path="/services"
              element={
                <PageTransition>
                  <ServicesPage />
                </PageTransition>
              }
            />

            <Route
              path="/team"
              element={
                <PageTransition>
                  <TeamPage />
                </PageTransition>
              }
            />

            <Route
              path="/portfolio"
              element={
                <PageTransition>
                  <PortfolioPage />
                </PageTransition>
              }
            />

            <Route
              path="/privacy"
              element={
                <PageTransition>
                  <PrivacyPolicy />
                </PageTransition>
              }
            />

            <Route
              path="/terms"
              element={
                <PageTransition>
                  <TermsOfService />
                </PageTransition>
              }
            />

            <Route
              path="/*"
              element={
                <PageTransition>
                  <NotFoundPage />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
      </main>

      {showHeaderFooter && <Footer />}
      {showHeaderFooter && <FloatingContactButton />}
      <RouteCurtain />
    </>
  );
}

/* ---------------- Home Page ---------------- */

function HomePage() {
  useDocumentMeta({
    title: "IFLEON — AI, DevOps & IT Consulting | Nellore, India",
    description: "IFLEON delivers practical AI, DevOps automation, cloud engineering, and cybersecurity solutions for businesses and individuals across India. Get started today.",
    canonical: "https://ifleon.com/",
  });
  return (
    <>
      <Hero />
      <TrustStrip />
      <SectionCut variant="blade" accent="indigo" label="What We Do" />
      <Services />
      <SectionCut variant="diagonal" accent="blue" label="By the Numbers" />
      <Metrics />
      <About />
      <SectionCut variant="blade" accent="purple" label="Experience" />
      <Experience />
      <WhyChooseUs />
      <SectionCut variant="flip" accent="indigo" label="Our Process" />
      <HowWeWork />
      <SectionCut variant="iris" accent="violet" label="Voices" />
      <Testimonials />
      <Newsletter />
      <SectionCut variant="diagonal" accent="orange" label="Let's Talk" />
      <Contact />
    </>
  );
}

/* ---------------- App Root ---------------- */

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <SmoothScrollProvider>
            <AppContent />
          </SmoothScrollProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
