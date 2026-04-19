import express from 'express';
import { getAllUsers ,getProfile, updateProfile, blockUser, unblockUser, availability, deleteProfile, getGithubRepos } from '../controllers/profile.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();

router.get("/users", protectRoute, getAllUsers);
router.get("/github/:username", protectRoute, getGithubRepos);
router.get("/:Id", protectRoute, getProfile);
router.put("/update", protectRoute, updateProfile);
router.put("/unblock/:userId", protectRoute, unblockUser);
router.put('/block/:userId', protectRoute, blockUser);
router.put('/availability', protectRoute, availability);
router.delete('/delete', protectRoute, deleteProfile);

export default router;