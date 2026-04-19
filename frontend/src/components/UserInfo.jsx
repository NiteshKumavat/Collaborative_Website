import React from 'react';

function UserInfo({ user, click }) {
  // Fallback for avatar if user has no image
  const initials = user.fullName ? user.fullName.charAt(0).toUpperCase() : "?";

  return (
    <div 
      onClick={click}
      className="group relative bg-[#151725] border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        
        {/* Avatar Section */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-indigo-500 transition-colors">
            {user.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={user.fullName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#0B0C15] flex items-center justify-center text-xl font-bold text-indigo-400">
                {initials}
              </div>
            )}
          </div>
          {/* Online Status Indicator (Optional visual only for now) */}
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-[#151725] rounded-full"></div>
        </div>

        {/* Info Section */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
            {user.fullName || "Unknown User"}
          </h3>
          
          {/* Bio Preview */}
          <p className="text-sm text-gray-500 truncate mt-1">
            {user.bio || "No bio added yet."}
          </p>

          {/* Skills Preview (If available) */}
          {user.skills && user.skills.length > 0 && (
            <div className="flex gap-2 mt-3 overflow-hidden">
              {user.skills.slice(0, 2).map((skill, index) => (
                <span key={index} className="text-[10px] px-2 py-1 bg-white/5 rounded-md text-gray-400 border border-white/5">
                  {skill}
                </span>
              ))}
              {user.skills.length > 2 && (
                <span className="text-[10px] px-2 py-1 text-gray-500">+{user.skills.length - 2}</span>
              )}
            </div>
          )}
        </div>

        {/* Arrow Icon */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
            <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;