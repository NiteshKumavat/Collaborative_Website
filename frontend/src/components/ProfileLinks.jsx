import React from 'react';

export default function ProfileLinks({ info, editMode, updateLink }) {
  
  // Helper to get icons (You can replace these with image tags if you prefer)
  const getIcon = (name) => {
    switch(name) {
        case 'linkedin': return 'Likedin'; // Or use <img src="..." />
        case 'github': return 'Github';
        default: return 'Link';
    }
  };

  return (
    <div className="mt-8 border-t border-white/10 pt-8">
      <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4">Socials & Portfolio</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["LinkedIn", "GitHub", "Portfolio"].map((label) => {
          const key = label.toLowerCase();
          const value = info?.links?.[key] || "";

          return (
            <div key={label} className="group">
              
              {editMode ? (
                // Edit Mode: Clean Inputs
                <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500 text-xs font-bold uppercase">{label}</span>
                    <input
                      className="input-field pt-8 pb-2" // Extra padding top for the label
                      value={value}
                      placeholder={`Paste your ${label} URL`}
                      onChange={(e) => updateLink(key, e.target.value)}
                    />
                </div>
              ) : (
                // View Mode: Clickable Cards
                value ? (
                  <a
                    href={value.startsWith('http') ? value : `https://${value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#6366F1]/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                        {/* You can add real icons here later */}
                        <span className="text-gray-300 font-medium group-hover:text-white">{label}</span>
                    </div>
                    
                    {/* External Link Icon */}
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-[#6366F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  // Empty State (Hidden or greyed out)
                  <div className="p-4 rounded-xl border border-dashed border-white/10 text-gray-600 select-none">
                    {label} not linked
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}