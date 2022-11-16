import {JoystickShape} from "../enums/shape.enum";
import {shapeFactory} from "../shapes/shape.factory";

const DEFAULT_BASE_COLOR = "#000033";
const DEFAULT_BASE_SHAPE = JoystickShape.Circle;



export const useBaseStyle = (baseSize: number, baseColor = DEFAULT_BASE_COLOR, baseShape = DEFAULT_BASE_SHAPE, baseImage:string | null | undefined = null) => {

    const baseSizeString = `${baseSize}px`;
    const padStyle = {
        ...shapeFactory(baseShape, baseSize),
        height: baseSizeString,
        width: baseSizeString,
        background: baseColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    } as any;
    if (baseImage !== null) {
        padStyle.background = `url(${baseImage})`;
        padStyle.backgroundSize = '100%'
    }
    return padStyle;
}