/* ============================================================
   KURAKANI — FIXED JAVASCRIPT (WORKING PATH VERSION)
============================================================ */

/* ── PANEL CONTROLS ── */
const app = document.querySelector('.app');
const chatListPanel = document.getElementById('chatListPanel');
const chatListToggle = document.getElementById('chatListToggle');
const infoPanel = document.getElementById('infoPanel');
const infoPanelToggle = document.getElementById('infoPanelToggle');

chatListToggle.addEventListener('click', () => {
  chatListPanel.classList.toggle('collapsed');
  app.classList.toggle('chat-list-collapsed');
});

infoPanelToggle.addEventListener('click', () => {
  infoPanel.classList.toggle('collapsed');
  app.classList.toggle('info-collapsed');
});


/* ── TABS ── */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});


/* ── CHAT ITEMS ── */
document.querySelectorAll('.chat-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});


/* ── NAV ITEMS ── */
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});


/* ── INPUT + MESSAGE AREA ── */
const input = document.querySelector('.input-box');
const messagesArea = document.querySelector('.messages-area');


/* ─────────────────────────────────────────────
   SEND MESSAGE (FIXED PATH + JSON SAFE)
──────────────────────────────────────────── */
function sendMessage() {

  const text = input.value.trim();
  if (!text) return;

  fetch("http://localhost/Kurakani/Backend/api/send_message.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "receiver_id=2&message=" + encodeURIComponent(text)
  })

  .then(res => res.text())   // IMPORTANT DEBUG STEP
  .then(data => {
    console.log("RAW RESPONSE:", data);

    try {
      const json = JSON.parse(data);
      console.log("SEND:", json);

      if (json.success) {
        input.value = '';
        loadMessages();
      }
    } catch (e) {
      console.error("NOT JSON:", data);
    }
  })

  .catch(err => console.error("Send error:", err));
}


/* ─────────────────────────────────────────────
   LOAD MESSAGES (FIXED PATH)
──────────────────────────────────────────── */
function loadMessages() {

  fetch("http://localhost/Kurakani/Backend/api/fetch_messages.php?chat_user=2")
    .then(res => res.json())
    .then(data => {

      console.log("MESSAGES:", data);

      messagesArea.innerHTML = "";

      data.forEach(msg => {
        const div = document.createElement("div");
        div.classList.add("message");

        div.innerText = msg.message_content;

        messagesArea.appendChild(div);
      });

    })
    .catch(err => console.error("Fetch error:", err));
}


/* ── SEND BUTTON + ENTER KEY ── */
document.querySelector('.send-btn').addEventListener('click', sendMessage);

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});


/* ── TOGGLES ── */
document.querySelectorAll('.toggle').forEach(toggle => {
  toggle.addEventListener('click', () => toggle.classList.toggle('on'));
});


/* ── AUTO REFRESH CHAT ── */
setInterval(loadMessages, 2000);

/* INITIAL LOAD */
loadMessages();