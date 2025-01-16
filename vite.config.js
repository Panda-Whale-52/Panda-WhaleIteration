import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // pure JavaScript implementation of the DOM that runs in Node.js
    globals: true, // allows use of describe, it, expect without importing
  },
});
