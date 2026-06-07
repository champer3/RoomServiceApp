import { useRef, useCallback } from 'react';

/**
 * Returns a callback that ignores rapid re-invocations within `delay` ms.
 * Use on navigation calls and add-to-cart taps to prevent double-fires.
 */
export default function useThrottledPress(callback, delay = 500) {
  const lastCall = useRef(0);

  return useCallback(
    (...args) => {
      const now = Date.now();
      if (now - lastCall.current < delay) return;
      lastCall.current = now;
      return callback(...args);
    },
    [callback, delay]
  );
}
