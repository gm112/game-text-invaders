import config from '@gm112/text-invaders-config-vite'
import { mergeConfig, type UserConfig, type Plugin } from 'vite'

// Credit to https://github.com/vitejs/vite/issues/16719#issuecomment-2308170706 for workerChunkPlugin - written by  Hiroshi Ogawa GH @hi-ogawa
// use emitFile to create a worker entry as a chunk of main client build.
function workerChunkPlugin(): Plugin {
  return {
    name: workerChunkPlugin.name,
    apply: 'build',
    enforce: 'pre',
    async resolveId(source, importer, _options) {
      // intercept "xxx?worker"
      if (source.endsWith('?worker')) {
        const resolved = await this.resolve(source.split('?')[0], importer)
        return '\0' + resolved?.id + '?worker-chunk'
      }
    },
    load(id, _options) {
      if (id.startsWith('\0') && id.endsWith('?worker-chunk')) {
        const referenceId = this.emitFile({
          type: 'chunk',
          id: id.slice(1).split('?')[0],
        })
        return `
          export default function WorkerWrapper() {
            return new Worker(
              import.meta.ROLLUP_FILE_URL_${referenceId},
              { type: "module" }
            );
          }
        `
      }
    },
  }
}

export default mergeConfig(config, {
  publicDir: './public/',
  plugins: [workerChunkPlugin()],
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         if (id.includes('rxjs')) return 'rxjs'
  //       },
  //     },
  //   },
  // },
  // build: {
  //   rollupOptions: {
  //     input: {
  //       main: './public/index.html',
  //     }
  //   }
  // },
} satisfies UserConfig)
