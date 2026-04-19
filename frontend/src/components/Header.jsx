import React from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const { authUser } = useAuthStore();
  const location = useLocation();
  console.log("Auth User in Header:", authUser);  

  if (!authUser) return null;

  const { fullName, profilePicture } = authUser;
  const initials = fullName?.charAt(0).toUpperCase();


  const isActive = (path) => location.pathname === path
    ? "text-white bg-white/10"
    : "text-gray-400 hover:text-white hover:bg-white/5";

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 bg-[#0B0C15]/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">


        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <img
              src="/logo-removebg-preview.png"
              alt="CollabSpace"
              className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            CollabSpace
          </span>
        </Link>

        <div className="md:flex items-center bg-white/5 rounded-full p-1 border border-white/5">
          <Link
            to="/"
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive("/")}`}
          >
            Home
          </Link>
          <Link
            to="/developers"
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive("/developers")}`}
          >
            Developers
          </Link>
          <Link
            to="/chats"
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive("/chats")}`}
          >
            Chats
          </Link>
        </div>

        <Link
          to="/pricing"
          className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full hover:opacity-90 transition"
        >
          Upgrade Plan
        </Link>

        {/* User Profile */}
        <Link to={`/profile/${authUser._id}`} className="flex items-center gap-3 pl-4 border-l border-white/10 hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white leading-none">{fullName}</p>
            <p className="text-xs text-indigo-400 mt-1">{authUser.plan}</p>
          </div>

          <div className="w-10 h-10 rounded-full border border-white/10 p-0.5 relative overflow-hidden bg-white/5">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                {initials}
              </div>
            )}
          </div>
        </Link>
      </div>
    </nav>
  );
}

export default Header;