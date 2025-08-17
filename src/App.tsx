import { Toaster } from 'sonner';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Testimonials } from './components/Testimonials';
import { Newsletter } from './components/Newsletter';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Blog } from './components/Blog';
import { BlogPost } from './components/BlogPost';
import { NotFoundPage } from './components/Pagenotfound';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import Settings from './components/Settings';
import Profile from './components/Profile';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
  const isForgotPasswordPage = location.pathname === '/forgot-password';
  const isSettingsPage = location.pathname === '/settings';
  const isProfilePage = location.pathname === '/profile';

  const showHeaderFooter = !isAdminRoute && !isLoginPage && !isSignupPage && !isForgotPasswordPage && !isSettingsPage && !isProfilePage;

  return (
    <>
      <Toaster position="top-center" richColors />
      {showHeaderFooter && <Header />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        {/* Admin routes can be added here */}
        {/* <Route path="/admin/*" element={<AdminRoutes />} /> */}
      </Routes>

      {showHeaderFooter && <Footer />}
    </>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <About />
      <Experience />
      <Testimonials />
      <Newsletter />
      <Contact />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
