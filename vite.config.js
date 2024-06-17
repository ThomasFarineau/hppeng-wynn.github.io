import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
    plugins: [solidPlugin()],
    base: 'wynnbuilder',
    build: {
        target: 'esnext',
    }, define: {
        'process.env': {}
    }
});
