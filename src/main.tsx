import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary.tsx';

// Initialize theme from localStorage if available
const theme = localStorage.getItem('guitar-maestro-storage')
  ? JSON.parse(localStorage.getItem('guitar-maestro-storage')!).state.theme
  : 'light';

// Apply theme class to html element
if (theme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// Measure initial load time for performance tracking
const startTime = performance.now();

// Create root and render app
const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

// Log performance metrics
window.addEventListener('load', () => {
  // Calculate and log page load time
  const loadTime = performance.now() - startTime;
  console.log(`Page fully loaded in ${loadTime.toFixed(2)}ms`);

  // Report Web Vitals if needed
  if ('connection' in navigator) {
    // @ts-ignore - Connection property exists but TypeScript doesn't have types for it
    const connectionType = (navigator.connection || {}).effectiveType || 'unknown';
    console.log(`Connection type: ${connectionType}`);
  }
});