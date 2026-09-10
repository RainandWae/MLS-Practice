import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  root: "web",
  plugins: [wasm()],
  optimizeDeps: {
    exclude: ["openmls-wasm"],
  },
});
