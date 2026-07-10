const onlineUsers = new Map();

export const initializeSocket = (io) => {

  io.on("connection", (socket) => {

    console.log("🟢 Connected:", socket.id);

    // ─── User Presence ─────────────────────────────

    socket.on("user_online", (userId) => {

        const previousSocket = onlineUsers.get(userId);

        // Ignore duplicate registrations from the same socket
        if (previousSocket === socket.id) {
            return;
        }

        onlineUsers.set(userId, socket.id);

        console.log("🟢 User Online:", userId);

        io.emit("online_users", Array.from(onlineUsers.keys()));

    });

    // ─── Chat ──────────────────────────────────────

    socket.on("join_chat", (chatId) => {

      socket.join(chatId);

    });

    socket.on("send_message", (message) => {

      socket.to(message.chatId).emit("receive_message", message);

    });

    // ─── Typing ────────────────────────────────────

    socket.on("typing_start", ({ chatId, userName }) => {

      socket.to(chatId).emit("typing_show", {
        chatId,
        userName,
      });

    });

    socket.on("typing_stop", ({ chatId }) => {

      socket.to(chatId).emit("typing_hide", {
        chatId,
      });

    });

    // ─── Call Signaling ────────────────────────────

    socket.on("call:start", (payload) => {
      console.log("call:start received", payload);
      const receiverSocket = onlineUsers.get(payload.receiverId);
      if (!receiverSocket) return;
      io.to(receiverSocket).emit("call:incoming", payload);
    });

    socket.on("call:accept", (payload) => {
        const callerSocket = onlineUsers.get(payload.callerId);
        if (!callerSocket) return;
        io.to(callerSocket).emit("call:accepted", payload);
    });

    socket.on("call:reject", (payload) => {
      const receiverSocket = onlineUsers.get(payload.receiverId);
      if (!receiverSocket) return;
      io.to(receiverSocket).emit("call:rejected", payload);
    });

    socket.on("call:end", (payload) => {
      const receiverSocket = onlineUsers.get(payload.receiverId);
      if (!receiverSocket) return;
      io.to(receiverSocket).emit("call:ended", payload);
    });

    // ─── Disconnect ────────────────────────────────

    socket.on("disconnect", () => {

      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      io.emit("online_users", Array.from(onlineUsers.keys()));

      console.log("🔴 Disconnected:", socket.id);

    });

  });

};