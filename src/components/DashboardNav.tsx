"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import type { Session } from "next-auth";

export default function DashboardNav() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname: string = usePathname();
  const { data: session }: { data: Session | null } = useSession();

  const isSuperAdmin = session?.user?.role === "superadmin";
  const isAdmin = session?.user?.role === "admin" || isSuperAdmin;
  const isMember = session?.user?.role === "member" || isAdmin;

  const navLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      show: true,
    },
    {
      href: "/dashboard/profile",
      label: "Profile",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
      show: true,
    },
    {
      href: "/dashboard/tasks",
      label: "Tasks",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
            clipRule="evenodd"
          />
        </svg>
      ),
      show: true, // Everyone can see tasks
    },
    {
      href: "/dashboard/events",
      label: "Events",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      show: isMember,
    },
    {
      href: "/dashboard/admin/meetings",
      label: "Meetings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      show: session?.user?.role === "admin",
    },
    {
      href: "/dashboard/superadmin/meetings",
      label: "All Meetings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      show: isSuperAdmin,
    },
    {
      href: "/dashboard/admin/members",
      label: "Club Members",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      show: session?.user?.role === "admin",
    },
    {
      href: "/dashboard/superadmin/members",
      label: "All Club Members",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      show: isSuperAdmin,
    },
    {
      href: "/dashboard/user-management",
      label: "User Management",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zm0 2a6 6 0 016 6H2a6 6 0 016-6zM16 8a3 3 0 11-6 0 3 3 0 016 0zm-8 6a6 6 0 00-6 6h12a6 6 0 00-6-6z" />
        </svg>
      ),
      show: isAdmin,
    },
  {
  name: "Newsletter",
  href: "/newsletter.pdf", // public folder me rakhi hui file ka path
  label: "Newsletter",
  icon: (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  show: isAdmin,
  download: true, // yeh flag use karenge <a> ke download attribute ke liye
}


  ];

const handleLogout = () => {
  if (isSigningOut) return;
  setIsSigningOut(true);
  signOut({ callbackUrl: "/" });
};

const roleBadge = (
  <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${isSuperAdmin
      ? "bg-gradient-to-r from-red-600/20 to-pink-600/20 border-red-500/40 text-red-300"
      : isAdmin
        ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/40 text-yellow-300"
        : "bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border-indigo-500/40 text-indigo-300"
    }`}>
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6l7 4-7 4-7-4 7-4zm0 8l7 4-7 4-7-4 7-4z" />
    </svg>
    <span>{isSuperAdmin ? "SUPER ADMIN" : isAdmin ? "ADMIN" : "MEMBER"}</span>
  </div>
);

return (
  <nav className="sticky top-0 z-40 mb-6">
    <div className="bg-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl shadow-purple-900/20">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Title and Links */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2 7-7 7 7 2 2M5 10v10a1 1 0 001 1h12a1 1 0 001-1V10" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-semibold tracking-wide">
                  {isAdmin ? "Admin Panel" : "Dashboard"}
                </h2>
                {roleBadge}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {navLinks.map((link) => {
                if (!link.show) return null;
                const isRoot = link.href === "/dashboard";
                const isActive = isRoot ? pathname === "/dashboard" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`group flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${isActive
                        ? "bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-indigo-500/50 text-white"
                        : "bg-gray-900/40 border-gray-800 hover:bg-gray-900/70 hover:border-gray-700"
                      }`}
                  >
                    <span className={`text-gray-300 group-hover:text-indigo-300 ${isActive ? "text-indigo-300" : ""}`}>
                      {link.icon}
                    </span>
                    <span className="whitespace-nowrap text-sm font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleLogout}
              disabled={isSigningOut}
              aria-busy={isSigningOut}
              title={isSigningOut ? "Logging out..." : "Logout"}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border shadow-md transition-all
                  bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 border-red-500/40 shadow-red-900/30
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black
                  ${isSigningOut ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {isSigningOut ? (
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              )}
              <span className="sr-only">{isSigningOut ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
);
}
