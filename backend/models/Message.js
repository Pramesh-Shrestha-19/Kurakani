import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },

    text: {
      type: String,
      default: ""
    },

    seen: {
      type: Boolean,
      default: false
    },

    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null
    },

    type: {
      type: String,
      enum: ["text", "call"],
      default: "text"
    },

    callInfo: {
      callType: { type: String, enum: ["voice", "video"] },
      status: { type: String, enum: ["completed", "missed", "rejected"] },
      duration: { type: Number, default: 0 },
      startedAt: Date,
      endedAt: Date
    }
  },
  {
    timestamps: true
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;