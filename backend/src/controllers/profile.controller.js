import Profile from "../models/Profile.js";
import cloudinary from "../lib/cloudinary.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import axios from "axios";


export const getAllUsers = async (req, res) => {
  try {
    const viewerId = req.user._id;

    const profiles = await Profile.find({
      user: { $ne: viewerId },
      blockList: { $nin: [viewerId] }
    })
      .sort({ isAvailableForCollab: -1 });

    if (!profiles.length) return res.status(404).json({ message: "No profiles found" });

    res.status(200).json({ profiles, currentUserId: viewerId   });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const getProfile = async (req, res) => {
  try {
    const ownerId = req.params.Id;
    const viewerId = req.user._id;

    const ownerProfile = await Profile.findOne({ user: ownerId });
    const viewerProfile = await Profile.findOne({ user: viewerId });


    if (!ownerProfile) return res.status(404).json({ message: "Profile Not Found" });

    const isBlocked = ownerProfile.blockList.includes(viewerId.toString());
    if (isBlocked) return res.status(403).json({ message: "You are blocked by this user" });

    return res.status(200).json({ profile: ownerProfile, blockList: viewerProfile.blockList });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const updateProfile = async (req, res) => {

  try {
    const userId = req.user._id;
    const updates = req.body;


    if (updates?.profilePicture) {
      const upload = await cloudinary.uploader.upload(updates.profilePicture);
      updates.profilePicture = upload.secure_url;
    }

    const updated = await Profile.findOneAndUpdate(
      { user: userId },
      updates,
      { new: true }
    );

    res.status(200).json(updated);

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const blockUser = async (req, res) => {
  try {
    const blockerId = req.user._id;
    const blockedId = req.params.userId;

    const pro = await Profile.findOneAndUpdate(
      { user: blockerId },
      { $addToSet: { blockList: blockedId } }
    );

    await pro.save();


    res.json({ message: "User blocked successfully." });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const unblockUser = async (req, res) => {
  try {
    const blockerId = req.user._id;
    const blockedId = req.params.userId;

    await Profile.findOneAndUpdate(
      { user: blockerId },
      { $pull: { blockList: blockedId } }
    );

    res.json({ message: "User unblocked successfully." });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const availability = async (req, res) => {
  try {
    const { available } = req.body;
    const userId = req.user._id;

    const updated = await Profile.findOneAndUpdate(
      { user: userId },
      { isAvailableForCollab: available },
      { new: true }
    );

    res.status(200).json({
      isAvailableForCollab: updated.isAvailableForCollab,
      profile: updated
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const userProjects = await Project.find({
      $or: [
        { "team.userId": userId },
        { "requests.userId": userId },
        { adminId: userId }
      ]
    });

    for (const project of userProjects) {


      if (project.adminId.toString() === userId.toString()) {
        await project.deleteOne();
      } else {


        project.team = project.team.filter(
          member => member.userId.toString() !== userId.toString()
        );


        project.requests = project.requests.filter(
          req => req.userId.toString() !== userId.toString()
        );

        await project.save();
      }
    }

    const deleted = await Profile.findOneAndDelete({ user: userId });
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deleted || !deletedUser)
      return res.status(400).json({ message: "Profile deletion failed" });

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({ message: "Profile deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getGithubRepos = async (req, res) => {
  try {
    const { username: input } = req.params;
    const username = input.split('/').filter(Boolean).pop();
    const response = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
    
    // Return only essential data
    const repos = response.data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count,
      language: repo.language,
      forks_count: repo.forks_count,
    }));

    res.status(200).json(repos);
  } catch (error) {
    console.error("Error fetching GitHub repos:", error.message);
    res.status(500).json({ message: "Error fetching GitHub repos" });
  }
};


