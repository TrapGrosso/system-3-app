import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useGetOperationDefaults } from "@/api/operation-context/getOperationDefaults"
import { useUpdateOperationDefaults } from "@/api/operation-context/updateOperationDefaults"

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

const OperationDefaultsContext = React.createContext(null)

export const OperationDefaultsProvider = ({ children }) => {
  const queryClient = useQueryClient()

  // Fetch all operation defaults
  const {
    data: rawRecords = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetOperationDefaults()

  const records = React.useMemo(
    () => normalizeOperationRecords(rawRecords),
    [rawRecords]
  )

  const mapByOperation = React.useMemo(
    () => indexByOperation(records),
    [records]
  )

  const availableOperations = React.useMemo(
    () => Object.keys(mapByOperation).sort(),
    [mapByOperation]
  )

  const getDefaults = React.useCallback(
    (operation) => {
      const defaults = mapByOperation[operation]?.default_settings || {}
      return deepClone(defaults)
    },
    [mapByOperation]
  )

  /**
   * Build an options object containing exactly the keys defined
   * in the canonical defaults for the given operation.
   * Unknown override keys are dropped.
   *
   * mode:
   * - "strict" (default): returns exactly the default keys (values from overrides if present, otherwise defaults)
   * - "merge": same behavior today; placeholder for future extension
   */
  const pickOperationOptions = React.useCallback(
    (operation, overrides = {}, mode = "strict") => {
      const defaults = getDefaults(operation)
      const keys = Object.keys(defaults)
      const result = {}

      for (const k of keys) {
        if (Object.prototype.hasOwnProperty.call(overrides, k)) {
          result[k] = deepClone(overrides[k])
        } else {
          result[k] = deepClone(defaults[k])
        }
      }

      // Future: If mode !== 'strict', you could add extra behaviors here.
      return result
    },
    [getDefaults]
  )

  const buildOperationPayload = React.useCallback(
    (operation, overrides = {}, mode = "strict") => {
      return {
        operation,
        options: pickOperationOptions(operation, overrides, mode),
      }
    },
    [pickOperationOptions]
  )

  // Mutation to update defaults with invalidate + toasts
  const updateDefaultsMutation = useUpdateOperationDefaults({
    onSuccess: (data) => {
      const message = data?.message || "Operation defaults updated successfully"
      toast.success(message)
      // Invalidate all variants
      queryClient.invalidateQueries({ queryKey: ["getOperationDefaults"] })
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update operation defaults")
    },
  })

  const updateOperationDefaults = React.useCallback(
    (operation, updated_defaults_settings) => {
      return updateDefaultsMutation.mutateAsync({
        operation,
        updated_defaults_settings,
      })
    },
    [updateDefaultsMutation]
  )

  const invalidate = React.useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["getOperationDefaults"] }),
    [queryClient]
  )

  const value = React.useMemo(
    () => ({
      // Data
      records,
      mapByOperation,
      availableOperations,

      // States
      isLoading,
      isError,
      error,

      // Utilities
      getDefaults,
      pickOperationOptions,
      buildOperationPayload,

      // Mutations
      updateOperationDefaults,
      isUpdating: updateDefaultsMutation.isPending,

      // Cache controls
      refetch,
      invalidate,
    }),
    [
      records,
      mapByOperation,
      availableOperations,
      isLoading,
      isError,
      error,
      getDefaults,
      pickOperationOptions,
      buildOperationPayload,
      updateOperationDefaults,
      updateDefaultsMutation.isPending,
      refetch,
      invalidate,
    ]
  )

  return (
    <OperationDefaultsContext.Provider value={value}>
      {children}
    </OperationDefaultsContext.Provider>
  )
}

export const useOperationDefaults = () => {
  const ctx = React.useContext(OperationDefaultsContext)
  if (!ctx) {
    throw new Error("useOperationDefaults must be used within an OperationDefaultsProvider")
  }
  return ctx
}

/**
 * Convenience hook to access a single operation's defaults with loading/error state.
 */
export const useOperationDefault = (operation) => {
  const { getDefaults, isLoading, isError, error } = useOperationDefaults()
  const defaults = React.useMemo(() => getDefaults(operation), [getDefaults, operation])
  return { defaults, isLoading, isError, error }
}

export default OperationDefaultsContext

/**
 * Example usage:
 *
 * import { useOperationDefaults } from "@/contexts/OperationDefaultsContext"
 * const { pickOperationOptions, updateOperationDefaults, availableOperations } = useOperationDefaults()
 *
 * const options = pickOperationOptions("add_leads", { add_to_group: true })
 * // options contains exactly: flags, prompt_ids, add_to_group
 *
 * // Update defaults
 * await updateOperationDefaults("add_leads", { flags: ["add_to_ds_queue"], prompt_ids: [], add_to_group: false })
 */
