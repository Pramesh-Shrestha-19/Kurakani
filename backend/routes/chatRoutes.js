import express from "express";
import Chat from "../models/Chat.js";
import protect from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

/*
1. CREATE OR GET ONE-TO-ONE CHAT

POST /api/chat
*/
router.post("/", protect, async (req, res) => {
  try {
    console.log("🔥 CHAT CREATE HIT");

    const userId = req.user._id;
    const receiverId = req.body.userId;

    console.log("USER:", userId);
    console.log("RECEIVER:", receiverId);

    if (!receiverId) {
      return res.status(400).json({ message: "receiverId required" });
    }

    // check existing chat
    let chat = await Chat.findOne({
      isGroup: false,
      members: { $all: [userId, receiverId] }
    });

    if (!chat) {
      chat = await Chat.create({
        members: [userId, receiverId]
      });

      console.log("✅ CHAT CREATED:", chat);
    }

    await chat.populate("members", "-password");
    res.status(200).json(chat);

  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
});

/*
2. GET ALL CHATS FOR LOGGED-IN USER

GET /api/chat
*/
router.get("/", protect, async (req, res) => {
  try {
    const chats = await Chat.find({
      members: req.user._id
    })
      .populate("members", "-password")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
console.log("DB NAME:", mongoose.connection.name);
export default router;