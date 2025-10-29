import { defineConfig } from "vite";

export default defineConfig({
    base: '/NUSP1-Documentation/',
    build: {
        outDir: 'docs',
        emptyOutDir: false
    }
})