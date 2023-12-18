import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import isDev from 'isdev';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: isDev ? '.' : '/create_box/',
});
