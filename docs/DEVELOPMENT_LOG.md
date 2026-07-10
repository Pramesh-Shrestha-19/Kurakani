# Kurakani Development Log

Last Updated:
2026-07-09

---

# Current Module

Calling System

---

# Completed This Session

## CallContext

✅ Refactored from setter-based API to action-based API

Implemented:

- startVoiceCall()
- startVideoCall()
- receiveCall()
- acceptCall()
- rejectCall()
- endCall()
- closeCall()
- minimizeCall()
- restoreCall()
- toggleFullscreen()
- toggleMute()
- toggleSpeaker()
- toggleCamera()

Removed raw state setters from the public context API.

CallContext now acts as the single source of truth for all call state.

---

## CallWindow

✅ Removed duplicated local call state

Removed:

- callStatus
- windowState
- controls

CallWindow now consumes all call state directly from CallContext.

Only the local End Call dialog visibility remains as component state.

---

## Chat Integration

✅ Chat now starts calls through:

- startVoiceCall(contact)
- startVideoCall(contact)

Chat no longer owns any call state.

---

## Authentication

✅ Began integrating AuthContext into CallContext in preparation for Socket.io signaling.

---

## Socket.io Preparation

✅ Backend signaling scaffolding prepared.

Next implementation will transmit call events between users instead of simulating local calls.

---

# Current Status

✅ Calling UI Complete

✅ CallContext Migration Complete

🚧 Socket.io Call Signaling In Progress

WebRTC has not yet been started.

---

# Important Architectural Decision

CallContext is now the single source of truth for every piece of call state.

UI components only dispatch actions.

They never directly modify call state.

This allows Socket.io and WebRTC to plug into CallContext without further architectural changes.

---

## Socket.io Call Signaling (Completed)

Completed:
- Online user tracking using Map
- Incoming call delivery
- Accept synchronization
- Reject synchronization
- End call synchronization
- Caller identity sent in payload
- Timer synchronization
- Duplicate user_online registrations fixed

Current Status

✅ Socket.io Call Signaling Complete

Next Task

Implement signaling polish:
- Ringing
- Busy
- Timeout
- Missed calls

Then begin WebRTC.
