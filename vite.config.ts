import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { designTokens } from './src/theme/tokens'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    VitePWA({
      registerType: 'prompt',
      injectRegister: null,
      includeAssets: [
        'etlaasot-favicon.png',
        'et-laasot-bat-yam-logo.png',
        'apple-touch-icon-180x180.png',
      ],
      manifest: {
        id: '/',
        name: 'עת לעשות',
        short_name: 'עת לעשות',
        description: 'אפליקציית המתנדבים והחניכים של עת לעשות',
        lang: 'he',
        dir: 'rtl',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: designTokens.color.primary,
        background_color: designTokens.color.primarySoft,
        icons: [
          {
            src: '/pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api(?:\/|$)/, /^\/auth(?:\/|$)/],
        runtimeCaching: [],
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 700,
  },
})
