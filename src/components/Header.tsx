import React, { useState, useEffect } from 'react';
import { Menu, X, Network } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Avatar from './Avatar';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<Record<string, unknown> | null>(
    null
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const isHomePage = location.pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || !isHomePage ? 'bg-background/80 backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <Network className="h-8 w-8 text-primary transition-colors" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground transition-colors">
                IFLEON
              </span>
              <span className="text-xs text-muted-foreground transition-colors">
                Infinite Logical Elements of Network
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {isHomePage ? (
              <>
                {['Services', 'About', 'Experience', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="transition-colors hover:text-primary text-foreground"
                  >
                    {item}
                  </button>
                ))}
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="transition-colors hover:text-primary text-foreground"
                >
                  Home
                </Link>
                <button
                  onClick={() => scrollToSection('services')}
                  className="transition-colors hover:text-primary text-foreground"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="transition-colors hover:text-primary text-foreground"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="transition-colors hover:text-primary text-foreground"
                >
                  Contact
                </button>
              </>
            )}
            <Link
              to="/blog"
              className="transition-colors hover:text-primary text-foreground"
            >
              Blog
            </Link>
            {currentUser ? (
              <Avatar />
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-300"
              >
                Login
              </Link>
            )}
          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-background/80 backdrop-blur-sm shadow-lg rounded-lg mt-2 py-4">
            {isHomePage ? (
              <>
                {['Services', 'About', 'Experience', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="block w-full text-left px-4 py-2 text-foreground hover:bg-accent"
                  >
                    {item}
                  </button>
                ))}
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="block w-full text-left px-4 py-2 text-foreground hover:bg-accent"
                >
                  Home
                </Link>
                <button
                  onClick={() => scrollToSection('services')}
                  className="block w-full text-left px-4 py-2 text-foreground hover:bg-accent"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="block w-full text-left px-4 py-2 text-foreground hover:bg-accent"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="block w-full text-left px-4 py-2 text-foreground hover:bg-accent"
                >
                  Contact
                </button>
              </>
            )}
            <Link
              to="/blog"
              className="block w-full text-left px-4 py-2 text-foreground hover:bg-accent"
            >
              Blog
            </Link>
            {currentUser ? (
              <div className="px-4 py-2">
                <Avatar />
              </div>
            ) : (
              <Link
                to="/login"
                className="block w-full text-left px-4 py-2 text-foreground hover:bg-accent"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
