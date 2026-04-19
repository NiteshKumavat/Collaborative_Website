import { useState, useEffect } from "react";
// Added 'Sparkles' to imports
import {
  X,
  Plus,
  Image as ImageIcon,
  Users,
  Trash2,
  Edit2,
  LogOut,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { useProjectStore } from "../store/useProjectStore.js";
import { useMessageStore } from "../store/useMessageStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import toast from "react-hot-toast";

const ProjectDescription = ({ onClose, project, mode, setMode }) => {
  // Destructured 'generateAIProject' from store
  const {
    createProject,
    updateProject,
    deleteProject,
    requestToJoin,
    leaveProject,
    generateAIProject,
    removeUserFromProject,
  } = useProjectStore();
  const { authUser } = useAuthStore();
  const { getMyProjects } = useMessageStore();
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // New State for AI Loading
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: [],
    team: [],
    image: "",
    repoLink: "",
  });

  const isOwner =
    authUser?._id === project?.adminId?._id ||
    authUser?._id === project?.adminId;
  const isTeamMember = project?.team?.some(
    (member) => member.userId === authUser?._id,
  );
  const hasRequested = project?.requests?.some(
    (req) => req.userId === authUser?._id,
  );

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || "",
        description: project.description || "",
        skills: project.skills || [],
        team: project.team || [],
        image: project.image || "",
        repoLink: project.repoLink || "",
      });
      setImagePreview(project.image || "");
    }
  }, [project]);

  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isView = mode === "view";

  const handleAIGenerate = async () => {
    if (!form.title.trim()) {
      toast.error("Please enter a Title first (e.g., 'Fitness Tracker')");
      return;
    }

    setIsGenerating(true);
    const res = await generateAIProject(form.title);
    setIsGenerating(false);

    if (res.success) {
      setForm((prev) => ({
        ...prev,
        title: form.title, // Keep the original title
        description: res.data.description,
        skills: res.data.skills,
      }));
      toast.success("AI generated the roadmap! 🚀");
    } else {
      toast.error("AI failed to respond. Please try again.");
    }
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    if (!form.skills.includes(skillInput.trim())) {
      setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
    }
    setSkillInput("");
  };

  const handleSkillRemove = (index) => {
    setForm({ ...form, skills: form.skills.filter((_, i) => i !== index) });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setForm({ ...form, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      alert("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      let res;
      if (isCreate) {
        res = await createProject(form);
        if (res.success) {
          await getMyProjects();
        }
      } else if (isEdit) res = await updateProject(project._id, form);

      if (res?.success) onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure?")) return;
    setLoading(true);
    try {
      const res = await deleteProject(project._id);
      if (res.success) onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setLoading(true);
    await requestToJoin(project._id);
    setLoading(false);
  };

  const handleLeave = async () => {
    if (!window.confirm("Leave this team?")) return;
    setLoading(true);
    await leaveProject(project._id);
    setLoading(false);
  };

  const removeUser = async (projectId, userId) => {
    if (!window.confirm("Remove this member?")) return;

    try {
      const res = await removeUserFromProject(projectId, userId);

      if (res.success) {
        toast.success("Member removed");

        setForm((prev) => ({
          ...prev,
          team: prev.team.filter((member) => member.userId !== userId),
        }));
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0B0C15]/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="w-full max-w-2xl bg-[#151725] border border-white/10 rounded-2xl shadow-2xl text-gray-100 relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/20 hover:bg-white/10 p-2 rounded-full transition text-gray-400 hover:text-white z-10"
        >
          <X size={20} />
        </button>

        <div className="overflow-y-auto p-8 custom-scrollbar">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-2xl border-2 border-white/10 shadow-lg overflow-hidden bg-[#0B0C15]">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Project"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>
              {(isCreate || isEdit) && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition cursor-pointer rounded-2xl">
                  <ImageIcon size={20} className="text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            <div className="w-full">
              {isView ? (
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  {form.title}
                </h1>
              ) : (
                <div className="relative w-full">
                  <input
                    className="input-field text-lg font-semibold pr-12 w-full"
                    placeholder="Project Title (e.g. Crypto Wallet)"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />

                  {isCreate && (
                    <button
                      onClick={handleAIGenerate}
                      disabled={isGenerating || !form.title}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-indigo-500/20"
                      title="Auto-fill with AI"
                    >
                      <Sparkles
                        size={18}
                        className={
                          isGenerating
                            ? "animate-spin"
                            : "group-hover:scale-110 transition"
                        }
                      />
                    </button>
                  )}
                </div>
              )}

              {isView && (
                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20">
                    Active
                  </span>
                  {isTeamMember && (
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-medium rounded-full border border-indigo-500/20">
                      Member
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              About
            </h3>
            {isView ? (
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {form.description}
              </p>
            ) : (
              <div className="relative">
                <textarea
                  className="input-field min-h-[120px] w-full"
                  placeholder="Description..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
                {/* AI Loading Overlay */}
                {isGenerating && (
                  <div className="absolute inset-0 bg-[#151725]/80 backdrop-blur-sm flex items-center justify-center rounded-xl border border-white/10 z-10">
                    <span className="text-indigo-400 text-sm font-bold animate-pulse flex items-center gap-2">
                      <Sparkles size={16} /> AI is writing...
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {form.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-[#6366F1]/10 text-[#818CF8] border border-[#6366F1]/20 rounded-lg text-sm font-medium flex gap-2"
                >
                  {skill}
                  {!isView && (
                    <button onClick={() => handleSkillRemove(i)}>×</button>
                  )}
                </span>
              ))}
              {(isCreate || isEdit) && (
                <div className="flex gap-2">
                  <input
                    className="bg-transparent border border-white/10 rounded-lg px-2 py-1 text-sm text-white w-32"
                    placeholder="+ Add"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                  />
                  <button
                    onClick={handleAddSkill}
                    className="text-white bg-white/10 p-1 rounded"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* GitHub Repo */}
          <div className="mt-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              GitHub Repository
            </h3>

            {isView ? (
              form.repoLink ? (
                <a
                  href={form.repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline break-all"
                >
                  {form.repoLink}
                </a>
              ) : (
                <p className="text-gray-500 text-sm">No repository added</p>
              )
            ) : (
              <input
                type="url"
                placeholder="https://github.com/username/repo"
                value={form.repoLink}
                onChange={(e) => setForm({ ...form, repoLink: e.target.value })}
                className="input-field w-full"
              />
            )}
          </div>
          {/* Members Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                Team Members ({form.team.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {form.team.map((member, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                    {member.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                      {member.name}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {member.userId === project?.adminId ||
                      member.userId === project?.adminId._id
                        ? "Project Lead"
                        : member.role}
                    </span>
                  </div>
                  {isOwner && member.userId !== authUser?._id && (
                    <button
                      onClick={() => removeUser(project._id, member.userId)}
                      className="ml-auto text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Optional: Show Pending Requests only to the Owner in View Mode */}
          {isView && isOwner && project?.requests?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-bold text-orange-500/80 uppercase tracking-wider mb-3 flex items-center gap-2">
                Pending Requests ({project.requests.length})
              </h3>
              <div className="space-y-2">
                {project.requests.map((req, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-orange-500/5 border border-orange-500/10"
                  >
                    <span className="text-sm text-gray-300">{req.name}</span>
                    <button className="text-xs bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-3 py-1 rounded-lg transition">
                      Review
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="mt-10 pt-6 border-t border-white/10 flex justify-end gap-3">
            {(isCreate || isEdit) && (
              <button
                onClick={handleSubmit}
                className="btn-primary-glow"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Project"}
              </button>
            )}

            {isView && isOwner && (
              <>
                <button
                  onClick={handleDelete}
                  className="px-5 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition flex gap-2 items-center"
                >
                  <Trash2 size={16} /> Delete
                </button>
                <button
                  onClick={() => setMode("edit")}
                  className="px-5 py-2 text-white bg-white/5 hover:bg-white/10 rounded-xl transition flex gap-2 items-center"
                >
                  <Edit2 size={16} /> Edit
                </button>
              </>
            )}

            {isView && !isOwner && (
              <>
                {isTeamMember ? (
                  <button
                    onClick={handleLeave}
                    className="px-5 py-2 text-red-400 border border-red-500/20 hover:bg-red-500/10 rounded-xl transition flex gap-2 items-center"
                  >
                    <LogOut size={16} /> Leave Team
                  </button>
                ) : hasRequested ? (
                  <button
                    disabled
                    className="px-5 py-2 text-gray-400 bg-gray-800 rounded-xl cursor-not-allowed flex gap-2 items-center"
                  >
                    <CheckCircle size={16} /> Request Sent
                  </button>
                ) : (
                  <button
                    onClick={handleJoin}
                    className="btn-primary-glow"
                    disabled={loading}
                  >
                    {loading ? "Joining..." : "Join Project"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDescription;
