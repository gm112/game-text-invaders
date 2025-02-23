/// <reference types="vite/client" />
import { fromEvent, map } from 'rxjs'
import entity_worker_thread from './entity.job.js?worker'

export default function entity_worker() {
  const worker = new entity_worker_thread()
  const $worker_messages = fromEvent<MessageEvent>(worker, 'message').pipe(
    map((event) => ({ worker: 'entity', message: event })),
  )

  function start() {
    worker.postMessage({ type: 'wakeup' })
  }

  function tick() {
    worker.postMessage({ type: 'tick' })
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
