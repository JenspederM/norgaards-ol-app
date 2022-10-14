import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from 'vite-plugin-pwa'
import postcss from "./postcss.config.cjs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      workbox: {
        globPatterns: ['**/*.{js,ts,css,html,svg,png}'],
      },
      registerType: "autoUpdate",
      devOptions: {
        enabled: process.env.NODE_ENV === "development",
      },
      manifest: {
        "background_color": "#ffffff",
        "theme_color": "#7E1F86",
        "name": "NørgaardsØlApp.web.app",
        "short_name": "NørgaardsØlApp.web.app",
        "start_url": "/",
        "display": "standalone",
        "icons": [
          {
            "src": "/images/icon-128x128.png",
            "sizes": "128x128",
            "type": "image/png",
            "purpose": "maskable any"
          },
          {
            "src": "/images/icon-256x256.png",
            "sizes": "256x256",
            "type": "image/png",
            "purpose": "maskable any"
          },
          {
            "src": "/images/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable any"
          }
        ]
      }
    })
  ],
  css: {
    postcss,
  },
});
