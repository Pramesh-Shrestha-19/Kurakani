import { useState, useRef, useEffect } from "react";
import axios from "axios";
import socket from "../socket/socket";
import "../css/Chat.css";

const API = "http://localhost:5000/api";

function getNow() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [filter, setFilter] = useState("All");
  const [mute, setMute] = useState(false);
  const [theme, setTheme] = useState("Default");
  const [emoji, setEmoji] = useState("Default");

  const endRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  if (!user) return null;

  useEffect(() => {
    if (user?._id) {
      socket.emit("user_online", user._id);
    }
  }, [user]);

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // LOAD CHATS
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${API}/chat`, getConfig());
        setChats(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchChats();
  }, []);

  // LOAD MESSAGES
  useEffect(() => {
    if (!activeChat?._id) return;

    const fetchMessages = async () => {
      try {
        // Get messages
        const res = await axios.get(
          `${API}/message/${activeChat._id}`,
          getConfig()
        );

        setMessages(res.data);

        // Mark messages as seen
        await axios.put(
          `${API}/message/seen/${activeChat._id}`,
          {},
          getConfig()
        );

        // Fetch updated messages (with seen=true)
        const updated = await axios.get(
          `${API}/message/${activeChat._id}`,
          getConfig()
        );

        setMessages(updated.data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages();
  }, [activeChat]);

  // JOIN SOCKE ROOM
  useEffect(() => {
    if (!activeChat?._id) return;

    socket.emit("join_chat", activeChat._id);

    console.log("Joined room:", activeChat._id);
  }, [activeChat]);

  // user online
  useEffect(() => {
    if (user?._id) {
      socket.emit("user_online", user._id);
    }
  }, [user]);

  // AUTO SCROLL
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // RECEIVE SOCKET MESSAGE
  useEffect(() => {
    socket.on("receive_message", (message) => {
      console.log("Received:", message);

      if (message.chatId === activeChat?._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [activeChat]);

  useEffect(() => {
    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("online_users");
    };
  }, []);

  useEffect(() => {
    socket.on("typing_show", ({ chatId, userName }) => {
      if (chatId === activeChat?._id) {
        setTypingUser(userName);
      }
    });

    socket.on("typing_hide", ({ chatId }) => {
      if (chatId === activeChat?._id) {
        setTypingUser(null);
      }
    });

    return () => {
      socket.off("typing_show");
      socket.off("typing_hide");
    };
  }, [activeChat]);

  // SEND MESSAGE
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || !activeChat) return;
    try {
      const res = await axios.post(
      `${API}/message`,
      { chatId: activeChat._id, text },
      getConfig()
    );

    // SOCKET EMIT
    socket.emit("send_message", res.data);

    setMessages((prev) => [...prev, res.data]);
    setInput("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getOtherUser = (chat) =>
    chat?.members?.find((m) => {
      const memberId =
        typeof m === "object" ? m._id?.toString() : m?.toString();
      const userId = user._id?.toString() || user.id?.toString();
      return memberId !== userId;
    });

  const contact = activeChat ? getOtherUser(activeChat) : null;

  const currentUserId = (user._id || user.id)?.toString();

  return (
    <div className="app">

      {/* NAV */}
      <nav className="nav">
        
        <div className="nav-avatar">
          <img src="/src/Images/KuraKani logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
        </div>

        {[
          ["chatbox-outline", "Chats", true],
          ["call-outline", "Calls", false],
          ["people-outline", "People", false],
        ].map(([icon, label, isActive]) => (
          <div
            key={label}
            className={`nav-item${isActive ? " active" : ""}`}
            title={label}
          >
            <ion-icon name={icon}></ion-icon>
          </div>
        ))}

        <div className="nav-spacer" />

        <div className="nav-item" title="Settings">
          <ion-icon name="settings-outline"></ion-icon>
        </div>
      </nav>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Chats</h1>
          <div className="search-box">
            <ion-icon name="search-outline" className="search-icon"></ion-icon>
            <input placeholder="Search chats..." />
          </div>
        </div>

        <div className="filter-tabs">
          {["All", "Unread", "Groups"].map((f) => (
            <button
              key={f}
              className={`filter-tab${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="chat-list">
          {chats.map((chat) => {
            const other = getOtherUser(chat);
            const isOnline = onlineUsers.includes(other?._id);
            return (
              <div
                key={chat._id}
                className={`chat-item${
                  activeChat?._id === chat._id ? " active" : ""
                }`}
                onClick={() => setActiveChat(chat)}
              >
                <div className="chat-avatar">
                  {other?.name?.charAt(0) || "U"}
                </div>
                <div className="chat-info">
                  <div className="chat-top">
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className="chat-name">
                        {other?.name || "Unknown"}
                      </span>

                      <span
                        style={{
                          fontSize: "10px",
                          color: isOnline ? "limegreen" : "gray"
                        }}
                      >
                        ●
                      </span>
                    </div>
                  </div>
                  <div className="chat-bottom">
                    <span className="chat-preview">Click to open chat</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* MAIN CHAT WINDOW */}
      <main className="chat-window">
        <header className="chat-header">
          <div className="header-avatar">
            {contact?.name?.charAt(0) || "?"}
          </div>
          <div className="header-info">
            <div className="header-name">
              {contact?.name || "Select a chat"}
            </div>
            <div className="header-status">
              {contact && onlineUsers.includes(contact._id?.toString())
                ? <span style={{ color: "limegreen" }}>● Active now</span>
                : <span style={{ color: "gray" }}>● Offline</span>
              }
            </div>
          </div>
          <div className="header-actions">
            <button className="action-btn">
              <ion-icon name="call-outline"></ion-icon>
            </button>
            <button className="action-btn">
              <ion-icon name="videocam-outline"></ion-icon>
            </button>
            <button className="action-btn">
              <ion-icon name="ellipsis-horizontal-outline"></ion-icon>
            </button>
          </div>
        </header>

        <div className="messages">
          <div className="date-divider">
            <span className="date-chip">Today</span>
          </div>
          
          {typingUser && (
            <div style={{ fontSize: "12px", color: "gray", marginBottom: "5px" }}>
              {typingUser} is typing...
            </div>
          )}

          {messages.map((m) => {
            const senderId =
              m.sender && typeof m.sender === "object"
                ? m.sender._id?.toString()
                : m.sender?.toString();

            const isOwn = senderId === currentUserId;

            return (
              <div
                key={m._id}
                className={`msg-wrapper ${isOwn ? "sent" : "received"}`}
              >
                <div className="bubble">
                  <div className="bubble-text">{m.text}</div>
                  <div className="bubble-time">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {isOwn && (
                      <ion-icon name={m.seen ? "checkmark-done-outline" : "checkmark-outline"}
                        style={{ color: m.seen ? "#53bdeb" : "gray", marginLeft: "4px",}}
                      ></ion-icon>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={endRef} />
        </div>

        {activeChat && (
          <div className="input-bar">
            <button className="attach-btn">
              <ion-icon name="add-outline"></ion-icon>
            </button>
            <textarea
              className="msg-input"
              rows={1}
              placeholder="Type a message..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);

                socket.emit("typing_start", {
                  chatId: activeChat._id,
                  userName: user.name,
                });

                clearTimeout(window.typingTimeout);

                window.typingTimeout = setTimeout(() => {
                  socket.emit("typing_stop", {
                    chatId: activeChat._id,
                  });
                }, 1000);
              }}
              onKeyDown={handleKeyDown}
            />
            <button className="send-btn" onClick={sendMessage}>
              <ion-icon name="send-outline"></ion-icon>
            </button>
          </div>
        )}
      </main>

      {/* RIGHT PANEL */}
      <aside className="right-panel">
        <div className="panel-header">Contact Info</div>

        <div className="panel-item">
          <div className="panel-item-label">Theme</div>
          <div className="panel-chips">
            {["Default", "Dark", "Ocean"].map((t) => (
              <span
                key={t}
                className={`chip${theme === t ? " selected" : ""}`}
                onClick={() => setTheme(t)}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* <div className="panel-item">
          <div className="panel-item-label">Emoji</div>
          <div className="panel-chips">
            {["Default", "Classic", "Fluent"].map((e) => (
              <span
                key={e}
                className={`chip${emoji === e ? " selected" : ""}`}
                onClick={() => setEmoji(e)}
              >
                {e}
              </span>
            ))}
          </div>
        </div> */}

        <div className="panel-item">
          <div className="panel-item-label">Nickname</div>
          <div style={{ fontWeight: 600 }}>{contact?.name || "-"}</div>
        </div>

        <div className="panel-item">
          <div className="toggle-row">
            <span className="toggle-label">Mute notifications</span>
            <div
              className={`toggle${mute ? " on" : ""}`}
              onClick={() => setMute(!mute)}
            >
              <div className="toggle-thumb" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}