import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

const onlineUsers = new Map();
const pendingCalls = new Map();
const activeCalls = new Map();
const callTimeouts = new Map();
const callSessions = new Map(); // callId -> { chatId, callType, callerId, receiverId, startedAt }

const logCall = async ({ io, chatId, callType, status, duration = 0, startedAt, endedAt, callerId, receiverId }) => {
    if (!chatId) return;

    try {
        const message = await Message.create({
            chatId,
            sender: null,
            text: "",
            type: "call",
            callInfo: {
                callType,
                status,
                duration,
                startedAt,
                endedAt
            }
        });

        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: status === "missed"
                ? "Missed call"
                : status === "rejected"
                ? "Call declined"
                : callType === "video"
                ? "Video call"
                : "Voice call"
        });

        if (io) {
            const callerSocket = onlineUsers.get(callerId);
            const receiverSocket = onlineUsers.get(receiverId);

            if (callerSocket) io.to(callerSocket).emit("receive_message", message);
            if (receiverSocket && receiverSocket !== callerSocket) {
                io.to(receiverSocket).emit("receive_message", message);
            }
        }

        return message;
    } catch (error) {
        console.error("Failed to log call:", error.message);
    }
};

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

        // Track this call's session info for logging later
        callSessions.set(payload.callId, {
            chatId: payload.chatId || null,
            callType: payload.callType,
            callerId: payload.callerId,
            receiverId: payload.receiverId,
            initiatedAt: new Date()
        });

        // Reserve receiver while phone is ringing
        pendingCalls.set(payload.receiverId, payload.callId);

        const timeout = setTimeout(async () => {

            // Remove pending call
            pendingCalls.delete(payload.receiverId);

            // Remove stored timeout
            callTimeouts.delete(payload.callId);

            const session = callSessions.get(payload.callId);
            callSessions.delete(payload.callId);

            if (session) {
                await logCall({
                    io,
                    chatId: session.chatId,
                    callType: session.callType,
                    status: "missed",
                    startedAt: session.initiatedAt || new Date(),
                    endedAt: new Date(),
                    callerId: session.callerId,
                    receiverId: session.receiverId
                });
            }

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

        const session = callSessions.get(callId);
        if (session) {
            session.startedAt = new Date();
            if (payload.chatId) session.chatId = payload.chatId;
        }

        if (!callerSocket) return;

        io.to(callerSocket).emit("call:accepted", payload);

    });



    socket.on("call:reject", async (payload) => {
      const receiverSocket = onlineUsers.get(payload.receiverId);

      const callId = pendingCalls.get(payload.callerId);

      if (callId) {
          const timeout = callTimeouts.get(callId);

          if (timeout) {
              clearTimeout(timeout);
              callTimeouts.delete(callId);
          }

          const session = callSessions.get(callId);
          callSessions.delete(callId);

          if (session) {
              await logCall({
                  io,
                  chatId: session.chatId || payload.chatId,
                  callType: session.callType || payload.callType,
                  status: "rejected",
                  startedAt: session.initiatedAt || new Date(),
                  endedAt: new Date(),
                  callerId: session.callerId || payload.callerId,
                  receiverId: session.receiverId || payload.receiverId
              });
          }
      }

      pendingCalls.delete(payload.callerId);
      if (!receiverSocket) return;
      io.to(receiverSocket).emit("call:rejected", payload);
    });



    socket.on("call:end", async (payload) => {
      const receiverSocket = onlineUsers.get(payload.receiverId);

      const callId = activeCalls.get(payload.callerId) || activeCalls.get(payload.receiverId);

      activeCalls.delete(payload.receiverId);
      activeCalls.delete(payload.callerId);

      if (callId) {
          const session = callSessions.get(callId);
          callSessions.delete(callId);

          if (session) {
              const endedAt = new Date();
              const startedAt = session.startedAt || endedAt;
              const duration = Math.max(0, Math.floor((endedAt - startedAt) / 1000));

              await logCall({
                  io,
                  chatId: session.chatId || payload.chatId,
                  callType: session.callType || payload.callType,
                  status: "completed",
                  duration,
                  startedAt,
                  endedAt,
                  callerId: session.callerId || payload.callerId,
                  receiverId: session.receiverId || payload.receiverId
              });
          }
      }

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

      let disconnectedUserId = null;

      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          onlineUsers.delete(userId);
          break;
        }
      }

      if (disconnectedUserId) {

        // Clean up any pending call this user was ringing for
        const pendingCallId = pendingCalls.get(disconnectedUserId);
        if (pendingCallId) {
            const timeout = callTimeouts.get(pendingCallId);
            if (timeout) {
                clearTimeout(timeout);
                callTimeouts.delete(pendingCallId);
            }
            callSessions.delete(pendingCallId);
            pendingCalls.delete(disconnectedUserId);
        }

        // Clean up any active call and notify the other party
        const activeCallId = activeCalls.get(disconnectedUserId);
        if (activeCallId) {

            const session = callSessions.get(activeCallId);
            callSessions.delete(activeCallId);

            // Find the other participant in this call and clear their entry too
            for (const [uid, cid] of activeCalls.entries()) {
                if (cid === activeCallId && uid !== disconnectedUserId) {
                    const otherSocket = onlineUsers.get(uid);
                    if (otherSocket) {
                        io.to(otherSocket).emit("call:ended", { receiverId: uid });
                    }
                    activeCalls.delete(uid);
                }
            }

            activeCalls.delete(disconnectedUserId);
        }
      }

      io.emit("online_users", Array.from(onlineUsers.keys()));

      console.log("🔴 Disconnected:", socket.id);

    });

  });

};