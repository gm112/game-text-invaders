import type { type_job_message } from '../../primitives/messages/job-message.primitive.js'

export type type_render_job_message =
  | (type_job_message<OffscreenCanvas> & {
      type: 'wakeup'
    })
  | (type_job_message<ArrayBuffer> & { type: 'tick' })
