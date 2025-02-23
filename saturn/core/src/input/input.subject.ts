import { fromEvent, map, merge, Observable, Subject } from 'rxjs'

export interface type_options_create_input_listener {
  target: HTMLElement
  handlers: {
    key_down?: (key: string) => void
    key_up?: (key: string) => void
    mouse_down?: (button: string) => void
    mouse_up?: (button: string) => void
    mouse_move?: (x: number, y: number) => void
    mouse_wheel?: (delta: number) => void
    touch_start?: (touch: Touch) => void
    touch_move?: (touch: Touch) => void
    touch_end?: (touch: Touch) => void
    touch_cancel?: (touch: Touch) => void
  }
  // on_context_menu?: (event: MouseEvent) => void
  // on_focus?: (event: FocusEvent) => void
  // on_blur?: (event: FocusEvent) => void
  // on_pointer_lock_change?: (event: Event) => void
  // on_visibility_change?: (event: Event) => void
}

export interface type_input {
  key_down?: string
  key_up?: string
  mouse_down?: string
  mouse_up?: string
  mouse_move?: {
    x: number
    y: number
  }
  mouse_wheel?: number
  touch_start?: Touch
  touch_move?: Touch
  touch_end?: Touch
  touch_cancel?: Touch
  context: unknown
}

export function create_input_listener(
  options: type_options_create_input_listener,
) {
  const $input_listners: Observable<type_input>[] = []
  for (const [key, value] of Object.entries(options.handlers)) {
    if (!value) continue
    const $input_listener = fromEvent(options.target, key).pipe(
      map((event) => ({ context: event }) as type_input),
    )
    $input_listners.push($input_listener)
  }

  const $input_event_stream = merge(...$input_listners)
  return {
    $input_event_stream,
  }
}
