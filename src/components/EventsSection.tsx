"use client";
import React from "react";
import { motion } from "framer-motion";

export default function TechnoClubsHierarchy() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_60%)]" />

      <div className="max-w-5xl mx-auto text-center mb-16 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent"
        >
          Techno Clubs Hierarchy
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 text-lg"
        >
          Structured leadership for organized excellence
        </motion.p>
      </div>

      <div className="space-y-16 relative z-10 max-w-6xl mx-auto">
        {/* Faculty */}
        <GroupRow
          title="Faculty Coordinators"
          members={["Faculty Advisor 1", "Faculty Advisor 2"]}
          color="from-purple-500 to-indigo-500"
          delay={0.2}
        />

        <Arrow />

        {/* Core Council */}
        <GroupRow
          title="Student Council"
          members={["President", "Vice President"]}
          color="from-cyan-500 to-sky-500"
          delay={0.4}
        />

        <Arrow />

        {/* Club Heads */}
        <GroupRow
          title="Club Heads"
          members={["IEEE", "ACM", "AWS", "GDG", "STIC"]}
          color="from-green-400 to-blue-500"
          delay={0.6}
        />
      </div>
    </section>
  );
}

function GroupRow({
  title,
  members,
  color,
  delay,
}: {
  title: string;
  members: string[];
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="text-center"
    >
      <h3 className="mb-6 text-2xl font-bold text-white">{title}</h3>
      <div className="flex flex-wrap justify-center gap-6">
        {members.map((name) => (
          <motion.div
            key={name}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`bg-gradient-to-r ${color} text-white px-6 py-3 rounded-2xl shadow-lg backdrop-blur-sm border border-white/20 transition-all`}
          >
            {name}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function Arrow() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="flex justify-center my-6"
    >
      <div className="h-12 w-1 bg-gradient-to-b from-pink-400 via-purple-400 to-blue-400 rounded-full animate-pulse" />
    </motion.div>
  );
}
