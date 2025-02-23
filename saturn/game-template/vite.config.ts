import config from '@gm112/text-invaders-config-vite'
import { mergeConfig, type UserConfig } from 'vite'

export default mergeConfig(config, {
  publicDir: './public/',
  // build: {
  //   rollupOptions: {
  //     input: {
  //       main: './public/index.html',
  //     }
  //   }
  // },
} satisfies UserConfig)
