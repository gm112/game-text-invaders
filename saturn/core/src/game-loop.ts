import { BehaviorSubject, Subject } from 'rxjs'

export interface type_options_create_game_loop<type_game_state> {
  state: type_game_state
  min_workers?: number
  max_workers: number
}

export function create_game_loop<type_game_state>(state: type_game_state) {
  const $game_loop = new Subject<type_game_state>()
  const $pause_state = new BehaviorSubject(false)
  $game_loop.next(state)

  return {
    $game_loop,
    $pause_state,
  }
}
