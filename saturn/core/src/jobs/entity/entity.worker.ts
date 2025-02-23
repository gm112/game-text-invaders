/// <reference types="vite/client" />
import type { type_job_message } from '../../primitives/messages/job-message.primitive.js'

self.onmessage = (event: MessageEvent<type_job_message<ArrayBuffer>>) => {
  const { type, payload } = event.data
  if (type === 'wakeup') {
    const entity_definitions = new Uint8Array(payload)
    console.log(entity_definitions)
  } else if (type === 'tick') {
    console.log('tick')
  } else if (type === 'die') {
    console.log('die')
    self.close()
  } else throw new Error(`Unknown message type: ${type}`)
}
