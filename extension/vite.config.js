import { defineConfig } from "vite";
import fs from "fs";

console.log("🔥 VITE BACKGROUND CONFIG LOADED");

console.log(
    "📄 MANIFEST BEFORE BACKGROUND BUILD:",
    fs.readFileSync("./public/manifest.json", "utf-8")
);

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