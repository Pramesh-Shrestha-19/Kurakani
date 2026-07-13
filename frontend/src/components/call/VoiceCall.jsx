import "./css/VoiceCall.css";

import { useEffect } from "react";
import { getCallStatusText } from "../../utils/callUtils";
import useCallTimer from "../../hooks/useCallTimer";
import { useCall } from "../../context/CallContext";

function VoiceCall({
    user,
    status
}) {

    const { remoteMediaRef, remoteStream, callStartTimeRef } = useCall();

    const duration = useCallTimer(status, callStartTimeRef);

    const statusText = getCallStatusText(
        status,
        duration
    );

    useEffect(() => {
        if (remoteMediaRef.current) {
            remoteMediaRef.current.srcObject = remoteStream || null;
        }
    }, [remoteStream]);

    return (

        <div className="voice-call">

            <audio
                ref={(element) => {
                    if (element) {
                        remoteMediaRef.current = element;
                    }
                }}
                autoPlay
                playsInline
            />

            <div className="voice-avatar">

                {
                    user?.avatar
                        ?
                        (
                            <img
                                src={user.avatar}
                                alt={user.name}
                            />
                        )
                        :
                        (
                            <div className="voice-avatar-placeholder">
                                {(user?.name || "?")
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>
                        )
                }

            </div>

            <h2 className="voice-user-name">
                {user?.name || "Unknown User"}
            </h2>

            <p className="voice-status">
                {statusText}
            </p>

            <div className="voice-divider" />

            <div className="voice-security">

                <ion-icon
                    name="shield-checkmark-outline"
                />

                <span>
                    Secure Peer Connection
                </span>

            </div>

        </div>

    );

}

export default VoiceCall;