"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import CertificatesSection from '@/components/CertificatesSection';

type ProfileData = {
  user: {
    _id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
    creditScore: number;
    certificates: Array<{
      _id: string;
      name: string;
      submittedAt: string;
      isVerified: boolean;
      creditsAwarded: number;
      url: string;
      verifiedAt?: string;
    }>;
  };
  createdEvents: Array<{
    _id: string;
    name: string;
    description: string;
    startDate: string;
    location: string;
    imageUrl?: string;
    isPublished: boolean;
    participantCount: number;
  }>;
  participatingEvents: Array<{
    _id: string;
    name: string;
    description: string;
    startDate: string;
    location: string;
    imageUrl?: string;
  }>;
  stats: {
    eventsCreated: number;
    eventsParticipating: number;
    upcomingEvents: number;
    pastEvents: number;
  };
};

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'created' | 'participating' | 'certificates'>('created');

  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchProfileData();
    }
  }, [status, session]);

  const fetchProfileData = async () => {
    try {
      if (!loading) setRefreshing(true);
      setError('');

      const response = await fetch('/api/profile');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile data');
      }

      const data = await response.json();
      setProfileData(data);
    } catch (err: unknown) {
      console.error('Error fetching profile data:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const isUpcoming = (date: string) => {
    return new Date(date) > new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-900 border-l-4 border-red-500 text-red-200 p-4 mb-6 rounded">
          <div className="flex">
            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="p-6">
        <div className="bg-gray-800 p-10 rounded-lg text-center shadow-md border border-gray-700">
          <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-gray-300 text-lg mb-4">Profile data could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg mb-6">
        <div className="relative h-40 bg-gradient-to-r from-purple-900 to-indigo-900">
          <div className="absolute -bottom-16 left-6 lg:left-10">
            <div className="h-32 w-32 rounded-full border-4 border-gray-800 overflow-hidden bg-gray-700">
              {profileData.user.image ? (
                <Image
                  src={profileData.user.image}
                  alt={profileData.user.name || 'User'}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-indigo-600 text-white text-3xl font-bold">
                  {profileData.user.name && profileData.user.name.length > 0 
                    ? profileData.user.name.charAt(0).toUpperCase() 
                    : 'U'
                  }
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-20 pb-6 px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{profileData.user.name}</h1>
              <p className="text-gray-400">{profileData.user.email}</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 lg:mt-0">
              <div className="bg-gray-700 p-3 rounded-lg text-center">
                <p className="text-gray-300 text-sm">Created</p>
                <p className="text-white text-xl font-bold">{profileData.stats.eventsCreated}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg text-center">
                <p className="text-gray-300 text-sm">Participating</p>
                <p className="text-white text-xl font-bold">{profileData.stats.eventsParticipating}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg text-center">
                <p className="text-gray-300 text-sm">Upcoming</p>
                <p className="text-white text-xl font-bold">{profileData.stats.upcomingEvents}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg text-center">
                <p className="text-gray-300 text-sm">Past</p>
                <p className="text-white text-xl font-bold">{profileData.stats.pastEvents}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-700 mb-6">
        <button 
          onClick={() => setActiveTab('created')}
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${
            activeTab === 'created' 
              ? 'text-indigo-400 border-b-2 border-indigo-500' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Events Created
        </button>
        <button 
          onClick={() => setActiveTab('participating')}
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${
            activeTab === 'participating' 
              ? 'text-indigo-400 border-b-2 border-indigo-500' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Events Participating
        </button>
        <button 
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${
            activeTab === 'certificates' 
              ? 'text-indigo-400 border-b-2 border-indigo-500' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Certificates
        </button>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'created' && (
        <>
          <h2 className="text-xl font-semibold text-white mb-4">Events Created</h2>
          {profileData.createdEvents.length === 0 ? (
            <div className="bg-gray-800 p-10 rounded-lg text-center shadow-md">
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <h3 className="text-xl text-gray-300 font-medium mb-2">No events created</h3>
              <p className="text-gray-400 mb-6">Create your first event to see it here</p>
              <Link href="/dashboard/events/create" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Create Event
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profileData.createdEvents.map((event) => (
                <EventCard 
                  key={event._id} 
                  event={event} 
                  isUpcoming={isUpcoming(event.startDate)}
                  showStatus={true}
                />
              ))}
            </div>
          )}
        </>
      )}
      
      {activeTab === 'participating' && (
        <>
          <h2 className="text-xl font-semibold text-white mb-4">Events Participating</h2>
          {profileData.participatingEvents.length === 0 ? (
            <div className="bg-gray-800 p-10 rounded-lg text-center shadow-md">
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <h3 className="text-xl text-gray-300 font-medium mb-2">Not participating in any events</h3>
              <p className="text-gray-400 mb-6">Register for an event to see it here</p>
              <Link href="/events" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profileData.participatingEvents.map((event) => (
                <EventCard 
                  key={event._id} 
                  event={event} 
                  isUpcoming={isUpcoming(event.startDate)}
                  showStatus={false}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Certificates Tab */}
      {activeTab === 'certificates' && (
        <div className="relative">
          {refreshing && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10 rounded-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          )}
          <CertificatesSection
            certificates={profileData.user.certificates}
            creditScore={profileData.user.creditScore}
            onCertificateUpload={fetchProfileData}
          />
        </div>
      )}
    </div>
  );
};

// Event card component
type EventCardProps = {
  event: {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    location: string;
    imageUrl?: string;
    isPublished?: boolean;
    participantCount?: number;
  };
  isUpcoming: boolean;
  showStatus: boolean;
};

const EventCard: React.FC<EventCardProps> = ({ event, isUpcoming, showStatus }) => {
  return (
    <Link href={`/dashboard/events/${event._id}`}>
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
        {/* Card Image */}
        <div className="h-40 relative">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.name || 'Event'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-indigo-900 to-purple-900">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          )}
          
          {/* Status Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {!isUpcoming && (
              <span className="bg-gray-800 text-gray-300 text-xs font-medium px-2 py-1 rounded-md">
                Past
              </span>
            )}
            
            {showStatus && !event.isPublished && (
              <span className="bg-yellow-900 text-yellow-200 text-xs font-medium px-2 py-1 rounded-md">
                Pending
              </span>
            )}
          </div>
        </div>
        
        {/* Card Content */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{event.name || 'Unnamed Event'}</h3>
          
          <div className="mb-4 flex-grow">
            <p className="text-gray-400 text-sm line-clamp-2">{event.description || 'No description available'}</p>
          </div>
          
          <div className="text-sm text-gray-300 mt-auto space-y-2">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>{formatDate(event.startDate)}</span>
            </div>
            
            <div className="flex items-center">
              <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span className="truncate">{event.location || 'No location specified'}</span>
            </div>
            
            <div className="flex items-center">
              <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span>{event.participantCount} participant{event.participantCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProfilePage; 