import { mergeConfig } from "vite";
import base from "./vite.phase4.config";
// Local mocked UI only. No dotenv, live backend, Auth provider or service worker.
export default mergeConfig(base, {
  server: { host: "127.0.0.1", port: 5194, strictPort: true, open: false },
  optimizeDeps: { entries: ["password-demo.html"] },
  define: {
    "import.meta.env.VITE_APPLICANT_PASSWORD_AUTH_ENABLED": JSON.stringify(
      process.env.PASSWORD_UI_DISABLED === "true" ? "false" : "true",
    ),
    "import.meta.env.VITE_VOLUNTEER_REGISTRATION_ENABLED":
      JSON.stringify("true"),
    "import.meta.env.VITE_SERVER_URL": JSON.stringify("http://127.0.0.1:5194"),
    "import.meta.env.VITE_PARENT_REGISTRATION_API_URL": JSON.stringify(
      "http://127.0.0.1:5194",
    ),
  },
});
