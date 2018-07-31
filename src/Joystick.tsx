import * as React from 'react';

export interface IJoystickProps {
    size?: string;
    baseColor?: string;
    stickColor?: string;
    throttle?: number;
}

export interface IJoystickState {
    dragging:boolean;
    coordinates?:IJoystickCoordinates;
}
export interface IJoystickCoordinates {
    relativeX:number;
    relativeY:number;
    absoluteX: number;
    absoluteY: number;
}

class Joystick extends React.Component<IJoystickProps, IJoystickState> {
    private _stickRef: React.RefObject<any>;
    private _baseRef: React.RefObject<any>;
    private _throttledUpdate: (data:IJoystickCoordinates)=>void;
    private _boundMouseUp: EventListenerOrEventListenerObject;

    constructor(props: IJoystickProps) {
        super(props);
        this.state = {
            dragging:false
        };
        this._stickRef = React.createRef();
        this._baseRef = React.createRef();


        this._throttledUpdate = (()=> {
           let lastCall = 0;
           return (coordinates:IJoystickCoordinates) => {

               const now = new Date().getTime();
               const throttleAmount = this.props.throttle || 0;
               if(now - lastCall < throttleAmount){
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
    private updatePos(coordinates: IJoystickCoordinates){
        this.setState({
           coordinates
        });
    }
    private mouseDown(e:any){
        this.setState({
            dragging:true
        });
        window.addEventListener("mouseup", this._boundMouseUp);
    }

    private mouseMove(event: any){
        if(this.state.dragging) {
            const bounds = event.target.parentElement.getBoundingClientRect();
            const absoluteX = event.clientX;
            const absoluteY = event.clientY;
            const relativeX = absoluteX - bounds.left - 50;
            const relativeY = absoluteY - bounds.top - 50;
            console.log(event.clientX, event.clientY)
            this._throttledUpdate({
                relativeX,
                relativeY,
                absoluteX,
                absoluteY
            });
        }
    }
    private mouseUp(){
        this.setState({
            dragging:false,
            coordinates:undefined
        });
        window.removeEventListener("mouseup", this._boundMouseUp);

    }
    render() {
        const baseSize: string = this.props.size !== undefined ? this.props.size : "100px";
        const baseColor: string = this.props.baseColor !== undefined ? this.props.baseColor : "red";
        const stickColor: string = this.props.stickColor !== undefined ? this.props.stickColor : "blue";

        const baseStyle = {
            height: baseSize,
            width: baseSize,
            background: baseColor,
            borderRadius: baseSize,

            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };
        let stickStyle = {
            background: stickColor,
            cursor: "move",
            height: "60px",
            width: "60px",
            borderRadius: baseSize,
            flexShrink: 0
        };
        if(this.state.dragging && this.state.coordinates !== undefined){
            stickStyle = Object.assign({}, stickStyle, {
                position: 'relative',
                top:this.state.coordinates.relativeY ,
                left:this.state.coordinates.relativeX
            });
        }

        return (
            <div onMouseMove={this.mouseMove.bind(this)} onMouseDown={this.mouseDown.bind(this)} ref={this._baseRef} style={baseStyle}>
                <div  ref={this._stickRef} style={stickStyle}></div>
            </div>
        )
    }
}

export {
    Joystick
};
