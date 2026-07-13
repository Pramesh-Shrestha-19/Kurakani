import "./css/VideoCall.css";

import {
    useEffect,
    useRef
} from "react";

import { useCall } from "../../context/CallContext";

function VideoCall({
    user,
    status,
    localStream,
    remoteStream
}) {

    const localVideoRef = useRef(null);
    const {
        remoteMediaRef
    } = useCall();

    useEffect(() => {

        if(localVideoRef.current){
            localVideoRef.current.srcObject = localStream || null;
        }

    }, [localStream]);



    useEffect(() => {

        if(remoteMediaRef.current){
            remoteMediaRef.current.srcObject =
                remoteStream || null;
        }

    }, [remoteStream]);

    // ─── Render ─────────────────────────────────────
    return (

        <div className="video-call">

            <div className="video-stage">

                {/* Remote Video */}

                <div className="remote-video">

    {
        remoteStream ?

        (
            <video
                ref={(element)=>{

                    if(element){

                        remoteMediaRef.current = element;

                    }

                }}
                autoPlay
                playsInline
                className="remote-video-element"
            />
        )

        :

        (
            <div className="remote-placeholder">

                            <ion-icon name="videocam-outline"/>

                            <h2>
                                {user?.name || "Unknown User"}
                            </h2>

                            <p> Waiting for video... </p>
                        </div>
                    )
                }
            </div>

                {/* Local Preview */}

                <div className="local-video">

                    {
                        localStream ?

                        (
                            <video
                                ref={localVideoRef}
                                autoPlay
                                muted
                                playsInline
                                className="local-video-element"
                            />
                        )

                        :

                        (
                            <div className="local-placeholder">
                                You
                            </div>
                        )
                    }
                </div>

            </div>

        </div>
    );
}
export default VideoCall;