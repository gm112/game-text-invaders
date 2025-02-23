import {
  create_saturn_game,
  type type_create_saturn_game_function,
  type type_options_create_saturn_game,
} from '@bluedreamers/saturn-core/kernel.js'

const initial_game_state = {
  player_hp: 100,
  score: 0,
}
const game_options: type_options_create_saturn_game<typeof initial_game_state> =
  {
    max_workers: navigator.hardwareConcurrency ?? 1,
    state: initial_game_state,
  }
create_saturn_game(game_options).$game_loop.subscribe((state) => {
  console.log('[game] state:', state)
})
