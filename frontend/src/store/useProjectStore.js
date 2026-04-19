import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useProjectStore = create((set, get) => ({
  projects: [],
  userProjects: [],
  projectUpdates: {},
  loading: false,
  error: null,


  fetchAllProjects: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get("/project");
      set({ projects: res.data.filteredProjects });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch projects" });
    } finally {
      set({ loading: false });
    }
  },


  fetchUserProjects: async (userId) => {
    try {

      set({ loading: true });
      const res = await axiosInstance.get(`/project/${userId}/projects`);
      set({ userProjects: res.data.projects });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch user projects" });
    } finally {
      set({ loading: false });
    }
  },


  createProject: async (projectData) => {
    try {
      const res = await axiosInstance.post("/project", projectData);
      set({ userProjects: [res.data.project, ...get().userProjects] });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },


  updateProject: async (projectId, updates) => {
    try {
      const res = await axiosInstance.put(`/project/${projectId}`, updates);

      set({
        projects: get().projects.map((proj) =>
          proj._id === projectId ? res.data.project : proj
        )
      });

      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },


  leaveProject: async (projectId) => {
    try {
      await axiosInstance.put(`/project/${projectId}/leave`);
      set({
        projects: get().projects.filter((proj) => proj._id !== projectId),
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },



  deleteProject: async (projectId) => {
    try {
      await axiosInstance.delete(`/project/${projectId}`);

      set({
        projects: get().projects.filter((proj) => proj._id !== projectId),
      });

      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  requestToJoin: async (projectId) => {
    try {
      const res = await axiosInstance.put(`/project/${projectId}/request`);
      set((state) => ({
        projects: state.projects.map(p =>
          p._id === projectId ? res.data.project : p
        )
      }));
      return { success: true, message: res.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },


  acceptRequest: async (projectId, userId) => {
    try {
      const res = await axiosInstance.put(`/project/${projectId}/request/${userId}/accept`);
      set((state) => ({
        projects: state.projects.map(p =>
          p._id === projectId ? res.data.project : p
        )
      }));
      return { success: true, message: res.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  generateAIProject: async (title) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post("/project/generate-ai", { title });
      return { success: true, data: res.data };
    } catch (error) {
      // toast.error(error.response?.data?.message || 'API Key Invalid or Network Error');
      return {
        success: false,
        message: error.response?.data?.message || "AI Generation Failed"
      };
    } finally {
      set({ loading: false });
    }
  },

  rejectRequest: async (projectId, userId) => {
    try {
      const res = await axiosInstance.put(`/project/${projectId}/request/${userId}/reject`);
      set((state) => ({
        projects: state.projects.map(p =>
          p._id === projectId ? res.data.project : p
        )
      }));
      return { success: true, message: res.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  fetchProjectUpdates: async (projectId) => {
    try {
      const res = await axiosInstance.get(`/project/${projectId}/updates`);
      set((state) => ({
        projectUpdates: { ...state.projectUpdates, [projectId]: res.data }
      }));
    } catch (error) {
      console.log("Error fetching updates:", error);
    }
  },

  addProjectUpdate: async (projectId, data) => {
    try {
      const res = await axiosInstance.post(`/project/${projectId}/updates`, data);
      set((state) => {
        const currentUpdates = state.projectUpdates[projectId] || [];
        const exists = currentUpdates.some(u => u._id === res.data._id);
        if (exists) return state;

        return {
          projectUpdates: {
            ...state.projectUpdates,
            [projectId]: [...currentUpdates, res.data]
          }
        };
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  subscribeToProjectUpdates: (projectId) => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    
    socket.emit("joinProject", projectId);
    socket.on("new-project-update", (update) => {
      set((state) => {
        const currentUpdates = state.projectUpdates[projectId] || [];
        const exists = currentUpdates.some(u => u._id === update._id);
        if (exists) return state;
        
        return {
          projectUpdates: {
            ...state.projectUpdates,
            [projectId]: [...currentUpdates, update]
          }
        };
      });
    });
  },

  unsubscribeFromProjectUpdates: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("new-project-update");
  },

  removeUserFromProject: async (projectId, userId) => {
    try {
      const res = await axiosInstance.put(`/project/remove/member`, { projectId, userId });

      set((state) => ({
        userProjects: state.userProjects.map(p => {
          if (p._id === projectId) {
            return {
              ...p,
              team: p.team.filter(member => member.userId !== userId),
            };
          }else{
            return p;
          }
        }
          
        )
      }));

      
      return { success: true, message: res.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

}));

