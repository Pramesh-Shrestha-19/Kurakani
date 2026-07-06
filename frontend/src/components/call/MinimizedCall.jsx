import "./css/MinimizedCall.css";

function MinimizedCall({
    user,
    status,
    onRestore,
    onEnd
}) {
    return (
        <div className="mini-call">

            <div
                className="mini-call-info"
                onClick={onRestore}
            >
                <div className="mini-avatar">
                    {user.name.charAt(0).toUpperCase()}
                </div>

                <div>

                    <h4>{user.name}</h4>

                    <span>{status}</span>

                </div>
            </div>

            <div className="mini-buttons">

                <button
                    className="mini-btn"
                    onClick={onRestore}
                >
                    <ion-icon name="expand-outline"></ion-icon>
                </button>

                <button
                    className="mini-btn end"
                    onClick={onEnd}
                >
                    <ion-icon name="call-outline"></ion-icon>
                </button>

            </div>

        </div>
    );
}

export default MinimizedCall;