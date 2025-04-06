import React from 'react';

interface ErrorDisplayProps {
  error: Error | null;
  resetError?: () => void;
  title?: string;
  showDetails?: boolean;
}

/**
 * A reusable error display component that can be used throughout the application
 * for consistent error presentation.
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  resetError,
  title = 'Something went wrong',
  showDetails = false,
}) => {
  return (
    <div className="p-6 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-100 rounded-lg shadow-md border border-red-200 dark:border-red-800">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <p className="mb-4">Please try again or contact support if the problem persists.</p>
      
      {showDetails && error && (
        <details className="bg-white dark:bg-gray-800 p-3 rounded-md">
          <summary className="cursor-pointer font-medium mb-2">Error Details</summary>
          <div className="mt-2 text-sm font-mono overflow-auto bg-gray-100 dark:bg-gray-900 p-3 rounded">
            {error.message}
            {error.stack && (
              <pre className="mt-2 whitespace-pre-wrap text-xs">{error.stack}</pre>
            )}
          </div>
        </details>
      )}
      
      {resetError && (
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded hover:bg-red-700 dark:hover:bg-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={resetError}
            aria-label="Try again"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorDisplay;