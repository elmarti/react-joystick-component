import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from '@storybook/addon-actions';

import { Joystick } from "./Joystick";

const joystickStories = storiesOf('Joystick', module);

joystickStories.add("basic joystick", ()=> <Joystick move={action("Moved")} stop={action("Stopped")} />);
