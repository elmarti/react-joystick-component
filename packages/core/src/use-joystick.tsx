import { IJoystickAdapter, IJoystickCoordinates, IJoystickProps, JoystickDirection, JoystickEnvironment, JoystickShape, RadianQuadrantBinding } from "./joystick-types";
import { useEffect, useState, useMemo } from "react";
import { shapeBoundsFactory } from "./shapes/shape.bounds.factory";
import { shapeFactory } from "./shapes/shape.factory";
import { useThrottledMove } from "./use-throttled-move";




export const useJoystick = (
    props: IJoystickProps,
    env: JoystickEnvironment,
    joystickAdapter: IJoystickAdapter
  ) => {
    const [dragging, setDragging] = useState(false);
    const [coordinates, setCoordinates] = useState<IJoystickCoordinates | undefined>(undefined);
    const [parentRect, setParentRect] = useState(null);
    //@ts-ignore
    const throttledMove = useThrottledMove(props.throttle, props.move);
    useEffect(()=> {
        if(env === JoystickEnvironment.ReactNative){
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            return () => {

            };
        }
        if (props.followCursor) {
            // @ts-ignore
            setParentRect(joystickAdapter.getParentRect());

            setDragging(true);

            joystickAdapter.registerMoveListener(props.move);

            if (props.start) {
                props.start({
                    type: "start",
                    x: null,
                    y: null,
                    distance: null,
                    direction: null
                });
            }

        }
        return () => {
            if(props.followCursor){
                joystickAdapter.removeMoveListener();
            }
        };
    }, [props.move]);
    const baseSize = props.size || 100;
    const stickSize = props.stickSize
    const radius = useMemo(() => baseSize / 2, [baseSize]);


    return {
        updatePos(coordinates: IJoystickCoordinates){
            if(env === JoystickEnvironment.React){
                window.requestAnimationFrame(() => {
                    setCoordinates(coordinates);
                  });
            }
            if(typeof props.minDistance ===  'number'){
                if(coordinates.distance < props.minDistance){
                    return;
                }
            }
            throttledMove({
                type: "move",
                x: ((coordinates.relativeX * 2) / baseSize),
                y: -((coordinates.relativeY * 2) / baseSize),
                direction: coordinates.direction,
                distance: coordinates.distance
            });
        },
        pointerDown(e: PointerEvent){
            if(props.disabled || props.followCursor){
                return;
            }
            setParentRect(joystickAdapter.getParentRect());
            setDragging(true);
            joystickAdapter.registerUpListeners(props.stop);
            joystickAdapter.registerMoveListener(throttledMove)
            joystickAdapter.setPointerCapture(e);
            if(props.start){
                props.start({
                    type: "start",
                    x: null,
                    y: null,
                    distance: null,
                    direction: null
                });
            }
        },
        getDirection(atan2: number): JoystickDirection{
            if (atan2 > RadianQuadrantBinding.TopRight || atan2 < RadianQuadrantBinding.TopLeft) {
                return "FORWARD";
            } else if (atan2 < RadianQuadrantBinding.TopRight && atan2 > RadianQuadrantBinding.BottomRight) {
                return "RIGHT"
            } else if (atan2 < RadianQuadrantBinding.BottomLeft) {
                return "LEFT";
            }
            return "BACKWARD";
        },
        distance(x: number, y: number): number {
            return Math.hypot(x, y);
        },
        distanceToPercentile(distance:number): number {
            const percentageBaseSize = distance / (baseSize/2) * 100;
            if(percentageBaseSize > 100){
                return 100;
            }
            return percentageBaseSize;
        },
        pointerMove(event: PointerEvent){
            if(dragging){
                if(joystickAdapter.canMove(event, props)){
                    return;
                }
                //@ts-ignore
                let {absoluteX, absoluteY, relativeX, relativeY} = joystickAdapter.getPosition(event);
                const dist = this.distance(relativeX, relativeY);
                const bounded = shapeBoundsFactory(
                    // @ts-ignore
                    props.controlPlaneShape || props.baseShape,
                    absoluteX,
                    absoluteY,
                    relativeX,
                    relativeY,
                    dist,
                    radius,
                    baseSize,
                    parentRect as any);
            relativeX = bounded.relativeX
            relativeY = bounded.relativeY
            const atan2 = Math.atan2(relativeX, relativeY);
            this.updatePos({
                relativeX,
                relativeY,
                distance: this.distanceToPercentile(dist),
                direction: this.getDirection(atan2),
                // @ts-ignore
                axisX: absoluteX - parentRect.left,
                // @ts-ignore
                axisY: absoluteY - parentRect.top
            })
            }
        },
        pointerUp(event: PointerEvent){
            if(!joystickAdapter.isCurrentPointer(event)){
                return;
            }
            if(!props.sticky){
                setCoordinates(undefined);
            }
            setDragging(false);
            joystickAdapter.removeMoveListener();
            joystickAdapter.removeUpListener();
            if(props.stop){
                props.stop({
                    type: "stop",
                    // @ts-ignore
                    x: props.sticky ? ((state.coordinates.relativeX * 2) / baseSize) : null,
                    // @ts-ignore
                    y: props.sticky ? ((state.coordinates.relativeY * 2) / baseSize): null,
                    // @ts-ignore
                    direction: props.sticky ? state.coordinates.direction : null,
                    // @ts-ignore
                    distance: props.sticky ? state.coordinates.distance : null

                });
            }
        },
         getBaseShapeStyle() {
            const shape = props.baseShape || JoystickShape.Circle;
            return shapeFactory(shape, baseSize);
        },
       
        getBaseStyle() {
            return joystickAdapter.getBaseStyle(props, stickSize, baseSize);
        },
        getStickStyle() {
            return joystickAdapter.getStickStyle(props, stickSize, baseSize, coordinates);
        },
        dragging,
        setDragging,
        coordinates,
        setCoordinates
    }
}