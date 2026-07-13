import { mediaConstraints } from "./rtcConfig";
import { CALL_TYPE } from "../constants/callConstants";


export const getLocalStream = async (type) => {
    return await navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
        },
                video:type === CALL_TYPE.VIDEO,
    });
};

export const stopStream = (stream) => {
    if (!stream) return;

    stream.getTracks().forEach((track) => track.stop());
};