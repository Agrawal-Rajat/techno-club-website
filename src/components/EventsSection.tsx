import React from "react";

export default function TechnoClubsHierarchy() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Techno Clubs Hierarchy</h2>
        <p className="text-gray-300">Structured leadership for organized excellence</p>
      </div>

      <div className="space-y-12 relative z-10 max-w-6xl mx-auto">
        {/* Faculty */}
        <GroupRow
          title="Faculty Coordinators"
          members={["Faculty Advisor 1", "Faculty Advisor 2"]}
          color="from-purple-500 to-indigo-500"
        />

        <Arrow />

        {/* Core Council */}
        <GroupRow
          title="Student Council"
          members={["President", "Vice President", "Treasurer", "Secretary"]}
          color="from-cyan-500 to-sky-500"
        />

        <Arrow />

        {/* Club Heads */}
        <GroupRow
          title="Club Heads"
          members={["IEEE", "ACM", "AWS", "GDG", "STIC"]}
          color="from-green-400 to-blue-500"
        />
      </div>
    </section>
  );
}

function GroupRow({
  title,
  members,
  color,
}: {
  title: string;
  members: string[];
  color: string;
}) {
  return (
    <div className="text-center">
      <h3 className="mb-4 text-xl font-semibold text-white">{title}</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {members.map((name) => (
          <div
            key={name}
            className={`bg-gradient-to-r ${color} text-white px-4 py-2 rounded-xl shadow-md`}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center my-4">
      <div className="h-6 w-1 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full" />
    </div>
  );
}
