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
import { StickyCTA } from "./components/StickyCTA";
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
import ProcessPage from "./pages/ProcessPage";
import { useAnalytics } from "./hooks/useAnalytics";

/* ---------------- Page Transition Wrapper ---------------- */

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    className="min-h-screen"
  >
    {children}
  </motion.div>
);

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
            path="/process"
            element={
              <PageTransition>
                <ProcessPage />
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
    </>
  );
}

/* ---------------- Home Page ---------------- */

function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Services />
      <Metrics />
      <About />
      <Experience />
      <WhyChooseUs />
      <HowWeWork />
      <Testimonials />
      <Newsletter />
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
