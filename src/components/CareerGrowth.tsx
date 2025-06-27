import React from "react";

export default function CareerGrowth() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-[#24243e] via-[#302b63] to-[#0f0c29] text-white">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Excel in Your Career & Grow</h2>
        <p className="text-gray-300 text-lg">
          Leverage club experiences to unlock your full potential and build a future-ready profile.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {growthPaths.map((item) => (
          <GrowthCard key={item.title} title={item.title} desc={item.desc} />
        ))}
      </div>
    </section>
  );
}

const growthPaths = [
  {
    title: "Build Real Projects",
    desc: "Gain hands-on experience by collaborating on tech projects, open source contributions, and live prototypes.",
  },
  {
    title: "Grow Your Network",
    desc: "Connect with alumni, industry mentors, and like-minded peers through events and community partnerships.",
  },
  {
    title: "Master Soft Skills",
    desc: "Learn public speaking, team coordination, time management, and problem-solving — all essential for any career.",
  },
  {
    title: "Boost Your Resume",
    desc: "Add valuable experience from hackathons, leadership roles, and technical sessions to stand out in applications.",
  },
  {
    title: "Discover Your Passion",
    desc: "Explore different domains like AI, Cloud, DevOps, Design, and choose what truly excites you.",
  },
  {
    title: "Stay Ahead of Trends",
    desc: "Clubs are always on the cutting edge — be the first to learn, build, and share emerging tech.",
  },
];

function GrowthCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
      <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="text-gray-300 text-sm">{desc}</p>
    </div>
  );
}
