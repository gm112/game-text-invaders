import { defineConfig } from 'vite'

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  base: process.env['CI'] ? '/game-text-invaders/' : '/',
  resolve: {
    alias: {
      '@core': './saturn/core/src',
      '@game-template': './saturn/game-template/src',
      '@editor': './saturn/editor/src',
    },
  },
  build: {
    target: 'esnext',
    minify: true,
    rollupOptions: {
      output: {
        entryFileNames: '[name]-[hash].mjs',
        chunkFileNames: '[name]-[hash].mjs',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        format: 'esm',
      },
    },
  },
  worker: {
    format: 'es',
  },
})
