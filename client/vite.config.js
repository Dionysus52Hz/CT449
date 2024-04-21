import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import { fileURLToPath, URL } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [vue()],
   resolve: {
      alias: {
         '~': fileURLToPath(new URL('./src', import.meta.url)),
      },
   },
   server: {
      port: 5174,
      proxy: {
         '/v1': {
            target: 'http://localhost:3004/',
            changeOrigin: true,
         },
      },
   },
});
