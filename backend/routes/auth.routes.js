import express from "express";
import User from "../models/User.js";

const router = express.Router();

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    console.log("REGISTER API HIT:", req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newUser = await User.create({
      name,
      email,
      password
    });

    console.log("USER SAVED:", newUser);

    res.status(201).json(newUser);
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;