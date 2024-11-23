import { defineConfig } from 'vite'
import hmr from "./hmr.js";

export default defineConfig({
    root: 'src',
    server: {
        open: true,
        port: 3000,
    },
    plugins: [
        hmr()
    ]
})