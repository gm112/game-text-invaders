import config from '@gm112/text-invaders-config-vite'
import { mergeConfig } from 'vite'

export default mergeConfig(config, {
  root: 'public',
})
