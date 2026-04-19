import ProjectBox from "./ProjectBox.jsx";
import ProjectDescription from "./ProjectDescription.jsx"; // Import ProjectDescription
import { useState } from "react";

export default function ProfileProjects({ projects, isOwner, onCreate }) {
    const [selectedProject, setSelectedProject] = useState(null);
    const [modalMode, setModalMode] = useState("view");


    const handleProjectClick = (project) => {
        setSelectedProject(project);
        setModalMode("view");
    };

    

    return (
        <div className="mt-6">
            <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">Projects</h2>

                {isOwner && (
                    <button
                        onClick={onCreate}
                        className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl"
                    >
                        Create Project
                    </button>
                )}
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,250px)] gap-4 mt-4">
                {projects?.length ? (
                    projects.map((p) => (
                        <ProjectBox 
                            key={p._id} 
                            project={p} 
                            isOwner={isOwner}
                            onStart={() => handleProjectClick(p)} // Fixed prop name
                        />
                    ))
                ) : (
                    <p className="text-gray-300 text-sm">No projects yet</p>
                )}
            </div>

            {/* Project Details Modal */}
            {selectedProject && (
                <ProjectDescription
                    mode={modalMode}
                    project={selectedProject}
                    onClose={() => {
                        setSelectedProject(null);
                        setModalMode("view");
                    }}
                    
                    userRole={isOwner ? "admin" : "viewer"}
                    setMode={setModalMode}
                />
            )}
        </div>
    );
}
