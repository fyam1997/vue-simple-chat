import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import * as dotenv from "dotenv";

dotenv.config()

// https://vite.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        vue(),
        vueDevTools(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    define: {
        '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
        '__GOOGLE_CLIENT_ID__': JSON.stringify(process.env.GOOGLE_CLIENT_ID),
    }
})
