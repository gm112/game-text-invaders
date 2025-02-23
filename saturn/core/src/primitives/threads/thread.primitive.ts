import type { Observable } from 'rxjs'

export interface type_thread<type_worker_message = unknown> {
  start(): void
  tick(): void
  stop(): void
  $worker_messages: Observable<{
    worker: string
    message: MessageEvent<type_worker_message>
  }>
}
