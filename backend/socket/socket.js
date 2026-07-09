let onlineUsers = {};

export const initializeSocket = (io) => {

  io.on("connection", (socket) => {

    console.log("🟢 Connected:", socket.id);

    // ─── User Presence ─────────────────────────────

    socket.on("user_online", (userId) => {

      onlineUsers[userId] = socket.id;

      console.log("Online Users:", onlineUsers);

      io.emit("online_users", Object.keys(onlineUsers));

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

    socket.on("call:start", ({ to, from, type }) => {

      const receiverSocket = onlineUsers[to];

      if (!receiverSocket) return;

      io.to(receiverSocket).emit("call:incoming", {
        from,
        type,
      });

    });

    // ─── Disconnect ────────────────────────────────

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

  });

};