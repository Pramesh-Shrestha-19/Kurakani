export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // Join a chat room
    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
      console.log(`Joined room: ${chatId}`);
    });

    // Receive message from sender
    socket.on("send_message", (message) => {
        socket.to(message.chatId).emit(
            "receive_message",
            message
        );
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};