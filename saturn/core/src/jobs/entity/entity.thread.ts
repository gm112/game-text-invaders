/// <reference types="vite/client" />
import { fromEvent, map } from 'rxjs'
import entity_worker from './entity.worker.js?worker'
import type { type_thread } from '../../primitives/threads/thread.primitive.js'

const entity_workers = new Map<
  string,
  { thread: type_thread; worker: Worker }
>()

export default function entity_worker_thread(): type_thread {
  const worker_id = crypto.randomUUID()
  const worker = new entity_worker()
  const $worker_messages = fromEvent<MessageEvent>(worker, 'message').pipe(
    map((message) => ({ worker: 'entity', message })),
  )

  function start() {
    worker.postMessage({ type: 'wakeup' })
  }

  function tick() {
    worker.postMessage({ type: 'tick' })
  }

  function stop() {
    try {
      worker.postMessage({ type: 'die' })
      worker.terminate()
    } catch (error) {
      console.error(error)
    }
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
