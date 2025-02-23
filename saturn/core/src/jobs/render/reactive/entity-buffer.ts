export interface type_render_data {
  entity_id: string
  position: {
    x: number
    y: number
  }
  rotation: number
  scale: {
    x: number
    y: number
  }
  sprite_index: number // Index into sprite atlas
  visible: boolean
  alpha: number
}

export const buffer_constants = {
  float32_size: 4,
  uint32_size: 4,
  uint8_size: 1,
} as const

// Calculate size of a single entity's render data in bytes
export const render_data_size =
  buffer_constants.uint32_size + // entity_id (we'll store as a number and map back to string)
  buffer_constants.float32_size * 2 + // position (x, y)
  buffer_constants.float32_size + // rotation
  buffer_constants.float32_size * 2 + // scale (x, y)
  buffer_constants.uint32_size + // sprite_index
  buffer_constants.uint8_size + // visible
  buffer_constants.float32_size // alpha

// ID mapping utilities
const id_map = new Map<number, string>()

export const get_or_create_numeric_id = (string_id: string): number => {
  // Simple hash function for string to number conversion
  let numeric_id = 0
  for (let i = 0; i < string_id.length; i++) {
    numeric_id = (numeric_id << 5) - numeric_id + string_id.charCodeAt(i)
    numeric_id = numeric_id & numeric_id // Convert to 32-bit integer
  }

  id_map.set(numeric_id, string_id)
  return numeric_id
}

export const get_string_id = (numeric_id: number): string => {
  const string_id = id_map.get(numeric_id)
  if (!string_id) {
    throw new Error(`No string ID found for numeric ID: ${numeric_id}`)
  }
  return string_id
}

// Main buffer encoding/decoding functions
export const encode_render_data = (
  entities: type_render_data[],
): ArrayBuffer => {
  const buffer = new ArrayBuffer(render_data_size * entities.length)
  const data_view = new DataView(buffer)

  for (let index = 0; index < entities.length; index++) {
    const entity = entities[index]!
    const offset = index * render_data_size

    // Convert string ID to number for efficient transfer
    const numeric_id = get_or_create_numeric_id(entity.entity_id)

    // Write data into buffer
    data_view.setUint32(offset, numeric_id)
    data_view.setFloat32(offset + 4, entity.position.x)
    data_view.setFloat32(offset + 8, entity.position.y)
    data_view.setFloat32(offset + 12, entity.rotation)
    data_view.setFloat32(offset + 16, entity.scale.x)
    data_view.setFloat32(offset + 20, entity.scale.y)
    data_view.setUint32(offset + 24, entity.sprite_index)
    data_view.setUint8(offset + 28, entity.visible ? 1 : 0)
    data_view.setFloat32(offset + 29, entity.alpha)
  }

  return buffer
}

export const decode_entity_buffer = (
  buffer: ArrayBuffer,
): type_render_data[] => {
  const data_view = new DataView(buffer)
  const entity_count = buffer.byteLength / render_data_size
  const entities: type_render_data[] = []

  for (let i = 0; i < entity_count; i++) {
    const offset = i * render_data_size

    const numeric_id = data_view.getUint32(offset)
    const entity_id = get_string_id(numeric_id)

    entities.push({
      entity_id,
      position: {
        x: data_view.getFloat32(offset + 4),
        y: data_view.getFloat32(offset + 8),
      },
      rotation: data_view.getFloat32(offset + 12),
      scale: {
        x: data_view.getFloat32(offset + 16),
        y: data_view.getFloat32(offset + 20),
      },
      sprite_index: data_view.getUint32(offset + 24),
      visible: data_view.getUint8(offset + 28) === 1,
      alpha: data_view.getFloat32(offset + 29),
    })
  }

  return entities
}
