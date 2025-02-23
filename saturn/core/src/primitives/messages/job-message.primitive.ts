export interface type_job_message<type_payload = ArrayBuffer> {
  type: 'wakeup' | 'tick' | 'die' | 'confirmation_response' | 'failure_response'
  origin: string
  payload: type_payload
}
