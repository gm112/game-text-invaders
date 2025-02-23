import { map, Subject } from 'rxjs'
import { decode_entity_buffer } from './entity-buffer.js'

export const $entity_buffer = new Subject<SharedArrayBuffer>()
export const $entity_state = $entity_buffer.pipe(map(decode_entity_buffer))
