import type { Observable } from 'rxjs'

export interface type_worker_handler<type_worker_message = unknown> {
  start(): void
  tick(): void
  stop(): void
  kill_all_humans(): void
  $worker_messages: Observable<{
    worker: string
    message: MessageEvent<type_worker_message>
  }>
}
