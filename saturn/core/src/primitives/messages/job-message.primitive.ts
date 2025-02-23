// FIXME: fix(saturn/core): rework job_message to use SABs instead. #Try to work in SharedSharedArrayBuffers instead of SharedArrayBuffers as this could allow for more efficient sharing of data between workers.
export interface type_job_message<type_payload = SharedArrayBuffer> {
  type: 'wakeup' | 'tick' | 'die' | 'confirmation_response' | 'failure_response'
  origin: string
  payload: type_payload
}
