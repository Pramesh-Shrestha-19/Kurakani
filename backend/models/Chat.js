import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    isGroup: {
      type: Boolean,
      default: false
    },

    groupName: {
      type: String,
      default: null
    },

    lastMessage: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;