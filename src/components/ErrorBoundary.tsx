import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to gracefully handle runtime errors
 * Prevents the entire app from crashing when errors occur in child components
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error information
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // You could also send to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI or default error component
      return this.props.fallback || (
        <div className="p-6 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-100 rounded-lg shadow-md border border-red-200 dark:border-red-800">
          <h2 className="text-xl font-bold mb-3">Something went wrong</h2>
          <p className="mb-4">Please try refreshing the page or contact support if the problem persists.</p>
          
          <details className="bg-white dark:bg-gray-800 p-3 rounded-md">
            <summary className="cursor-pointer font-medium mb-2">Technical Details</summary>
            <div className="mt-2 text-sm font-mono overflow-auto bg-gray-100 dark:bg-gray-900 p-3 rounded max-h-[200px]">
              {this.state.error?.toString()}
              <pre className="mt-2 whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
          </details>
          
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
              onClick={() => window.location.reload()}
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;