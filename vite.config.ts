import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

import Vue from "@vitejs/plugin-vue";
import Vuetify from "vite-plugin-vuetify";

export default defineConfig({
  base: "/tuemplate/",
  plugins: [
    Vue(),
    Vuetify({ autoImport: true })
  ],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) }
  }
});
