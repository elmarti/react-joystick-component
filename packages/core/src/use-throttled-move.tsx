import { useCallback } from "react";
import { IJoystickUpdateEvent } from "./joystick-types";



export const useThrottledMove = (rate = 0, move:(event: IJoystickUpdateEvent)=>void): (event: IJoystickUpdateEvent) => void => {
    const throttledMove = useCallback(() => {
        let lastCall = 0;
        return (event: IJoystickUpdateEvent) => {
            const now = new Date().getTime();
            if (now - lastCall < rate) {
                return () => {};
            }
            lastCall = now;
            if (move) {
                return move(event);
            }
            return () => {};
        };
    }, [rate, move])

   return throttledMove;

            
};