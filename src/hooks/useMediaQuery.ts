import { useState, useEffect } from 'react';

/**
 * A custom hook that returns a boolean indicating whether the current viewport
 * matches the provided media query.
 * 
 * @param query The media query to check against (e.g. "(max-width: 768px)")
 * @returns A boolean indicating whether the query matches
 */
export function useMediaQuery(query: string): boolean {
  // Use a function for the initial value to avoid running matchMedia on the server
  const [matches, setMatches] = useState<boolean>(() => {
    // Check if window exists (client-side only)
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // Avoid running this effect during SSR
    if (typeof window === 'undefined') return;
    
    // Create the media query list
    const mediaQueryList = window.matchMedia(query);
    
    // Initial check
    setMatches(mediaQueryList.matches);
    
    // Define the handler
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    // Add the listener
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQueryList.addListener(handler);
    }
    
    // Clean up
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handler);
      } else {
        // Fallback for older browsers
        mediaQueryList.removeListener(handler);
      }
    };
  }, [query]);
  
  return matches;
}

/**
 * A custom hook that returns a boolean indicating whether the current viewport
 * is mobile (width <= 768px).
 * 
 * @returns A boolean indicating whether the device is considered mobile
 */
export function useMobileDetection(): boolean {
  return useMediaQuery('(max-width: 768px)');
}