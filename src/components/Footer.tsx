import { Network, Mail, MapPin, Calendar} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Network className="h-8 w-8 text-primary" />
              <div>
                <span className="text-2xl font-bold text-foreground">IFLEON</span>
                <div className="text-sm text-muted-foreground">Infinite Logical Elements of Network</div>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Empowering businesses and individuals across India with innovative AI solutions, 
              DevOps automation, cloud migration, and digital transformation services since 2022.
            </p>
            <div className="flex items-center space-x-2 text-muted-foreground text-sm mb-4">
              <Calendar className="h-4 w-4" />
              <span>Founded April 5, 2022 by S. Mahendra Reddy</span>
            </div>
            
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Business Services</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">AI Solutions & Analytics</li>
              <li className="hover:text-primary cursor-pointer transition-colors">DevOps & CI/CD Automation</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Cloud Migration & Strategy</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Cybersecurity & Compliance</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Custom Software Development</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Digital Transformation</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Individual Services</h3>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="hover:text-primary cursor-pointer transition-colors">Tech Support & Setup</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Personal Cybersecurity</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Smart Home Integration</li>
              <li className="hover:text-primary cursor-pointer transition-colors">IT & AI Education Guidance</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li>
                <Link to="/blog" className="hover:text-primary transition-colors">
                  Technical Blog
                </Link>
              </li>
              <li>
              </li>
            </ul>
            
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact Info</h3>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@ifleon.com" className="hover:text-primary transition-colors">
                  info@ifleon.com
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span className="text-sm">Nellore, Andhra Pradesh<br />India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-muted-foreground text-sm">
                © 2024 IFLEON (Infinite Logical Elements of Network). All rights reserved.
              </p>
              <p className="text-muted-foreground/80 text-xs mt-1">
                Founded by S. Mahendra Reddy • AI Generalist & DevOps Expert • Targeting ₹75 Lakh Revenue in 2027
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/blog"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Technical Blog
              </Link>
              <a
                href="https://ifleon.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Service Portal
              </a>
              <button
                onClick={scrollToTop}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 
                         rounded-lg text-sm transition-colors duration-300"
              >
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
