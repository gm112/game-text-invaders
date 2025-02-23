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
})
