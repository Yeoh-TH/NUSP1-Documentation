import { defineConfig } from "vite";

export default defineConfig({
    base: '/NUSP1-Documentation/',
    build: {
        outDir: 'dist',
        emptyOutDir: true
    }
})