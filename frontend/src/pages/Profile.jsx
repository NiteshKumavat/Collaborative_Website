import { useEffect, useState } from "react";
import { useParams } from "react-router";
// REMOVED: import Header from "../components/Header";  <-- Caused the double header
import ProfileHeader from "../components/ProfileHeader";
import ProfileInfo from "../components/ProfileInfo";
import ProfileLinks from "../components/ProfileLinks";
import ProfileProjects from "../components/ProfileProjects";
import ProfileRequests from "../components/ProfileRequests";
import ProfileActions from "../components/ProfileActions";
import { useAuthStore } from "../store/useAuthStore";
import { useProfileStore } from "../store/useProfileStore";
import { useProjectStore } from "../store/useProjectStore";
import { Toaster } from "react-hot-toast";
import ProjectDescription from "../components/ProjectDescription.jsx";
import ProfileGithub from "../components/ProfileGithub.jsx";

export default function Profile() {
    const { id } = useParams();
    const [editMode, setEditMode] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [selectedImage, setSelectedImage] = useState(null); 
    const [showCreateProject, setShowCreateProject] = useState(false); 

    const { authUser } = useAuthStore();
    const { profile, fetchProfile, updateProfile, blockUser, unblockUser, blockedIds, fetchGithubRepos, githubRepos, loadingGithub, error: githubError } = useProfileStore();
    const { deleteProfile } = useProfileStore();    

    const { fetchUserProjects, userProjects} = useProjectStore(); 

    const isOwner = authUser?._id === id;

    // ---------- LOCAL STATE ----------
    const [info, setInfo] = useState({
        fullName: "",
        email: "",
        bio: "",
        skills: [],
        links: { linkedin: "", github: "", portfolio: "" },
        profilePicture: "",
        isAvailableForCollab: true,
        blockList: []
    });

    // ---------- FETCH PROFILE ----------
    useEffect(() => {
        fetchProfile(id);
        fetchUserProjects(id);
    }, [id, fetchProfile, fetchUserProjects]);

    useEffect(() => {
        if (profile?._id) {
            setInfo({
                fullName: profile.fullName || "",
                email: profile.email || "",
                bio: profile.bio || "",
                skills: profile.skills || [],
                links: {
                    linkedin: profile.websites?.find(w => w.websiteName === "LinkedIn")?.websiteLink || "",
                    github: profile.websites?.find(w => w.websiteName === "GitHub")?.websiteLink || "",
                    portfolio: profile.websites?.find(w => w.websiteName === "Portfolio")?.websiteLink || ""
                },
                profilePicture: profile.profilePicture || "",
                isAvailableForCollab: profile.isAvailableForCollab ?? true,
                blockList: profile.blockList || []
            });

            // Trigger GitHub fetch if a GitHub link exists
            const githubLink = profile.websites?.find(w => w.websiteName === "GitHub")?.websiteLink;
            if (githubLink) {
                // Pass directly to let backend sanitize
                fetchGithubRepos(githubLink);
            }
        }
    }, [profile, fetchGithubRepos]);

    // ---------- FIELD UPDATERS ----------
    const updateField = (field, value) => {
        setInfo(prev => ({ ...prev, [field]: value }));
    };

    const updateLink = (name, value) => {
        setInfo(prev => ({
            ...prev,
            links: { ...prev.links, [name]: value }
        }));
    };

    // ---------- SAVE CHANGES ----------
    const saveChanges = async () => {
        const websites = [];
        if (info.links.linkedin) websites.push({ websiteName: "LinkedIn", websiteLink: info.links.linkedin });
        if (info.links.github) websites.push({ websiteName: "GitHub", websiteLink: info.links.github });
        if (info.links.portfolio) websites.push({ websiteName: "Portfolio", websiteLink: info.links.portfolio });

        const payload = { ...info, websites };
        delete payload.links;

        await updateProfile(payload);
        setEditMode(false);
    };

    // ---------- HANDLE PROJECT CREATION ----------
    const handleCreateProject = () => {
        setShowCreateProject(true);
    };

    const block = async (id) => await blockUser(id)
    const unBlock = async (id) => await unblockUser(id)
    const isBlocked = blockedIds.includes(id);

    return (
        <div className="min-h-screen w-full pb-20"> {/* Added pb-20 for footer space */}
            <Toaster />
           

            <div className="w-[90%] md:w-[80%] mx-auto pt-24 px-4">
                
                <div className="glass-card p-8 rounded-2xl"> {/* Removed explicit bg-white/10, used glass-card class */}

                    <ProfileHeader
                        info={info}
                        setInfo={setInfo}
                        isOwner={isOwner}
                        editMode={editMode}
                        setEditMode={setEditMode}
                        saveChanges={saveChanges}
                        setSelectedImage={setSelectedImage}
                    />

                    {/* Components (Inputs need fixing in their own files) */}
                    <ProfileInfo
                        editMode={editMode}
                        info={info}
                        updateField={updateField}
                    />

                    <ProfileLinks
                        editMode={editMode}
                        info={info}
                        updateLink={updateLink}
                    />

                    <ProfileGithub 
                        repos={githubRepos} 
                        loading={loadingGithub} 
                        username={info.links?.github} 
                        error={githubError} 
                    />

                    {isOwner && (
                        <ProfileProjects 
                            projects={userProjects} 
                            isOwner={isOwner} 
                            onCreate={handleCreateProject}
                        />
                    )}

                    {isOwner && <ProfileRequests id={id}/>}

                    <ProfileActions isOwner={isOwner} profileId={id} block={block} unBlock={unBlock} isBlocked={isBlocked} deleteProfile ={deleteProfile}/>
                </div>
            </div>

            {showCreateProject && (
                <ProjectDescription
                    mode="create"
                    project={{}}
                    onClose={() => setShowCreateProject(false)}
                    userRole={isOwner ? "admin" : "viewer"}
                    setMode={() => {}}   
                />
            )}
        </div>
    );
}