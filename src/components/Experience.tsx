import React from 'react';
import { Building, Zap, Globe, Briefcase, Users, Smartphone, Brain, GitBranch, Bot } from 'lucide-react';

export const Experience = () => {
  const projects = [
    {
      icon: Brain,
      title: 'AI-Powered Analytics Platform',
      client: 'Regional Financial Services',
      description: 'Developed machine learning models for fraud detection and customer analytics, improving detection accuracy by 40%.',
      technologies: ['Machine Learning', 'Python', 'TensorFlow', 'AWS SageMaker']
    },
    {
      icon: GitBranch,
      title: 'DevOps Automation Pipeline',
      client: 'Healthcare Technology Startup',
      description: 'Implemented complete CI/CD pipeline with Docker, Jenkins, and AWS, reducing deployment time by 75%.',
      technologies: ['Jenkins', 'Docker', 'AWS', 'Git Workflows']
    },
    {
      icon: Globe,
      title: 'Cloud Migration & Optimization',
      client: 'Manufacturing SMB',
      description: 'Migrated legacy infrastructure to AWS with cost optimization, achieving 50% reduction in operational costs.',
      technologies: ['AWS EC2', 'S3', 'Lambda', 'Cost Optimization']
    },
    {
      icon: Zap,
      title: 'Cybersecurity Implementation',
      client: 'Educational Institution',
      description: 'Implemented comprehensive cybersecurity framework with DPDP Act compliance and security audit protocols.',
      technologies: ['DPDP Compliance', 'Security Audits', 'Threat Detection', 'ISO 27001']
    },
    {
      icon: Users,
      title: 'Smart Home IoT Solutions',
      client: 'Residential Clients',
      description: 'Deployed IoT solutions and smart home automation systems for multiple households in Nellore region.',
      technologies: ['IoT Setup', 'Home Automation', 'Smart Security', 'Voice Integration']
    },
    {
      icon: Smartphone,
      title: 'Custom ERP Development',
      client: 'Local Retail Chain',
      description: 'Developed custom Odoo ERP solution with mobile app for inventory management and customer analytics.',
      technologies: ['Odoo ERP', 'Mobile Development', 'Customer Analytics', 'API Integration']
    }
  ];

  const competitiveAdvantages = [
    {
      title: 'AI & DevOps Expertise',
      description: 'Specialized knowledge in AI solutions and DevOps automation with proven track record'
    },
    {
      title: 'Memorable Domain',
      description: 'ifleon.com provides strong brand recall and professional online presence'
    },
    {
      title: 'Technical Blog & GitHub',
      description: 'Sharing insights and source code builds trust and demonstrates expertise'
    },
    {
      title: 'Local + National Vision',
      description: 'Deep understanding of Nellore market with pan-India expansion strategy'
    }
  ];

  return (
    <section id="experience" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Since 2022, we've delivered innovative AI, DevOps, and IT solutions to businesses and individuals 
            across Nellore and beyond, building a strong foundation for national expansion.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <project.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <div className="text-sm text-blue-600 font-medium mb-3">{project.client}</div>
                  <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Founder's Expertise */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white mb-16">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">Founder's Expertise</h3>
            <p className="text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
              S. Mahendra Reddy brings extensive experience in AI, DevOps, and cloud technologies, 
              with a proven track record of delivering scalable solutions for businesses.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-700 rounded-lg p-4">
                <Bot className="h-8 w-8 mx-auto mb-2" />
                <div className="text-lg font-bold">AI Generalist</div>
                <div className="text-blue-200 text-sm">Machine Learning & Analytics</div>
              </div>
              <div className="bg-blue-700 rounded-lg p-4">
                <GitBranch className="h-8 w-8 mx-auto mb-2" />
                <div className="text-lg font-bold">DevOps Expert</div>
                <div className="text-blue-200 text-sm">CI/CD & Automation</div>
              </div>
              <div className="bg-blue-700 rounded-lg p-4">
                <Globe className="h-8 w-8 mx-auto mb-2" />
                <div className="text-lg font-bold">Cloud Architect</div>
                <div className="text-blue-200 text-sm">AWS & Azure Solutions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Competitive Advantages */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Competitive Advantage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {competitiveAdvantages.map((advantage, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                <h4 className="text-lg font-bold text-gray-900 mb-3">{advantage.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Market Position */}
        <div className="bg-teal-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Market Position</h3>
          <p className="text-xl text-teal-100 mb-6 max-w-3xl mx-auto">
            Positioned to capitalize on India's growing demand for AI and DevOps solutions, 
            leveraging Nellore's emerging IT ecosystem supported by AP's IT Policy 2021-24.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-teal-700 rounded-lg p-4">
              <div className="text-2xl font-bold">50%</div>
              <div className="text-teal-200">AI & DevOps Services</div>
            </div>
            <div className="bg-teal-700 rounded-lg p-4">
              <div className="text-2xl font-bold">30%</div>
              <div className="text-teal-200">Individual Clients</div>
            </div>
            <div className="bg-teal-700 rounded-lg p-4">
              <div className="text-2xl font-bold">20%</div>
              <div className="text-teal-200">Consulting & Education</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};