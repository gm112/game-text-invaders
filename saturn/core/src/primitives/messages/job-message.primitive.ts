// FIXME: fix(saturn/core): rework job_message to use SABs instead. #Try to work in SharedArrayBuffers instead of ArrayBuffers as this could allow for more efficient sharing of data between workers.
export interface type_job_message<type_payload = ArrayBuffer> {
  type: 'wakeup' | 'tick' | 'die' | 'confirmation_response' | 'failure_response'
  origin: string
  payload: type_payload
}
