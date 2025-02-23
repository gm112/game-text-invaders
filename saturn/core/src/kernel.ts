import { BehaviorSubject, filter, map, switchMap, takeUntil } from 'rxjs'
import entity_worker_handler from './jobs/entity/entity.worker.handler.js'
import render_worker_handler from './jobs/render/render.worker.handler.js'

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
  const $kill_game_loop = $pause_state.pipe(
    filter((pause_state) => pause_state === undefined),
  )

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
  else if (min_workers <= 0) min_workers = 1

  min_workers = ~~min_workers
  max_workers = ~~max_workers

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
      takeUntil(
        $kill_game_loop.pipe(
          map(() => {
            console.debug('[saturn-core] create_saturn_game(): game loop ended')
            try {
              for (const worker of entity_workers.values()) worker.stop()
              for (const worker of render_workers.values()) worker.stop()
              entity_workers.clear()
              render_workers.clear()
            } catch (error) {
              console.error(error)
            }

            // $kill_game_loop.unsubscribe()
            $game_loop.complete()
            console.debug(
              '[saturn-core] create_saturn_game(): $game_loop completed.',
            )
          }),
        ),
      ),
    ),
    $pause_state,
  }
}

export type type_create_saturn_game_function = typeof create_saturn_game

export interface type_options_saturn_on_tick_game_state<type_game_state> {
  state: type_game_state
  game: ReturnType<typeof create_saturn_game<type_game_state>>
}

export interface type_options_start_saturn_game<type_game_state> {
  options: type_options_create_saturn_game<type_game_state>
  on_tick?: (game_state: type_game_state) => void
}

export interface type_options_start_saturn_game_with_on_ready<type_game_state>
  extends type_options_start_saturn_game<type_game_state> {
  on_tick: (game_state: type_game_state) => void
}

export function start_saturn_game<type_game_state>(
  parameters: type_options_start_saturn_game_with_on_ready<type_game_state>,
): ReturnType<typeof create_saturn_game<type_game_state>>

export async function start_saturn_game<type_game_state>(
  parameters: type_options_start_saturn_game<type_game_state>,
): Promise<ReturnType<typeof create_saturn_game<type_game_state>>>

export function start_saturn_game<type_game_state>(
  parameters: type_options_start_saturn_game<type_game_state>,
):
  | ReturnType<typeof create_saturn_game<type_game_state>>
  | Promise<ReturnType<typeof create_saturn_game<type_game_state>>> {
  const game = create_saturn_game(parameters.options)

  if (!parameters.on_tick)
    return new Promise((resolve) => {
      console.debug('[saturn-core] start_saturn_game(): waiting for game loop')
      // TODO: Add an on_ready observable.
      resolve(game)
    })
  game.$game_loop.subscribe(parameters.on_tick!)

  return game
}
