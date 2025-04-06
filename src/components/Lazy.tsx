import React, { Suspense, lazy as reactLazy, ComponentType, LazyExoticComponent } from 'react';

// Loading fallback component with prop types
interface LoadingProps {
  message?: string;
}

const DefaultLoading = ({ message = "Loading..." }: LoadingProps) => (
  <div className="p-4 bg-white dark:bg-metal-darker rounded-lg shadow-md dark:shadow-neon-blue dark:border dark:border-metal-blue flex items-center justify-center min-h-[100px]">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-metal-blue mb-3"></div>
      <h2 className="text-lg font-medium text-gray-800 dark:text-metal-lightblue">
        {message}
      </h2>
    </div>
  </div>
);

// Type for the lazy loading function
interface LazyOptions {
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

/**
 * Enhanced lazy loading function with better error handling and loading state
 * 
 * @param importFn - Dynamic import function that returns a promise for a module
 * @param options - Configuration options for loading and error states
 * @returns A lazily loaded component with proper Suspense and error handling
 */
export function lazy<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyOptions = {}
): LazyExoticComponent<T> {
  const LazyComponent = reactLazy(importFn);

  // Create a wrapper component with proper Suspense and fallback
  const LazyWrapper = (props: React.ComponentProps<T>) => (
    <Suspense fallback={options.fallback || <DefaultLoading />}>
      <LazyComponent {...props} />
    </Suspense>
  );

  // Cast to LazyExoticComponent to maintain proper typing
  return LazyWrapper as unknown as LazyExoticComponent<T>;
}

export default lazy;