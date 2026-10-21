import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// A separate loopback-only dev server. No App/AuthProvider, PWA or .env loading.
export default defineConfig({
  envDir: false,
  optimizeDeps: { entries: ["parent-registration-demo.html"] },
  plugins: [
    react(),
    {
      name: "registration-preview-only",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/" || req.url?.startsWith("/index.html")) {
            res.writeHead(302, { Location: "/parent-registration-demo.html" });
            res.end();
            return;
          }
          next();
        });
      },
    },
  ],
  server: { host: "127.0.0.1", port: 5183, strictPort: true, open: false },
});
