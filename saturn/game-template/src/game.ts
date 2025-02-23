import { start_saturn_game } from '@bluedreamers/saturn-core/kernel.js'

const { $game_loop, $pause_state } = await start_saturn_game({
  options: {
    max_workers: navigator.hardwareConcurrency ?? 1,
    state: {
      player_hp: 100,
      score: 0,
    },
  },
})

let kill_player_interval_id: number | undefined

const player_hp_element = document.createElement('pre')
document.body.appendChild(player_hp_element)

function start_killing_player(game_state: { player_hp: number }) {
  if (kill_player_interval_id) return

  // This is a filler proof of concept as its not using the actual game engine (yet).
  kill_player_interval_id = setInterval(() => {
    game_state.player_hp -=
      game_state.player_hp * (game_state.player_hp > 45 ? 0.25 : 2)

    if (game_state.player_hp > 0) {
      console.log('[game] player_hp:', game_state.player_hp)
      requestAnimationFrame(
        () => (player_hp_element.textContent = `HP: ${game_state.player_hp}`),
      )
    } else {
      clearInterval(kill_player_interval_id!)
      kill_player_interval_id = undefined

      requestAnimationFrame(() => {
        player_hp_element.textContent = `Oh no! Game over!`
        $pause_state.next(undefined)
      })
    }
  }, 2000) as unknown as number
}

$game_loop.subscribe((game_state) => {
  console.log('[game] state:', game_state)
  start_killing_player(game_state)
})

/*
if not using async/await, you can use the following:
start_saturn_game(
  {
    options: {
      max_workers: navigator.hardwareConcurrency ?? 1,
      state: {
        player_hp: 100,
        score: 0,
      },
    },
    on_tick: (game_state) => {
      console.log('[game] state:', game_state)
    },
  },
)
*/
