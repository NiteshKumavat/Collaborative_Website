import ProjectBox from '../components/ProjectBox.jsx';
import ProjectDescription from '../components/ProjectDescription.jsx';
import { useProjectStore } from "../store/useProjectStore.js";
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from 'react';

function DashBoard() {
    const [open, setOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState({});
    const { projects, fetchAllProjects, loading, error } = useProjectStore();
    const [mode, setMode] = useState("view");
    const [searchTerm, setSearchTerm] = useState(""); // ✅ Added search state

    const projectsRef = useRef(null);

    useEffect(() => {
        fetchAllProjects();
    }, [fetchAllProjects]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleCreateClick = () => {
        setSelectedProject(null);
        setMode("create");
        setOpen(true);
    };

    const handleExploreClick = () => {
        projectsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // ✅ Filtered Projects
    const filteredProjects = projects?.filter((project) => {
        const search = searchTerm.toLowerCase();

        return (
            project.title?.toLowerCase().includes(search) ||
            project.description?.toLowerCase().includes(search) ||
            project.techStack?.some((tech) =>
                tech.toLowerCase().includes(search)
            )
        );
    });

    return (
        <div className="min-h-screen pb-20">

            {/* HERO SECTION */}
            <div className="relative pt-20 pb-20 lg:pt-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
                        Build better, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                            together.
                        </span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        The platform for developers to find teammates, collaborate on open-source,
                        and ship amazing projects.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleExploreClick}
                            className="btn-primary-glow text-lg px-8 py-3"
                        >
                            Explore Projects
                        </button>
                        <button
                            onClick={handleCreateClick}
                            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-lg font-medium transition-all"
                        >
                            Create a Team
                        </button>
                    </div>
                </div>
            </div>

            <div ref={projectsRef} className="max-w-7xl mx-auto px-6">

                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
                        <p className="text-gray-400 mt-1">Discover teams looking for your skills.</p>
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm} // ✅ Controlled input
                            onChange={(e) => setSearchTerm(e.target.value)} // ✅ Update state
                            className="input-field pl-4"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center sm:place-items-stretch">
                    
                    {loading && (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            Loading projects...
                        </div>
                    )}

                    {!loading && filteredProjects?.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                            <p className="text-gray-300 text-lg">No projects found.</p>
                            <button
                                onClick={handleCreateClick}
                                className="mt-4 text-indigo-400 hover:text-indigo-300"
                            >
                                Create one now &rarr;
                            </button>
                        </div>
                    )}

                    {!loading && filteredProjects?.map((project) => (
                        <ProjectBox
                            key={project._id}
                            project={project}
                            onStart={() => {
                                setMode("view");
                                setSelectedProject(project);
                                setOpen(true);
                            }}
                        />
                    ))}
                </div>
            </div>

            {open && (
                <ProjectDescription
                    onClose={() => { 
                        setOpen(false); 
                        setSelectedProject({}); 
                    }}
                    project={selectedProject}
                    mode={mode}
                    userRole={"viewer"}
                    setMode={setMode}
                />
            )}
        </div>
    );
}

export default DashBoard;