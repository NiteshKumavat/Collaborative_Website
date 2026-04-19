import Message from "../models/Message.js";
import Project from "../models/Project.js";
import { io } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js";

// 1. Get All Teams (For Sidebar)
export const getUserTeams = async (req, res) => {
  try {
    const userId = req.user._id;
    // Find projects where the user is in the team
    const teams = await Project.find({
      "team.userId": userId
    }).select("title description image team");

    // Return in the format your frontend expects { data: [...] }
    res.status(200).json({ data: teams });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// 2. Get Messages for a specific Team
export const getTeamMessages = async (req, res) => {
  try {
    const { teamId } = req.params;

    // Verify user is member
    const project = await Project.findById(teamId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isMember = project.team.some(m => m.userId.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ message: "Not a member" });

    // Match your Schema: "teamId"
    const messages = await Message.find({ teamId })
      .populate("userId", "fullName profilePicture") // Populate sender info
      .sort({ createdAt: 1 });

    res.status(200).json({ data: messages });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


export const sendMessage = async (req, res) => {
  try {

    const { teamId, message, image } = req.body;
    const userId = req.user._id;


    const project = await Project.findById(teamId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isMember = project.team.some(m => m.userId.toString() === userId.toString());
    if (!isMember) return res.status(403).json({ message: "Not a member" });
    let newImage = null;

    if(image){
      const upload = await cloudinary.uploader.upload(image);
      newImage = upload.secure_url;
    }


    const newMessage = new Message({
      userId,        
      teamId,       
      message : message || "",       
      image : newImage || null 
    });

    await newMessage.save();

    // Populate user details immediately for the UI
    await newMessage.populate("userId", "fullName profilePicture");

    // --- REAL TIME MAGIC ---
    // Emit to the specific Room ID (teamId)
    io.to(teamId).emit("newMessage", newMessage);

    res.status(201).json({ data: newMessage });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message, image } = req.body;
    const userId = req.user._id;

    const existingMessage = await Message.findById(messageId);
    if (!existingMessage) return res.status(404).json({ message: "Message not found" });
    if (existingMessage.userId.toString() !== userId.toString()) return res.status(403).json({ message: "Unauthorized to update this message" });

    let newImage = existingMessage.image;
    if (image && image !== existingMessage.image) {
      if (image !== "") {
        const upload = await cloudinary.uploader.upload(image);
        newImage = upload.secure_url;
      } else {
        newImage = "";
      }
    }

    existingMessage.message = message !== undefined ? message : existingMessage.message;
    existingMessage.image = newImage;
    await existingMessage.save();

    await existingMessage.populate("userId", "fullName profilePicture");

    // Update real-time 
    io.to(existingMessage.teamId.toString()).emit("messageUpdated", existingMessage);

    res.status(200).json({ data: existingMessage });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const existingMessage = await Message.findById(messageId);
    if (!existingMessage) return res.status(404).json({ message: "Message not found" });
    if (existingMessage.userId.toString() !== userId.toString()) return res.status(403).json({ message: "Unauthorized to delete this message" });

    const teamId = existingMessage.teamId.toString();
    await existingMessage.deleteOne();

    // Update real-time
    io.to(teamId).emit("messageDeleted", messageId);

    res.status(200).json({ message: "Message deleted successfully", messageId });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProjectMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    const messages = await Message.find({ teamId: projectId })
      .populate("userId", "fullName profilePicture")
      .sort({ createdAt: 1 });
    res.status(200).json({ data: messages });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};