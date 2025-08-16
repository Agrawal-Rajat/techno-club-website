'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';

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

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isUnregistering, setIsUnregistering] = useState<boolean>(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState<boolean>(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/events/${id}`);


        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Event not found');
          }
          throw new Error('Failed to fetch event details');
        }

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const handleRegister = async () => {
    if (status !== 'authenticated') {
      setShowLoginPrompt(true);
      return;
    }

    try {
      setIsRegistering(true);

      let endpoint = '/api/events/participate';
      if (event?.ticketPrice && event.ticketPrice > 0) {
        // For paid events, redirect to payment flow
        router.push(`/payment/checkout?eventId=${id}&amount=${event.ticketPrice}`);
        return;
      }

      // For free events, register directly
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId: id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to register for event');
      }

      // Refresh event data to update participation status
      const updatedEventResponse = await fetch(`/api/events/${id}`);
      const updatedEvent = await updatedEventResponse.json();
      setEvent(updatedEvent);

    } catch (err) {
      console.error('Error registering for event:', err);
      setError(err instanceof Error ? err.message : 'Failed to register for event');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (status !== 'authenticated') {
      return;
    }

    try {
      setIsUnregistering(true);

      const response = await fetch('/api/events/unregister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId: id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to unregister from event');
      }

      // Refresh event data to update participation status
      const updatedEventResponse = await fetch(`/api/events/${id}`);
      const updatedEvent = await updatedEventResponse.json();
      setEvent(updatedEvent);

    } catch (err) {
      console.error('Error unregistering from event:', err);
      setError(err instanceof Error ? err.message : 'Failed to unregister from event');
    } finally {
      setIsUnregistering(false);
    }
  };

  // Format dates for display
  const formattedStartDate = event ? format(new Date(event.startDate), 'PPP') : '';
  const formattedEndDate = event ? format(new Date(event.endDate), 'PPP') : '';
  const formattedStartTime = event ? format(new Date(event.startDate), 'p') : '';
  const formattedEndTime = event ? format(new Date(event.endDate), 'p') : '';

  // Determine if the event is full
  const isEventFull = event ? event.participantCount >= event.capacity : false;

  // Determine if the event is in the past
  const isEventPast = event ? new Date(event.endDate) < new Date() : false;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-gray-900 pb-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="container mx-auto px-4 py-8">
            <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        ) : event ? (
          <>
            {/* Hero Section */}
            <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden">
              {event.imageUrl ? (
                <Image
                  src={event.imageUrl}
                  alt={event.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="brightness-50"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-indigo-900/70"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-black/50"></div>

              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 lg:p-10">
                <div className="container mx-auto">
                  <span className="inline-block px-3 py-1 mb-4 text-xs font-medium rounded-full bg-purple-700/70 text-purple-100">
                    {event.club}
                  </span>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
                    {event.name}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formattedStartDate}
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formattedStartTime} - {formattedEndTime}
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Event Details */}
                <div className="md:col-span-2">
                  <div className="bg-gray-900 rounded-lg shadow-md shadow-purple-900/20 border border-purple-900/20 p-6 mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">About This Event</h2>
                    <p className="text-gray-300 whitespace-pre-line">{event.description}</p>
                  </div>

                  <div className="bg-gray-900 rounded-lg shadow-md shadow-purple-900/20 border border-purple-900/20 p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Event Details</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-purple-400 font-medium mb-2">Date & Time</h3>
                        <p className="text-gray-300">
                          {formattedStartDate} - {formattedEndDate}
                          <br />
                          {formattedStartTime} - {formattedEndTime}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-purple-400 font-medium mb-2">Location</h3>
                        <p className="text-gray-300">{event.location}</p>
                      </div>
                      <div>
                        <h3 className="text-purple-400 font-medium mb-2">Organized by</h3>
                        <p className="text-gray-300">{event.club}</p>
                      </div>
                      <div>
                        <h3 className="text-purple-400 font-medium mb-2">Contact</h3>
                        <p className="text-gray-300">{event.creatorId.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Registration */}
                <div>
                  <div className="bg-gray-900 rounded-lg shadow-md shadow-purple-900/20 border border-purple-900/20 p-6 sticky top-24">
                    <h2 className="text-xl font-semibold text-white mb-4">Registration</h2>
                    <div className="mb-4">
                      <span className="text-sm text-gray-300 block mb-1">Ticket Price:</span>
                      <span className="text-2xl font-bold text-white">
                        {event.ticketPrice > 0 ? `₹${event.ticketPrice}` : 'Free'}
                      </span>
                    </div>
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Available Spots:</span>
                        <span className="text-purple-400 font-medium">
                          {event.capacity - event.participantCount} / {event.capacity}
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
                          style={{ width: `${(event.participantCount / event.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {status === 'loading' ? (
                      <button
                        className="w-full py-3 rounded-md bg-gray-800 text-gray-400 cursor-not-allowed"
                        disabled
                      >
                        Loading...
                      </button>
                    ) : isEventPast ? (
                      <div className="text-center py-2 px-4 bg-gray-800/50 rounded-md text-gray-400 mb-4">
                        This event has ended
                      </div>
                    ) : event.isParticipating ? (
                      <button
                        onClick={handleUnregister}
                        disabled={isUnregistering}
                        className="w-full py-3 rounded-md bg-red-900/50 text-red-300 border border-red-800/50 hover:bg-red-900/70 transition-colors"
                      >
                        {isUnregistering ? 'Processing...' : 'Cancel Registration'}
                      </button>
                    ) : isEventFull ? (
                      <div className="text-center py-2 px-4 bg-gray-800/50 rounded-md text-gray-400 mb-4">
                        Event is fully booked
                      </div>
                    ) : (
                      <button
                        onClick={handleRegister}
                        disabled={isRegistering}
                        className="w-full py-3 rounded-md bg-gradient-to-r from-purple-600 to-indigo-700 text-white hover:from-purple-700 hover:to-indigo-800 transition-all shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50"
                      >
                        {isRegistering ? 'Processing...' : `Register${event.ticketPrice > 0 ? ' & Pay' : ' Now'}`}
                      </button>
                    )}

                    {showLoginPrompt && status === 'unauthenticated' && (
                      <div className="mt-4 text-center p-3 bg-purple-900/30 border border-purple-800/30 rounded-md text-purple-200 text-sm">
                        Please <button
                          onClick={() => router.push('/auth/signin')}
                          className="text-purple-400 hover:text-purple-300 font-medium"
                        >sign in</button> to register for this event
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold text-gray-300">Event not found</h2>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 