import { defineConfig } from "vite";

console.log("🔥 VITE CONTENT CONFIG LOADED");

export default defineConfig({
    build: {
        rollupOptions: {
            input: "content.js",
            output: {
                entryFileNames: "content.js",
                format: "iife"
            }
        },
        outDir: "dist",
        emptyOutDir: false
    },
    publicDir: false
});