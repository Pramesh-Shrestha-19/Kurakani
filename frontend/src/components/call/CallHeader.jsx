import "./css/CallHeader.css";
import { WINDOW_STATE } from "../../constants/callConstants";

function CallHeader({
    user,
    windowState,
    onMinimize,
    onFullscreen,
    onClose
}) {

    return (

        <div className="call-header">

            <div className="call-user">

                <div className="call-avatar">

                    {
                        user.avatar
                        ?
                        <img
                            src={user.avatar}
                            alt={user.name}
                        />
                        :
                        <div className="avatar-placeholder">

                            {(user?.name || "?").charAt(0).toUpperCase()}

                        </div>
                    }

                </div>

                <div className="call-user-info">

                    <h3>{user?.name || "Unknown User"}</h3>

                    <span>Kurakani Call</span>

                </div>

            </div>

            <div className="window-controls">

                <button
                    className="window-btn minimize"
                    onClick={onMinimize}
                >
                    <ion-icon name="remove-outline"></ion-icon>
                </button>

                <button
                    className="window-btn fullscreen"
                    onClick={onFullscreen}
                >

                    <ion-icon
                        name={
                            windowState === WINDOW_STATE.FULLSCREEN
                            ? "contract-outline"
                            : "expand-outline"
                        }
                    />

                </button>

                <button
                    className="window-btn danger"
                    onClick={onClose}
                >
                    <ion-icon name="close-outline"></ion-icon>
                </button>

            </div>

        </div>

    );

}

export default CallHeader;