export const WINDOW_STATE = {
    NORMAL: "normal",
    FULLSCREEN: "fullscreen",
    MINIMIZED: "minimized",
};

export const CALL_TYPE = {
    VOICE: "voice",
    VIDEO: "video",
};

export const CALL_STATUS = {
    INCOMING: "incoming",
    CALLING: "calling",
    RINGING: "ringing",
    CONNECTING: "connecting",
    CONNECTED: "connected",
    BUSY: "busy", 
    TIMEOUT: "timeout",
    OFFLINE: "offline",
    ENDED: "ended",
    MISSED: "missed",
};

// Statuses stored in a call-log message (Message.callInfo.status)
export const CALL_LOG_STATUS = {
    COMPLETED: "completed",
    MISSED: "missed",
    REJECTED: "rejected",
};