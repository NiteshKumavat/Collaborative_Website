import express from "express";
import { 
    sendMessage, 
    getTeamMessages, 
    getUserTeams, 
    updateMessage, 
    deleteMessage 
} from "../controllers/message.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/teams", protectRoute, getUserTeams);
router.get("/teams/:teamId", protectRoute, getTeamMessages);
router.post("/", protectRoute, sendMessage);
router.put("/:messageId", protectRoute, updateMessage);
router.delete("/:messageId", protectRoute, deleteMessage);

export default router;