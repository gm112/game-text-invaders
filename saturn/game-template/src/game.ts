// import { create_game_loop } from '@bluedreamers/saturn-core/game-loop'
import { create_game_loop } from '@bluedreamers/saturn-core/game-loop.js'

const { $game_loop } = create_game_loop({
  max_workers: navigator.hardwareConcurrency ?? 1,
  state: {
    player_hp: 100,
    score: 0,
  },
})

$game_loop.subscribe((state) => {
  console.log(state)
})
