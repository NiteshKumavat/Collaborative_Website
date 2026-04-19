import { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaPlus, FaTimes, FaCircle } from "react-icons/fa";
import { HiOutlinePhotograph } from "react-icons/hi"; // Using cleaner icons
import { useMessageStore } from "../store/useMessageStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link, useNavigate }  from "react-router";
import ProjectFeed from "./ProjectFeed.jsx";


export default function ChatWindow({ project }) {
  const [activeTab, setActiveTab] = useState("chat");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const messageEndRef = useRef(null);


  const { messages, fetchMessages, sendMessage, deleteMessage, subscribeToMessages, unsubscribeFromMessages } = useMessageStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (!project?._id) return;
    fetchMessages(project._id);
    subscribeToMessages(project._id);
    return () => unsubscribeFromMessages();
  }, [project?._id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    await sendMessage({
      teamId: project._id,
      message: text.trim(),
      image
    });

    setText("");
    removeImage();
  };

  const deleteMessages = async (messageId) => {
    await deleteMessage(messageId);
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#0F111A] text-white/40">
        <div className="w-16 h-16 mb-4 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
          <FaPaperPlane className="opacity-20" size={24} />
        </div>
        <p className="text-sm tracking-wide">Select a project to start collaborating</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0F111A] relative shadow-2xl">
      
      <header className="px-6 py-4 border-b border-white/5 bg-[#0F111A]/80 backdrop-blur-xl flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
              {project.title.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0F111A] rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-white font-medium tracking-tight leading-none mb-1">{project.title}</h2>
            <div className="flex items-center gap-6 mt-1.5">
              <div className="flex bg-[#1A1C26] rounded-[9px] p-0.5 shadow-inner border border-white/5">
                <button 
                  onClick={() => setActiveTab('chat')} 
                  className={`px-4 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition ${activeTab === 'chat' ? 'bg-[#2A2D3E] text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Chat
                </button>
                <button 
                  onClick={() => setActiveTab('feed')} 
                  className={`px-4 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition ${activeTab === 'feed' ? 'bg-[#2A2D3E] text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Activity
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 relative"><span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span></span>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                  {project.team.length} Online
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate(`/${project._id}/call`)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition shadow-lg shadow-emerald-600/20"
        >
          <FaCircle size={10} className="animate-pulse" />
          Call
        </button>
        
      </header>

      {/* ---------------- CONTENT ---------------- */}
      {activeTab === "chat" ? (
        <>
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-hide">
        {messages.map((msg, idx) => {
          const senderId = msg.userId?._id || msg.userId;
          const isMe = senderId === authUser._id;

          return (
            <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"} group animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                
                {!isMe && (
                  <span className="text-[11px] font-bold text-indigo-400 mb-1.5 ml-1 uppercase tracking-tighter">
                    {msg.userId?.fullName || "Collaborator"}
                  </span>
                )}

                <div className={`relative px-4 py-3 rounded-2xl shadow-sm border group ${
                  isMe 
                    ? "bg-indigo-600 border-indigo-500 text-white rounded-tr-none shadow-indigo-500/10" 
                    : "bg-white/5 border-white/10 text-gray-200 rounded-tl-none"
                }`}>
                  {isMe && (
                    <button
                      onClick={() => deleteMessages(msg._id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaTimes size={10} />
                    </button>
                  )}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="attachment"
                      className="max-w-full sm:max-w-sm rounded-lg mb-2 cursor-zoom-in hover:opacity-90 transition"
                    />
                  )}
                  <p className="text-[14.5px] leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>

                <span className={`text-[10px] text-gray-500 mt-1.5 font-medium ${isMe ? "mr-1" : "ml-1"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* ---------------- INPUT AREA ---------------- */}
      <footer className="p-6 bg-gradient-to-t from-[#0F111A] via-[#0F111A] to-transparent shrink-0">
        <form onSubmit={handleSend} className="max-w-5xl mx-auto relative">
          
          {/* Image Preview Overlay */}
          {image && (
            <div className="absolute -top-32 left-0 animate-in zoom-in-95 fade-in duration-200">
              <div className="bg-[#1A1C26] p-2 rounded-2xl border border-indigo-500/30 shadow-2xl backdrop-blur-xl">
                <img src={image} alt="preview" className="w-24 h-24 object-cover rounded-xl" />
                <button 
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:scale-110 transition shadow-lg"
                >
                  <FaTimes size={10} />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 pl-4 rounded-2xl focus-within:border-indigo-500/50 transition-all duration-300">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <HiOutlinePhotograph size={22} />
            </button>
            
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleImageSelect}
            />

            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a message..."
              className="flex-1 bg-transparent py-2 text-white placeholder-gray-500 outline-none text-sm"
            />

            <button
              type="submit"
              disabled={!text.trim() && !image}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              <FaPaperPlane size={14} />
            </button>
          </div>
        </form>
      </footer>
        </>
      ) : (
        <ProjectFeed project={project} />
      )}
    </div>
  );
}