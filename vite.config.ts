import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

if (typeof globalThis.CustomEvent === "undefined") {
  const CustomEventShim = function (type: string, eventInitDict: any = {}) {
    return {
      type,
      detail: eventInitDict.detail ?? null,
      bubbles: eventInitDict.bubbles ?? false,
      cancelable: eventInitDict.cancelable ?? false,
      composed: eventInitDict.composed ?? false,
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
      stopPropagation() {},
      stopImmediatePropagation() {},
    };
  } as any;
  globalThis.CustomEvent = CustomEventShim;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
