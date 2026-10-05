import { defineConfig } from 'vite';

export default defineConfig({
  // Root is project root (index.html lives here)
  root: '.',

  // Dev server config
  server: {
    port: 5173,
    open: true,
    host: true,
  },

  // Build output configuration
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Generate source maps for debugging
    sourcemap: true,
    // Rollup options for clean output
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },

  // CSS configuration
  css: {
    devSourcemap: true,
  },
});
