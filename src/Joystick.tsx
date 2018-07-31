import * as React from 'react';

export interface IJoystickProps {
    size?: number;
    baseColor?: string;
    stickColor?: string;
    throttle?: number;
    move?: (event: IJoystickUpdateEvent) => void;
    stop?: (event: IJoystickUpdateEvent) => void;
}

export interface IJoystickUpdateEvent {
    type: "move" | "stop";
    x: number | null;
    y: number | null;
}

export interface IJoystickState {
    dragging: boolean;
    coordinates?: IJoystickCoordinates;
}

export interface IJoystickCoordinates {
    relativeX: number;
    relativeY: number;
    absoluteX: number;
    absoluteY: number;
    axisX: number;
    axisY: number;
}

class Joystick extends React.Component<IJoystickProps, IJoystickState> {
    private _stickRef: React.RefObject<any>;
    private _baseRef: React.RefObject<any>;
    private _throttledUpdate: (data: IJoystickCoordinates) => void;
    private _boundMouseUp: EventListenerOrEventListenerObject;
    private baseSize: number;

    constructor(props: IJoystickProps) {
        super(props);
        this.state = {
            dragging: false
        };
        this._stickRef = React.createRef();
        this._baseRef = React.createRef();


        this._throttledUpdate = (() => {
            let lastCall = 0;
            return (coordinates: IJoystickCoordinates) => {

                const now = new Date().getTime();
                const throttleAmount = this.props.throttle || 0;
                if (now - lastCall < throttleAmount) {
                    return;
                }
                lastCall = now;
                return this.updatePos(coordinates);

            };
        })();

        this._boundMouseUp = () => {
            this.mouseUp();
        };


    }

    private updatePos(coordinates: IJoystickCoordinates) {
        this.setState({
            coordinates
        });
        if (this.props.move) {
            this.props.move({
                type: "move",
                x: coordinates.relativeX,
                y: Math.abs(coordinates.relativeY)
            });
        }
    }

    private mouseDown(e: any) {
        this.setState({
            dragging: true
        });
        window.addEventListener("mouseup", this._boundMouseUp);
    }

    private mouseMove(event: any) {
        if (this.state.dragging) {
            const bounds = event.target.parentElement.getBoundingClientRect();
            const absoluteX = event.clientX;
            const absoluteY = event.clientY;
            const relativeX = absoluteX - bounds.left - (this.baseSize / 2);
            const relativeY = absoluteY - bounds.top - (this.baseSize / 2);
            console.log(event.target.getBoundingClientRect())
            this._throttledUpdate({
                relativeX,
                relativeY,
                absoluteX,
                absoluteY,
                axisX: absoluteX - bounds.left,
                axisY: absoluteY - bounds.top
            });
        }
    }

    private mouseUp() {
        this.setState({
            dragging: false,
            coordinates: undefined
        });
        window.removeEventListener("mouseup", this._boundMouseUp);
        if (this.props.stop) {
            this.props.stop({
                type: "stop",
                x: null,
                y: null
            });
        }

    }

    render() {
        this.baseSize = this.props.size || 100;
        const baseColor: string = this.props.baseColor !== undefined ? this.props.baseColor : "red";
        const stickColor: string = this.props.stickColor !== undefined ? this.props.stickColor : "blue";

        const baseSizeString: string = `${this.baseSize}px`;
        const stickSize: string = `${this.baseSize / 1.5}px`;
        const baseStyle = {
            height: baseSizeString,
            width: baseSizeString,
            background: baseColor,
            borderRadius: this.baseSize,

            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };
        let stickStyle = {
            background: stickColor,
            cursor: "move",
            height: stickSize,
            width: stickSize,
            borderRadius: this.baseSize,
            flexShrink: 0
        };
        if (this.state.dragging && this.state.coordinates !== undefined) {
            stickStyle = Object.assign({}, stickStyle, {
                position: 'relative',
                top: this.state.coordinates.relativeY,
                left: this.state.coordinates.relativeX
            });
        }

        return (
            <div onMouseMove={this.mouseMove.bind(this)} onMouseDown={this.mouseDown.bind(this)} ref={this._baseRef}
                 style={baseStyle}>
                <div ref={this._stickRef} style={stickStyle}></div>
            </div>
        )
    }
}

export {
    Joystick
};
