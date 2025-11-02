'use client';

import React, { useState, useRef, useEffect } from 'react';

type TeamMember = {
  id: string;
  name: string;
  position: string;
  department: string;
  bio: string;
  image?: string;
  social?: {
    linkedin?: string;
  };
  color: string;
};

const teamMembers: TeamMember[] = [
  {
    id: 'somil-nema',
    name: 'Somil Nema',
    position: 'President',
    department: 'Computer Science',
    bio: "Leading the overarching vision and strategic initiatives for all chapters under the Techno Clubs umbrella.",
    image: 'Somil nema ,Techno clubs , President,8770577994.jpg', // Placeholder
    social: {
      linkedin: 'https://www.linkedin.com/in/somil-nema-16464b1a5/', // Placeholder
    },
    color: 'from-blue-600 to-blue-400',
  },
  {
    id: 'akshat-agrawal',
    name: 'Akshat Agrawal',
    position: 'Vice President',
    department: 'Computer Science',
    bio: 'Coordinates inter-chapter activities, ensures smooth operations, and supports the club president.',
    image: 'Akshat Agrawal, Techno Club, Vice President.jpg', // Placeholder
    social: {
      linkedin: 'https://www.linkedin.com/in/akshat-agrawal-3b559224a/', // Placeholder
    },
    color: 'from-purple-600 to-purple-400',
  },
  {
    id: 'anekant-jain',
    name: 'Anekant Jain',
    position: 'Vice President',
    department: 'Computer Science',
    bio: 'Coordinates inter-chapter activities, ensures smooth operations, and supports the club president.',
    image: 'AnekantJain.jpg', // Placeholder
    social: {
      linkedin: 'https://www.linkedin.com/in/anekantjain01/', // Placeholder
    },
    color: 'from-indigo-600 to-indigo-400',
  },
  {
    id: 'sourabh-mourya',
    name: 'Sourabh Mourya',
    position: 'Technical head', // Position from document
    department: 'Computer Science',
    bio: 'Oversees the technical development, infrastructure, and execution of all coding projects and hackathons.',
    image: 'sourabh mourya.jpg', // Placeholder
    social: {
      linkedin: 'https://www.linkedin.com/in/sourabhmourya/', // Placeholder
    },
    color: 'from-green-600 to-green-400',
  },
  {
    id: 'kalyani-soni',
    name: 'Kalyani Soni',
    position: 'Content and ideation head', // Position from document
    department: 'Computer Science',
    bio: "Manages content creation, marketing strategy, and ideation for major club initiatives.",
    image: 'kalyani.jpg', // Placeholder
    social: {
      linkedin: 'https://www.linkedin.com/in/kalyani-soni-a4063725a/', // Placeholder
    },
    color: 'from-pink-600 to-pink-400',
  },
  {
    id: 'devank-dubey',
    name: 'Devank Dubey',
    position: 'Design and Graphics head', // Position from document
    department: 'Computer Science',
    bio: 'Responsible for all graphic design, branding, and visual content across the Techno Clubs.',
    image: 'devank.jpg', // Placeholder
    social: {
      linkedin: 'https://www.linkedin.com/in/devank-dubey-423824283/', // Placeholder
    },
    color: 'from-yellow-600 to-yellow-400',
  },

];

const TeamSection: React.FC = () => {
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

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      id="team"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-gray-950 to-black"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div
          className={`mb-16 text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
        >
          <div className="inline-block mb-4 bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-lg px-3 py-1 border border-green-500/30">
            <p className="text-sm font-medium text-white">Meet Our Team</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            The{' '}
            <span className="bg-gradient-to-r from-green-400 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
              Minds
            </span>{' '}
            Behind TechnoClubs
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Our dedicated team of student leaders works tirelessly to create
            opportunities for technical growth and foster a collaborative
            learning environment at Medicaps University.
          </p>
        </div>

        {/* Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className={`bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 shadow-xl transition-all duration-500 hover:-translate-y-1 group relative delay-${index * 100 + 200
                } transform ${isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
                } cursor-pointer`}
              onClick={() => {
                if (member.social?.linkedin) {
                  window.open(
                    member.social.linkedin,
                    '_blank',
                    'noopener,noreferrer'
                  );
                }
              }}
            >
              {/* Background glow effect */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${member.color} rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
              ></div>

              <div className="relative p-6">
                <div className="flex items-center mb-4">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-14 w-14 rounded-full object-cover border-2 border-gray-700"
                    />
                  ) : (
                    <div
                      className={`h-14 w-14 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-xl font-bold`}
                    >
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                  )}
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-white transition-colors">
                      {member.name}
                    </h3>
                    <p
                      className={`text-sm bg-gradient-to-r ${member.color} bg-clip-text text-transparent font-medium`}
                    >
                      {member.position}
                    </p>
                  </div>
                </div>

                <div className="mb-1 text-gray-400 text-sm flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span>{member.department}</span>
                </div>

                <p className="text-gray-400 text-sm mt-4 h-24 overflow-hidden">
                  {member.bio}
                </p>

                <div
                  className={`h-0.5 w-full bg-gradient-to-r ${member.color} mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
