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
- Socket.io Client
- WebRTC

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

# Call System Architecture

Development order

1. Call UI
2. Local React State
3. CallContext Migration
4. Socket.io Signaling
5. WebRTC Media
6. Backend Signaling Services
7. Production Polish

Current Status

✅ Call UI Complete

✅ CallContext is the single source of truth for all call state.

Next Step

Socket.io signaling will synchronize call state between users.

After signaling is stable, WebRTC media streams will be integrated without changing the existing UI architecture.

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
- Socket.io Client
- WebRTC

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

# Call System Architecture

Development order

1. Call UI
2. Local React State
3. CallContext Migration
4. Socket.io Signaling
5. WebRTC Media
6. Backend Signaling Services
7. Production Polish

Current Status

✅ Call UI Complete

✅ CallContext is the single source of truth for all call state.

Next Step

Socket.io signaling will synchronize call state between users.

After signaling is stable, WebRTC media streams will be integrated without changing the existing UI architecture.

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

CallContext is the single source of truth for every piece of call state.

Responsibilities include:

- Current call participant
- Call type
- Call status
- Window state
- Call controls
- Call lifecycle

Components never mutate call state directly.

Instead they request actions such as:

- startVoiceCall()
- startVideoCall()
- receiveCall()
- acceptCall()
- rejectCall()
- endCall()
- closeCall()
- toggleMute()
- toggleSpeaker()
- toggleCamera()
- minimizeCall()
- restoreCall()
- toggleFullscreen()

This architecture keeps UI components stateless and prepares the project for Socket.io signaling and WebRTC without future refactoring.

---

# Current Calling Architecture (Updated)

Socket.IO signaling is now complete for the call lifecycle.

Implemented signaling events:
- call:start / call:incoming
- call:accept / call:accepted
- call:reject / call:rejected
- call:end / call:ended

CallContext remains the single source of truth. WebRTC will plug into this signaling layer without architectural changes.

CallContext is the single source of truth for every piece of call state.

Responsibilities include:

- Current call participant
- Call type
- Call status
- Window state
- Call controls
- Call lifecycle

Components never mutate call state directly.

Instead they request actions such as:

- startVoiceCall()
- startVideoCall()
- receiveCall()
- acceptCall()
- rejectCall()
- endCall()
- closeCall()
- toggleMute()
- toggleSpeaker()
- toggleCamera()
- minimizeCall()
- restoreCall()
- toggleFullscreen()

This architecture keeps UI components stateless and prepares the project for Socket.io signaling and WebRTC without future refactoring.

---

# Socket.io Signaling Architecture

Backend maintains:

- onlineUsers
- pendingCalls
- activeCalls
- callTimeouts

CallContext remains the single source of truth.

Socket.io is responsible only for signaling. WebRTC media will integrate into this architecture without requiring UI refactoring.


---

# WebRTC Architecture

WebRTC is now fully integrated into the calling system.

Architecture flow:

CallContext
      ↓
Socket.io Signaling
      ↓
RTCPeerConnection
      ↓
Media Streams
      ↓
Voice / Video UI

Responsibilities

CallContext
- Owns call lifecycle
- Owns PeerConnection state
- Owns local/remote streams
- Coordinates signaling and media

webrtc/media.js
- Acquire microphone/camera
- Stop media streams

webrtc/peerConnection.js
- Peer connection creation
- Offer/Answer exchange
- ICE candidate handling
- Track events
- Connection state events

Completed Features

- Voice calling
- Video calling
- Offer/Answer negotiation
- ICE candidate exchange
- Local video preview
- Remote media rendering
- Microphone toggle
- Camera toggle
- Speaker control
- Automatic WebRTC cleanup on call end

Next Focus

- TURN server integration
- Call reconnection
- Screen sharing
- Device selection
