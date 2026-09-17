import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'feather-editor/vue': resolve(import.meta.dirname, 'adapters/vue/index.js'),
      'feather-editor/styles': resolve(import.meta.dirname, 'styles/feather.css'),
      'feather-editor': resolve(import.meta.dirname, 'src/index.js'),
    },
  },
  server: {
    port: 4000,
    host: '127.0.0.1',
  },
});
