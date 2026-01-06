import { defineConfig } from 'vite'

export default defineConfig({
    // Root directory
    root: '.',

    // Public directory for static assets
    publicDir: 'public',

    // Build output directory
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: './index.html'
            }
        }
    },

    // Dev server configuration
    server: {
        port: 3333,
        open: true,
        cors: true,
        strictPort: false
    },

    // Preview server configuration
    preview: {
        port: 4173,
        open: true
    },

    // Plugins configuration - disable strict HTML handling
    optimizeDeps: {
        exclude: []
    }
})
