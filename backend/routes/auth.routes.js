import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {

    console.log("REGISTER API HIT:", req.body);

    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    console.log("USER SAVED:", newUser);

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (err) {

    console.log("ERROR:", err.message);

    res.status(500).json({
      message: err.message
    });
  }
});

// LOGIN ROUTE
router.post("/login", async (req, res) => {

  try {

    console.log("LOGIN API HIT:", req.body);

    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    // check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // create JWT token
    const token = jwt.sign(
      {
        userId: user._id
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }
    );

    // send response
    res.status(200).json({

      message: "Login successful",

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }

    });

  } catch (err) {

    console.log("LOGIN ERROR:", err.message);

    res.status(500).json({
      message: "Server error"
    });
  }

});

export default router;