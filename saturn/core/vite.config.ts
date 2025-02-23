import config from '@gm112/text-invaders-config-vite'
import { mergeConfig, type UserConfig } from 'vite'

const saturn_config: UserConfig = {
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
  optimizeDeps: {
    exclude: ['rxjs'],
  },
}

export default mergeConfig(config, saturn_config)
