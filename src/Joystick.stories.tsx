import * as React from "react";

import {storiesOf} from "@storybook/react";
import {action} from '@storybook/addon-actions';

import {Joystick} from "./Joystick";
import {JoystickShape} from "./enums/shape.enum";

const joystickStories = storiesOf('Joystick Examples', module);


joystickStories.add("Default joystick", () => <Joystick start={action("Started")} move={action("Moved")}
                                                        stop={action("Stopped")}/>);
joystickStories.add("Default joystick with 50% minDistance", () => <Joystick minDistance={50} start={action("Started")} move={action("Moved")}
                                                        stop={action("Stopped")}/>);
joystickStories.add("Control plane override", () => <Joystick start={action("Started")} controlPlaneShape={JoystickShape.Square} move={action("Moved")}
                                                        stop={action("Stopped")}/>);
joystickStories.add("Square joystick", () => <div style={{display:'flex', justifyContent:'space-around', padding:'25px'}}><Joystick throttle={100} start={action("Started")} baseShape={JoystickShape.Square} stickShape={JoystickShape.Square} move={action("Moved")}
                                                        stop={action("Stopped")}/><Joystick throttle={100} start={action("Started")} baseShape={JoystickShape.Square}  move={action("Moved")}
                                                                                            stop={action("Stopped")}/></div>);

joystickStories.add("Yellow (custom colors) joystick",
    () => <Joystick
        start={action("Started")}
        baseColor={"#FFFF99"}
        stickColor={"#FFD300"} move={action("Moved")}
        stop={action("Stopped")}/>);


joystickStories.add("50ms throttled joystick", () => <Joystick start={action("Started")} throttle={50}
                                                               move={action("Moved")} stop={action("Stopped")}/>);

joystickStories.add("100ms throttled joystick",
    () => <Joystick
        start={action("Started")}
        throttle={100}
        move={action("Moved")}
        stop={action("Stopped")}/>);

joystickStories.add("200ms throttled joystick",
    () => <Joystick
        start={action("Started")}
        throttle={200}
        move={action("Moved")}
        stop={action("Stopped")}/>);


joystickStories.add("500ms throttled joystick",
    () => <Joystick
        start={action("Started")}
        throttle={500}
        move={action("Moved")}
        stop={action("Stopped")}/>);

joystickStories.add("Sticky joystick",
    () => <Joystick
        sticky={true}
        start={action("Started")}
        throttle={50}
        move={action("Moved")}
        stop={action("Stopped")}/>);

joystickStories.add("Images", () => <Joystick
    baseImage="http://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/fire.png"
    stickImage="https://i.imgflip.com/1cf8by.jpg" start={action("Started")} throttle={50} move={action("Moved")}
    stop={action("Stopped")}/>);

joystickStories.add("Follow Cursor", () => (<div style={{padding: "50px", display: 'flex'}}>
    <Joystick followCursor={true} start={action("Started")} baseColor='grey' stickColor='black' throttle={50}
              move={action("Moved")} stop={action("Stopped")}/>
    <Joystick followCursor={true} start={action("Started")} baseColor='grey' stickColor='black' throttle={50}
              move={action("Moved")} stop={action("Stopped")}/>
</div>));
joystickStories.add("Many follow Cursor", () => (<div style={{padding: "50px", display: 'flex'}}>
    <Joystick followCursor={true} start={action("Started")} baseColor='grey' stickColor='black' throttle={50}
              move={action("Moved")} stop={action("Stopped")}/>
    <Joystick followCursor={true} start={action("Started")} baseColor='grey' stickColor='black' throttle={50}
              move={action("Moved")} stop={action("Stopped")}/>
    <Joystick followCursor={true} start={action("Started")} baseColor='grey' stickColor='black' throttle={50}
              move={action("Moved")} stop={action("Stopped")}/> <Joystick followCursor={true} start={action("Started")}
                                                                          baseColor='grey' stickColor='black'
                                                                          throttle={50}
                                                                          move={action("Moved")}
                                                                          stop={action("Stopped")}/> <Joystick
    followCursor={true} start={action("Started")} baseColor='grey' stickColor='black' throttle={50}
    move={action("Moved")} stop={action("Stopped")}/> <Joystick followCursor={true} start={action("Started")}
                                                                baseColor='grey' stickColor='black' throttle={50}
                                                                move={action("Moved")} stop={action("Stopped")}/>
    <Joystick followCursor={true} start={action("Started")} baseColor='grey' stickColor='black' throttle={50}
              move={action("Moved")} stop={action("Stopped")}/>
</div>));

joystickStories.add("HUGE joystick", () => <Joystick start={action("Started")} move={action("Moved")}
                                                     stop={action("Stopped")} size={500}/>);
joystickStories.add("Tiny joystick", () => <Joystick start={action("Started")} move={action("Moved")}
                                                     stop={action("Stopped")} size={50}/>);
joystickStories.add("Disabled joystick", () => <Joystick start={action("Started")} move={action("Moved")}
                                                         stop={action("Stopped")} disabled={true}/>);

interface IDirectionComponentState {
    direction: string;
}


class DirectionComponent extends React.Component<any, IDirectionComponentState> {
    constructor(props: any) {
        super(props);
        this.state = {
            direction: "Stopped"
        };
    }

    private _handleMove(data: any) {
        this.setState({
            direction: data.direction
        });
    }

    private _handleStop() {
        this.setState({
            direction: "Stopped"
        });
    }

    render() {
        return (<div>
            <Joystick move={this._handleMove.bind(this)} stop={this._handleStop.bind(this)}/>
            <p>{this.state.direction}</p>
        </div>);
    }
}

joystickStories.add("Default with direction text", () => <DirectionComponent/>)