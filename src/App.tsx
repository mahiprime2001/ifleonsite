import { Toaster } from "sonner";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import ScrollToTop from "./components/ScrollToTop";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Testimonials } from "./components/Testimonials";
import { Newsletter } from "./components/Newsletter";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { NotFoundPage } from "./components/Pagenotfound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import { Metrics } from "./components/Metrics";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { HowWeWork } from "./components/HowWeWork";
import { FloatingContactButton } from "./components/FloatingContactButton";
import FAQPage from "./pages/FAQPage";
import TechStackPage from "./pages/TechStackPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import { TrustStrip } from "./components/TrustStrip";
import PricingPage from "./pages/PricingPage";
import ServicesPage from "./pages/ServicesPage";
import TeamPage from "./pages/TeamPage";
import PortfolioPage from "./pages/PortfolioPage";
import { useAnalytics } from "./hooks/useAnalytics";
import { SectionCut } from "./components/animations/SectionCut";

/* ---------------- Page Transition Wrapper ---------------- */

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
    transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
    className="min-h-screen"
  >
    {children}
  </motion.div>
);

/* ---------------- Route-change scrim sweep ---------------- */
// Brief gradient sweep that paints across the screen on every route change
// to feel like a premium dashboard transition.
const RouteScrim = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="fixed inset-0 z-[120] pointer-events-none"
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={{ scaleX: 1, transformOrigin: "left" }}
        exit={{ scaleX: 0, transformOrigin: "right" }}
        transition={{ duration: 0.55, ease: [0.7, 0, 0.3, 1] }}
        style={{
          background:
            "linear-gradient(90deg, rgba(15,23,42,0) 0%, rgba(52,211,153,0.18) 35%, rgba(96,165,250,0.18) 65%, rgba(15,23,42,0) 100%)",
          mixBlendMode: "screen",
        }}
      />
    </AnimatePresence>
  );
};

/* ---------------- App Content ---------------- */

function AppContent() {
  const location = useLocation();
  useAnalytics ();

  // Dev-only Easter egg
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

  return (
    <>
      <Toaster position="top-center" richColors />
      {showHeaderFooter && <Header />}

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
            path="/*"
            element={
              <PageTransition>
                <NotFoundPage />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>

      {showHeaderFooter && <FloatingContactButton />}
      {showHeaderFooter && <Footer />}
      <RouteScrim />
    </>
  );
}

/* ---------------- Home Page ---------------- */

function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <SectionCut variant="blade" accent="emerald" label="What We Do" />
      <Services />
      <SectionCut variant="diagonal" accent="blue" label="By the Numbers" />
      <Metrics />
      <About />
      <SectionCut variant="blade" accent="purple" label="Experience" />
      <Experience />
      <WhyChooseUs />
      <SectionCut variant="flip" accent="emerald" label="Our Process" />
      <HowWeWork />
      <SectionCut variant="iris" accent="teal" label="Voices" />
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
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
