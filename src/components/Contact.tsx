import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';

interface ContactFormResponse {
  status: string;
  message: string;
  invalid_fields?: { message: string }[];
}

export const Contact = () => {
  const [formData, setFormData] = useState({
    'your-name': '',
    'your-email': '',
    'your-company': '',
    'your-service': '',
    'your-message': ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Build FormData for CF7 API
      const cf7FormData = new FormData();
      cf7FormData.append('your-name', formData['your-name'] || '');
      cf7FormData.append('your-email', formData['your-email'] || '');
      cf7FormData.append('your-company', formData['your-company'] || '');
      cf7FormData.append('your-service', formData['your-service'] || '');
      cf7FormData.append('your-message', formData['your-message'] || '');

      // Required hidden CF7 fields
      cf7FormData.append('_wpcf7', '84');
      cf7FormData.append('_wpcf7_version', '5.8.7');
      cf7FormData.append('_wpcf7_locale', 'en_US');
      cf7FormData.append('_wpcf7_unit_tag', 'wpcf7-f84-p0-o1');
      cf7FormData.append('_wpcf7_container_post', '0');

      const response = await fetch(
        'https://ifleon.com/wp-json/contact-form-7/v1/contact-forms/84/feedback',
        {
          method: 'POST',
          body: cf7FormData,
        }
      );

      const result: ContactFormResponse = await response.json();

      if (result.status === 'mail_sent') {
        setIsSubmitted(true);
        setFormData({
          'your-name': '',
          'your-email': '',
          'your-company': '',
          'your-service': '',
          'your-message': ''
        });
        setTimeout(() => setIsSubmitted(false), 3000);
      } else if (result.invalid_fields && result.invalid_fields.length > 0) {
        const fieldErrors = result.invalid_fields.map(f => f.message).join(', ');
        setError(`Validation error: ${fieldErrors}`);
      } else {
        setError(result.message || 'Form submission failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Contact form error:', err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Let's Transform Your Business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to implement AI solutions, DevOps automation, or cloud migration? Contact IFLEON for a free consultation 
            and discover how we can help you achieve your digital transformation goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Info Panel */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Email</div>
                  <a href="mailto:info@ifleon.com" className="text-gray-600 hover:text-blue-600">
                    info@ifleon.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Location</div>
                  <div className="text-gray-600">Nellore, Andhra Pradesh, India</div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">Free Consultation</h4>
              <p className="text-gray-600 mb-4">
                Schedule a complimentary consultation to discuss your AI, DevOps, or cloud technology challenges 
                and explore how IFLEON can accelerate your digital transformation.
              </p>
            </div>

            <div className="mt-8 p-6 bg-teal-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">Technical Resources</h4>
              <p className="text-gray-600">
                Check out our technical blog for insights on AI, DevOps, and cloud technologies. 
                All source code is available on{' '}
                <a href="https://github.com/mahiprime2001" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 underline">
                  GitHub
                </a>{' '}
                and detailed service information is on{' '}
                <a href="https://ifleon.com" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 underline">
                  ifleon.com
                </a>
              </p>
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600">
                  Your message has been sent successfully. We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="your-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="your-name"
                      name="your-name"
                      required
                      value={formData['your-name']}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                               focus:ring-blue-600 focus:border-transparent transition-colors"
                      placeholder="Your Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="your-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="your-email"
                      name="your-email"
                      required
                      value={formData['your-email']}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                               focus:ring-blue-600 focus:border-transparent transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="your-company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company/Organization
                    </label>
                    <input
                      type="text"
                      id="your-company"
                      name="your-company"
                      value={formData['your-company']}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                               focus:ring-blue-600 focus:border-transparent transition-colors"
                      placeholder="Your Company"
                    />
                  </div>

                  <div>
                    <label htmlFor="your-service" className="block text-sm font-medium text-gray-700 mb-2">
                      Service Interest
                    </label>
                    <select
                      id="your-service"
                      name="your-service"
                      value={formData['your-service']}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                               focus:ring-blue-600 focus:border-transparent transition-colors"
                    >
                      <option value="">Select a service</option>
                      <option value="AI Solutions">AI Solutions</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Cloud Migration">Cloud Migration</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="your-message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="your-message"
                    name="your-message"
                    required
                    rows={5}
                    value={formData['your-message']}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                             focus:ring-blue-600 focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us about your project, AI/DevOps challenges, or technology needs..."
                  />
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 
                           rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Send Message</span>
                  <Send className="h-5 w-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
