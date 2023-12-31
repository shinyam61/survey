import { defineConfig } from 'astro/config';
import glsl from 'vite-plugin-glsl'

const isDev = process.env.NODE_ENV !== "production";

// https://astro.build/config
export default defineConfig({
  base: '/',
  vite: {
    plugins: [glsl()],
    build: {
      assetsInlineLimit: 0,
      cssCodeSplit: false,
      outDir: './dist',
      minify: true
    }
  },
  esbuild: {
    drop: isDev ? [] : ["console", "debugger"],
  },
});
