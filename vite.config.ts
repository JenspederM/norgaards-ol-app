import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
<<<<<<< HEAD
import postcss from "./postcss.config.cjs";
=======
import postcss from "./postcss.config.js";
>>>>>>> main

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  css: {
    postcss,
  },
});
