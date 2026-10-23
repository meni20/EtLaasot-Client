import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Isolated UI harness only: no .env, App, real authentication or PWA registration.
export default defineConfig({
  envDir: false,
  plugins: [
    react(),
    {
      name: "phase4-no-service-worker",
      resolveId(id) {
        if (id === "virtual:pwa-register/react")
          return "\0phase4-no-service-worker";
      },
      load(id) {
        if (id === "\0phase4-no-service-worker")
          return "export const useRegisterSW=()=>({needRefresh:[false,()=>{}],offlineReady:[false,()=>{}],updateServiceWorker:async()=>{}});";
      },
    },
  ],
  optimizeDeps: { entries: ["phase4-demo.html"] },
  define: {
    "import.meta.env.VITE_SERVER_URL": JSON.stringify("http://127.0.0.1:5184"),
    "import.meta.env.VITE_PARENT_REGISTRATION_API_URL": JSON.stringify(
      "http://127.0.0.1:5184",
    ),
    "import.meta.env.VITE_ID_FIRST_LOGIN_ENABLED": JSON.stringify("true"),
    "import.meta.env.VITE_APPLICANT_REGISTRATION_ENABLED":
      JSON.stringify("true"),
    "import.meta.env.VITE_PARENT_REGISTRATION_BLOCKING_ENABLED":
      JSON.stringify("true"),
  },
  server: { host: "127.0.0.1", port: 5184, strictPort: true, open: false },
});
