/**
 * Safely coerce default_settings into an object.
 * Accepts either an object or a JSON string.
 */
export const coerceDefaults = (value) => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return {}
    }
  }
  return value && typeof value === 'object' ? value : {}
}

/**
 * Normalize records into a consistent shape:
 * { operation: string, default_settings: object, updated_at: string|null }
 */
export const normalizeOperationRecords = (records) => {
  const arr = Array.isArray(records) ? records : (records ? [records] : [])
  return arr.map((r) => ({
    operation: r?.operation ?? '',
    default_settings: coerceDefaults(r?.default_settings),
    updated_at: r?.updated_at ?? null,
  }))
}

/**
 * Build a map keyed by operation.
 */
export const indexByOperation = (records) => {
  const map = {}
  ;(records || []).forEach((r) => {
    if (r && r.operation) {
      map[r.operation] = r
    }
  })
  return map
}

/**
 * Deep clone utility with graceful fallback.
 */
export const deepClone = (obj) => {
  try {
    // Prefer structuredClone if available
    if (typeof structuredClone === 'function') {
      return structuredClone(obj)
    }
  } catch {
    // fall through
  }
  try {
    return JSON.parse(JSON.stringify(obj))
  } catch {
    return obj
  }
}
