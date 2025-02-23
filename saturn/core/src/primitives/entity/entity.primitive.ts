import type { type_entity_state } from './entity-state.primitive.js'

export interface type_entity {
  id: string
  name: string
  state: type_entity_state
}
