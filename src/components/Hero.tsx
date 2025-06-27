// components/Hero.tsx
import React from "react";

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col justify-center items-center text-center px-4 py-20 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-dot-black/[0.2] pointer-events-none z-0" />
      <div className="relative z-10 max-w-4xl">
        <p className="mb-4 text-sm font-semibold bg-white/10 px-4 py-1 rounded-full inline-block">
          Revolutionizing Student Tech Communities
        </p>
        <h1 className="text-5xl sm:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-400 to-pink-400 text-transparent bg-clip-text">
            Techno Clubs
          </span>{" "}
          <span className="text-white">Portal</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-10">
          A unified digital platform for tech communities featuring smart automation, real-time collaboration tools, and secure operations across all club activities.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full transition">
            Explore Features
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-full transition">
            Join the Revolution
          </button>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto backdrop-blur-sm">
          <StatItem number="5" label="Tech Clubs" />
          <StatItem number="1K+" label="Active Members" />
          <StatItem number="100+" label="Events Hosted" />
          <StatItem number="10+" label="Universities" />
        </div>
      </div>
    </section>
  );
}

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-blue-400">{number}</div>
      <div className="text-gray-300 mt-1">{label}</div>
    </div>
  );
}
