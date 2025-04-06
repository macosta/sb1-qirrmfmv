/**
 * Utility functions for performance monitoring and optimization
 */

// Initialize performance monitoring
let perfMetrics: Record<string, { count: number; totalTime: number }> = {};

/**
 * Measures the execution time of a function and logs it
 * 
 * @param name The name of the function or operation being measured
 * @param fn The function to measure
 * @returns The result of the function
 */
export function measurePerformance<T>(name: string, fn: () => T): T {
  const start = performance.now();
  
  try {
    return fn();
  } finally {
    const end = performance.now();
    const duration = end - start;
    
    // Track the performance metrics
    if (!perfMetrics[name]) {
      perfMetrics[name] = { count: 0, totalTime: 0 };
    }
    
    perfMetrics[name].count += 1;
    perfMetrics[name].totalTime += duration;
    
    // Only log in development
    if (import.meta.env.DEV) {
      console.debug(`⏱️ ${name} took ${duration.toFixed(2)}ms`);
    }
  }
}

/**
 * Logs a summary of the performance metrics
 */
export function logPerformanceMetrics(): void {
  console.info('📊 Performance Metrics:');
  
  // Convert the metrics to an array and sort by total time (descending)
  const sortedMetrics = Object.entries(perfMetrics)
    .map(([name, data]) => ({
      name,
      count: data.count,
      totalTime: data.totalTime,
      avgTime: data.totalTime / data.count
    }))
    .sort((a, b) => b.totalTime - a.totalTime);
  
  // Log the metrics as a table
  console.table(sortedMetrics);
}

/**
 * Resets the performance metrics
 */
export function resetPerformanceMetrics(): void {
  perfMetrics = {};
}

// Reset metrics when hot module reloaded
if (import.meta.env.DEV) {
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      resetPerformanceMetrics();
    });
  }
}