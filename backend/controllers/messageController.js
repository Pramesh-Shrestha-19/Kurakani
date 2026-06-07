import Message from "../models/Message.js";

// Send Message
export const sendMessage = async (req, res) => {
  try {
    const { chatId, text, replyTo } = req.body;

    const message = await Message.create({
      chatId,
      sender: req.user._id,
      text,
      replyTo: replyTo || null,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Messages
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chatId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark messages as sen
export const markAsSeen = async (req, res) => {
  try {
    const { chatId } = req.params;

    await Message.updateMany(
      {
        chatId,
        sender: { $ne: req.user._id }, // only other person's messages
        seen: false,
      },
      {
        seen: true,
      }
    );

    res.status(200).json({
      message: "Messages marked as seen",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};