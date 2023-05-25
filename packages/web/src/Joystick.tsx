import {IJoystickProps, JoystickEnvironment, useJoystick} from 'joystick-core';
import { WebAdapter } from './web-adapter';
import React, { useRef } from 'react';
const webAdapter = new WebAdapter();

export const Joystick = (props: IJoystickProps) => {
    const baseRef = useRef();
    const stickRef = useRef();
    const joystick = useJoystick(props, JoystickEnvironment.React, webAdapter);
    console.log({joystick})
    //@ts-ignore
    return (
        <div data-testid="joystick-base" className={props.disabled ? 'joystick-base-disabled' : ''}
            //@ts-ignore     
        ref={baseRef}
             style={joystick.getBaseStyle()}>
                    {/*@ts-ignore*/}

            <button ref={stickRef}
                    disabled={props.disabled}
                //@ts-ignore*
                    onPointerDown={joystick.pointerDown}
                    className={props.disabled ? 'joystick-disabled' : ''}
                    style={joystick.getStickStyle()}/>
        </div>
    )}