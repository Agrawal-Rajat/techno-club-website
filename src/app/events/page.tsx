'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';

type Participant = {
  _id: string;
  name: string;
  email: string;
};

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
  participants?: Participant[];
};

type EventsByClub = Record<string, Event[]>;

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <div className="bg-gray-900 rounded-lg shadow-md shadow-purple-900/30 overflow-hidden h-full flex flex-col border border-purple-800/30 hover:border-purple-700/70 hover:shadow-purple-800/50 transition-all duration-200">
      <div className="relative w-full h-40">
        {event.imageUrl ? (
          <Image 
            src={event.imageUrl} 
            alt={event.name}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-indigo-900/40 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <div className="p-4 flex-grow bg-gradient-to-b from-gray-900 to-gray-900/95">
        <h3 className="text-lg font-semibold mb-2 text-white">{event.name}</h3>
        <p className="text-sm text-gray-300 mb-2 line-clamp-2">{event.description}</p>
        <div className="text-xs text-gray-400 mb-1">
          <span className="font-medium text-purple-400">Date: </span>
          {format(new Date(event.startDate), 'PPP')}
        </div>
        <div className="text-xs text-gray-400 mb-1">
          <span className="font-medium text-purple-400">Location: </span>
          {event.location}
        </div>
        <div className="text-xs text-gray-400">
          <span className="font-medium text-purple-400">Participants: </span>
          {event.participantCount} / {event.capacity}
        </div>
      </div>
      <div className="px-4 pb-4 bg-gray-900">
        <Link 
          href={`/events/${event._id}`}
          className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

const ClubSection: React.FC<{ clubName: string; events: Event[] }> = ({ clubName, events }) => {
  if (events.length === 0) return null;
  
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white relative">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">{clubName}</span>
          <div className="absolute -bottom-1 left-0 w-1/4 h-0.5 bg-gradient-to-r from-purple-600 to-transparent"></div>
        </h2>
        <Link 
          href={`/clubs/${clubName.toLowerCase()}`}
          className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors flex items-center group"
        >
          View All {clubName} Events 
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </section>
  );
};

export default function EventsPage() {
  const [eventsByClub, setEventsByClub] = useState<EventsByClub>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/events/by-club');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        setEventsByClub(data.eventsByClub);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const clubNames = Object.keys(eventsByClub);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="relative mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500">
              Upcoming Events
            </h1>
            <p className="text-gray-400 text-center max-w-2xl mx-auto">
              Discover the latest tech events from all clubs at Medi-Caps University
            </p>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent"></div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          ) : clubNames.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold text-gray-300">No events found</h2>
              <p className="text-gray-400 mt-2">Check back later for upcoming events.</p>
            </div>
          ) : (
            clubNames.map(clubName => (
              <ClubSection 
                key={clubName} 
                clubName={clubName} 
                events={eventsByClub[clubName]} 
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
