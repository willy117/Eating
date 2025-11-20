import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Use '.' instead of process.cwd() to avoid potential TS issues with node types
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    // Key for GitHub Pages deployment
    base: './',
    define: {
      // Inject API KEY safely
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY),
    },
  };
});