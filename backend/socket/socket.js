let onlineUsers = {};

export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);
    
    // USER COMES ONLINE
    socket.on("user_online", (userId) => {
      onlineUsers[userId] = socket.id;

      console.log("Online Users:", onlineUsers);

      io.emit("online_users", Object.keys(onlineUsers));
    });

    // JOIN CHAT ROOM
    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
    });

    // SEND MESSAGE
    socket.on("send_message", (message) => {
      socket.to(message.chatId).emit("receive_message", message);
    });

    // USER DISCONNECTS
    socket.on("disconnect", () => {
      for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          break;
        }
      }

      io.emit("online_users", Object.keys(onlineUsers));

      console.log("🔴 Disconnected:", socket.id);
    });

    // USER START TYPING
    socket.on("typing_start", ({ chatId, userName }) => {
      socket.to(chatId).emit("typing_show", {
        chatId,
        userName,
      });
    });

    // USER STOP TYPING
    socket.on("typing_stop", ({ chatId }) => {
      socket.to(chatId).emit("typing_hide", {
        chatId,
      });
    });

  });
};