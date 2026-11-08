import { defineConfig, loadEnv } from 'vite'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { selectBranding, brandingCss } from './branding.config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
// Railway supplies the existing target/API settings as build environment vars.
// Keep an object export: isolated local configs merge this base configuration.
// NODE_ENV chooses standard Vite env files, never the brand itself.
const branding = selectBranding({
  ...loadEnv(process.env.NODE_ENV === 'production' ? 'production' : 'development', process.cwd(), 'VITE_'),
  ...process.env,
})
export default defineConfig({
  define: { __ETLAASOT_BRANDING__: JSON.stringify(branding) },
  plugins: [
    {
      name: 'environment-branding',
      resolveId(id) { if (id === 'virtual:brand.css') return '\0virtual:brand.css' },
      load(id) { if (id === '\0virtual:brand.css') return brandingCss(branding) },
      transformIndexHtml(html) {
        return html
          .replace('/favicon.ico', branding.favicon)
          .replace('/apple-touch-icon-180x180.png', branding.apple)
          .replace('content="#7A3E6B"', `content="${branding.colors.primary}"`)
      },
      generateBundle() {
        if (!branding.production) return
        // Sources live outside public, so DEV builds do not ship these assets.
        const assets = new URL('./branding/production/', import.meta.url)
        for (const name of readdirSync(assets)) {
          if (!/\.(svg|png|ico)$/.test(name))
            throw new Error('Unexpected branding asset')
          this.emitFile({
            type: 'asset',
            fileName: `branding/production/${name}`,
            source: readFileSync(new URL(name, assets)),
          })
        }
        const worker = readFileSync(
          fileURLToPath(
            new URL('./public/push-notifications-sw.js', import.meta.url),
          ),
          'utf8',
        )
          .replace('"/pwa-192x192.png"', JSON.stringify(branding.pwa192))
          .replace('"/pwa-64x64.png"', JSON.stringify(branding.pwa64))
        this.emitFile({
          type: 'asset',
          fileName: 'push-notifications-sw.js',
          source: worker,
        })
      },
    },
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    VitePWA({
      registerType: 'prompt',
      injectRegister: null,
      manifestFilename: 'manifest.json',
      includeAssets: branding.production
        ? []
        : [
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
        theme_color: branding.colors.primary,
        background_color: branding.production ? branding.colors.canvas : branding.colors.primarySoft,
        icons: [
          {
            src: branding.pwa64,
            sizes: '64x64',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: branding.pwa192,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: branding.pwa512,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: branding.maskable,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        importScripts: ['/push-notifications-sw.js'],
        globPatterns: [
          '**/*.{js,css,html,woff2}',
          ...(branding.production
            ? ['branding/production/*.{svg,png,ico}']
            : []),
        ],
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
