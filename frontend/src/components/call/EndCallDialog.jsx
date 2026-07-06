import "./css/EndCallDialog.css";

function EndCallDialog({
    open,
    onCancel,
    onConfirm
}) {

    if (!open) return null;

    return (

        <div className="end-dialog-overlay">

            <div className="end-dialog">

                <h2>End Call?</h2>

                <p>
                    Are you sure you want to end this call?
                </p>

                <div className="dialog-buttons">

                    <button
                        className="cancel-btn"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        className="end-btn"
                        onClick={onConfirm}
                    >
                        End Call
                    </button>

                </div>

            </div>

        </div>

    );

}

export default EndCallDialog;