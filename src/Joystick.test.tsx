import React from 'react';

import { render, fireEvent, screen } from '@testing-library/react';
import { Joystick, IJoystickProps } from './Joystick';
import { JoystickShape } from 'enums/shape.enum';
import '@testing-library/jest-dom';

const defaultProps: IJoystickProps = {
    size: 100,
    stickSize: 50,
    baseColor: '#000033',
    stickColor: '#3D59AB',
    throttle: 0,
    disabled: false,
    sticky: false,
    followCursor: false,
    baseShape: JoystickShape.Circle,
    stickShape: JoystickShape.Circle,
    controlPlaneShape: JoystickShape.Circle,
    minDistance: 0,
};
// setPointerCapture is not available in JSDom
Element.prototype.setPointerCapture = function () {};


describe('Joystick component', () => {
    test('renders without crashing', () => {
        render(<Joystick {...defaultProps} />);
    });

    test('calls the start, move, and stop callbacks when appropriate', () => {
        const onStart = jest.fn();
        const onMove = jest.fn();
        const onStop = jest.fn();

        render(
            <Joystick
                {...defaultProps}
                start={onStart}
                move={onMove}
                stop={onStop}
            />
        );

        const joystick = screen.getByRole('button');

        fireEvent.pointerDown(joystick, { clientX: 50, clientY: 50 });
        expect(onStart).toHaveBeenCalledTimes(1);

        fireEvent.pointerMove(window, { clientX: 60, clientY: 60 });
        expect(onMove).toHaveBeenCalledTimes(1);

        fireEvent.pointerUp(window, { clientX: 60, clientY: 60 });
        expect(onStop).toHaveBeenCalledTimes(1);
    });

    test('respects the disabled prop', () => {
        const onStart = jest.fn();
        const onMove = jest.fn();
        const onStop = jest.fn();

        render(
            <Joystick
                {...defaultProps}
                disabled={true}
                start={onStart}
                move={onMove}
                stop={onStop}
            />
        );

        const joystick = screen.getByRole('button');

        fireEvent.pointerDown(joystick, { clientX: 50, clientY: 50 });
        expect(onStart).not.toHaveBeenCalled();

        fireEvent.pointerMove(window, { clientX: 60, clientY: 60 });
        expect(onMove).not.toHaveBeenCalled();

        fireEvent.pointerUp(window, { clientX: 60, clientY: 60 });
        expect(onStop).not.toHaveBeenCalled();
    });

    test('follows the cursor when followCursor prop is set to true', () => {
        const onStart = jest.fn();
        const onMove = jest.fn();
        const onStop = jest.fn();

        render(
            <Joystick
                {...defaultProps}
                followCursor={true}
                start={onStart}
                move={onMove}
                stop={onStop}
            />
        );

        fireEvent.pointerMove(window, { clientX: 60, clientY: 60 });
        expect(onMove).toHaveBeenCalledTimes(1);

    });

    test('applies custom styles based on the baseColor, stickColor, size, and stickSize props', () => {
        render(
            <Joystick
                {...defaultProps}
                baseColor="red"
                stickColor="blue"
                size={200}
                stickSize={100}
            />
        );
        const joystick = screen.getByRole('button');

        expect(joystick).toHaveStyle({ backgroundColor: 'blue', width: '100px', height: '100px' });
        const baseElement = screen.getByTestId('joystick-base');
        expect(baseElement).toHaveStyle({ 
        width: '200px', height: '200px' });

      });
  
    
    //   test('applies sticky behavior when sticky prop is set to true', async () => {
    //     let lastMovePosition = { x: 0, y: 0 };
    //     let lastStopPosition = { x: 0, y: 0 };
    //     const handleMove = (event) => {
    //       lastMovePosition = { x: event.x, y: event.y };
    //     };
    //     const handleStop = (event) => {
    //       lastStopPosition = { x: event.x, y: event.y};
    //     };
      
    //     const { getByRole } = render(
    //       <Joystick {...defaultProps} sticky={true} move={handleMove} stop={handleStop} />
    //     );
      
    //     const stick = getByRole('button');
      
    //     fireEvent.pointerDown(stick, { clientX: 0, clientY: 0 });
    //     fireEvent.pointerMove(window, { clientX: 10, clientY: 10 });
    //     fireEvent.pointerUp(window, { clientX: 10, clientY: 10 });
      
    //     // Add a wait for the events to propagate
    //     await waitFor(() => {
    //       expect(lastStopPosition.x).toBe(lastMovePosition.x);
    //       expect(lastStopPosition.y).toBe(lastMovePosition.y);
    //     });
    //   });
      
      

      // it('should not trigger the move callback if distance is less than minDistance', async () => {
      //   const moveCallback = jest.fn();
      //   const { getByTestId } = render(
      //     <Joystick
      //       minDistance={100}
      //       move={moveCallback}
      //     />
      //   );
      
      //   const joystickBase = getByTestId('joystick-base');
      //   const stick = joystickBase.querySelector('button');
      //   const baseRect = joystickBase.getBoundingClientRect();
      //   const centerX = baseRect.left + baseRect.width / 2;
      //   const centerY = baseRect.top + baseRect.height / 2;
    
      //   console.log(stick)
      //   fireEvent.pointerDown(stick, { clientX: centerX, clientY: centerY });
      
      //   await act(async () => {
      //     // Add a small delay
      //     await new Promise((resolve) => setTimeout(resolve, 50));
      //   });
      
      //   fireEvent.pointerMove(window, { clientX: centerX + 1, clientY: centerY + 1 }); // Move a larger distance
      //   fireEvent.pointerUp(window, { clientX: centerX + 1, clientY: centerY + 1 }); 
      
      //   expect(moveCallback).not.toHaveBeenCalled();
      // });


  test('renders the joystick stick at the correct position when the pos prop is provided', () => {
    const pos = { x: 0.4, y: -0.6 };
    const size = 100;
    const expectedStickPosition = {
      x: (pos.x * size) / 2,
      y: -(pos.y * size) / 2,
    };

    render(<Joystick size={size} pos={pos} />);
    const stick = screen.getByRole('button');

    expect(stick).toHaveStyle({
      transform: `translate3d(${expectedStickPosition.x}px, ${expectedStickPosition.y}px, 0)`,
    });
  });
      
  });
