import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Improve build output
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'components-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-slider', 
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-separator',
          ],
        }
      }
    },
    sourcemap: true,
    // Minify options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs
        drop_debugger: true  // Remove debugger statements
      }
    }
  },
  server: {
    port: 3000,
    strictPort: false,
    open: false,
  },
});