import "./css/VideoCall.css";

function VideoCall({
    user,
    status
}) {

    // ─── Render ─────────────────────────────────────
    return (

        <div className="video-call">

            <div className="video-stage">

                {/* Remote Video */}

                <div className="remote-video">

                    <div className="remote-placeholder">
                        <ion-icon name="videocam-outline"/>
                        <h2>
                            {user?.name || "Unknown User"}
                        </h2>

                        <p>
                            Waiting for video...
                        </p>

                    </div>

                </div>

                {/* Local Preview */}

                <div className="local-video">

                    <div className="local-placeholder">
                        You
                    </div>

                </div>

            </div>

        </div>
    );
}
export default VideoCall;