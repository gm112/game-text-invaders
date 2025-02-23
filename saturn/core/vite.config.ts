import config from '@gm112/text-invaders-config-vite'
import { mergeConfig } from 'vite'

export default mergeConfig(config, {
  build: {
    lib: {
      entry: 'src/game-loop.ts',
      formats: ['es'],
    },
  },
})
