import "./css/CallControls.css";
import ControlButton from "./ControlButton";
import { CALL_TYPE } from "../../constants/callConstants";

function CallControls({
    type,
    controls,
    actions
}) {

    // ─── Props ─────────────────────────────────────

    const {
        muted,
        speakerOn,
        cameraOn
    } = controls;

    const {
        onMute,
        onSpeaker,
        onCamera,
        onEnd
    } = actions;

    // ─── Helper Variables ──────────────────────────

    const buttons = [

        {
            id: "mute",
            icon: muted ? "mic-off-outline" : "mic-outline",
            title: muted ? "Unmute Microphone" : "Mute Microphone",
            active: muted,
            onClick: onMute
        },

        ...(type === CALL_TYPE.VIDEO
            ? [{
                id: "camera",
                icon: cameraOn ? "videocam-outline" : "videocam-off-outline",
                title: cameraOn ? "Turn Camera Off" : "Turn Camera On",
                active: cameraOn,
                onClick: onCamera
            }]
            : []),

        {
            id: "speaker",
            icon: speakerOn ? "volume-high-outline" : "volume-mute-outline",
            title: speakerOn ? "Mute Speaker" : "Enable Speaker",
            active: speakerOn,
            onClick: onSpeaker
        },

        {
            id: "end",
            icon: "call-outline",
            title: "End Call",
            danger: true,
            onClick: onEnd
        }

    ];

    // ─── Render ────────────────────────────────────

    return (

        <div className="call-controls">

            {buttons.map(({
                id,
                icon,
                title,
                active = false,
                danger = false,
                onClick
            }) => (

                <ControlButton
                    key={id}
                    icon={icon}
                    title={title}
                    active={active}
                    danger={danger}
                    onClick={onClick}
                />

            ))}

        </div>

    );

}

export default CallControls;