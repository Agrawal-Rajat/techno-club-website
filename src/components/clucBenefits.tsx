import React from "react";

export default function ClubCulture() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Why Club Culture Matters</h2>
        <p className="text-gray-300 text-lg">
          Student-led clubs shape future innovators. Here&apos;s why they matter.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((item) => (
          <BenefitCard key={item.title} title={item.title} desc={item.desc} />
        ))}
      </div>
    </section>
  );
}

const benefits = [
  {
    title: "Peer-to-Peer Learning",
    desc: "Students learn best from one another — clubs foster informal, hands-on learning in a safe space.",
  },
  {
    title: "Leadership & Collaboration",
    desc: "By organizing events and managing teams, students grow into effective leaders and collaborators.",
  },
  {
    title: "Real-World Exposure",
    desc: "Tech clubs bridge academics with industry through workshops, hackathons, and guest sessions.",
  },
  {
    title: "Innovation Culture",
    desc: "A culture of ideation, prototyping, and building helps students move from consumers to creators.",
  },
  {
    title: "Confidence & Communication",
    desc: "Public speaking, event planning, and discussions help students build essential soft skills.",
  },
  {
    title: "Community & Belonging",
    desc: "A well-knit club culture gives students a strong sense of purpose, identity, and support.",
  },
];

function BenefitCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
      <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="text-gray-300 text-sm">{desc}</p>
    </div>
  );
}
