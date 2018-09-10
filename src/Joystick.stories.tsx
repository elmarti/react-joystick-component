import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from '@storybook/addon-actions';

import { Joystick } from "./Joystick";

const joystickStories = storiesOf('Joystick Examples', module);


joystickStories.add("Default joystick", ()=> <Joystick start={action("Started")} move={action("Moved")} stop={action("Stopped")} />);


joystickStories.add("Yellow (custom colors) joystick", ()=> <Joystick start={action("Started")} baseColor={"#FFFF99"} stickColor={"#FFD300"} move={action("Moved")} stop={action("Stopped")} />);


joystickStories.add("50ms throttled joystick", ()=> <Joystick start={action("Started")} throttle={50} move={action("Moved")} stop={action("Stopped")} />);

joystickStories.add("100ms throttled joystick", ()=> <Joystick start={action("Started")} throttle={100} move={action("Moved")} stop={action("Stopped")} />);

joystickStories.add("200ms throttled joystick", ()=> <Joystick start={action("Started")} throttle={200} move={action("Moved")} stop={action("Stopped")} />);


joystickStories.add("500ms throttled joystick", ()=> <Joystick start={action("Started")} throttle={500} move={action("Moved")} stop={action("Stopped")} />);


joystickStories.add("HUGE joystick", ()=> <Joystick start={action("Started")}move={action("Moved")} stop={action("Stopped")}  size={500}/>);
joystickStories.add("Tiny joystick", ()=> <Joystick start={action("Started")}move={action("Moved")} stop={action("Stopped")}  size={50}/>);
joystickStories.add("Disabled joystick", ()=> <Joystick start={action("Started")}move={action("Moved")} stop={action("Stopped")}  disabled={true}/>);

interface IDirectionComponentState {
    direction:string;
}
interface IDirectionCompnentProps {

}
class DirectionComponent extends React.Component<IDirectionCompnentProps, IDirectionComponentState> {
    constructor(props:any){
        super(props);
        this.state = {
            direction:"Stopped"
        };
    }
    private _handleMove(data:any){
        this.setState({
            direction: data.direction
        });
    }
    private _handleStop(data:any){
        this.setState({
            direction: "Stopped"
        });
    }
    render(){
        return (<div>
            <Joystick move={this._handleMove.bind(this)} stop={this._handleStop.bind(this)} />
            <p>{this.state.direction}</p>
        </div>);
    }
}

joystickStories.add("Default with direction text", ()=><DirectionComponent/>)