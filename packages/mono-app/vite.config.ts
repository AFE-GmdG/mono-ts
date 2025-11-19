import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => ({
  build: {
    target: ["es2024"],
    modulePreload: {
      polyfill: false,
    },
    sourcemap: command === "serve",
  },

  resolve: {
    alias: {
      // Wir leiten den Import auf den Source-Code um.
      // Der Pfad ist relativ zur vite.config.ts, also müssen wir ../mono-lib/src verwenden.
      // Di wir hier nicht wissen, von welchem Unterordner im src der Anwendung der import kommt,
      // nutzen wir __dirname zusammen mit path.resolve.
      "mono-lib": path.resolve(__dirname, "../mono-lib/src"),
    },
  },

  esbuild: {
    sourcemap: "inline",
  },

  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    port: 2110,
    strictPort: true,
    open: false,
    cors: true,
    fs: {
      allow: [".."],
    },
  },

  clearScreen: true,

  plugins: [],
}));
