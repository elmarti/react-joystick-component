import { IJoystickAdapter, IJoystickCoordinates, IJoystickProps, IJoystickUpdateEvent, JoystickShape } from "joystick-core";
import { shapeFactory } from "./shapes/shape.factory";

export class WebAdapter implements IJoystickAdapter {
    getStickShapeStyle(props: IJoystickProps, baseSize: number): any {
        const shape = props.stickShape || JoystickShape.Circle;
        return shapeFactory(shape, baseSize);
    }
    getBaseShapeStyle(props: IJoystickProps, baseSize: number): any {
        const shape = props.baseShape || JoystickShape.Circle;
        return shapeFactory(shape, baseSize);
    }
    getStickStyle(props: IJoystickProps, stickSizeInput: number | undefined, baseSizeInput: number, coordinates: IJoystickCoordinates) {
        const stickColor: string = props.stickColor !== undefined ? props.stickColor : "#3D59AB";
        const stickSize = stickSizeInput? `${stickSizeInput}px` :`${baseSizeInput / 1.5}px`;

        let stickStyle = {
            ...this.getStickShapeStyle(props, baseSizeInput),
            background: stickColor,
            cursor: "move",
            height: stickSize,
            width: stickSize,
            border: 'none',
            flexShrink: 0,
            touchAction: 'none'
        } as any;
        if (props.stickImage) {
            stickStyle.background = `url(${props.stickImage})`;
            stickStyle.backgroundSize = '100%'
        }
        if(props.pos){
            stickStyle = Object.assign({}, stickStyle, {
                position: 'absolute',
                transform: `translate3d(${(props.pos.x * baseSizeInput)/2 }px, ${-(props.pos.y * baseSizeInput)/2}px, 0)`
            });
        }

        if (coordinates !== undefined) {
            stickStyle = Object.assign({}, stickStyle, {
                position: 'absolute',
                transform: `translate3d(${coordinates.relativeX}px, ${coordinates.relativeY}px, 0)`
            });
        }
        return stickStyle;    }
    getBaseStyle(props: IJoystickProps, stickSizeInput: number | undefined, baseSizeInput: number) {
        const baseColor: string = props.baseColor !== undefined ? props.baseColor : "#000033";

        const baseSizeString = `${baseSizeInput}px`;
        const padStyle = {
            ...this.getBaseShapeStyle(props, baseSizeInput),
            height: baseSizeString,
            width: baseSizeString,
            background: baseColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        } as any;
        if (props.baseImage) {
            padStyle.background = `url(${props.baseImage})`;
            padStyle.backgroundSize = '100%'
        }
        return padStyle;    }
    removeUpListener(): void {
        throw new Error("Method not implemented.");
    }
    isCurrentPointer(event: PointerEvent): boolean {
        throw new Error("Method not implemented.");
    }
    getPosition(event: PointerEvent): { absoluteX: any; absoluteY: any; relativeX: any; relativeY: any; } {
        throw new Error("Method not implemented.");
    }
    canMove(event: PointerEvent, props: IJoystickProps): unknown {
        throw new Error("Method not implemented.");
    }
    setPointerCapture(e: PointerEvent): void {
        throw new Error("Method not implemented.");
    }
    registerUpListeners(stop: ((event: IJoystickUpdateEvent) => void) | undefined): unknown {
        throw new Error("Method not implemented.");
    }
    removeMoveListener(): void {
        throw new Error("Method not implemented.");
    }
    registerMoveListener(move: any): void {
        throw new Error("Method not implemented.");
    }
    getParentRect() {
        throw new Error("Method not implemented.");
    }
   

}