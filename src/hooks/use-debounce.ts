import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * Useful for auto-save functionality to prevent excessive API calls
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for detecting if a value has changed
 * Returns true if the value is different from the initial value
 */
export function useHasChanged<T>(value: T, initialValue: T): boolean {
  return JSON.stringify(value) !== JSON.stringify(initialValue);
}
