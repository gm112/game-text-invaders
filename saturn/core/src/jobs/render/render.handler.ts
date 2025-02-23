/// <reference types="vite/client" />
import { fromEvent, map } from 'rxjs'
import render_worker from './render.worker.js?worker'
import {
  encode_render_data,
  type type_render_data,
} from './reactive/entity-buffer.js'
import type { type_thread } from '../../primitives/threads/thread.primitive.js'
import { start_worker, stop_worker } from '../thread.manager.js'

export type type_render_thread = Omit<
  type_thread<ArrayBuffer>,
  'start' | 'tick'
> & {
  start(canvas: HTMLCanvasElement): void
  tick(entities: type_render_data[]): void
}

const render_workers = new Map<
  string,
  { thread: type_render_thread; worker: Worker }
>()

export default function render_worker_handler(): type_render_thread {
  const worker_id = crypto.randomUUID()
  const worker = new render_worker()
  const $worker_messages = fromEvent<MessageEvent>(worker, 'message').pipe(
    map((message) => ({ worker: 'render', message })),
  )

  function start(canvas: HTMLCanvasElement) {
    start_worker(worker, canvas.transferControlToOffscreen())
  }

  function tick(entities: type_render_data[]) {
    const payload = new Uint8Array(encode_render_data(entities))
    worker.postMessage({ type: 'tick', payload }, [payload])
  }

  function stop() {
    stop_worker(worker)
    render_workers.delete(worker_id)
  }

  const thread = {
    start,
    tick,
    stop,
    $worker_messages,
  }

  render_workers.set(worker_id, { thread, worker })
  return thread
}

export function destroy_all_render_workers() {
  for (const worker of render_workers.values()) worker.thread.stop()
  render_workers.clear()
}
