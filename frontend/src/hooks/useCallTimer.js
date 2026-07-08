import { useEffect, useState } from "react";
import { CALL_STATUS } from "../constants/callConstants";

export default function useCallTimer(status) {

    const [seconds, setSeconds] = useState(0);

    useEffect(() => {

        if (status !== CALL_STATUS.CONNECTED) {

            setSeconds(0);
            return;

        }

        const interval = setInterval(() => {

            setSeconds(prev => prev + 1);

        }, 1000);

        return () => clearInterval(interval);

    }, [status]);

    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");

    return hrs === "00"
        ? `${mins}:${secs}`
        : `${hrs}:${mins}:${secs}`;

}