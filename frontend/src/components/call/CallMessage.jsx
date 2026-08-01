import "./css/CallMessage.css";
import { CALL_TYPE } from "../../constants/callConstants";

function formatDuration(seconds) {
    if (!seconds) return null;

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return mins > 0
        ? `${mins}m ${secs}s`
        : `${secs}s`;
}

function formatTime(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function CallMessage({ callInfo }) {

    const { callType, status, duration, endedAt, startedAt } = callInfo || {};

    const isVideo = callType === CALL_TYPE.VIDEO;
    const isMissed = status === "missed";
    const isRejected = status === "rejected";

    const icon = isMissed || isRejected
        ? "close-circle-outline"
        : isVideo
        ? "videocam-outline"
        : "call-outline";

    const label = isMissed
        ? "Missed call"
        : isRejected
        ? "Call declined"
        : isVideo
        ? "Video call"
        : "Voice call";

    const durationText = formatDuration(duration);
    const timeText = formatTime(endedAt || startedAt);

    return (

        <div className={`call-message ${isMissed || isRejected ? "missed" : ""}`}>

            <div className="call-message-icon">
                <ion-icon name={icon}></ion-icon>
            </div>

            <div className="call-message-info">
                <span className="call-message-label">{label}</span>
                <span className="call-message-meta">
                    {durationText ? `${durationText} · ` : ""}{timeText}
                </span>
            </div>

        </div>

    );

}

export default CallMessage;