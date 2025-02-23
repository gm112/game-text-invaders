import config from '@gm112/text-invaders-config-vite'
import { mergeConfig } from 'vite'

export default mergeConfig(config, {
  build: {
    lib: {
      entry: 'src/kernel.ts',
      formats: ['es'],
      fileName: 'saturn-core',
    },
    rollupOptions: {
      external: ['rxjs'],
      output: {
        format: 'esm',
        entryFileNames: '[name].mjs',
      },
    },
  },
})
