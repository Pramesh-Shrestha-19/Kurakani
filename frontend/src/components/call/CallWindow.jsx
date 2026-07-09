import { useState } from "react";
import "./css/CallWindow.css";

import CallHeader from "./CallHeader";
import VoiceCall from "./VoiceCall";
import VideoCall from "./VideoCall";
import CallControls from "./CallControls";
import MinimizedCall from "./MinimizedCall";
import EndCallDialog from "./EndCallDialog";
import IncomingCall from "./IncomingCall";
import { useCall } from "../../context/CallContext";
import {
    CALL_TYPE,
    CALL_STATUS,
    WINDOW_STATE
} from "../../constants/callConstants";


function CallWindow()
{

    
    const [showEndDialog, setShowEndDialog] = useState(false);
    const {
        isOpen,
        callType,
        callStatus,
        windowState,
        controls,
        currentUser,
        acceptCall,
        rejectCall,
        closeCall,
        minimizeCall,
        restoreCall,
        toggleFullscreen,
        toggleMute,
        toggleSpeaker,
        toggleCamera
    } = useCall();


    if (!isOpen) return null;

    return (

        <>
            {windowState !== WINDOW_STATE.MINIMIZED && (
                <div className="call-overlay" />
            )}

            {
                windowState === WINDOW_STATE.MINIMIZED
                ? (
                    <MinimizedCall
                    user={currentUser}
                    status={callStatus}
                    onRestore={() => restoreCall()}
                    onEnd={() => {
                        restoreCall();
                        setShowEndDialog(true);
                    }}
                />
                )
                :
                (
                    <div
                        className={`call-window ${windowState}`}
                    >

                        <CallHeader
                            user={currentUser}
                            windowState={windowState}

                            onMinimize={() => minimizeCall()}

                            onFullscreen={() =>
                                toggleFullscreen()
                            }

                            onClose={() => setShowEndDialog(true)}
                        />

                        <div className="call-content">

                        {
                            callStatus === CALL_STATUS.INCOMING ? (
                                <IncomingCall
                                    user={currentUser}
                                    type={callType}
                                    onAccept={acceptCall}
                                    onReject={() => {
                                        rejectCall();
                                        setShowEndDialog(true);
                                    }}
                                />

                                ) : callType === CALL_TYPE.VOICE ? (

                                    <VoiceCall
                                        user={currentUser}
                                        status={callStatus}
                                    />

                                ) : (

                                    <VideoCall
                                        user={currentUser}
                                        status={callStatus}
                                    />

                                )
                            }
                        </div>

                        <CallControls
                            type={callType}
                            controls={controls}
                            actions={{
                                onMute: toggleMute,
                                onSpeaker: toggleSpeaker,
                                onCamera: toggleCamera,
                                onEnd: () => setShowEndDialog(true)
                            }}
                        />

                        <EndCallDialog
                            open={showEndDialog}
                            onCancel={() => setShowEndDialog(false)}
                            onConfirm={() => {
                                setShowEndDialog(false);
                                closeCall();
                            }}
                        />
                    </div>
                )
            }

        </>

    );

}

export default CallWindow;