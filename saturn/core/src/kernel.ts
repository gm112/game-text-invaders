import { BehaviorSubject, filter, switchMap } from 'rxjs'
import entity_worker_handler from './jobs/entity/entity.worker.handler.js'
import render_worker_handler from './jobs/render/render.handler.js'

export interface type_options_create_saturn_game<type_game_state> {
  state: type_game_state
  min_workers?: number
  max_workers: number
}

export function create_saturn_game<type_game_state>({
  state,
  min_workers = 0,
  max_workers,
}: type_options_create_saturn_game<type_game_state>) {
  console.debug('[saturn-core] create_saturn_game(): starting')

  const $game_loop = new BehaviorSubject<type_game_state>(state)
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
      $game_loop.complete()
    })

  const entity_workers = new Map<
    number,
    ReturnType<typeof entity_worker_handler>
  >()
  const render_workers = new Map<
    number,
    ReturnType<typeof render_worker_handler>
  >()

  if (min_workers && min_workers > max_workers)
    throw new Error('min_workers must be less than or equal to max_workers')
  else if (min_workers === 0) min_workers = 1

  console.debug('[saturn-core] create_saturn_game(): creating worker threads')
  for (let index = 0; index < min_workers; index++)
    entity_workers.set(index, entity_worker_handler())

  // For now, just have a single render worker.
  render_workers.set(0, render_worker_handler())

  console.debug('[saturn-core] create_saturn_game(): initializing game loop')

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      console.debug('[saturn-core] module reloaded:', module)
      $pause_state.next(undefined)
    })
  }

  return {
    $game_loop: $pause_state.pipe(
      filter((pause_state) => !pause_state),
      switchMap(() => $game_loop),
    ),
    $pause_state,
  }
}

export type type_create_saturn_game_function = typeof create_saturn_game
