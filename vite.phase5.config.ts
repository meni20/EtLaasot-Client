import { defineConfig, mergeConfig } from "vite";
import base from "./vite.config";
// Real application entry point and providers; no mock routes or API adapters.
export default mergeConfig(
  base,
  defineConfig({
    envDir: false,
    server: { host: "127.0.0.1", port: 5185, strictPort: true },
  }),
);
