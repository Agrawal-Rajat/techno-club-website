// import React from 'react';
// import DashboardNav from '@/components/DashboardNav';

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="min-h-screen bg-black text-white p-6">
//       <div className="max-w-6xl mx-auto">
//         <DashboardNav />
//         {children}

//       </div>
//     </div>
//   );
// } 

"use client";

import React from "react";
import DashboardNav from "@/components/DashboardNav";
import { useSession } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  // Jab tak session load ho raha hai
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <DashboardNav />
        {children}
      </div>
    </div>
  );
}
