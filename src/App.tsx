import { Toaster } from "sonner";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense, useEffect } from "react";

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
import { Metrics } from "./components/Metrics";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { HowWeWork } from "./components/HowWeWork";
import { TrustStrip } from "./components/TrustStrip";
import { useAnalytics } from "./hooks/useAnalytics";
import { SectionCut } from "./components/animations/SectionCut";
/* Inner pages load only when visited, so the home page doesn't hold every page in memory. */
const Blog = lazy(() => import("./pages/Blog").then((m) => ({ default: m.Blog })));
const BlogPost = lazy(() => import("./pages/BlogPost").then((m) => ({ default: m.BlogPost })));
const NotFoundPage = lazy(() =>
  import("./components/Pagenotfound").then((m) => ({ default: m.NotFoundPage }))
);
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Settings = lazy(() => import("./components/Settings"));
const Profile = lazy(() => import("./components/Profile"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const TechStackPage = lazy(() => import("./pages/TechStackPage"));
const CaseStudiesPage = lazy(() => import("./pages/CaseStudiesPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));

/* ---------------- Page Transition Wrapper ---------------- */

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
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

      <Suspense fallback={<div className="min-h-screen" />}>
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
      </Suspense>

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
      {/* Sections below the first screen are skipped by the browser until they scroll near the viewport. */}
      <div className="cv-auto">
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
      </div>
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
