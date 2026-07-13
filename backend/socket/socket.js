const onlineUsers = new Map();
const pendingCalls = new Map();
const activeCalls = new Map();
const callTimeouts = new Map();

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

      console.log("Receiver:", payload.receiverId);
      console.log("Map:", [...onlineUsers.entries()]);

        const receiverSocket = onlineUsers.get(payload.receiverId);

        if (!receiverSocket) {
          const callerSocket = onlineUsers.get(payload.callerId);

          if (callerSocket) {
              io.to(callerSocket).emit("call:offline", payload);
          }
          return;
        }

        if (
            pendingCalls.has(payload.receiverId) ||
            activeCalls.has(payload.receiverId)                   // Receiver already has a pending or active call
        ) {

            const callerSocket = onlineUsers.get(payload.callerId);

            if (callerSocket) {
                io.to(callerSocket).emit("call:busy", payload);
            }

            return;
        }

        // Reserve receiver while phone is ringing
        pendingCalls.set(payload.receiverId, payload.callId);

        const timeout = setTimeout(() => {

            // Remove pending call
            pendingCalls.delete(payload.receiverId);

            // Remove stored timeout
            callTimeouts.delete(payload.callId);

            // Notify caller
            const callerSocket = onlineUsers.get(payload.callerId);

            if (callerSocket) {
                io.to(callerSocket).emit("call:timeout", payload);
            }

            // Notify receiver
            const currentReceiverSocket = onlineUsers.get(payload.receiverId);

            if (currentReceiverSocket) {
                io.to(currentReceiverSocket).emit("call:missed", payload);
            }

        }, 30000);

        callTimeouts.set(payload.callId, timeout);

        io.to(receiverSocket).emit("call:incoming", payload);
    });

    socket.on("call:ringing", (payload) => {
        const callerSocket = onlineUsers.get(payload.callerId);
        if (!callerSocket) return;
        io.to(callerSocket).emit("call:ringing", payload);
    });

    socket.on("call:accept", (payload) => {

        const callerSocket = onlineUsers.get(payload.callerId);

        // Move receiver from pending → active
        const callId = pendingCalls.get(payload.receiverId);

        const timeout = callTimeouts.get(callId);

        if (timeout) {
            clearTimeout(timeout);
            callTimeouts.delete(callId);
        }

        pendingCalls.delete(payload.receiverId);

        activeCalls.set(payload.receiverId, callId);
        activeCalls.set(payload.callerId, callId);

        if (!callerSocket) return;

        io.to(callerSocket).emit("call:accepted", payload);

    });

    socket.on("call:reject", (payload) => {
      const receiverSocket = onlineUsers.get(payload.receiverId);

      const callId = pendingCalls.get(payload.receiverId);

      if (callId) {
          const timeout = callTimeouts.get(callId);

          if (timeout) {
              clearTimeout(timeout);
              callTimeouts.delete(callId);
          }
      }

      pendingCalls.delete(payload.receiverId);
      if (!receiverSocket) return;
      io.to(receiverSocket).emit("call:rejected", payload);
    });

    socket.on("call:end", (payload) => {
      const receiverSocket = onlineUsers.get(payload.receiverId);
      activeCalls.delete(payload.receiverId);
      activeCalls.delete(payload.callerId);
      if (!receiverSocket) return;
      io.to(receiverSocket).emit("call:ended", payload);
    });

    socket.on("webrtc:offer", ({ receiverId, offer }) => {
        const receiverSocket = onlineUsers.get(receiverId);
        if (!receiverSocket) return;
        io.to(receiverSocket).emit("webrtc:offer", {
            offer,
        });
    });

    socket.on("webrtc:answer", ({ receiverId, answer }) => {
        const receiverSocket = onlineUsers.get(receiverId);
        if (!receiverSocket) return;
        io.to(receiverSocket).emit("webrtc:answer", {
            answer,
        });
    });

    socket.on("webrtc:ice-candidate", ({ receiverId, candidate }) => {
        const receiverSocket = onlineUsers.get(receiverId);
        if (!receiverSocket) return;
        io.to(receiverSocket).emit("webrtc:ice-candidate", {
            candidate,
        });
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