import { rtcConfiguration } from "./rtcConfig";

export const createPeerConnection = () => {
    return new RTCPeerConnection(rtcConfiguration);
};

export const addLocalStream = (peerConnection, stream) => {
    if (!peerConnection || !stream) return;

    stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
    });
};

export const createOffer = async (peerConnection) => {
    return await peerConnection.createOffer();
};

export const createAnswer = async (peerConnection) => {
    return await peerConnection.createAnswer();
};

export const setRemoteDescription = async (
    peerConnection,
    description
) => {
    await peerConnection.setRemoteDescription(description);
};

export const addIceCandidate = async (
    peerConnection,
    candidate
) => {

    if(!peerConnection || !candidate){
        return;
    }


    if(!peerConnection.remoteDescription){
        console.warn(
            "Remote description not set. Ignoring ICE candidate."
        );
        return;
    }

    await peerConnection.addIceCandidate(candidate);

};

export const closePeerConnection = (peerConnection) => {
    if (!peerConnection) return;

    if (peerConnection.connectionState !== "closed") {
        peerConnection.close();
    }
};

export const setLocalDescription = async (
    peerConnection,
    description
) => {
    await peerConnection.setLocalDescription(description);
};

// Event Listeners

export const onIceCandidate = (peerConnection, callback) => {
    if (!peerConnection) return;

    peerConnection.onicecandidate = ({ candidate }) => {
        if (!candidate) return;

        callback(candidate);
    };
};

export const onTrack = (peerConnection, callback) => {
    if (!peerConnection) return;

    peerConnection.ontrack = ({ streams }) => {
        callback(streams[0]);
    };
};

export const onConnectionStateChange = (
    peerConnection,
    callback
) => {
    if (!peerConnection) return;

    peerConnection.onconnectionstatechange = () => {
        callback(peerConnection.connectionState);
    };
};

export const onIceConnectionStateChange = (
    peerConnection,
    callback
) => {
    if (!peerConnection) return;

    peerConnection.oniceconnectionstatechange = () => {
        callback(peerConnection.iceConnectionState);
    };
};