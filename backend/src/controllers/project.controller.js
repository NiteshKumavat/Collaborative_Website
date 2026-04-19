import Profile from "../models/Profile.js";
import Project from "../models/Project.js";
import cloudinary from "../lib/cloudinary.js";
import Groq from "groq-sdk";
import { io } from "../lib/socket.js";

export const getAllProjects = async (req, res) => {
  try {
    const viewerId = req.user._id;

    const viewerProfile = await Profile.findOne({ user: viewerId }).select("blockList");
    const blockedUsers = viewerProfile?.blockList || [];


    const blockedByUsers = await Profile.find({
      blockList: viewerId
    }).select("user");

    const usersWhoBlockedMe = blockedByUsers.map(u => u.user.toString());

    const excludedUsers = [...blockedUsers.map(u => u.toString()), ...usersWhoBlockedMe];

    const projects = await Project.find({
      adminId: { $nin: excludedUsers }
    });


    const filteredProjects = projects.filter(project =>
      project.adminId._id.toString() !== viewerId.toString()
    );

    return res.status(200).json({ filteredProjects });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getUserProjects = async (req, res) => {
  try {
    const userId = req.params.userId;

    const projects = await Project.find({ adminId: userId });

    return res.status(200).json({ projects });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const createProject = async (req, res) => {
  try {
    const { title, description, skills } = req.body;
    const adminId = req.user._id;

    if (!title || !description) return res.status(400).json({ message: "Title and Description are required" });

    // Enforce Pro plan limit
    if (req.user.plan === "free") {
      const projectCount = await Project.countDocuments({ adminId });
      if (projectCount >= 2) {
        return res.status(403).json({ message: "Free users can only create up to 2 projects. Please upgrade to Pro." });
      }
    }

    let imageUrl = null;
    if (req.body.image) {
      const upload = await cloudinary.uploader.upload(req.body.image);
      imageUrl = upload.secure_url;
    }

    const project = await Project.create({
      adminId,
      title,
      description,
      skills,
      image: imageUrl,
      team: [{ userId: adminId, name: req.user.fullName }],
    });

    return res.status(201).json({ project });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const adminId = req.user._id;

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.adminId.toString() !== adminId.toString())
      return res.status(403).json({ message: "Only admin can update project" });

    if (req.body.image) {
      const upload = await cloudinary.uploader.upload(req.body.image);
      req.body.image = upload.secure_url;
    }

    const updatedProject = await Project.findByIdAndUpdate(projectId, req.body, { new: true });
    await updatedProject.save();

    return res.status(200).json({ project: updatedProject });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const leaveProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.user._id;

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.adminId.toString() === userId.toString()) {
      return res.status(400).json({ message: "Admin cannot leave the project. Delete it instead." });
    }
    project.team = project.team.filter(member => member.userId.toString() !== userId.toString());

    await project.save();

    return res.status(200).json({ message: "Left the project successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.user._id;

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.adminId.toString() !== userId.toString())
      return res.status(403).json({ message: "You are not allowed to delete this project" });

    await project.deleteOne();
    await Message.deleteMany({ teamId: projectId });
    return res.status(200).json({ message: "Project deleted successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const requestToJoin = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.user._id;

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ message: "Project not found" });

    // 1. Admin cannot join their own project
    if (project.adminId.toString() === userId.toString()) {
      return res.status(400).json({ message: "Admin cannot join their own project" });
    }

    // 2. Check Profile blocklist
    const adminProfile = await Profile.findOne({ user: project.adminId });
    if (adminProfile && adminProfile.blockList.includes(userId.toString())) {
      return res.status(403).json({ message: "You are blocked by the project admin" });
    }

    // 3. Check if the user isAvailableForCollab
    const userProfile = await Profile.findOne({ user: userId });
    if (userProfile && !userProfile.isAvailableForCollab) {
      return res.status(400).json({ message: "You must be available for collaboration to request joining a project" });
    }

    const alreadyMember = project.team.some(member => member.userId.toString() === userId.toString());
    const alreadyRequested = project.requests.some(req => req.userId.toString() === userId.toString());

    if (alreadyMember) return res.status(400).json({ message: "You are already a member" });
    if (alreadyRequested) return res.status(400).json({ message: "Request already sent" });

    project.requests.push({
      userId,
      name: req.user.fullName,
    });

    await project.save();

    return res.status(200).json({ message: "Request sent successfully", project : project });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



// 👉 Accept Request (Admin Only)
export const acceptRequest = async (req, res) => {
  try {
    const { projectId, requestUserId } = req.params;
    const adminId = req.user._id;

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.adminId.toString() !== adminId.toString())
      return res.status(403).json({ message: "Only admin can accept requests" });

    const request = project.requests.find(r => r.userId.toString() === requestUserId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    project.team.push(request);
    project.requests = project.requests.filter(r => r.userId.toString() !== requestUserId);

    await project.save();

    return res.status(200).json({ message: "Member added", project });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




export const rejectRequest = async (req, res) => {
  try {
    const { projectId, requestUserId } = req.params;
    const adminId = req.user._id;

    const project = await Project.findById(projectId);

    if (project.adminId.toString() !== adminId.toString())
      return res.status(403).json({ message: "Only admin can reject requests" });

    project.requests = project.requests.filter(r => r.userId.toString() !== requestUserId);

    await project.save();

    return res.status(200).json({ message: "Request rejected" });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const generateProjectAI = async (req, res) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Project title is required" });
    }

    // AI Gate: Limit free users to 3 uses
    if (req.user.plan === "free") {
      if (req.user.magicWandUses >= 3) {
        return res.status(403).json({ message: "Free users are limited to 3 Magic Wand uses. Please upgrade to Pro." });
      }
      // Increment usages
      req.user.magicWandUses += 1;
      await req.user.save();
    }

    const prompt = `
      Act as a Senior CTO. I am building a project titled: "${title}".
      1. Write a professional, concise description (max 2 sentences) explaining what this project does.
      2. List the 4 most important technologies (Skills) needed to build it (e.g., React, Node.js, Python).
      
      Return ONLY valid JSON in this format:
      {
        "description": "string",
        "skills": ["string", "string"]
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile", // Currently supported model
      response_format: { type: "json_object" }, // Enforce JSON
    });

    let content = chatCompletion.choices[0].message.content;

    // Safety fallback for unexpected markdown wrappers
    if (content.includes('```json')) {
      content = content.split('```json')[1].split('```')[0];
    } else if (content.includes('```')) {
      content = content.split('```')[1].split('```')[0];
    }

    const aiResponse = JSON.parse(content.trim());

    return res.status(200).json(aiResponse);

  } catch (error) {
    console.error("AI Generation Error:", error);
    return res.status(500).json({ message: "Failed to generate AI content" });
  }
};

export const getProjectUpdates = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate({
      path: 'updates.sender',
      select: 'fullName profilePicture'
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    return res.status(200).json(project.updates);
  } catch (error) {
    console.error("Error fetching project updates:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addProjectUpdate = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { content, type } = req.body;
    const userId = req.user._id;

    if (!content) return res.status(400).json({ message: "Content is required" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Validate user is authorized (admin or team member)
    const isMember = project.team.some(member => member.userId.toString() === userId.toString());
    const isAdmin = project.adminId.toString() === userId.toString();
    if (!isMember && !isAdmin) return res.status(403).json({ message: "Not authorized to update this project" });

    const newUpdate = {
      sender: userId,
      content,
      type: type || "text",
      createdAt: new Date(),
    };

    project.updates.push(newUpdate);
    await project.save();

    const populatedProject = await Project.findById(projectId).populate({
      path: 'updates.sender',
      select: 'fullName profilePicture'
    });

    const populatedUpdate = populatedProject.updates[populatedProject.updates.length - 1];

    // Emit to socket room
    io.to(projectId).emit('new-project-update', populatedUpdate);

    return res.status(201).json(populatedUpdate);
  } catch (error) {
    console.error("Error adding project update:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeUserFromProject = async (req, res) => {
  try {
    const { projectId, userId } = req.body;
    const adminId = req.user._id;

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.adminId.toString() !== adminId.toString())
      return res.status(403).json({ message: "Only admin can remove members" });

    project.team = project.team.filter(member => member.userId.toString() !== userId.toString());
    await project.save();

    return res.status(200).json({ message: "Member removed", project });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};