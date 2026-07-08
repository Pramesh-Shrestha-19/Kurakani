# Kurakani Architecture

## Project Overview

Kurakani is a MERN Stack real-time chat application.

Goals:
- Production-quality architecture
- Modular codebase
- Clean separation of concerns
- Reusable components
- Scalable folder structure

---

# Tech Stack

Frontend
- React
- Vite
- React Router
- Context API
- Socket.io Client (planned)
- WebRTC (planned)

Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Socket.io

---

# Project Structure

backend/

frontend/

docs/

---

# Frontend Folder Structure

src/

components/

call/

css/

context/

hooks/

constants/

utils/

pages/

services/

---

# Component Philosophy

Components should have one responsibility.

Example:

ControlButton

Responsible only for rendering a circular control button.

CallControls

Responsible for deciding which control buttons exist.

CallWindow / CallContext

Responsible for business logic.

---

# JS vs JSX

.jsx

- React Components
- JSX
- UI

.js

- Hooks
- Context
- Utilities
- Constants
- Pure JavaScript logic

---

# Hooks vs Utils

hooks/

Reusable React logic.

Examples

- useCall
- useSocket

utils/

Reusable JavaScript helper functions.

Examples

- formatDate
- debounce

---

# Comment Style

// ─── Props ─────────────────────────────────────

// ─── Hooks ─────────────────────────────────────

// ─── Helper Variables ──────────────────────────

// ─── Event Handlers ────────────────────────────

// ─── Derived State ─────────────────────────────

// ─── Render ────────────────────────────────────

---

# Call System Architecture

Development order

1. UI
2. Local React State
3. CallContext (Single Source of Truth)
4. Socket.io Signalling
5. WebRTC Media
6. Backend Signalling Services
7. Production Polish

---

# Call Window

Supports

- Normal
- Fullscreen
- Minimized

Chat remains visible behind the call.

Minimize never disconnects the call.

Close always asks for confirmation.

---

# Coding Standards

- Avoid duplicate code
- Prefer reusable components
- Prefer configuration when it improves readability
- Explain architectural decisions
- Avoid unnecessary abstraction
- Prioritize maintainability over shortcuts

---

# CallContext Philosophy

CallContext is responsible for all call business logic.

Components should request actions rather than mutate call state directly.

Preferred API:

- startVoiceCall()
- startVideoCall()
- receiveCall()
- acceptCall()
- rejectCall()
- endCall()
- toggleMute()
- toggleSpeaker()
- toggleCamera()
- minimizeCall()
- restoreCall()
- toggleFullscreen()

Components should avoid directly calling internal state setters whenever possible.