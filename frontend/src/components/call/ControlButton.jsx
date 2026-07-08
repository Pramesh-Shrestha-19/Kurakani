import "./css/ControlButton.css";

function ControlButton({
    icon,
    active = false,
    danger = false,
    title = "",
    onClick = () => {}
}) {

    return (

        <button
            className={`
                control-btn
                ${active ? "active" : ""}
                ${danger ? "danger" : ""}
            `}
            title={title}
            onClick={onClick}
        >

            <ion-icon name={icon}></ion-icon>

        </button>

    );

}

export default ControlButton;