import { renderHook, act } from '@testing-library/react-hooks';
import { useThrottledMove } from './use-throttled-move';
import { IJoystickUpdateEvent } from 'joystick-types';

jest.useFakeTimers();

describe('useThrottledMove', () => {
    it('throttles move events', () => {
        const moveMock = jest.fn();
        const event: IJoystickUpdateEvent = { type: "move", x: 10, y: 10, direction: "FORWARD", distance: 20 };

        const { result } = renderHook(() => useThrottledMove(1000, moveMock));

        // Get the throttledMove function once and reuse it
        const throttledMove = result.current();

        // Trigger the first move
        act(() => {
            throttledMove(event);
        });

        expect(moveMock).toHaveBeenCalledTimes(1);

        // Trigger a second move within the throttle window
        act(() => {
            jest.advanceTimersByTime(500);
            throttledMove(event);
        });

        // Move event is throttled, so moveMock shouldn't be called again
        expect(moveMock).toHaveBeenCalledTimes(1);

        // Trigger a third move outside the throttle window
        act(() => {
            jest.advanceTimersByTime(500);
            throttledMove(event);
        });

        // Move event isn't throttled, so moveMock should be called again
        expect(moveMock).toHaveBeenCalledTimes(2);
    });
});
