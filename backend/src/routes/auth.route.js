import express from 'express';
import { login, register, logout, deleteUser, checkAuth, getStreamTokenForUser, googleAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/google', googleAuth);
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.delete("/deleteUser", protectRoute, deleteUser);
router.get("/streamToken", protectRoute, getStreamTokenForUser);

router.get("/check", protectRoute, checkAuth);

export default router;