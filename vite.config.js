import { defineConfig } from "vite";

export default defineConfig({
    base: process.env.NODE_ENV === 'production' 
        ? '/NUSP1-Documentation/'
        : '/',
    publicDir: 'public',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            input: {
                main: '/index.html',
            }
        }
    }
})