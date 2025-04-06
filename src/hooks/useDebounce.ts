import { useState, useEffect } from 'react';

/**
 * A custom hook for debouncing values
 * 
 * @param value The value to debounce
 * @param delay The delay in milliseconds (default: 500ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timer if the value changes again before the delay is over
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * A custom hook for creating a debounced callback function
 * 
 * @param callback The function to debounce
 * @param delay The delay in milliseconds (default: 500ms)
 * @returns The debounced callback function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T, 
  delay = 500
): (...args: Parameters<T>) => void {
  // Store the timeout reference
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // The debounced function
  const debouncedFn = React.useCallback(
    (...args: Parameters<T>) => {
      // Clear existing timeout
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Set new timeout
      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  // Clean up the timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return debouncedFn;
}