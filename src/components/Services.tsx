import { Brain, Cog as Cogs, Cloud, Shield, Database, Monitor, Home, GraduationCap, GitBranch, Bot } from 'lucide-react';

export const Services = () => {
  const businessServices = [
    {
      icon: Brain,
      title: 'AI Solutions & Analytics',
      description: 'Machine learning models, AI-driven analytics, automation, and intelligent data processing solutions.',
      features: ['Machine Learning Models', 'AI-Driven Analytics', 'Process Automation', 'Predictive Analytics']
    },
    {
      icon: GitBranch,
      title: 'DevOps & CI/CD',
      description: 'Complete DevOps automation, Docker containerization, Jenkins pipelines, and Git-based workflows.',
      features: ['CI/CD Pipelines', 'Docker Containerization', 'Jenkins Automation', 'Git Workflows']
    },
    {
      icon: Cloud,
      title: 'Cloud Migration & Strategy',
      description: 'Comprehensive cloud migration and optimization services across AWS EC2, S3, Lambda, and Microsoft Azure.',
      features: ['AWS Migration', 'Azure Integration', 'Lambda Functions', 'Infrastructure Design']
    },
    {
      icon: Shield,
      title: 'Cybersecurity & Compliance',
      description: 'Advanced security assessments, DPDP Act compliance, and ISO 27001 implementation for robust protection.',
      features: ['Security Audits', 'DPDP Act Compliance', 'ISO 27001 Implementation', 'Threat Detection']
    },
    {
      icon: Cogs,
      title: 'Custom Software Development',
      description: 'Tailored web and mobile applications, Odoo ERP implementation, and business process automation.',
      features: ['Web & Mobile Apps', 'Odoo ERP Setup', 'Process Automation', 'API Integration']
    },
    {
      icon: Database,
      title: 'Digital Transformation',
      description: 'AI-powered automation, data analytics with Tableau, and business process modernization.',
      features: ['AI-Powered Automation', 'Tableau Analytics', 'Legacy Modernization', 'Strategy Consulting']
    }
  ];

  const individualServices = [
    {
      icon: Monitor,
      title: 'Tech Support & Setup',
      description: 'Professional device setup, troubleshooting, and ongoing technical support for individuals and families.',
      features: ['Device Configuration', 'Software Installation', 'Troubleshooting', 'Performance Optimization']
    },
    {
      icon: Shield,
      title: 'Personal Cybersecurity',
      description: 'Comprehensive cybersecurity solutions including antivirus setup, secure Wi-Fi, and data backups.',
      features: ['Antivirus Setup', 'Secure Wi-Fi Config', 'Data Backup Solutions', 'Safe Browsing Training']
    },
    {
      icon: Home,
      title: 'Smart Home Integration',
      description: 'IoT device setup, smart home automation, and seamless integration of connected devices.',
      features: ['IoT Device Setup', 'Home Automation', 'Voice Assistant Config', 'Smart Security Systems']
    },
    {
      icon: GraduationCap,
      title: 'IT & AI Education Guidance',
      description: 'Personalized guidance on pursuing AI, DevOps, cloud, or cybersecurity training and certifications.',
      features: ['AI Learning Paths', 'DevOps Training', 'Cloud Certifications', 'Career Guidance']
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Comprehensive AI, DevOps, and IT solutions designed to drive innovation, enhance security, 
            and accelerate digital transformation for businesses and individuals.
          </p>
          <div className="bg-blue-100 rounded-lg p-4 inline-block">
            <p className="text-blue-800 font-medium">
              For detailed pricing and service information,
              
            contact{' '}
              <a href="mailto:info@ifleon.com" className="underline hover:text-blue-900">
                info@ifleon.com
              </a>
            </p>
          </div>
        </div>

        {/* Business Services */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Business Solutions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 
                         transform hover:-translate-y-2 group"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center 
                                group-hover:bg-blue-600 transition-colors duration-300">
                    <service.icon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                
                <h4 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h4>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Services */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Individual Solutions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {individualServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 
                         transform hover:-translate-y-2 group"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center 
                                group-hover:bg-teal-600 transition-colors duration-300">
                    <service.icon className="h-6 w-6 text-teal-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h4>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.description}</p>
                
                <ul className="space-y-1">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-700 text-sm">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Blog and GitHub Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Technical Insights & Source Code</h3>
          <p className="text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
            Stay updated with our latest technical insights, project updates, and access source code 
            for our implementations on GitHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/blog"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold 
                       transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <Bot className="h-5 w-5" />
              <span>Read Our Blog</span>
            </a>
            <a
              href="https://github.com/mahiprime2001"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 
                       px-6 py-3 rounded-lg font-semibold transition-colors duration-300 
                       flex items-center justify-center space-x-2"
            >
              <GitBranch className="h-5 w-5" />
              <span>View Source Code</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};