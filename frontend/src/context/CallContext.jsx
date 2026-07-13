import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    CALL_STATUS,
    CALL_TYPE,
    WINDOW_STATE
} from "../constants/callConstants";

import { useAuth } from "./AuthContext";
import socket from "../socket/socket";

const CallContext = createContext(null);

export function CallProvider({ children }) {

    const { user } = useAuth();

    // ─── Call State ─────────────────────────────────

    const [isOpen, setIsOpen] = useState(false);

    const [callType, setCallType] = useState(CALL_TYPE.VOICE);

    const [callStatus, setCallStatus] = useState(CALL_STATUS.CALLING);

    const [windowState, setWindowState] = useState(WINDOW_STATE.NORMAL);

    const [controls, setControls] = useState({
        muted: false,
        speakerOn: true,
        cameraOn: true
    });

    const [currentUser, setCurrentUser] = useState(null);

    // ─── Socket Events ──────────────────────────────

    useEffect(() => {

        if (!user) return;

        socket.on("call:incoming", (payload) => {
            console.log("Incoming Call:", payload);
            receiveCall(payload);
        });

        socket.on("call:ringing", () => {
            console.log("Call Ringing");
            setCallStatus(CALL_STATUS.RINGING);
        });

        socket.on("call:rejected", (payload) => {
            console.log("Call Rejected:", payload);
            closeCall();
        });

        socket.on("call:accepted", () => {
            console.log("Call Accepted");
            setCallStatus(CALL_STATUS.CONNECTED);
        });

        socket.on("call:busy", () => {
            console.log("User is busy");
            setCallStatus(CALL_STATUS.BUSY);

            setTimeout(() => {
                closeCall();
            }, 4000);
        });

        socket.on("call:timeout", () => {
            console.log("Call Timed Out");
            setCallStatus(CALL_STATUS.TIMEOUT);

            setTimeout(() => {
                closeCall();
            }, 4000);
        });

        socket.on("call:offline", () => {
            console.log("User is offline");
            setCallStatus(CALL_STATUS.OFFLINE);

            setTimeout(() => {
                closeCall();
            }, 5000);
        });

        socket.on("call:ended", () => {
            console.log("Call Ended");
            closeCall();
        });

        return () => {
            socket.off("call:incoming");
            socket.off("call:ringing");
            socket.off("call:accepted");
            socket.off("call:rejected");
            socket.off("call:busy");
            socket.off("call:timeout");
            socket.off("call:offline");
            socket.off("call:ended");
        };

    }, [user]);

    // ─── Actions ────────────────────────────────────

    const startVoiceCall = (contact) => {

        console.log("startVoiceCall()", contact);

        if (!contact) {
            console.error("No contact selected.");
            return;
        }

        setCurrentUser(contact);
        setCallType(CALL_TYPE.VOICE);
        setCallStatus(CALL_STATUS.CALLING);
        setWindowState(WINDOW_STATE.NORMAL);
        setIsOpen(true);

        console.log("Socket connected:", socket.connected);

        const callId = crypto.randomUUID();

        socket.emit("call:start", {
            callId,
            callerId: user._id,
            callerName: user.name,
            callerEmail: user.email,
            receiverId: contact._id,
            callType: CALL_TYPE.VOICE
        });

        console.log("Sending call:start", {
            callId,
            callerId: user._id,
            receiverId: contact._id,
            callType: CALL_TYPE.VOICE
        });

    };

    const startVideoCall = (contact) => {

        setCurrentUser(contact);
        setCallType(CALL_TYPE.VIDEO);
        setCallStatus(CALL_STATUS.CALLING);
        setWindowState(WINDOW_STATE.NORMAL);
        setIsOpen(true);

        const callId = crypto.randomUUID();

        socket.emit("call:start", {
            callId,
            callerId: user._id,
            callerName: user.name,
            callerEmail: user.email,
            receiverId: contact._id,
            callType: CALL_TYPE.VIDEO
        });

    };

    const receiveCall = (payload) => {

        setCurrentUser({
            _id: payload.callerId,
            name: payload.callerName,
            email: payload.callerEmail
        });

        setCallType(payload.callType);
        setCallStatus(CALL_STATUS.INCOMING);
        setWindowState(WINDOW_STATE.NORMAL);
        setIsOpen(true);

        socket.emit("call:ringing", {
            callerId: payload.callerId,
            receiverId: user._id
        });
    };

    const acceptCall = () => {

        socket.emit("call:accept", {
            callerId: currentUser._id,
            receiverId: user._id,
            callType
        });

        setCallStatus(CALL_STATUS.CONNECTED);

    };

    const rejectCall = () => {

        socket.emit("call:reject", {
            callId: crypto.randomUUID(),
            callerId: user._id,
            receiverId: currentUser._id,
            callType
        });

        setCallStatus(CALL_STATUS.ENDED);

        closeCall();

    };

    const endCall = () => {

        socket.emit("call:end", {
            callerId: user._id,
            receiverId: currentUser._id,
            callType
        });

        setCallStatus(CALL_STATUS.ENDED);
        closeCall();
    };

    const closeCall = () => {

        setIsOpen(false);
        setCurrentUser(null);

        setCallStatus(CALL_STATUS.CALLING);
        setWindowState(WINDOW_STATE.NORMAL);

        setCallType(CALL_TYPE.VOICE);

        setControls({
            muted: false,
            speakerOn: true,
            cameraOn: true
        });

    };

    const minimizeCall = () => {
        setWindowState(WINDOW_STATE.MINIMIZED);
    };

    const restoreCall = () => {
        setWindowState(WINDOW_STATE.NORMAL);
    };

    const toggleFullscreen = () => {

        setWindowState((prev) =>
            prev === WINDOW_STATE.FULLSCREEN
                ? WINDOW_STATE.NORMAL
                : WINDOW_STATE.FULLSCREEN
        );

    };

    const toggleMute = () => {

        setControls((prev) => ({
            ...prev,
            muted: !prev.muted
        }));

    };

    const toggleSpeaker = () => {

        setControls((prev) => ({
            ...prev,
            speakerOn: !prev.speakerOn
        }));

    };

    const toggleCamera = () => {

        setControls((prev) => ({
            ...prev,
            cameraOn: !prev.cameraOn
        }));

    };

    // ─── Context Value ──────────────────────────────

    const value = {

        // State
        isOpen,
        callType,
        callStatus,
        windowState,
        controls,
        currentUser,

        // Setters
        // setIsOpen,
        // setCallType,
        // setCurrentUser,
        // setCallStatus,
        // setWindowState,
        // setControls,

        // Actions
        startVoiceCall,
        startVideoCall,
        receiveCall,
        acceptCall,
        rejectCall,
        endCall,
        closeCall,
        minimizeCall,
        restoreCall,
        toggleFullscreen,
        toggleMute,
        toggleSpeaker,
        toggleCamera

    };

    return (

        <CallContext.Provider value={value}>

            {children}

        </CallContext.Provider>

    );

}

export function useCall() {

    return useContext(CallContext);

}