import { defineConfig } from 'vite'

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  resolve: {
    alias: {
      '@core': './saturn/core/src',
      '@game-template': './saturn/game-template/src',
      '@editor': './saturn/editor/src',
    },
  },
  build: {
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
})
