/// <reference types="vite/client" />
import { fromEvent, map } from 'rxjs'
import render_worker_thread from './render.job.js?worker'
import {
  encode_render_data,
  type render_data,
} from './reactive/entity-buffer.js'

export default function render_worker() {
  const worker = new render_worker_thread()
  const $worker_messages = fromEvent<MessageEvent>(worker, 'message').pipe(
    map((event) => ({ worker: 'render', message: event })),
  )

  function start(canvas: HTMLCanvasElement) {
    const offscreen_context = canvas.transferControlToOffscreen()
    worker.postMessage({ type: 'wakeup', payload: offscreen_context }, [
      offscreen_context,
    ])

    return
  }

  function tick(entities: render_data[]) {
    const payload = new Uint8Array(encode_render_data(entities))
    worker.postMessage({ type: 'tick', payload }, [payload])
  }

  function stop() {
    worker.postMessage({ type: 'die' })
    worker.terminate()
  }

  return {
    start,
    tick,
    stop,
    $worker_messages,
  }
}
