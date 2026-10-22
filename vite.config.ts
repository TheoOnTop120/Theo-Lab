import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      deny: ["**/500_infos_sur_theo.md", "**/.env", "**/.env.*", "**/*.{crt,pem}", "**/.git/**"],
    },
  },
});
