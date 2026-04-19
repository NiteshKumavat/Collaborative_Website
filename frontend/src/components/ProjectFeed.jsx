import { useEffect, useState, useRef } from "react";
import { useProjectStore } from "../store/useProjectStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { FaPaperPlane, FaCode, FaAlignLeft } from "react-icons/fa";

export default function ProjectFeed({ project }) {
  // eslint-disable-next-line no-unused-vars
  const { authUser } = useAuthStore();
  const { fetchProjectUpdates, projectUpdates, addProjectUpdate, subscribeToProjectUpdates, unsubscribeFromProjectUpdates } = useProjectStore();
  const updates = projectUpdates[project?._id] || [];
  const [content, setContent] = useState("");
  const [type, setType] = useState("text"); // 'text' | 'code' | 'file'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const feedEndRef = useRef(null);

  useEffect(() => {
    if (!project?._id) return;
    
    fetchProjectUpdates(project._id);
    subscribeToProjectUpdates(project._id);

    return () => {
      unsubscribeFromProjectUpdates();
    };
  }, [project?._id]);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [updates]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    await addProjectUpdate(project._id, { content, type });
    setContent("");
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden shrink-0" style={{ flex: 1 }}>
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 scrollbar-hide">
        {updates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/40 min-h-[300px]">
            <p className="text-sm tracking-wide font-medium bg-white/5 px-6 py-3 rounded-2xl border border-white/10">No activity yet. Document the project's inception!</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-[#2A2D3E] ml-4 pb-10 space-y-12">
            {updates.map((update, idx) => (
              <div key={update._id || idx} className="relative pl-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Timeline dot */}
                <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-[#1A1C26] border-2 border-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.6)] z-10">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                
                <div className="bg-[#1A1C26]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl relative max-w-3xl hover:border-indigo-500/50 transition-colors duration-300">
                  {/* Sender Header */}
                  <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
                    {update.sender?.profilePicture ? (
                      <img src={update.sender.profilePicture} alt="avatar" className="w-9 h-9 rounded-full border border-indigo-500/50 shadow-md" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                        {update.sender?.fullName?.charAt(0) || "U"}
                      </div>
                    )}
                    <div>
                      <span className="text-[14px] font-bold text-gray-100 tracking-wide">
                        {update.sender?.fullName || "A User"}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded-md">
                          {update.type === "code" ? "Committed Code" : "Status Update"}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-tight">
                          {new Date(update.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  {update.type === "code" ? (
                    <div className="bg-[#0B0C15] rounded-xl p-5 overflow-x-auto border border-[#2A2D3E] shadow-inner relative group">
                      <div className="absolute top-2 right-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Snippet</div>
                      <pre className="text-[13px] text-gray-300 font-mono leading-relaxed">
                        <code>{update.content}</code>
                      </pre>
                    </div>
                  ) : (
                    <p className="text-[#aab2c0] text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                      {update.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div ref={feedEndRef} />
          </div>
        )}
      </div>

      <footer className="p-6 bg-gradient-to-t from-[#0F111A] via-[#0F111A] to-transparent shrink-0 pt-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex flex-col gap-3 bg-[#1A1C26]/90 backdrop-blur-xl border border-white/10 p-3 rounded-2xl focus-within:border-indigo-500/50 transition-all duration-300 shadow-2xl">
          
          <div className="flex border-b border-white/5 pb-2 ml-2 gap-5">
            <button
              type="button"
              onClick={() => setType("text")}
              className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${type === 'text' ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <FaAlignLeft size={12} /> Text Entry
            </button>
            <button
              type="button"
              onClick={() => setType("code")}
              className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${type === 'code' ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <FaCode size={12} /> Code Snippet
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={type === 'code' ? 'Paste an important code snippet or function...' : 'Record a milestone, decision, or status update...'}
              className={`w-full bg-transparent p-2 text-gray-200 placeholder-gray-500 outline-none resize-none overflow-y-auto ${type === 'code' ? 'font-mono text-xs' : 'text-[14px]'}`}
              rows={type === 'code' ? 6 : 2}
            />
            
            <div className="flex justify-between items-center px-1 pb-1">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest pl-2">
                Visible to team
              </span>
              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
              >
                Post <FaPaperPlane size={11} />
              </button>
            </div>
          </div>

        </form>
      </footer>
    </div>
  );
}