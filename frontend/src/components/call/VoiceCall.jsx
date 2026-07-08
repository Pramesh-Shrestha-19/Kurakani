import "./css/VoiceCall.css";

import { getCallStatusText } from "../../utils/callUtils";
import useCallTimer from "../../hooks/useCallTimer";

function VoiceCall({
    user,
    status
}) {

    const duration = useCallTimer(status);

    const statusText = getCallStatusText(
        status,
        duration
    );

    return (

        <div className="voice-call">

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