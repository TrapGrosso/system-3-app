import { useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { countActiveFilters } from './activeFilters'

/**
 * Custom hook to handle React Query errors with a fallback mechanism.
 * It prevents infinite loops by using a ref to track if a fallback has already occurred.
 *
 * @param {object} queryApi The result object from a React Query hook (e.g., useQuery).
 * @param {function} resetFilters A function to reset the filters in the calling context.
 * @param {string} entityName The name of the entity being fetched (e.g., 'prospects', 'companies', 'logs').
 * @param {object} options Optional configuration.
 * @param {React.MutableRefObject<boolean>} [options.fallbackRef] An optional external ref to manage the fallback state.
 * @param {function} [options.onFallback] A callback function to be executed when the fallback is triggered, before filters are reset.
 * @param {boolean} [options.resetOnlyIfFiltersActive=false] If true, filters will only be reset if active filters are detected.
 *   If false (default), filters will always be reset on the first error.
 * @param {object} [options.query] The current query state object, used to detect active filters.
 *   Required if `resetOnlyIfFiltersActive` is true and `isAnyFilterActive` is not provided.
 * @param {object} [options.activeFilterOptions] Options for `countActiveFilters` (from `src/utils/activeFilters.js`),
 *   e.g., `{ ignore: ['page'], defaults: { status: '' } }`.
 * @param {function} [options.isAnyFilterActive] A function that returns `true` if any filters are active.
 *   If provided, this function overrides the internal detection using `query` and `activeFilterOptions`.
 */
export const useQueryErrorFallback = (queryApi, resetFilters, entityName, options = {}) => {
  const {
    fallbackRef: externalFallbackRef,
    onFallback,
    resetOnlyIfFiltersActive = false,
    query,
    activeFilterOptions,
    isAnyFilterActive,
  } = options

  const internalFallbackDoneRef = useRef(false)
  const fallbackDoneRef = externalFallbackRef || internalFallbackDoneRef

  const resetFallback = useCallback(() => {
    fallbackDoneRef.current = false
  }, [fallbackDoneRef])

  useEffect(() => {
    if (!queryApi.isError || queryApi.isFetching) return

    if (fallbackDoneRef.current) {
      toast.error(queryApi.error?.message ?? `Failed to fetch ${entityName}`)
      return
    }

    fallbackDoneRef.current = true

    let filtersAreActive = true // Default to true for backward compatibility if option is not set
    if (resetOnlyIfFiltersActive) {
      if (typeof isAnyFilterActive === 'function') {
        filtersAreActive = isAnyFilterActive()
      } else if (query) {
        filtersAreActive = countActiveFilters(query, activeFilterOptions) > 0
      } else {
        console.warn('useQueryErrorFallback: `query` prop is required when `resetOnlyIfFiltersActive` is true and `isAnyFilterActive` is not provided.')
        filtersAreActive = false // Prevent reset if query is missing
      }
    }

    if (filtersAreActive) {
      onFallback?.()
      toast.warning(
        `Filters failed (${queryApi.error?.message ?? 'unknown error'}). Showing all ${entityName} instead.`
      )
      resetFilters()
    } else {
      toast.error(queryApi.error?.message ?? `Failed to fetch ${entityName}`)
    }
  }, [
    queryApi.isError,
    queryApi.isFetching,
    queryApi.error,
    entityName,
    resetFilters,
    fallbackDoneRef,
    resetOnlyIfFiltersActive,
    query,
    activeFilterOptions,
    isAnyFilterActive,
    onFallback,
  ])

  return { fallbackDoneRef, resetFallback }
}
