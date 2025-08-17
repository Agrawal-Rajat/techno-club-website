'use client';

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-900">
      <div className="container mx-auto py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                TechnoClubs
              </h2>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Empowering students through technology and innovation at Medicaps University. Join our community of tech enthusiasts and innovators.
            </p>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/techno-clubs-medicaps/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white hover:scale-110 transform transition-all duration-300 shadow-lg hover:shadow-pink-500/25"
                aria-label="Follow us on Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>

              <a
                href="https://linkedin.com/company/technoclubs-medicaps"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white hover:scale-110 transform transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                aria-label="Connect with us on LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>


            </div>
          </div>  

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Home', path: '/' },
                  // { name: 'About Us', path: '/about' },
                  { name: 'Clubs', path: '/clubs' },
                  { name: 'Events', path: '/events' },
                  // { name: 'Team', path: '/team' },
                  // { name: 'Contact', path: '/contact' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className="text-gray-400 hover:text-white transition-colors flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-2 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>



            {/* Contact Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 relative">
                Contact Us
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-indigo-500 flex-shrink-0 mt-1 group-hover:text-purple-400 transition-colors duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="group-hover:text-white transition-colors duration-300 leading-relaxed">
                    Medicaps University<br />
                    AB Road, Pigdamber, Rau<br />
                    Indore, MP 453331, India
                  </span>
                </li>

                <li className="flex items-start group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-indigo-500 flex-shrink-0 group-hover:text-purple-400 transition-colors duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a
                    href="mailto:contact@technoclubs.medicaps.ac.in"
                    className="group-hover:text-white hover:text-indigo-400 transition-colors duration-300"
                  >
                    contact@technoclubs.medicaps.ac.in
                  </a>
                </li>

                <li className="flex items-start group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-indigo-500 flex-shrink-0 group-hover:text-purple-400 transition-colors duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a
                    href="tel:+917314259500"
                    className="group-hover:text-white hover:text-indigo-400 transition-colors duration-300"
                  >
                    +91 731 4259500
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-16 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} TechnoClubs, Medicaps University. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm text-gray-500">
                <Link
                  href="/privacy-policy"
                  className="hover:text-indigo-400 transition-colors duration-300 relative group"
                >
                  Privacy Policy
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  href="/terms-of-service"
                  className="hover:text-indigo-400 transition-colors duration-300 relative group"
                >
                  Terms of Service
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  href="/cookie-policy"
                  className="hover:text-indigo-400 transition-colors duration-300 relative group"
                >
                  Cookie Policy
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </div>
            </div>

            {/* Additional Brand Message */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                🚀 Innovating tomorrow, building today
              </p>
            </div>
          </div>
        </div>
    </footer>
  );
};

export default Footer;