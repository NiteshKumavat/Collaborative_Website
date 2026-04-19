import TeamSidebar from "../components/TeamSidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import { useMessageStore } from "../store/useMessageStore.js"; 
import { useState, useEffect } from "react";

export default function Chat() {
  // 1. Get 'projects' from MessageStore (This includes teams you JOINED)
  const { projects, getMyProjects } = useMessageStore(); 
  const [selectedProject, setSelectedProject] = useState(null);
  
  

  // 2. Fetch the teams
  useEffect(() => {
    getMyProjects();
  }, [getMyProjects]);

  return (
    <div className="h-screen w-full bg-[#0B0C15] flex items-center justify-center pt-20 pb-5 px-5">
        
        <div className="w-full h-full max-w-7xl bg-[#151725] rounded-2xl border border-white/10 flex overflow-hidden shadow-2xl relative">
            
            {/* Left Sidebar */}
            <div className="w-80 border-r border-white/10 flex flex-col bg-[#0B0C15]/50">
                <div className="p-5 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">My Teams</h2>
                    <p className="text-xs text-gray-500 mt-1">Select a team to chat</p>
                </div>
                
                {/* 3. PASS 'projects', NOT 'userProjects' */}
                <TeamSidebar 
                    projects={projects} 
                    setSelectedProject={setSelectedProject}
                />
            </div>

            {/* Right Chat Window */}
            <div className="flex-1 flex flex-col relative">
                {selectedProject ? (
                    <ChatWindow project={selectedProject} />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-50">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-5">
                             <span className="text-4xl">💬</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-300">No Chat Selected</h3>
                        <p className="text-gray-500 mt-2">Choose a project from the sidebar to start collaborating.</p>
                    </div>
                )}
            </div>

        </div>
    </div>
  );
}