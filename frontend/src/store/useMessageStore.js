import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore"; // Import auth store to access socket

export const useMessageStore = create((set, get) => ({

    messages: [],
    projects: [],
    loading: false,
    error: null,

    startLoading: () => set({ loading: true, error: null }),
    stopLoading: () => set({ loading: false }),
    setError: (msg) => set({ error: msg }),

    getMyProjects: async () => {
        set({ loading: true });
        try {
            // 🛑 OLD/WRONG: 
            // const res = await axiosInstance.get("/api/project/my-projects");

            // ✅ NEW/CORRECT: (Matches your backend route)
            const res = await axiosInstance.get("/message/teams");
            
            set({ projects: res.data.data }); 
        } catch (err) {
            console.log(err);
            toast.error("Unable to load your teams");
        } finally {
            set({ loading: false });
        }
    },

    fetchMessages: async (projectId) => {
        set({ loading: true });
        try {

            const res = await axiosInstance.get(`/message/teams/${projectId}`);

            set({ messages: res.data.data }); 
        } catch (err) {
            console.log(err);
        } finally {
            set({ loading: false });
        }
    },

    sendMessage: async ({ teamId, message, image }) => {
        const { messages } = get(); 
        try {
            const updates = {teamId, message, image};
            const res = await axiosInstance.post(
                `/message`,
                updates,
                { withCredentials: true }
            );

            const newMessage = res.data.data;
            

            const isDuplicate = messages.some(m => m._id === newMessage._id);
            
            if (!isDuplicate) {
                set({ messages: [...messages, newMessage] });
            }

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to send message");
        }
    },

    deleteMessage: async (messageId) => {
        try {
            await axiosInstance.delete(`/message/${messageId}`);
            set({ messages: get().messages.filter(m => m._id !== messageId) });
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete message");
        }
    },

    // ============================
    // SOCKET Live Updates
    // ============================
     subscribeToMessages: (projectId) => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        
        // 1. Join the Room
        socket.emit("joinProject", projectId);

        // 2. Listen for New Messages
        socket.on("newMessage", (newMessage) => {

            const messageRoomId = newMessage.teamId || newMessage.projectId;

            // Only add if it belongs to the currently open chat
            if (messageRoomId !== projectId) {
                console.log("⚠️ Message ignored (Wrong Room):", messageRoomId);
                return;
            }

            // Update State
            set({ messages: [...get().messages, newMessage] });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off("newMessage");
    },
}));    