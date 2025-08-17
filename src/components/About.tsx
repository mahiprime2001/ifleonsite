import { Users, TrendingUp, MapPin, Calendar, Brain } from 'lucide-react';

export const About = () => {
  const stats = [
    { icon: Calendar, number: '2022', label: 'Founded April 5th' },
    { icon: Users, number: '20+', label: 'Clients Served' },
    { icon: MapPin, number: 'Nellore', label: 'Based in AP' },
    { icon: TrendingUp, number: '₹75L', label: '2025 Revenue Target' }
  ];

  const milestones = [
    {
      year: '2022',
      title: 'Company Founded',
      description: 'IFLEON established by S. Mahendra Reddy in Nellore, Andhra Pradesh with ifleon.com domain'
    },
    {
      year: '2024',
      title: 'Brand Established',
      description: 'Served 2+ clients in Nellore, launched comprehensive AI and DevOps service platform'
    },
    {
      year: '2025',
      title: 'Growth Target',
      description: 'Targeting ₹7 K revenue with 15 business clients, and blog launch'
    },
    {
      year: '2026',
      title: 'Expansion Phase',
      description: 'Expanding to Hyderabad, partnering with AWS/Azure, targeting ₹1.2 lakhs revenue with 50+ clients'
    },
    {
      year: '2027',
      title: 'National Presence',
      description: 'Pan-India operations with ₹2.5 crore revenue target'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About 
              <span className="text-blue-600"> IFLEON</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              <strong>IFLEON (Infinite Logical Elements of Network)</strong> was founded on April 5, 2022, 
              in Nellore, Andhra Pradesh, by <strong>S. Mahendra Reddy</strong>, a B.Tech CSE graduate 
              and AI Generalist with expertise in DevOps and CI/CD.
            </p>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Our mission is to empower individuals and businesses with secure, scalable AI solutions, 
              DevOps automation, cloud migration, cybersecurity, and tech support. We guide clients on 
              IT and AI education and share technical insights through our blog on <strong>ifleon.com</strong> 
              with source code available on GitHub.
            </p>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              With our tagline <em>"Infinite Possibilities, Logical Solutions,"</em> we aim to become 
              India's leading consulting firm, capitalizing on Nellore\'s emerging IT ecosystem while 
              expanding nationwide.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg"
              alt="IFLEON team collaboration"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-6 rounded-xl shadow-lg">
              <div className="text-2xl font-bold">ifleon.com</div>
              <div className="text-blue-200">AI & DevOps Solutions Portal</div>
            </div>
          </div>
        </div>

        {/* Founder Section */}
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Founder</h3>
            <div className="max-w-3xl mx-auto">
              <h4 className="text-2xl font-bold text-blue-600 mb-2">S. Mahendra Reddy</h4>
              <p className="text-lg text-gray-700 mb-4">B.Tech CSE Graduate | AI Generalist | DevOps & CI/CD Expert</p>
              <p className="text-gray-600 leading-relaxed mb-6">
                With extensive experience in AI, machine learning, DevOps automation, and cloud technologies, 
                Mahendra brings a unique blend of technical expertise and business acumen to IFLEON. 
                His vision is to democratize AI and DevOps technologies for businesses across India.
              </p>
              <div className="flex justify-center space-x-4">
              
                <a
                  href="https://mahendra.ifleon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                           transition-colors flex items-center space-x-2"
                >
                  <Brain className="h-4 w-4" />
                  <span>Portfolio</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              To be India's leading consulting firm, delivering transformative AI, DevOps, and 
              IT services that drive digital success across the nation.
            </p>
          </div>
          <div className="bg-teal-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              Provide client-centric AI, DevOps, and IT solutions, guide clients on IT and AI education, 
              and share technical insights via our blog with source code on GitHub.
            </p>
          </div>
        </div>

        {/* Growth Roadmap */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Growth Roadmap</h3>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h4>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};