"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

type NavItem = {
  name: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
};

const navItems: NavItem[] = [
  { 
    name: "Home", 
    href: "/",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    name: "Clubs", 
    href: "/clubs",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
     { 
     name: "Events", 
     href: "/events",
     icon: (
       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
       </svg>
     )
   },
  { 
    name: "Team", 
    href: "/#team",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    )
  },
  // 
{
  name: "Newsletter",
  href: "/newsletter.pdf", // yeh file /public/newsletter.pdf me rakho
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
}


];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  // Check if user is admin or superadmin
  const isAdminUser =
    session?.user?.role === "admin" || session?.user?.role === "superadmin";

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide Navbar on dashboard routes (dashboard has its own nav)
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/95 backdrop-blur-xl shadow-2xl shadow-purple-900/30 border-purple-500/20"
          : "bg-black/80 backdrop-blur-lg border-transparent"
      } border-b`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center group">
                <div className="relative w-12 h-12 mr-3 transition-transform duration-300 group-hover:scale-110">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-blue-500 to-indigo-600 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  <div className="relative w-full h-full bg-gradient-to-tr from-purple-600 via-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <img
                      src="/logo_bgremoved.png"
                      alt="Logo"
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </div>
                </div>
                <div className="transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-2xl bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                    TechnoClub
                  </span>
                  <p className="text-xs text-gray-400 font-medium tracking-wide">Medi-Caps University</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block ml-12">
              <div className="flex items-center space-x-1">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (pathname === "/" && item.href.startsWith("#"));

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ease-out group ${
                        isActive
                          ? "text-white bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 shadow-lg shadow-purple-500/20"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {item.icon && (
                          <span className={`transition-transform duration-300 group-hover:scale-110 ${
                            isActive ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-400'
                          }`}>
                            {item.icon}
                          </span>
                        )}
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      
                      {/* Hover effect */}
                      {!isActive && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side - Auth & User Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isLoading ? (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-24 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg animate-pulse"></div>
                <div className="h-8 w-8 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
                                            <div className="flex items-center space-x-4">
                 {isAdminUser && (
                   <div className="flex items-center space-x-3">
                     {/* Admin Badge */}
                     <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                       <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                       </svg>
                       <span className="text-xs font-bold text-yellow-400">
                         {session?.user?.role === "superadmin" ? "SUPER ADMIN" : "ADMIN"}
                       </span>
                     </div>
                     
                     {/* Dashboard Link */}
                     <Link
                       href="/dashboard"
                       className="relative px-4 py-2 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 group"
                     >
                       <span className="flex items-center space-x-2">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                         </svg>
                         <span>Dashboard</span>
                       </span>
                     </Link>
                     
                     {/* Quick Actions for Superadmin */}
                     {session?.user?.role === "superadmin" && (
                       <div className="flex items-center space-x-2">
                         <Link
                           href="/dashboard/superadmin"
                           className="relative px-3 py-2 text-gray-300 hover:text-white rounded-lg text-xs font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-pink-600/20 group"
                         >
                           <span className="flex items-center space-x-1">
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                             </svg>
                             <span>Manage</span>
                           </span>
                         </Link>
                       </div>
                     )}
                   </div>
                 )}

                                 {/* User Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 text-white px-4 py-2 rounded-xl text-sm hover:from-gray-700/50 hover:to-gray-600/50 transition-all duration-300 border border-gray-600/30 hover:border-purple-500/50 shadow-lg hover:shadow-purple-500/20">
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden ring-2 ring-purple-500/30 group-hover:ring-purple-500/50 transition-all duration-300">
                      {session?.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-white">
                          {session?.user?.name?.charAt(0) || "U"}
                        </span>
                      )}
                    </div>
                    <span className="max-w-[120px] truncate font-medium">
                      {session?.user?.name}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-3 w-56 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-purple-900/30 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 border border-gray-700/50">
                    <div className="px-4 py-3 border-b border-gray-700/50">
                      <p className="text-sm text-gray-400">Signed in as</p>
                      <p className="text-sm font-medium text-white truncate">{session?.user?.email}</p>
                    </div>
                    
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 hover:text-white transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Profile
                    </Link>
                    
                    {isAdminUser && (
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
                    
                    <div className="border-t border-gray-700/50 my-2"></div>
                    
                    <button
                      onClick={() => signOut()}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-pink-600/20 hover:text-white transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => signIn()}
                  className="relative px-6 py-2.5 text-white rounded-xl text-sm font-medium border border-purple-500/50 hover:border-purple-400 transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 group overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign In</span>
                  </span>
                </button>
                
                <Link href="/auth/signup">
                  <button className="relative px-6 py-2.5 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white rounded-xl text-sm font-bold hover:from-purple-700 hover:via-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 transform hover:scale-105 group overflow-hidden">
                    <span className="relative z-10 flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <span>Join Us</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 focus:outline-none transition-all duration-200"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${isOpen ? "block" : "hidden"} md:hidden transition-all duration-300`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/95 backdrop-blur-xl border-t border-gray-700/50">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname === "/" && item.href.startsWith("#"));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  isActive
                    ? "text-white bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 shadow-lg shadow-purple-500/20"
                    : "text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-blue-600/10"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  {item.icon && (
                    <span className={`${isActive ? 'text-purple-400' : 'text-gray-400'}`}>
                      {item.icon}
                    </span>
                  )}
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          {/* Mobile auth options */}
          <div className="pt-4 border-t border-gray-700/50">
                                      {isAuthenticated ? (
               <>
                 {isAdminUser && (
                   <Link
                     href="/dashboard"
                     className="block text-gray-300 hover:text-white px-4 py-3 rounded-xl text-base font-medium hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 transition-all duration-200"
                     onClick={() => setIsOpen(false)}
                   >
                     <div className="flex items-center space-x-3">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                       </svg>
                       <span>Dashboard</span>
                     </div>
                   </Link>
                 )}
                 
                 <button
                  onClick={() => signOut()}
                  className="w-full text-left text-gray-300 hover:text-white block px-4 py-3 rounded-xl text-base font-medium hover:bg-gradient-to-r hover:from-red-600/20 hover:to-pink-600/20 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign out</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => signIn()}
                  className="w-full text-gray-300 hover:text-white block px-4 py-3 rounded-xl text-base font-medium hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 transition-all duration-200 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign In</span>
                  </div>
                </button>
                <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                  <button className="w-full mt-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-base hover:from-purple-700 hover:via-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg shadow-purple-900/30">
                    <div className="flex items-center justify-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <span>Join Us</span>
                    </div>
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
