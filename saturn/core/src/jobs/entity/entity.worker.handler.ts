/// <reference types="vite/client" />
import { fromEvent, map } from 'rxjs'
import entity_worker from './entity.worker.js?worker'
import type { type_thread } from '../../primitives/threads/thread.primitive.js'
import { start_worker, stop_worker } from '../thread.manager.js'

const entity_workers = new Map<
  string,
  { thread: type_thread; worker: Worker }
>()

export default function entity_worker_handler(): type_thread {
  const worker_id = crypto.randomUUID()
  const worker = new entity_worker()
  const $worker_messages = fromEvent<MessageEvent>(worker, 'message').pipe(
    map((message) => ({ worker: 'entity', message })),
  )

  function start() {
    start_worker(worker)
  }

  function tick() {
    worker.postMessage({ type: 'tick' })
  }

  function stop() {
    stop_worker(worker)
    entity_workers.delete(worker_id)
  }

  const thread = {
    start,
    tick,
    stop,
    $worker_messages,
  }

  entity_workers.set(worker_id, { thread, worker })
  return thread
}

export function destroy_all_entity_workers() {
  for (const worker of entity_workers.values()) worker.thread.stop()
  entity_workers.clear()
}
