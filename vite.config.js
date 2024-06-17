import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
    plugins: [solidPlugin()],
    base: process.argv.includes('dev') ? '' : process.env.BASE_PATH,
    build: {
        target: 'esnext',
    },
});
