import { defineConfig } from "vite";

export default defineConfig({
    build: {
        rollupOptions: {
            input: "background.js",

            output: {
                entryFileNames: "background.js",
                format: "iife"
            }
        },

        outDir: "dist",
        emptyOutDir: true
    },

    publicDir: "public"
});