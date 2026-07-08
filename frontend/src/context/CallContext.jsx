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

const CallContext = createContext(null);

export function CallProvider({ children }) {

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

    const openCall = ({
        user,
        type = CALL_TYPE.VOICE,
        status = CALL_STATUS.CALLING
    }) => {

        setCurrentUser(user);

        setCallType(type);

        setCallStatus(status);

        setWindowState(WINDOW_STATE.NORMAL);

        setIsOpen(true);

    };

    const closeCall = () => {

        setIsOpen(false);

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
        setIsOpen,
        setCallType,
        setCurrentUser,
        setCallStatus,
        setWindowState,
        setControls,

        // Actions
        openCall,
        closeCall

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