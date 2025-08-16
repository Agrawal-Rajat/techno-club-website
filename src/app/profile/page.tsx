
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface UserProfile {
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  enrollmentNumber?: string;
  year?: string;
  contactNumber?: string;
  role?: string;
  club?: string;
  creditScore?: number;
}

const ProfilePage: React.FC = () => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    bio: "",
    avatarUrl: "",
    enrollmentNumber: "",
    year: "",
    contactNumber: "",
    role: "",
    club: "",
    creditScore: 0
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Fetch profile data from API
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();

        // Set all fields from database, using empty strings for null/undefined values
        const updatedProfile = {
          name: data.user.name || "",
          email: data.user.email || "",
          bio: data.user.bio || "",
          avatarUrl: data.user.image || data.user.avatarUrl || "",
          enrollmentNumber: data.user.enrollmentNumber || "",
          year: data.user.year ? String(data.user.year) : "",
          contactNumber: data.user.contactNumber || "",
          role: data.user.role || "",
          club: data.user.club || "",
          creditScore: data.user.creditScore || 0
        };

        setProfile(updatedProfile);
      } else {
        console.error('Failed to fetch profile:', response.status, response.statusText);
        // Set empty profile if API fails
        setProfile({
          name: "",
          email: "",
          bio: "",
          avatarUrl: "",
          enrollmentNumber: "",
          year: "",
          contactNumber: "",
          role: "",
          club: "",
          creditScore: 0
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Set empty profile if network error
      setProfile({
        name: "",
        email: "",
        bio: "",
        avatarUrl: "",
        enrollmentNumber: "",
        year: "",
        contactNumber: "",
        role: "",
        club: "",
        creditScore: 0
      });
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  // Load profile data when session is available
  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    } else if (status !== "loading") {
      setIsInitialLoading(false);
    }
  }, [session, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };


  const handleSave = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Profile updated successfully!");
        setIsEditing(false);

        // Fetch fresh data from database to ensure UI is in sync
        await fetchProfile();
      } else {
        setMessage(data.error || "Failed to update profile");
      }
    } catch (error) {
      setMessage("Error updating profile. Please try again.");
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }

  };

  const handleCancel = async () => {
    setIsEditing(false);
    setMessage("");
    // Reset form to original values by fetching fresh data
    await fetchProfile();
  };

  if (status === "loading" || isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please sign in to view your profile</h2>
          <p className="text-gray-300">You need to be authenticated to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-pink-400 text-transparent bg-clip-text">
              My Profile
            </span>
          </h1>
          <p className="text-gray-300 text-lg">Manage your account information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-purple-500/20 shadow-2xl shadow-purple-900/20 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-8 text-center">
            <div className="relative inline-block">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold border-4 border-purple-400/30 mb-4 overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  profile.name ? profile.name.split(' ').map(n => n[0]).join('') : 'U'
                )}
              </div>
           
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">{profile.name || "No Name Set"}</h2>
            <p className="text-purple-300 mb-3">{profile.email || "No Email Set"}</p>

            {/* Role and Club Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {profile.role && String(profile.role).trim() !== "" && (
                <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30">
                  {profile.role}
                </span>
              )}
              {profile.club && String(profile.club).trim() !== "" && (
                <span className="bg-indigo-600/20 text-indigo-300 px-3 py-1 rounded-full text-sm border border-indigo-500/30">
                  {profile.club}
                </span>
              )}
            </div>

            {/* Credit Score */}
            {/* {profile.creditScore && profile.creditScore > 0 && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 px-4 py-2 rounded-full border border-purple-500/30">
                <span className="text-yellow-400 font-semibold">★</span>
                <span className="text-white font-medium">Credit Score: {profile.creditScore}</span>
              </div>
            )} */}
          </div>

          {/* Profile Form */}
          <div className="p-8">
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${message.includes("successfully")
                ? "bg-green-600/20 text-green-300 border border-green-500/30"
                : "bg-red-600/20 text-red-300 border border-red-500/30"
                }`}>
                {message}
              </div>
            )}
                    {profile.role === "superAdmin" && (
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 hover:text-white transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Dashboard
                      </Link>
                    )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-purple-500/30 pb-2">
                  Personal Information
                </h3>

                <div>
                  <label className="text-gray-300 font-medium text-sm">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profile.name || ""}
                      onChange={handleChange}
                      className="w-full mt-2 p-3 rounded-xl bg-gray-900/50 text-white border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="mt-2 text-white font-medium">
                  {profile.name && String(profile.name).trim() !== "" ? profile.name : "Not set"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-gray-300 font-medium text-sm">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profile.email || ""}
                      onChange={handleChange}
                      className="w-full mt-2 p-3 rounded-xl bg-gray-900/50 text-white border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                      placeholder="Enter your email"
                      disabled
                    />
                  ) : (
                    <p className="mt-2 text-white font-medium">
                      {profile.email && String(profile.email).trim() !== "" ? profile.email : "Not set"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-gray-300 font-medium text-sm">Contact Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="contactNumber"
                      value={profile.contactNumber || ""}
                      onChange={handleChange}
                      className="w-full mt-2 p-3 rounded-xl bg-gray-900/50 text-white border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                      placeholder="Enter your contact number"
                    />
                  ) : (
                    <p className="mt-2 text-white font-medium">
                      {profile.contactNumber && String(profile.contactNumber).trim() !== "" ? profile.contactNumber : "Not set"}
                    </p>
                  )}
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-purple-500/30 pb-2">
                  Academic Information
                </h3>

                <div>
                  <label className="text-gray-300 font-medium text-sm">Enrollment Number Or Scholar Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="enrollmentNumber"
                      value={profile.enrollmentNumber || ""}
                      onChange={handleChange}
                      className="w-full mt-2 p-3 rounded-xl bg-gray-900/50 text-white border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                      placeholder="Enter enrollment number"
                    />
                  ) : (
                    <p className="mt-2 text-white font-medium">
                      {profile.enrollmentNumber && String(profile.enrollmentNumber).trim() !== "" ? profile.enrollmentNumber : "Not set"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-gray-300 font-medium text-sm">Year of Study</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="year"
                      value={profile.year || ""}
                      onChange={handleChange}
                      className="w-full mt-2 p-3 rounded-xl bg-gray-900/50 text-white border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                      placeholder="e.g., 2025, 3rd Year"
                    />
                  ) : (
                    <p className="mt-2 text-white font-medium">
                      {profile.year && String(profile.year).trim() !== "" ? profile.year : "Not set"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mt-6">
              <label className="text-gray-300 font-medium text-sm">Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profile.bio || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full mt-2 p-3 rounded-xl bg-gray-900/50 text-white border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none"
                  placeholder="Tell us about yourself, your interests, and goals..."
                />
              ) : (
                <p className="mt-2 text-white font-medium leading-relaxed">
                  {profile.bio && String(profile.bio).trim() !== "" ? profile.bio : "No bio added yet"}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;