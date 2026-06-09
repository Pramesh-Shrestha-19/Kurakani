import User from "../models/User.js";

export const searchUsers = async (req, res) => {
  const keyword = req.query.search;
  if (!keyword) return res.json([]);

  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
      name: { $regex: keyword, $options: "i" },
    }).select("_id name email");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};