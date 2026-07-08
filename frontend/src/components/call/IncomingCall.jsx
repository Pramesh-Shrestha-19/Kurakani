import "./css/IncomingCall.css";
import { CALL_TYPE } from "../../constants/callConstants";

function IncomingCall({
    user,
    type,
    onAccept,
    onReject
}) {

    // ─── Render ─────────────────────────────────────

    return (

        <div className="incoming-call">

            <div className="incoming-card">

                <div className="incoming-avatar">

                    {
                        user?.avatar
                            ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                />
                            )
                            : (
                                <div className="incoming-avatar-placeholder">

                                    {(user?.name || "?")
                                        .charAt(0)
                                        .toUpperCase()}

                                </div>
                            )
                    }

                </div>

                <h2>
                    {user?.name || "Unknown User"}
                </h2>

                <p>
                    {type === CALL_TYPE.VIDEO
                        ? "Incoming Video Call..."
                        : "Incoming Voice Call..."}
                </p>

                <div className="incoming-actions">

                    <button
                        className="reject-btn"
                        title="Reject Call"
                        onClick={onReject}
                    >
                        <ion-icon name="call-outline"></ion-icon>
                    </button>

                    <button
                        className="accept-btn"
                        title="Accept Call"
                        onClick={onAccept}
                    >
                        <ion-icon name="call-outline"></ion-icon>
                    </button>

                </div>

            </div>

        </div>

    );

}

export default IncomingCall;