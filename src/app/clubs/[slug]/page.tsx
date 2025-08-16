'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { clubsData } from '@/lib/data/clubs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Type for event data from API
type Event = {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  imageUrl?: string;
  ticketPrice: number;
  capacity: number;
  isPublished: boolean;
  club: string;
  creatorId: {
    _id: string;
    name: string;
    email: string;
  };
  participantCount: number;
  isParticipating: boolean;
  participants?: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
};

// Custom components 
const SectionTitle: React.FC<{ title: string; color: string }> = ({ title, color }) => (
  <div className="mb-8">
    <h2 className="text-2xl md:text-3xl font-bold text-white inline-block">
      {title}
      <div className={`h-1 mt-2 bg-gradient-to-r ${color} rounded-full`}></div>
    </h2>
  </div>
);

const EventCard: React.FC<{ event: Event; color: string; isPast: boolean }> = ({ event, color, isPast }) => (
  <div className="bg-gray-900/80 rounded-xl border border-gray-800 overflow-hidden flex flex-col h-full hover:border-gray-700 transition-all group">
    <div className="relative h-48 overflow-hidden">
      {event.imageUrl ? (
        <Image
          src={event.imageUrl}
          alt={event.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-purple-900/40 to-indigo-900/40 flex items-center justify-center">
          <span className="text-gray-400">No image</span>
        </div>
      )}
      <div className={`absolute top-3 right-3 ${isPast ? 'bg-gray-800' : `bg-gradient-to-r ${color}`} text-white text-xs font-medium px-2.5 py-1 rounded-full`}>
        {isPast ? 'Past Event' : 'Upcoming'}
      </div>
    </div>
    <div className="p-5 flex-1 flex flex-col">
      <div className="flex items-center gap-2 text-gray-400 mb-3 text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{format(new Date(event.startDate), 'MMM d, yyyy')}</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>
      <p className="text-gray-300 mb-4 flex-1 line-clamp-3">{event.description}</p>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800">
        <div className="flex items-center text-gray-400 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{event.location}</span>
        </div>

        <div className="flex items-center text-gray-400 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>{event.participantCount} participants</span>
        </div>
      </div>
      <Link
        href={`/events/${event._id}`}
        className="mt-4 block text-center py-2 px-4 rounded-md bg-gradient-to-r from-purple-600 to-indigo-700 text-white hover:from-purple-700 hover:to-indigo-800 transition-all shadow-md shadow-purple-900/20 hover:shadow-purple-900/40"
      >
        View Details
      </Link>
    </div>
  </div>
);

export default function ClubPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [imageErrorByMemberId, setImageErrorByMemberId] = useState<Record<string, boolean>>({});

  // Form state for join club
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    year: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Get club data from static data
  const club = clubsData[slug];

  useEffect(() => {
    // If club doesn't exist, redirect to 404
    if (!club) {
      router.push('/404');
      return;
    }

    // Fetch events for the club
    const fetchClubEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/events/club/${slug}`);

        if (!response.ok) {
          throw new Error('Failed to fetch club events');
        }

        const data = await response.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error('Error fetching club events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClubEvents();
  }, [slug, club, router]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitError('');

    try {
      const response = await fetch('/api/clubs/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          clubSlug: slug,
          clubName: club.name
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage(data.message);
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          contactNumber: '',
          year: '',
          reason: ''
        });
      } else {
        setSubmitError(data.error || 'Failed to submit application');
      }
    } catch (error) {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!club) {
    return null; // Will redirect in useEffect
  }

  // Sort events by date
  const currentDate = new Date();

  // Split into past and upcoming events
  const upcomingEvents = events
    .filter((event) => new Date(event.endDate) >= currentDate)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const pastEvents = events
    .filter((event) => new Date(event.endDate) < currentDate)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">
        {/* Hero section */}
        <div className="relative py-20 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]"></div>
          <div className={`absolute inset-0 bg-gradient-to-br ${club.color || 'from-purple-900/30 to-black'} -z-10 opacity-30`}>
            <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl"></div>
          </div>

          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center max-w-5xl mx-auto text-center">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-r ${club.color} mb-6`}>
                <span className="text-white font-bold text-3xl">{club.name.substring(0, 2)}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                {club.name}
              </h1>

              {club.tagline && (
                <p className="text-xl text-gray-300 mb-8">{club.tagline}</p>
              )}

              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="#join"
                  className={`px-6 py-3 rounded-lg bg-gradient-to-r ${club.color} text-white font-medium hover:shadow-lg transition-all flex items-center`}
                >
                  Join {club.name}
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>

                <a
                  href="#events"
                  className="px-6 py-3 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all"
                >
                  View Events
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* About section */}
        <section className="py-16 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <SectionTitle title="About" color={club.color || 'from-purple-600 to-indigo-600'} />

              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 mb-12">
                <p className="text-gray-300 mb-6 leading-relaxed">{club.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4">Mission</h3>
                    <p className="text-gray-300">{club.mission}</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4">Vision</h3>
                    <p className="text-gray-300">{club.vision}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section className="py-16 bg-black">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <SectionTitle
                title="Our Team"
                color={club.color || "from-purple-600 to-indigo-600"}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {club.team.map((member) => (
                  <div
                    key={member.id}
                    className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 flex flex-col hover:bg-gray-900/70 transition-all duration-300 hover:border-gray-700 hover:transform hover:scale-105"
                  >
                    {member.image && !imageErrorByMemberId[member.id] ? (
                      <div className="w-24 h-24 mb-4 rounded-xl overflow-hidden border border-gray-700 group">
                        <Image
                          src={
                            member.image.startsWith("/")
                              ? member.image
                              : `/${member.image}`
                          }
                          alt={member.name}
                          width={128}
                          height={128}
                          quality={100}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                          onError={() => setImageErrorByMemberId((prev) => ({ ...prev, [member.id]: true }))}
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-24 h-24 mb-4 rounded-xl bg-gradient-to-r ${club.color} flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300`}
                      >
                        <span className="text-white font-bold text-2xl">
                          {member.initials}
                        </span>
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-indigo-400 group-hover:bg-clip-text transition-all duration-300">{member.name}</h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{member.position}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Events section */}
        <section id="events" className="py-16 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <SectionTitle title="Upcoming Events" color={club.color || 'from-purple-600 to-indigo-600'} />

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded mb-8">
                  {error}
                </div>
              ) : upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                  {upcomingEvents.map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      color={club.color || 'from-purple-600 to-indigo-600'}
                      isPast={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 text-center mb-16">
                  <p className="text-gray-300">No upcoming events at the moment. Check back soon!</p>
                </div>
              )}

              <SectionTitle title="Past Events" color={club.color || 'from-purple-600 to-indigo-600'} />

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : pastEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastEvents.map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      color={club.color || 'from-purple-600 to-indigo-600'}
                      isPast={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 text-center">
                  <p className="text-gray-300">To explore past events, visit our Yearbook</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Collaborations section */}
        {club.collaborations && club.collaborations.length > 0 && (
          <section className="py-16 bg-black">
            <div className="container mx-auto px-6">
              <div className="max-w-5xl mx-auto">
                <SectionTitle title="Collaborations" color={club.color || 'from-purple-600 to-indigo-600'} />

                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
                  <div className="grid grid-cols-1 gap-4">
                    {club.collaborations.map((collab, index) => (
                      <div key={index} className="flex justify-between items-center p-4 border-b border-gray-800 last:border-0">
                        <div>
                          <h4 className="text-lg font-medium text-white">{collab.partner}</h4>
                          <p className="text-gray-400">{collab.project}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${club.color} bg-opacity-20 text-white`}>
                          {collab.year}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Join section */}
        <section id="join" className="py-16 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Join {club.name}</h2>
              <p className="text-gray-300 mb-8">
                Interested in joining our community? Fill out the application form and start your journey with us.
              </p>

              <div className="bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-800 p-8">
                {/* Success/Error Messages */}
                {submitMessage && (
                  <div className="mb-6 p-4 bg-green-900/30 border border-green-800 text-green-200 rounded-lg">
                    {submitMessage}
                  </div>
                )}
                {submitError && (
                  <div className="mb-6 p-4 bg-red-900/30 border border-red-800 text-red-200 rounded-lg">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-300 mb-2">Contact Number</label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-2">Year of Study</label>
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select your year</option>
                      <option value="1">First Year</option>
                      <option value="2">Second Year</option>
                      <option value="3">Third Year</option>
                      <option value="4">Fourth Year</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2">Why do you want to join {club.name}?</label>
                    <textarea
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Tell us why you're interested in joining..."
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r ${club.color} text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
