/// <reference types="vite/client" />

import { combineLatest } from 'rxjs'
import type { type_render_job_message } from './render-job.message.js'
import {
  $entity_buffer,
  $entity_state,
} from './reactive/entity-buffer.subject.js'
import { $render_context } from './reactive/render-context.subject.js'
import type { render_data } from './reactive/entity-buffer.js'

self.onmessage = (event: MessageEvent<type_render_job_message>) => {
  const { type, payload } = event.data
  if (type === 'wakeup') {
    const context = payload.getContext('2d')
    if (!context)
      throw new Error('canvas.getContext("2d") is null', { cause: event })

    $render_context.next(context)
  } else if (type === 'tick') $entity_buffer.next(payload)
  else if (type === 'die') die()
  else throw new Error(`Unknown message type: ${type}`)
}

function render_entity(
  entity: render_data,
  context: OffscreenCanvasRenderingContext2D,
) {
  if (!entity.visible) return
  context.save()
  context.globalAlpha = entity.alpha
  context.translate(entity.position.x, entity.position.y)
  context.rotate(entity.rotation)
  context.scale(entity.scale.x, entity.scale.y)

  // PLACEHOLDER
  context.fillStyle = 'blue'
  context.fillRect(-25, -25, 50, 50)
  context.restore()
}

const $tick = combineLatest([$entity_state, $render_context])
const tick = $tick.subscribe(([entities, context]) => {
  requestAnimationFrame(() => {
    for (const entity of entities) render_entity(entity, context)
  })
})

function die() {
  tick.unsubscribe()
  $render_context.complete()
  $entity_buffer.complete()
  self.close()
}
