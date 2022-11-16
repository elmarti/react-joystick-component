import { shapeFactory } from "../shapes/shape.factory";
import { JoystickShape } from "../enums/shape.enum";
import { IJoystickCoordinates } from "../Joystick";

const DEFAULT_STICK_COLOR = "#3D59AB";
const DEFAULT_STICK_SHAPE = JoystickShape.Circle;

export const useStickStyle = (stickSize: number |undefined, baseSize: number, stickColor:string = DEFAULT_STICK_COLOR, stickImage: string| undefined| null = null, coordinates: IJoystickCoordinates | null, shape = DEFAULT_STICK_SHAPE) => {
    const pxStickSize = stickSize ? `${stickSize}px` :`${baseSize / 1.5}px`;


    let stickStyle = {
        ...shapeFactory(shape, baseSize),
        background: stickColor,
        cursor: "move",
        height: pxStickSize,
        width: pxStickSize,
        border: 'none',
        flexShrink: 0,
        touchAction: 'none'
    } as any;
    if (stickImage) {
        stickStyle.background = `url(${stickImage})`;
        stickStyle.backgroundSize = '100%'
    }

    if (coordinates) {
        stickStyle = Object.assign({}, stickStyle, {
            position: 'absolute',
            transform: `translate3d(${coordinates.relativeX}px, ${coordinates.relativeY}px, 0)`
        });
    }
    return stickStyle;
};