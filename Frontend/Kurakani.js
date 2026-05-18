/* ============================================================
   KURAKANI — JAVASCRIPT
   Sections:
   1. Panel Collapse / Expand
   2. Tab Switching
   3. Chat Item Selection
   4. Nav Item Selection
   5. Send Message
   ============================================================ */


/* ── 1. PANEL COLLAPSE / EXPAND ── */
const app           = document.querySelector('.app');
const chatListPanel = document.getElementById('chatListPanel');
const chatListToggle= document.getElementById('chatListToggle');
const infoPanel     = document.getElementById('infoPanel');
const infoPanelToggle = document.getElementById('infoPanelToggle');

chatListToggle.addEventListener('click', () => {
  chatListPanel.classList.toggle('collapsed');
  app.classList.toggle('chat-list-collapsed');
});

infoPanelToggle.addEventListener('click', () => {
  infoPanel.classList.toggle('collapsed');
  app.classList.toggle('info-collapsed');
});


/* ── 2. TAB SWITCHING ── */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});


/* ── 3. CHAT ITEM SELECTION ── */
document.querySelectorAll('.chat-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});


/* ── 4. NAV ITEM SELECTION ── */
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});


/* ── 5. SEND MESSAGE ── */
const input       = document.querySelector('.input-box');
const messagesArea= document.querySelector('.messages-area');

function sendMessage() {

  const text = input.value.trim();

  if (!text) return;

  fetch("api/send_message.php", {

    method: "POST",

    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },

    body:
      "receiver_id=2&message=" +
      encodeURIComponent(text)

  })

  .then(res => res.text())

  .then(data => {

    input.value = '';

  });

}
input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
document.querySelector('.send-btn').addEventListener('click', sendMessage);


/* ── TOGGLE SWITCHES (info panel) ── */
document.querySelectorAll('.toggle').forEach(toggle => {
  toggle.addEventListener('click', () => toggle.classList.toggle('on'));
});

setInterval(() => {

fetch("/Kurakani/Backend/api/fetch_messages.php?chat_user=2")
    .then(res => res.json())

    .then(data => {

      console.log(data);

      // update UI here

    });

}, 2000); 