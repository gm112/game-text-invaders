import { BehaviorSubject, Subject, filter } from 'rxjs'
import entity_worker_thread from './jobs/entity/entity.thread.js'
import render_worker_thread from './jobs/render/render.thread.js'

export interface type_options_create_game_loop<type_game_state> {
  state: type_game_state
  min_workers?: number
  max_workers: number
}

export function create_game_loop<type_game_state>({
  state,
  min_workers = 0,
  max_workers,
}: type_options_create_game_loop<type_game_state>) {
  const $game_loop = new Subject<type_game_state>()
  const $pause_state = new BehaviorSubject<boolean | undefined>(false)
  const $kill_game_loop = $pause_state
    .pipe(filter((pause_state) => pause_state === undefined))
    .subscribe(() => {
      try {
        for (const worker of entity_workers.values()) worker.stop()
        for (const worker of render_workers.values()) worker.stop()
        entity_workers.clear()
        render_workers.clear()
      } catch (error) {
        console.error(error)
      }

      $kill_game_loop.unsubscribe()
    })

  const entity_workers = new Map<
    number,
    ReturnType<typeof entity_worker_thread>
  >()
  const render_workers = new Map<
    number,
    ReturnType<typeof render_worker_thread>
  >()

  if (min_workers && min_workers > max_workers)
    throw new Error('min_workers must be less than or equal to max_workers')

  for (let index = 0; index < min_workers; index++)
    entity_workers.set(index, entity_worker_thread())

  // For now, just have a single render worker.
  render_workers.set(0, render_worker_thread())
  $game_loop.next(state)

  return {
    $game_loop,
    $pause_state,
  }
}
