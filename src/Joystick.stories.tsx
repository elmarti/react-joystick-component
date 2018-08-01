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
