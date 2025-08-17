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
};

const clubs: Club[] = [
  {
    id: 'ieee',
    name: 'IEEE Student Branch',
    description: 'Official IEEE student chapter dedicated to advancing technology for humanity. Connects students with global IEEE network and resources.',
    color: 'from-blue-700 to-blue-500',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    members: 200,
    achievements: ['Hosted IEEE regional conference', 'Published papers in IEEE journals', 'Conducted technical symposium with 500+ attendees']
  },
  {
    id: 'acm',
    name: 'ACM Student Chapter',
    description: 'Association for Computing Machinery student branch focusing on advancing computing as a science and profession. Regular coding competitions and technical talks.',
    color: 'from-cyan-600 to-cyan-400',
    icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
    members: 180,
    achievements: ['ACM-ICPC regional finalists', 'Distinguished School of Computing award', 'Organized 15+ technical workshops annually']
  },
  {
    id: 'aws',
    name: 'AWS Student Club',
    description: 'Learn about cloud computing with Amazon Web Services. Focus on cloud architecture, serverless computing, and AWS certifications.',
    color: 'from-orange-600 to-orange-400',
    icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    members: 120,
    achievements: ['Organized AWS Community Day', '25+ students achieved AWS certifications', 'Developed serverless applications for local businesses']
  },
  {
    id: 'gdg',
    name: 'Google Developer Group',
    description: 'Community of developers interested in Google technologies. Regular tech talks, coding sessions, and Google technology workshops.',
    color: 'from-red-500 to-yellow-500',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    members: 230,
    achievements: ['Hosted DevFest with 300+ attendees', 'Google I/O Extended organizer', 'Community recognition by Google Developers program']
  },
  {
    id: 'stic',
    name: 'STIC Innovation Club',
    description: 'Science and Technology Innovation Cell promoting research and innovation. Interdisciplinary projects addressing real-world challenges.',
    color: 'from-emerald-600 to-emerald-400',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    members: 165,
    achievements: ['Smart India Hackathon winners', 'Patent filed for innovative solution', 'Research grants from government organizations']
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
                  className={`flex items-center px-4 py-3 rounded-lg transition-all text-left ${
                    activeClub.id === club.id 
                      ? `bg-gradient-to-r ${club.color} text-white font-medium` 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <div className={`w-8 h-8 mr-3 rounded-full flex items-center justify-center ${
                    activeClub.id !== club.id ? `bg-gradient-to-r ${club.color} bg-opacity-20` : 'bg-white'
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
                    <Link href={`#`} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </Link>
                    <Link href={`#`} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                    </Link>
                    <Link href={`#`} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 11v2.4h3.97c-.16 1.03-1.2 3.02-3.97 3.02-2.39 0-4.34-1.98-4.34-4.42S4.61 7.58 7 7.58c1.36 0 2.27.58 2.79 1.08l1.9-1.83C10.47 5.69 8.89 5 7 5c-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.72-2.84 6.72-6.84 0-.46-.05-.81-.11-1.16H7z" fillRule="evenodd" clipRule="evenodd" />
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