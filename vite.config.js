import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
    plugins: [solidPlugin()],
    base: process.env.BASE_URL || '',
    build: {
        target: 'esnext',
    }, define: {
        'process.env': process.env,
    }
});
