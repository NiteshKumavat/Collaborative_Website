import React from 'react';

export default function ProfileInfo({ editMode, updateField, info }) {
  return (
    <div className="mt-8 space-y-8">
      
      {/* Bio Section */}
      <div>
        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-3">About Me</h3>
        
        {editMode ? (
          <textarea
            className="input-field min-h-[120px] resize-none" // Uses our global class
            placeholder="Tell us about yourself..."
            value={info.bio}
            onChange={(e) => updateField("bio", e.target.value)}
          />
        ) : (
          <p className={`text-lg leading-relaxed ${info.bio ? 'text-gray-200' : 'text-gray-500 italic'}`}>
            {info.bio || "This user hasn't written a bio yet."}
          </p>
        )}
      </div>

      {/* Skills Section */}
      <div>
        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-3">Skills & Expertise</h3>

        {editMode ? (
          <div>
            <input
              type="text"
              placeholder="e.g. React, Node.js, Python (comma separated)"
              className="input-field"
              value={info.skills.join(", ")}
              onChange={(e) =>
                updateField(
                  "skills",
                  e.target.value.split(",").map(s => s.trim()) // simple comma separation
                )
              }
            />
            <p className="text-xs text-gray-500 mt-2">Separate skills with commas.</p>
          </div>
        ) : (
          <div className="flex gap-3 flex-wrap">
            {info.skills.length > 0 ? (
              info.skills.map((skill, i) => (
                <span 
                  key={i} 
                  className="px-4 py-1.5 rounded-full text-sm font-medium bg-[#6366F1]/20 text-[#818cf8] border border-[#6366F1]/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-500 italic">No skills listed.</span>
            )}
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 gap-6 pt-6 border-t border-white/10">
        <div>
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Email Address</h3>
          <div className="flex items-center gap-3 text-gray-300">
            {/* Lock Icon to show it's private/read-only */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="font-mono">{info.email}</span>
          </div>
        </div>
      </div>

    </div>
  );
}