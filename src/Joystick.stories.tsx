import * as React from "react";

import { storiesOf } from "@storybook/react";
import { Joystick } from "./Joystick";

const joystickStories = storiesOf('Joystick', module);

joystickStories.add("basic joystick", ()=> <Joystick/>);
