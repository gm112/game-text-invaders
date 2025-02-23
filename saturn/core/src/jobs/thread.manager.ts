export function start_worker<type_worker_payload>(
  worker: Worker,
  payload?: type_worker_payload,
) {
  console.debug('[saturn-core] start_worker(): starting worker...')

  if (payload) worker.postMessage({ type: 'wakeup', payload }, [payload])
  else worker.postMessage({ type: 'wakeup' })
}

export function stop_worker(worker: Worker) {
  try {
    console.debug('[saturn-core] stop_worker(): stopping worker...')
    worker.postMessage({ type: 'die' })
    //worker.terminate()
  } catch (error) {
    console.error(error)
  }
}
