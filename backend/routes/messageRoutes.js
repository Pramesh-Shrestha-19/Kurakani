import express from "express";
import { sendMessage, getMessages , markAsSeen } from "../controllers/messageController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// send message
router.post("/", protect, sendMessage);

// get messages for a chat
router.get("/:chatId", protect, getMessages);

router.put("/seen/:chatId", protect, markAsSeen);

export default router;