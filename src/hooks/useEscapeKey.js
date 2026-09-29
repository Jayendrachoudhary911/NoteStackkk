import { useEffect } from 'react';

/**
 * Hook that invokes a handler when the Escape key is pressed.
 */
export function useEscapeKey(handler, active = true) {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handler, active]);
}

export default useEscapeKey;
