export enum JoystickShape {
    Circle = 'circle',
    Square = 'square',
    AxisY = 'axisY',
    AxisX = 'axisX',
}
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
    pos?: {x: number, y: number};
}
export interface IJoystickAdapter {
    getStickStyle(): unknown;
    getBaseStyle(): unknown;
    removeUpListener(): unknown;
    isCurrentPointer(event: PointerEvent): unknown;
    getPosition(event: PointerEvent): { absoluteX: any; absoluteY: any; relativeX: any; relativeY: any; };
    canMove(event: PointerEvent, props: IJoystickProps): unknown;
    setPointerCapture(e: PointerEvent): unknown;
    registerUpListeners(stop: ((event: IJoystickUpdateEvent) => void) | undefined): unknown;
    removeMoveListener(): void;
    registerMoveListener(move: any): void;
    getParentRect(): any;
}
export enum InteractionEvents {
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

export enum JoystickEnvironment {
    React = 'R',
    ReactNative = 'RN'
}

export type JoystickDirection = "FORWARD" | "RIGHT" | "LEFT" | "BACKWARD";

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
export enum RadianQuadrantBinding {
    TopRight = 2.35619449,
    TopLeft = -2.35619449,
    BottomRight = 0.785398163,
    BottomLeft = -0.785398163
}