import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

/**
 * Custom hook to handle React Query errors with a fallback mechanism.
 * It prevents infinite loops by using a ref to track if a fallback has already occurred.
 *
 * @param {object} queryApi The result object from a React Query hook (e.g., useQuery).
 * @param {function} resetFilters A function to reset the filters in the calling context.
 * @param {string} entityName The name of the entity being fetched (e.g., 'prospects', 'companies', 'logs').
 */
export const useQueryErrorFallback = (queryApi, resetFilters, entityName) => {
  const fallbackDoneRef = useRef(false)

  useEffect(() => {
    if (!queryApi.isError || queryApi.isFetching) return

    if (fallbackDoneRef.current) {
      toast.error(queryApi.error?.message ?? `Failed to fetch ${entityName}`)
      return
    }

    fallbackDoneRef.current = true
    toast.warning(
      `Filters failed (${queryApi.error?.message ?? 'unknown error'}). Showing all ${entityName} instead.`
    )
    resetFilters()
  }, [queryApi.isError, queryApi.isFetching, queryApi.error, resetFilters, entityName])
}
