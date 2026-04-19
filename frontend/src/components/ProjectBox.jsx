import React from 'react';
import { useProjectStore } from '../store/useProjectStore.js';
import { useAuthStore } from '../store/useAuthStore.js';

function ProjectBox({ onStart, project, isOwner }) { 
    const { requestToJoin, leaveProject, loading } = useProjectStore();
    const { authUser } = useAuthStore();
    
    const hasRequested = project.requests?.some(req => req.userId === authUser?._id);
    const isTeamMember = project.team?.some(member => member.userId === authUser?._id && member.userId !== project.adminId);

    const showJoinButton = !isOwner && !isTeamMember && !hasRequested && authUser?._id;

    const onJoin = async () => {
        await requestToJoin(project._id);
        
    };
    const onLeave = async () => await leaveProject(project._id);

    return (
        <div 
            className="
                w-full max-w-[300px] rounded-2xl overflow-hidden
                glass-card hover:-translate-y-2 transition-all duration-300 cursor-pointer group
            " 
            onClick={onStart}
        >

            {/* Image Header with Gradient Overlay */}
            <div className="relative h-44 overflow-hidden">
                <img 
                    src={project.image || `https://api.dicebear.com/9.x/shapes/svg?seed=${project.title}`}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Dark Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C15] via-transparent to-transparent opacity-90"></div>
                
                <h2 className="absolute bottom-4 left-4 text-white font-bold text-xl tracking-tight leading-none drop-shadow-md">
                    {project.title}
                </h2>
            </div>

            {/* Content Body */}
            <div className="p-5">
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 h-10">
                    {project.description || "No description provided for this project."}
                </p>

                {/* Skills Section */}
                <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                        {project.skills?.slice(0, 3).map((skill, index) => (
                            <span 
                                key={index}
                                className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 text-indigo-300 border border-white/10"
                            >
                                {skill}
                            </span>
                        ))}

                        {project.skills?.length > 3 && (
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 text-gray-400 border border-white/10">
                                +{project.skills.length - 3}
                            </span>
                        )}
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                {showJoinButton && (
                    <button
                        className={`
                            w-full mt-6 py-2.5 font-semibold rounded-xl text-sm
                            transition-all duration-300 shadow-lg
                            ${hasRequested 
                                ? "bg-gray-700 text-gray-400 cursor-not-allowed border border-white/5" 
                                : "btn-primary-glow"
                            }
                        `}
                        onClick={(e) => {
                            e.stopPropagation();
                            onJoin();
                        }}
                        disabled={loading || hasRequested}
                    >
                        {loading ? "Sending..." : hasRequested ? "Request Pending" : "Join Project"}
                    </button>
                )}

                {isTeamMember && (
                    <button
                        className="w-full mt-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold rounded-xl transition-all"
                        onClick={(e) => {
                            e.stopPropagation();
                            onLeave();
                        }}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Leave Team"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default ProjectBox;