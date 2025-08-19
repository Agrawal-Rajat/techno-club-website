'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type Club = {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  members: number;
  achievements: string[];
  linkedinUrl: string;
  instagramUrl: string;
};
// Linkdin 
// Acm 
// https://www.linkedin.com/company/acm-student-chapter-medicaps/

// AWS
// https://www.linkedin.com/company/aws-next/

// Gdg
// https://www.linkedin.com/company/gdscmu/

// Ieee
// Nhi mil Raha 

// Stic
// https://www.linkedin.com/company/sticmedicapsuniversity/

// Instagram 
// Acm 
// https://www.instagram.com/medicaps_acm?igsh=dDJlNXAxeWZmdmEw

// AWS
// https://www.instagram.com/medicaps_awsc?igsh=MXc5cG9oaWIyMWd1aA==

// Stic
// https://www.instagram.com/medicaps_stic?igsh=d2oxYTR3bDdtaGV3

// Ieee
// https://www.instagram.com/medicaps_ieee?igsh=d3JiOTN3d3g0NXJ0

// Gdg
// https://www.instagram.com/gdg_medicaps?igsh=YXhtM2d1MXB4Nmlv
const clubs: Club[] = [
  {
    id: 'ieee',
    name: 'IEEE Student Branch',
    description: 'Official IEEE student chapter dedicated to advancing technology for humanity. Connects students with global IEEE network and resources.',
    color: 'from-blue-700 to-blue-500',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    members: 200,
    achievements: ['Hosted IEEE regional conference', 'Published papers in IEEE journals', 'Conducted technical symposium with 500+ attendees'],
    linkedinUrl: 'https://www.linkedin.com/company/mu-ieee/',
    instagramUrl: 'https://www.instagram.com/medicaps_ieee?igsh=d3JiOTN3d3g0NXJ0'
  },
  {
    id: 'acm',
    name: 'ACM Student Chapter',
    description: 'Association for Computing Machinery student branch focusing on advancing computing as a science and profession. Regular coding competitions and technical talks.',
    color: 'from-cyan-600 to-cyan-400',
    icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
    members: 180,
    achievements: ['ACM INDIA Regional Coordinators '],
    linkedinUrl: 'https://www.linkedin.com/company/acm-student-chapter-medicaps/',
    instagramUrl: 'https://www.instagram.com/medicaps_acm?igsh=dDJlNXAxeWZmdmEw'
  },
  {
    id: 'aws',
    name: 'AWS Cloud Club',
    description: 'Learn about cloud computing with Amazon Web Services. Focus on cloud architecture, serverless computing, and AWS certifications.',
    color: 'from-orange-600 to-orange-400',
    icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    members: 120,
    achievements: ['Organized 2 Pan-India Placement Drills with participation from 70+ universities',
      'Educated 1000+ students on AWS through impactful sessions & workshops',
      'Recognized among the Top 5 AWS Cloud Clubs in India  by AWS Educate'],
    linkedinUrl: 'https://www.linkedin.com/company/aws-next/',
    instagramUrl: 'https://www.instagram.com/medicaps_awsc?igsh=MXc5cG9oaWIyMWd1aA='
  },

  {
    id: 'gdg',
    name: 'Google Developer Group',
    description: 'Community of developers interested in Google technologies. Regular tech talks, coding sessions, and Google technology workshops.',
    color: 'from-red-500 to-yellow-500',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    members: 230,
    achievements: ['Hosted DevFest with 300+ attendees', 'Google I/O Extended organizer', 'Community recognition by Google Developers program'],
    linkedinUrl: 'https://www.linkedin.com/company/gdscmu/',
    instagramUrl: 'https://www.instagram.com/gdg_medicaps?igsh=YXhtM2d1MXB4Nmlv'
  },
  {
    id: 'stic',
    name: 'Students Technical and  Innovation Club',
    description: 'Science and Technology Innovation Cell promoting research and innovation. Interdisciplinary projects addressing real-world challenges.',
    color: 'from-emerald-600 to-emerald-400',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    members: 165,
    achievements: ['Organizing base builder for 5 years',
      'Partnered with 47Billion in donation drives'],
    linkedinUrl: 'https://www.linkedin.com/company/sticmedicapsuniversity/',
    instagramUrl: 'https://www.instagram.com/medicaps_stic?igsh=d2oxYTR3bDdtaGV3'
  }
];

const ClubsSection: React.FC = () => {
  const [activeClub, setActiveClub] = useState<Club>(clubs[0]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="clubs" ref={sectionRef} className="py-20 bg-gradient-to-b from-black to-gray-950">
      <div className="container mx-auto px-6">
        <div className={`mb-16 text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-block mb-4 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-lg px-3 py-1 border border-purple-500/30">
            <p className="text-sm font-medium text-white">Discover Our Clubs</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Tech Communities at <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">Medicaps</span></h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Our Techno clubs work with the intention of conducting various seminars, events, and workshops in different technical domains.
            The main aim of all the clubs is to increase the technical potential of the students of the University.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Club list/sidebar */}
          <div className={`bg-gray-900/60 backdrop-blur-sm p-5 rounded-xl border border-gray-800 h-fit lg:sticky lg:top-24 transition-all duration-1000 delay-100 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <h3 className="text-white text-xl font-bold mb-4">Our Clubs</h3>
            <div className="flex flex-col space-y-1">
              {clubs.map((club) => (
                <button
                  key={club.id}
                  onClick={() => setActiveClub(club)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all text-left ${activeClub.id === club.id
                    ? `bg-gradient-to-r ${club.color} text-white font-medium`
                    : 'text-gray-300 hover:bg-gray-800'
                    }`}
                >
                  <div className={`w-8 h-8 mr-3 rounded-full flex items-center justify-center ${activeClub.id !== club.id ? `bg-gradient-to-r ${club.color} bg-opacity-20` : 'bg-white'
                    }`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ${activeClub.id === club.id ? 'text-white' : 'text-white'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={club.icon} />
                    </svg>
                  </div>
                  <span>{club.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Club details */}
          <div className={`col-span-1 lg:col-span-2 transition-all duration-1000 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative">
              {/* Background decoration */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${activeClub.color} blur-xl opacity-20 rounded-xl transition-all duration-500`}></div>

              <div className="relative bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 md:p-8 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-r ${activeClub.color}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={activeClub.icon} />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-3xl font-bold text-white">{activeClub.name}</h2>
                      <p className="text-gray-400">
                        <span className="font-medium text-gray-300">{activeClub.members}+</span> active members
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/clubs/${activeClub.id}`}
                    className={`inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r ${activeClub.color} text-white font-medium hover:shadow-lg transition-all cursor-pointer relative z-10`}
                    onClick={() => console.log('Join Club clicked for:', activeClub.name)}
                  >
                    Join Club
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>

                <div className="mt-6 mb-8">
                  <h3 className="text-lg font-medium text-white mb-3">About the Club</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {activeClub.description}
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-white mb-3">Key Achievements</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeClub.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <div className={`p-1 bg-gradient-to-r ${activeClub.color} rounded-full mt-1 mr-3`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-300">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-800 flex justify-between items-center">
                  <div className="text-gray-400 text-sm">
                    Want to know more? <Link href={`/clubs/${activeClub.id}`} className={`font-medium bg-gradient-to-r ${activeClub.color} bg-clip-text text-transparent`}>View detailed information</Link>
                  </div>
                  <div className="flex space-x-1">
                    <Link href={activeClub.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </Link>
                    <Link href={activeClub.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </Link>
               
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default ClubsSection;



