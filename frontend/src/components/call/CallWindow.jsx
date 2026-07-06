import { useState } from "react";
import "./css/CallWindow.css";

import CallHeader from "./CallHeader";
import VoiceCall from "./VoiceCall";
import VideoCall from "./VideoCall";
import CallControls from "./CallControls";
import MinimizedCall from "./MinimizedCall";
import EndCallDialog from "./EndCallDialog";
import {
    WINDOW_STATE,
    CALL_TYPE,
    CALL_STATUS
} from "../../constants/callConstants";


function CallWindow({
    isOpen = true,
    type = CALL_TYPE.VOICE,
    status = CALL_STATUS.CALLING,
    user = {},
    onClose = () => {}
}) {

    const [windowState, setWindowState] = useState(WINDOW_STATE.NORMAL);
    const [muted, setMuted] = useState(false);
    const [cameraOn, setCameraOn] = useState(true);
    const [speakerOn, setSpeakerOn] = useState(true);
    const [showEndDialog, setShowEndDialog] = useState(false);

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
                    user={user}
                    status={status}
                    onRestore={() => setWindowState(WINDOW_STATE.NORMAL)}
                    onEnd={() => {
                        setWindowState(WINDOW_STATE.NORMAL);
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

                            user={user}

                            windowState={windowState}

                            onMinimize={() => setWindowState(WINDOW_STATE.MINIMIZED)}

                            onFullscreen={() =>
                                setWindowState(
                                    windowState === WINDOW_STATE.FULLSCREEN
                                        ? WINDOW_STATE.NORMAL
                                        : WINDOW_STATE.FULLSCREEN
                                )
                            }

                            onClose={() => setShowEndDialog(true)}

                        />

                        <div className="call-content">

                            {
                                type === CALL_TYPE.VOICE

                                    ? <VoiceCall user={user} status={status} />

                                    : <VideoCall user={user} status={status} />

                            }

                        </div>

                        <CallControls

                            type={type}

                            muted={muted}
                            speakerOn={speakerOn}
                            cameraOn={cameraOn}

                            onMute={() => setMuted(!muted)}

                            onSpeaker={() => setSpeakerOn(!speakerOn)}

                            onCamera={() => setCameraOn(!cameraOn)}

                            onEnd={() => setShowEndDialog(true)}

                        />

                        <EndCallDialog
                            open={showEndDialog}
                            onCancel={() => setShowEndDialog(false)}
                            onConfirm={() => {
                                setShowEndDialog(false);
                                onClose();
                            }}
                        />
                    </div>
                )
            }

        </>

    );

}

export default CallWindow;