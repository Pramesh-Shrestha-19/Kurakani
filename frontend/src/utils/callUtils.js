import { CALL_STATUS } from "../constants/callConstants";

export const getCallStatusText = (status, duration) => {

    switch (status) {

        case CALL_STATUS.CALLING:
            return "Calling...";

        case CALL_STATUS.RINGING:
            return "Ringing...";

        case CALL_STATUS.CONNECTING:
            return "Connecting...";

        case CALL_STATUS.CONNECTED:
            return duration;

        case CALL_STATUS.BUSY:
            return "User is busy";

        case CALL_STATUS.TIMEOUT:
            return "No answer";

        case CALL_STATUS.OFFLINE:
            return "User is offline";

        case CALL_STATUS.ENDED:
            return "Call Ended";
        
        default:
            return "";
    }

};