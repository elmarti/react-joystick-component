## React Joystick Component

```
import { Joystick } from 'react-joystick-component';
```


```React
<Joystick size={100} baseColor="red" stickColor="blue" move={handleMove} stop={handleStop}></Joystick>
```

Component Props - as described by IJoystickProps

| Prop  | Type  | Description  |
|---|---|---|
| size  |  number |  The size in px of the Joystick base  |
|  baseColor |  string |  The color of the Joystick base |
| stickColor  |  string |  The color of the Stick |
|  throttle | number  |  The [throttling](https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf) rate of the move callback |
|  move | Function  | Callback fired on every mouse move, not throttled unless a throttling rate is provided as above  |
|  stop | Function  | Callback fired when the user releases the joystick  |
| start  |  Function | Callback fired when the user starts moving the Joystick  |

```TypeScript
interface IJoystickProps {
    size?: number;
    baseColor?: string;
    stickColor?: string;
    throttle?: number;
    move?: (event: IJoystickUpdateEvent) => void;
    stop?: (event: IJoystickUpdateEvent) => void;
    start?: (event: IJoystickUpdateEvent) => void;
}
```

```TypeScript
type JoystickDirection = "FORWARD" | "RIGHT" | "LEFT" | "BACKWARD";

export interface IJoystickUpdateEvent {
    type: "move" | "stop" | "start";
    x: number | null;
    y: number | null;
    direction: JoystickDirection | null;
}
```