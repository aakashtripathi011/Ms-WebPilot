import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: resolve(__dirname, "vision/vision.js"),
            output: {
                entryFileNames: "vision.js"
            }
        },
        outDir: "dist",
        emptyOutDir: false
    },
    publicDir: false
});