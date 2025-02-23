import { create_saturn_game } from '@bluedreamers/saturn-core/kernel.js'

const { $game_loop, $pause_state } = create_saturn_game({
  max_workers: navigator.hardwareConcurrency ?? 1,
  state: {
    player_hp: 100,
    score: 0,
  },
})

$game_loop.subscribe((state) => {
  console.log('[game] state:', state)

  setTimeout(() => {
    console.log('[game] shutting down...')
    $pause_state.next(undefined)
  }, 2000)
})
