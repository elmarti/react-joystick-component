import {JoystickShape} from "../enums/shape.enum";

export const shapeFactory = (shape: JoystickShape, size: number) =>{
    switch (shape){
        case JoystickShape.Circle:
            return {
                borderRadius:size,
            };
        case JoystickShape.Square:
            return  {
                borderRadius: Math.sqrt(size)
            }
    }
}