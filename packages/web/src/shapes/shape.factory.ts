import { JoystickShape } from "joystick-core";

export const shapeFactory = (shape: JoystickShape, size: number) =>{
    switch (shape){
      
        case JoystickShape.Square:
            return  {
                borderRadius: Math.sqrt(size)
            }
        case JoystickShape.Circle:
        default:
            return {
                borderRadius:size,
            };
    }
}