import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Loopback-only harness. Never load application .env files or register a worker.
export default defineConfig({
  envDir: false,
  cacheDir: "node_modules/.vite-ux",
  plugins: [
    react(),
    {
      name: "ux-worker-simulator",
      resolveId(id) {
        if (id === "virtual:pwa-register/react") return "\0ux-worker";
      },
      load(id) {
        if (id !== "\0ux-worker") return;
        return `import {useState} from 'react';
        export function useRegisterSW(options) {
          const [need,setNeed]=useState(false);
          window.uxOfferUpdate=()=>setNeed(true);
          window.uxExternalActivation=()=>options.onNeedReload?.();
          return {offlineReady:[false,()=>{}],needRefresh:[need,setNeed],updateServiceWorker:async()=>options.onNeedReload?.()};
        }`;
      },
    },
  ],
  define: {
    "import.meta.env.VITE_SERVER_URL": JSON.stringify("http://127.0.0.1:5185"),
  },
  optimizeDeps: { entries: ["ux-demo.html"] },
  server: { host: "127.0.0.1", port: 5185, strictPort: true, open: false },
});
