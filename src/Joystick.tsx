import * as React from 'react';
import {JoystickShape} from "./enums/shape.enum";
import {shapeBoundsFactory} from "./shapes/shape.bounds.factory";
import { useBaseStyle } from './hooks/use-base-style';
import {useEffect, useRef, useState} from "react";
import {useStickStyle} from "./hooks/use-stick-style";

export interface IJoystickProps {
    size?: number;
    stickSize?: number;
    baseColor?: string;
    stickColor?: string;
    throttle?: number;
    disabled?: boolean;
    sticky?: boolean;
    move?: (event: IJoystickUpdateEvent) => void;
    stop?: (event: IJoystickUpdateEvent) => void;
    start?: (event: IJoystickUpdateEvent) => void;
    stickImage?: string;
    baseImage?: string;
    followCursor?: boolean;
    baseShape?: JoystickShape;
    stickShape?: JoystickShape;
    controlPlaneShape?: JoystickShape;
    minDistance?: number;
}

enum InteractionEvents {
    PointerDown = "pointerdown",
    PointerMove = "pointermove",
    PointerUp = "pointerup"
}

export interface IJoystickUpdateEvent {
    type: "move" | "stop" | "start";
    // TODO: these could just be optional, but this may be a breaking change
    x: number | null;
    y: number | null;
    direction: JoystickDirection | null;
    distance: number | null;
}

export interface IJoystickState {
    dragging: boolean;
    coordinates?: IJoystickCoordinates;
}

type JoystickDirection = "FORWARD" | "RIGHT" | "LEFT" | "BACKWARD";

export interface IJoystickCoordinates {
    relativeX: number;
    relativeY: number;
    axisX: number;
    axisY: number;
    direction: JoystickDirection;
    distance: number;
}


/**
 * Radians identifying the direction of the joystick
 */
enum RadianQuadrantBinding {
    TopRight = 2.35619449,
    TopLeft = -2.35619449,
    BottomRight = 0.785398163,
    BottomLeft = -0.785398163
}



const distance = (x: number, y: number) =>  Math.hypot(x, y);
const distanceToPercentile = (distance:number, baseSize: number): number =>  {
    const percentageBaseSize = distance / (baseSize/2) * 100;
    if(percentageBaseSize > 100){
        return 100;
    }
    return percentageBaseSize;
}
const getDirection = (atan2: number): JoystickDirection => {
    if (atan2 > RadianQuadrantBinding.TopRight || atan2 < RadianQuadrantBinding.TopLeft) {
        return "FORWARD";
    } else if (atan2 < RadianQuadrantBinding.TopRight && atan2 > RadianQuadrantBinding.BottomRight) {
        return "RIGHT"
    } else if (atan2 < RadianQuadrantBinding.BottomLeft) {
        return "LEFT";
    }
    return "BACKWARD";


}

let parentRect: any = null;

export function Joystick ({
    size,
    stickSize,
    baseColor,
    stickColor,
    throttle,
    disabled,
    sticky,
    move,
    stop,
    start,
    stickImage,
    baseImage,
    followCursor,
    baseShape,
    stickShape,
    controlPlaneShape,
    minDistance,
}: IJoystickProps) {
    const baseSize = size || 100;
    const radius = baseSize / 2;
    const [dragging, setDragging] = useState<boolean>(false);
    const [coordinates, setCoordinates] = useState<IJoystickCoordinates | null>(null);
    const [pointerId, setPointerId] = useState<number | null>(null);
    const baseRef = useRef<HTMLDivElement>(null);
    const stickRef = useRef<HTMLButtonElement>(null);
    const throttleMoveCallback = (() => {
        let lastCall = 0;
        return (event: IJoystickUpdateEvent) => {

            const now = new Date().getTime();
            const throttleAmount = throttle || 0;
            if (now - lastCall < throttleAmount) {
                return;
            }
            lastCall = now;
            if (move) {
                return move(event);
            }
        };
    })();
    const updatePos = (newCoordinates: IJoystickCoordinates) => {
        window.requestAnimationFrame(() => {
            setCoordinates(newCoordinates);
        });
        if(typeof minDistance ===  'number'){
            if(newCoordinates.distance < minDistance){
                return;
            }
        }
        throttleMoveCallback({
            type: "move",
            x: newCoordinates.relativeX,
            y: -newCoordinates.relativeY,
            direction: newCoordinates.direction,
            distance: newCoordinates.distance
        });

    };
    const pointerMove = (event: PointerEvent) => {
        event.preventDefault();
        if (dragging) {
            if(!followCursor && event.pointerId !== pointerId) return;
            const absoluteX = event.clientX;
            const absoluteY = event.clientY;
            let relativeX = absoluteX - parentRect.left - radius;
            let relativeY = absoluteY - parentRect.top - radius;
            const dist = distance(relativeX, relativeY);
            // @ts-ignore
            const bounded = shapeBoundsFactory(
                    //@ts-ignore
                controlPlaneShape || baseShape,
                absoluteX,
                absoluteY,
                relativeX,
                relativeY,
                dist,
                radius,
                baseSize,
                parentRect);
            relativeX = bounded.relativeX
            relativeY = bounded.relativeY
            const atan2 = Math.atan2(relativeX, relativeY);

            updatePos({
                relativeX,
                relativeY,
                distance: distanceToPercentile(dist, baseSize),
                direction: getDirection(atan2),
                axisX: absoluteX - parentRect.left,
                axisY: absoluteY - parentRect.top
            });
        }
    };
    const pointerDown = (e: PointerEvent) => {
        if (disabled || followCursor) {
            return;
        }
        parentRect = baseRef.current?.getBoundingClientRect();
       setDragging(true);
       setPointerId(e.pointerId);
       window.addEventListener(InteractionEvents.PointerUp, event => pointerUp(event));
       window.addEventListener(InteractionEvents.PointerMove, event => pointerMove(event));
       console.log({pointerId})
        stickRef.current?.setPointerCapture(e.pointerId);

            if (start) {
                start({
                    type: "start",
                    x: null,
                    y: null,
                    distance: null,
                    direction: null
                });
            }

        };
    const pointerUp = (event: PointerEvent) =>  {
        console.log(event.pointerId, pointerId);
        if(event.pointerId !== pointerId) return;

        window.requestAnimationFrame(() => {
            setDragging(false);
            setCoordinates(null);
        });
        window.removeEventListener(InteractionEvents.PointerUp, event => pointerUp(event));
        window.removeEventListener(InteractionEvents.PointerMove, event => pointerMove(event));
        setPointerId(null);
        if (stop) {
            stop({
                type: "stop",
                // @ts-ignore
                x: sticky ? coordinates.relativeX : null,
                // @ts-ignore
                y: sticky ? coordinates.relativeY : null,
                // @ts-ignore
                direction: sticky ? coordinates.direction : null,
                // @ts-ignore
                distance: sticky ? coordinates.distance : null

            });
        }

    }


    const baseStyle = useBaseStyle(baseSize, baseColor, baseShape, baseImage);
    const stickStyle = useStickStyle(stickSize, baseSize, stickColor, stickImage, coordinates, stickShape);


    useEffect(() => {
        if (followCursor) {
            //@ts-ignore
        parentRect = baseRef.current.getBoundingClientRect();

        setDragging(true);

        window.addEventListener(InteractionEvents.PointerMove, event => pointerMove(event));

        if (start) {
            start({
                type: "start",
                x: null,
                y: null,
                distance: null,
                direction: null
            });
        }

        }
        return () => {
            if (followCursor) {
                window.removeEventListener(InteractionEvents.PointerMove, event => pointerMove(event));
            }
        };
    });
    //@ts-ignore
    return (
            <div className={disabled ? 'joystick-base-disabled' : ''}

                ref={baseRef}
                style={baseStyle}>
                <button ref={stickRef}
                    disabled={disabled}
                    onPointerDown={(event: any) => pointerDown(event)}
                    className={disabled ? 'joystick-disabled' : ''}
                    style={stickStyle}/>
            </div>
            );
}

