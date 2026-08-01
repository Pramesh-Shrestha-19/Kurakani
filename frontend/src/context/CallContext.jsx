import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import {
    CALL_STATUS,
    CALL_TYPE,
    WINDOW_STATE
} from "../constants/callConstants";

import {
    createPeerConnection,
    addLocalStream,
    createOffer,
    createAnswer,
    setLocalDescription,
    setRemoteDescription,
    addIceCandidate,
    closePeerConnection,
    onIceCandidate,
    onTrack,
    onConnectionStateChange,
    onIceConnectionStateChange,
} from "../webrtc/peerConnection";

import {
    getLocalStream,
    stopStream,
} from "../webrtc/media";

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

    const remoteMediaRef = useRef(null);

    const [currentUser, setCurrentUser] = useState(null);

    // ─── WebRTC State ─────────────────────────────────

    const [peerConnection, setPeerConnection] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const currentUserRef = useRef(null);
    const callStartTimeRef = useRef(null);
    const callTypeRef = useRef(CALL_TYPE.VOICE);
    const chatIdRef = useRef(null);

    // ─── WebRTC Helpers ───────────────────────────────


    const initializeWebRTC = async () => {
        let stream = null;
        let peer = null;

        try {
            stream = await getLocalStream(callTypeRef.current);
            peer = createPeerConnection();

            addLocalStream(peer, stream);

            onIceCandidate(peer, (candidate) => {

                const targetUser = currentUserRef.current;

                if (!targetUser) return;

                socket.emit("webrtc:ice-candidate", {
                    receiverId: targetUser._id,
                    candidate,
                });

            });

            onTrack(peer, (remoteStream) => {
                console.log("REMOTE STREAM:", remoteStream);
                console.log("Tracks:", remoteStream.getTracks());

                setRemoteStream(remoteStream);
            });

            onConnectionStateChange(peer, (state) => {
                console.log("Connection:", state);

                if (state === "connected" && !callStartTimeRef.current) {
                    const startTime = Date.now();
                    callStartTimeRef.current = startTime;

                    socket.emit("call:timer-sync", {
                        receiverId: currentUserRef.current?._id,
                        startTime,
                    });
                }
            });

            onIceConnectionStateChange(peer, (state) => {
                console.log("ICE:", state);
            });

            localStreamRef.current = stream;
            setLocalStream(stream);

            peerConnectionRef.current = peer;
            setPeerConnection(peer);

            return {
                peer,
                stream,
            };

        } catch (error) {
            console.error("Failed to initialize WebRTC:", error);

            if (peer) {
                closePeerConnection(peer);
            }

            if (stream) {
                stopStream(stream);
            }

            peerConnectionRef.current = null;
            localStreamRef.current = null;

            throw error;
        }
    };

    const cleanupWebRTC = () => {

        if(localStreamRef.current){

            stopStream(localStreamRef.current);

            localStreamRef.current=null;
            setLocalStream(null);
        }


        if(peerConnectionRef.current){

            closePeerConnection(peerConnectionRef.current);

            peerConnectionRef.current=null;
            setPeerConnection(null);
        }


        remoteMediaRef.current = null;
        setRemoteStream(null);
    };

    const sendOffer = async (peer) => {

        const offer = await createOffer(peer);

        await setLocalDescription(peer, offer);

        socket.emit("webrtc:offer", {
            receiverId: currentUserRef.current._id,
            offer,
        });

    };

    const sendAnswer = async (peer, offer) => {

        await setRemoteDescription(peer, offer);

        const answer = await createAnswer(peer);

        await setLocalDescription(peer, answer);

        socket.emit("webrtc:answer", {
            receiverId: currentUserRef.current._id,
            answer,
        });

    };

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

        socket.on("call:accepted", async () => {

            console.log("Call Accepted");

            try {

                const { peer } = await initializeWebRTC();
                await sendOffer(peer);

                setCallStatus(CALL_STATUS.CONNECTED);

            } catch (error) {
                console.error("Failed to initialize WebRTC:", error);

                closeCall();

            }

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

        socket.on("call:timer-sync", ({ startTime }) => {
            callStartTimeRef.current = startTime;
        });

        socket.on("webrtc:offer", async ({ offer }) => {

            try {

                let peer = peerConnectionRef.current;

                if (!peer) {
                    const result = await initializeWebRTC();
                    peer = result.peer;
                }

                await sendAnswer(peer, offer);

            } catch (error) {
                console.error("Failed to process WebRTC offer:", error);

                closeCall();
            }

        });

        socket.on("webrtc:answer", async ({ answer }) => {
            const peer = peerConnectionRef.current;

            if (!peer) {
                console.error("Peer connection not initialized.");
                return;
            }

            await setRemoteDescription(peer, answer);
        });

        socket.on("webrtc:ice-candidate", async ({ candidate }) => {
            try {
                const peer = peerConnectionRef.current;

                if (!peer) {
                    console.error("Peer connection not initialized.");
                    return;
                }

                await addIceCandidate(peer, candidate);

            } catch (error) {
                console.error("Failed to add ICE candidate:", error);
            }
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
            socket.off("webrtc:offer");
            socket.off("webrtc:answer");
            socket.off("webrtc:ice-candidate");
        };

    }, [user]);

    // ─── Actions ────────────────────────────────────

    const startVoiceCall = (contact, chatId) => {

        console.log("startVoiceCall()", contact);

        if (!contact) {
            console.error("No contact selected.");
            return;
        }

        setCurrentUser(contact);
        currentUserRef.current = contact;
        setCallType(CALL_TYPE.VOICE);
        callTypeRef.current = CALL_TYPE.VOICE;
        chatIdRef.current = chatId || null;
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
            callType: CALL_TYPE.VOICE,
            chatId: chatId || null
        });

        console.log("Sending call:start", {
            callId,
            callerId: user._id,
            receiverId: contact._id,
            callType: CALL_TYPE.VOICE
        });

    };

    const startVideoCall = (contact, chatId) => {

        setCurrentUser(contact);
        currentUserRef.current = contact;
        setCallType(CALL_TYPE.VIDEO);
        callTypeRef.current = CALL_TYPE.VIDEO;
        chatIdRef.current = chatId || null;
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
            callType: CALL_TYPE.VIDEO,
            chatId: chatId || null
        });

    };

    const receiveCall = (payload) => {

        const caller = {
            _id: payload.callerId,
            name: payload.callerName,
            email: payload.callerEmail
        };


        setCurrentUser(caller);
        currentUserRef.current = caller;

        setCallType(payload.callType);
        callTypeRef.current = payload.callType;
        chatIdRef.current = payload.chatId || null;
        setCallStatus(CALL_STATUS.INCOMING);
        setWindowState(WINDOW_STATE.NORMAL);
        setIsOpen(true);

        socket.emit("call:ringing", {
            callerId: payload.callerId,
            receiverId: user._id
        });
    };

    const acceptCall = async () => {

        try {

            await initializeWebRTC();

            socket.emit("call:accept", {
                callerId: currentUserRef.current._id,
                receiverId: user._id,
                callType,
                chatId: chatIdRef.current
            });

            setCallStatus(CALL_STATUS.CONNECTED);

        } catch (error) {
            console.error("Failed to accept call:", error);

            closeCall();
        }

    };

    const rejectCall = () => {

        socket.emit("call:reject", {
            callerId: user._id,
            receiverId: currentUserRef.current._id,
            callType,
            chatId: chatIdRef.current
        });

        setCallStatus(CALL_STATUS.ENDED);

        closeCall();

    };

    const endCall = () => {

        socket.emit("call:end", {
            callerId: user._id,
            receiverId: currentUserRef.current._id,
            callType,
            chatId: chatIdRef.current
        });

        setCallStatus(CALL_STATUS.ENDED);
        closeCall();
    };

    const closeCall = () => {

        cleanupWebRTC();

        setIsOpen(false);
        setCurrentUser(null);

        setCallStatus(CALL_STATUS.CALLING);
        setWindowState(WINDOW_STATE.NORMAL);

        callStartTimeRef.current = null;
        chatIdRef.current = null;

        setCallType(CALL_TYPE.VOICE);
        callTypeRef.current = CALL_TYPE.VOICE;

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

        setControls((prev)=>{

            const newState = !prev.muted;

            localStreamRef.current
            ?.getAudioTracks()
            .forEach(track=>{
                track.enabled = !newState;
            });


            return {
                ...prev,
                muted:newState
            };

        });

    };

    const toggleSpeaker = () => {

        setControls((prev)=>{

            const speakerOn = !prev.speakerOn;

            if(remoteMediaRef.current){
                remoteMediaRef.current.muted =
                    !speakerOn;
            }

            return {
                ...prev,
                speakerOn
            };

        });

    };

    const toggleCamera = () => {

        setControls((prev)=>{

            const newState=!prev.cameraOn;


            localStreamRef.current
            ?.getVideoTracks()
            .forEach(track=>{
                track.enabled=newState;
            });


            return {
                ...prev,
                cameraOn:newState
            };

        });

    };

    // ─── Context Value ──────────────────────────────

    const value = {

         // Call UI State
        isOpen,
        callType,
        callStatus,
        windowState,
        controls,
        currentUser,
        callStartTimeRef,


        // WebRTC State
        peerConnection,
        localStream,
        remoteStream,

        // Media Refs
        remoteMediaRef,

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