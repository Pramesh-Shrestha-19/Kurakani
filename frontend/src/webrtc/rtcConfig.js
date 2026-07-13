
// WebRTC Configuration

export const rtcConfiguration = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302",
        },
    ],
};

// Default Media Constraints

export const mediaConstraints = {
    audio: true,
    video: true,
};