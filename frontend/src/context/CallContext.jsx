import {
    createContext,
    useContext,
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

    // ─── Actions ────────────────────────────────────

    const startVoiceCall = (contact) => {

        setCurrentUser(contact);

        setCallType(CALL_TYPE.VOICE);

        setCallStatus(CALL_STATUS.CALLING);

        setWindowState(WINDOW_STATE.NORMAL);

        setIsOpen(true);

        socket.emit("call:start", {
            to: contact._id,
            from: user,
            type: CALL_TYPE.VOICE
        });

    };

    const startVideoCall = (contact) => {

        setCurrentUser(contact);

        setCallType(CALL_TYPE.VIDEO);

        setCallStatus(CALL_STATUS.CALLING);

        setWindowState(WINDOW_STATE.NORMAL);

        setIsOpen(true);

        socket.emit("call:start", {
            to: contact._id,
            from: user,
            type: CALL_TYPE.VIDEO
        });

    };

    const receiveCall = (user, type) => {

        setCurrentUser(user);

        setCallType(type);

        setCallStatus(CALL_STATUS.INCOMING);

        setWindowState(WINDOW_STATE.NORMAL);

        setIsOpen(true);

    };

    const acceptCall = () => {
        setCallStatus(CALL_STATUS.CONNECTED);
    };

    const rejectCall = () => {
        setCallStatus(CALL_STATUS.ENDED);
    };

    const endCall = () => {
        setCallStatus(CALL_STATUS.ENDED);
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