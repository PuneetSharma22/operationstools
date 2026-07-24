import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    // Generates stats.html on every build with a treemap of exactly what's
    // in each chunk (gzip/brotli sizes included) — this is the right tool
    // for finding the actual source of the "74 KiB unused JavaScript"
    // Lighthouse flag, rather than guessing at manualChunks blindly. Run
    // `npm run build` and it'll open automatically.
    visualizer({
      filename: 'stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),

    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      includeAssets: ['favicon.svg', 'pwa-192.png', 'pwa-512.png'],
      manifest: {
        name: 'OpsTools — Free Business Tools for India',
        short_name: 'OpsTools',
        description:
          'Generate fuel bills, rent receipts and more. Free, no sign-up needed.',
        theme_color: '#07011F',
        background_color: '#07011F',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
